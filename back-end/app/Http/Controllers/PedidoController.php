<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    // Controlador que busca todos os pedidos
    public function index() {
        $pedido = DB::select("SELECT p.*, e.CIDADE, e.CEP, e.BAIRRO, e.RUA_NUMERO, i.COD_PRODUTO, i.QUANTIDADE, ip.NOME_PRODUTO, 
        ip.VALOR_UNITARIO FROM PEDIDOS p LEFT JOIN ENDERECOS_INST_MANU e ON p.COD_PEDIDO = e.COD_PEDIDO 
        LEFT JOIN ITENS_PRODUTOS i ON p.COD_PEDIDO = i.COD_PEDIDO LEFT JOIN PRODUTOS ip ON i.COD_PRODUTO = ip.COD_PRODUTO 
        ORDER BY p.COD_PEDIDO");

        if (!$pedido) {
            return response()->json(['message' => 'Nenhum pedido encontrado'], 404);
        }

        return response()->json($pedido, 200);
    }

    // Controlador que busca um pedido pelo seu ID
    public function show($id) {
        $pedido = DB::select("SELECT * FROM PEDIDOS WHERE COD_PEDIDO = ?", [$id]);

        if (!$pedido) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }

        $enderecosInstManu= DB::select("SELECT * FROM ENDERECOS_INST_MANU WHERE COD_PEDIDO = ?", [$id]);
        $itensProdutos = DB::select("SELECT * FROM ITENS_PRODUTOS WHERE COD_PEDIDO = ?", [$id]);
        foreach ($itensProdutos as $i) {
            $produtos[$i->cod_produto] = [
                'nome_produto' => DB::select("SELECT NOME_PRODUTO FROM PRODUTOS WHERE COD_PRODUTO = ?", [$i->cod_produto])[0]->nome_produto,
                'valor_unitario' => DB::select("SELECT VALOR_UNITARIO FROM PRODUTOS WHERE COD_PRODUTO = ?", [$i->cod_produto])[0]->valor_unitario,
            ];
        }

        $pedido = $pedido[0];
        $pedido->itensprodutos = array_map(fn($i) => [
            'cod_produto' => $i->cod_produto,
            'quantidade' => $i->quantidade,
            'nome_produto' => $produtos[$i->cod_produto]['nome_produto'],
            'valor_unitario' => $produtos[$i->cod_produto]['valor_unitario'],
        ]);
        $pedido->enderecos_inst_manu = array_map(fn($e) => [
            'cidade' => $e->cidade,
            'cep' => $e->cep,
            'bairro' => $e->bairro,
            'rua_numero' => $e->rua_numero,
        ], $enderecosInstManu);

        return response()->json($pedido, 200);
    }

    // Controlador que cadastra um pedido
    public function store(Request $request) {
        $codCliente = $request->input('cod_cliente');
        $pedidoTipos = $request->input('pedido_tipos');
        $codProdutos = $request->input('cod_produtos');
        $quantidade = $request->input('quantidade');
        $descricao = $request->input('descricao');
        $valorTotal = $request->input('valor_total');

        $request->validate([
            'cod_cliente' => 'required|integer|exists:CLIENTES,COD_CLIENTE',
            'pedido_tipos' => 'required|array',
            'pedido_tipos.*' => 'required|string|in:INSTALACAO,MANUTENCAO,PRODUTO',
            'cod_produtos' => 'required_if:pedido_tipos,PRODUTO|array',
            'cod_produtos.*' => 'integer|exists:PRODUTOS,COD_PRODUTO',
            'quantidade' => 'required_if:pedido_tipos,PRODUTO|array',
            'quantidade.*' => 'integer|min:1',
            'descricao' => 'required|string|max:500',
            'valor_total' => 'required|numeric|min:0|max:99999999.99',
        ]);

        $codProdutos = array_map('intval', $request->input('cod_produtos'));

        do {
            $codPedido = random_int(1, 999999);
            $exists = DB::select("SELECT 1 FROM PEDIDOS WHERE COD_PEDIDO = ?", [$codPedido]);
        } while (!empty($exists));

        if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {
            $cidade = $request->input('cidade');
            $cep = $request->input('cep');
            $bairro = $request->input('bairro');
            $ruaNumero = $request->input('rua_numero');

            $request->validate([
                'cidade' => 'required|string|max:100',
                'cep' => 'required|size:8',
                'bairro' => 'required|string|max:100',
                'rua_numero' => 'required|string|max:100',
            ]);
        }

        DB::beginTransaction();

        try {
            DB::insert("INSERT INTO PEDIDOS (COD_PEDIDO, COD_CLIENTE, DESCRICAO, VALOR_TOTAL) VALUES (?, ?, ?, ?)", [$codPedido,
            $codCliente, $descricao, $valorTotal]);
            if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {
                DB::insert("INSERT INTO ENDERECOS_INST_MANU (COD_PEDIDO, CIDADE, CEP, BAIRRO, RUA_NUMERO)
                VALUES (?, ?, ?, ?, ?)", [$codPedido, $cidade, $cep, $bairro, $ruaNumero]);
            }
            if (in_array('PRODUTO', $pedidoTipos)) {
            foreach ($codProdutos as $codProduto) {
                DB::insert("INSERT INTO ITENS_PRODUTOS (COD_PEDIDO, COD_PRODUTO, QUANTIDADE) VALUES (?, ?, ?)", [$codPedido, 
                $codProduto, $quantidade]);
                }
            }
            foreach ($pedidoTipos as $pedidoTipo) {
                DB::insert("INSERT INTO PEDIDOS_TIPOS (COD_PEDIDO, NOME_TIPO) VALUES (?, ?)", [$codPedido, $pedidoTipo]);
            }
            DB::commit();
            return response()->json(['message' => 'Pedido cadastrado com sucesso!', 'cod_pedido' => $codPedido], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Erro ao cadastrar o pedido', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id) {
        $codCliente = $request->input('cod_cliente');
        $pedidoTipos = $request->input('pedido_tipos');
        $codProdutos = $request->input('cod_produtos');
        $quantidade = $request->input('quantidade');
        $descricao = $request->input('descricao');
        $valorTotal = $request->input('valor_total');
        
        $request->validate([
            'cod_cliente' => 'required|integer|exists:CLIENTES,COD_CLIENTE',
            'pedido_tipos' => 'required|array',
            'pedido_tipos.*' => 'required|string|in:INSTALACAO,MANUTENCAO,PRODUTO',
            'cod_produtos' => 'required_if:pedido_tipos,PRODUTO|array',
            'cod_produtos.*' => 'integer|exists:PRODUTOS,COD_PRODUTO',
            'quantidade' => 'required_if:pedido_tipos,PRODUTO|array',
            'quantidade.*' => 'integer|min:1',
            'valor_total' => 'required|numeric|min:0|max:99999999.99',
        ]);

        $codProdutos = array_map('intval', $request->input('cod_produtos'));

        if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {
            $cidade = $request->input('cidade');
            $cep = $request->input('cep');
            $bairro = $request->input('bairro');
            $ruaNumero = $request->input('rua_numero');

            $request->validate([
                'cidade' => 'required|string|max:100',
                'cep' => 'required|size:8',
                'bairro' => 'required|string|max:100',
                'rua_numero' => 'required|string|max:100',
            ]);
        }

        DB::beginTransaction();

        try {
            DB::update("UPDATE PEDIDOS SET COD_CLIENTE = ?, DESCRICAO = ?, VALOR_TOTAL = ? WHERE COD_PEDIDO = ?", [$codCliente,
            $descricao, $valorTotal, $id]);

            if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {
                DB::delete("DELETE FROM ENDERECOS_INST_MANU WHERE COD_PEDIDO = ?", [$id]);
                DB::insert("INSERT INTO ENDERECOS_INST_MANU (COD_PEDIDO, CIDADE, CEP, BAIRRO, RUA_NUMERO) VALUES (?, ?, ?, ?, ?)", [
                    $id, $cidade, $cep, $bairro, $ruaNumero
                ]);
            } 
            if (in_array('PRODUTO', $pedidoTipos)) {
                DB::delete("DELETE FROM ITENS_PRODUTOS WHERE COD_PEDIDO = ?", [$id]);
                foreach ($codProdutos as $codProduto) {
                    DB::insert("INSERT INTO ITENS_PRODUTOS (COD_PEDIDO, COD_PRODUTO, QUANTIDADE) VALUES (?, ?, ?)", [$id, 
                    $codProduto, $quantidade]);
                }
            }
            DB::delete("DELETE FROM PEDIDOS_TIPOS WHERE COD_PEDIDO = ?", [$id]);
            foreach ($pedidoTipos as $pedidoTipo) {
                DB::insert("INSERT INTO PEDIDOS_TIPOS (COD_PEDIDO, NOME_TIPO) VALUES (?, ?)", [$id, $pedidoTipo]);
            }
            DB::commit();
            return response()->json(['message' => 'Pedido atualizado com sucesso!'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao atualizar o pedido', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id) {
        try {
            $deleted = DB::delete("DELETE FROM PEDIDOS WHERE COD_PEDIDO = ?", [$id]);

            if ($deleted) {
                return response()->json(['message' => 'Pedido excluído com sucesso!'], 200);
            } else {
                return response()->json(['message' => 'Pedido não encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao excluir o pedido', 'error' => $e->getMessage()], 500);
        }
    }
}
