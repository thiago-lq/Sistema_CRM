<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    // Controlador que busca todos os pedidos
    public function index() {
    $pedido = DB::select("
    SELECT 
        p.*,
        p.VALOR_TOTAL AS valor_total, -- <- agora vem do banco CERTINHO
        e.CIDADE AS INST_CIDADE,
        e.CEP AS INST_CEP,
        e.BAIRRO AS INST_BAIRRO,
        e.RUA_NUMERO AS INST_RUA,

        ec.CIDADE AS CLI_CIDADE,
        ec.CEP AS CLI_CEP,
        ec.BAIRRO AS CLI_BAIRRO,
        ec.RUA_NUMERO AS CLI_RUA,

        STRING_AGG(pt.NOME_TIPO, ', ') AS tipos_pedido,

        pc.STATUS AS status_pagamento,

        p.CREATED_AT AS created_at,

        f.NOME_FUNCIONARIO AS funcionario_nome

    FROM PEDIDOS p
    LEFT JOIN ENDERECOS_INST_MANU e ON p.COD_PEDIDO = e.COD_PEDIDO 
    LEFT JOIN ENDERECOS_CLIENTES ec ON p.COD_ENDERECO_CLIENTE = ec.COD_ENDERECO_CLIENTE 
    LEFT JOIN ITENS_PRODUTOS i ON p.COD_PEDIDO = i.COD_PEDIDO 
    LEFT JOIN PRODUTOS ip ON i.COD_PRODUTO = ip.COD_PRODUTO 
    LEFT JOIN PEDIDOS_TIPOS pt ON p.COD_PEDIDO = pt.COD_PEDIDO 
    LEFT JOIN PAGAMENTOS_CLIENTES pc ON pc.COD_PEDIDO = p.COD_PEDIDO
    LEFT JOIN FUNCIONARIOS_CRM f ON f.COD_FUNCIONARIO = p.COD_FUNCIONARIO

    GROUP BY 
        p.COD_PEDIDO,
        p.VALOR_TOTAL,
        e.CIDADE, e.CEP, e.BAIRRO, e.RUA_NUMERO,
        ec.CIDADE, ec.CEP, ec.BAIRRO, ec.RUA_NUMERO,
        pc.STATUS,
        p.CREATED_AT,
        f.NOME_FUNCIONARIO

    ORDER BY p.COD_PEDIDO
");

    return response()->json($pedido);
}



    // Controlador que busca um pedido pelo seu ID
    public function show($id) {
        $pedido = DB::select("SELECT * FROM PEDIDOS WHERE COD_PEDIDO = ?", [$id]);
        if (!$pedido) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }

        $enderecosInstManu= DB::select("SELECT * FROM ENDERECOS_INST_MANU WHERE COD_PEDIDO = ?", [$id]);
        $itensProdutos = DB::select("SELECT * FROM ITENS_PRODUTOS WHERE COD_PEDIDO = ?", [$id]);
        $pedidoTipos = DB::select("SELECT * FROM PEDIDOS_TIPOS WHERE COD_PEDIDO = ?", [$id]);
        $enderecosClientes = DB::select("SELECT * FROM ENDERECOS_CLIENTES WHERE COD_ENDERECO_CLIENTE = ?", 
        [$pedido[0]['COD_ENDERECO_CLIENTE']]);
        $pagamentoCliente = DB::select("SELECT * FROM PAGAMENTOS_CLIENTES WHERE COD_PEDIDO = ?", [$id]);
        $funcionario = DB::select("SELECT * FROM FUNCIONARIOS_CRM WHERE COD_FUNCIONARIO = ?", [$pedido[0]['COD_FUNCIONARIO']]);

        $produtos = [];

        if (!empty($itensProdutos)) {
            $codigos =array_column($itensProdutos, 'COD_PRODUTO');

            $placeholders = implode(',', array_fill(0, count($codigos), '?'));

            $produtos = DB::select("SELECT * FROM PRODUTOS WHERE COD_PRODUTO IN ($placeholders)", $codigos);
        }
        
        return response()->json([
            'pedido' => $pedido[0],
            'funcionario' => $funcionario[0],
            'enderecos_inst_manu' => $enderecosInstManu[0],
            'enderecos_clientes' => $enderecosClientes[0],
            'itens_produtos' => $itensProdutos,
            'pedidos_tipos' => $pedidoTipos,
            'produtos' => $produtos,
        ], 200);
    }

    // Controlador que cadastra um pedido
    public function store(Request $request) {
        $funcionario = $request->attributes->get('funcionario');
        $codFuncionario = $funcionario->cod_funcionario; // ← Agora vem do middleware
        $codCliente = $request->input('cod_cliente');
        $codProdutos = $request->input('cod_produtos');
        $codEnderecoCliente = $request->input('cod_endereco_cliente');
        $pedidoTipos = $request->input('pedido_tipos');
        $quantidade = $request->input('quantidade');
        $descricao = $request->input('descricao');
        $valorTotal = $request->input('valor_total');
        $valorAdicional = $request->input('valor_adicional', 0);
        $prazo = $request->input('prazo');

        $request->validate([
            'cod_cliente' => 'required|integer|exists:clientes,cod_cliente',
            'cod_produtos' => 'required_if:pedido_tipos.*,PRODUTO|array',
            'cod_produtos.*' => 'integer|exists:produtos,cod_produto',
            'cod_endereco_cliente' => 'nullable|required_if:pedido_tipos.*,PRODUTO|integer|exists:enderecos_clientes,cod_endereco_cliente',
            'pedido_tipos' => 'required|array',
            'pedido_tipos.*' => 'required|string|in:INSTALACAO,MANUTENCAO,PRODUTO',
            'quantidade' => 'required_if:pedido_tipos.*,PRODUTO|array',
            'quantidade.*' => 'integer|min:1',
            'descricao' => 'required|string|max:500',
            'valor_total' => 'required|numeric|min:0|max:99999999.99',
            'valor_adicional' => 'nullable|numeric|min:0',
            'prazo' => 'required|date',
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
                'cidade' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|string|max:100',
                'cep' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|size:8',
                'bairro' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|string|max:100',
                'rua_numero' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|string|max:100',
            ]);
        }

        DB::beginTransaction();

        try {
            DB::insert("INSERT INTO PEDIDOS (COD_PEDIDO, COD_CLIENTE, COD_ENDERECO_CLIENTE, COD_FUNCIONARIO, DESCRICAO, 
            VALOR_TOTAL, VALOR_ADICIONAL, PRAZO) VALUES (?, ?, ?, ?, ?, ?, ? , ?)", [$codPedido, $codCliente, $codEnderecoCliente, 
            $codFuncionario, $descricao, $valorTotal, $valorAdicional, $prazo]);
            if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {
                DB::insert("INSERT INTO ENDERECOS_INST_MANU (COD_PEDIDO, CIDADE, CEP, BAIRRO, RUA_NUMERO)
                VALUES (?, ?, ?, ?, ?)", [$codPedido, $cidade, $cep, $bairro, $ruaNumero]);
            }
            if (in_array('PRODUTO', $pedidoTipos)) {
                if (count($codProdutos) !== count($quantidade)) {
                    return response()->json([
                        'message' => 'Arrays de produtos e quantidades incompatíveis'
                    ], 422);
                }
                foreach ($codProdutos as $codProduto) {
                    $quantidadeProduto = $quantidade[$codProduto] ?? 1;

                    DB::insert("INSERT INTO ITENS_PRODUTOS (COD_PEDIDO, COD_PRODUTO, QUANTIDADE) VALUES (?, ?, ?)", [$codPedido, 
                    $codProduto, $quantidadeProduto]);
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
        $funcionario = $request->attributes->get('funcionario');
        $codCliente = $request->input('cod_cliente');
        $codProdutos = $request->input('cod_produtos');
        $codEnderecoCliente = $request->input('cod_endereco_cliente');
        $pedidoTipos = $request->input('pedido_tipos');
        $quantidade = $request->input('quantidade');
        $descricao = $request->input('descricao');
        $valorTotal = $request->input('valor_total');
        $valorAdicional = $request->input('valor_adicional', 0);
        $prazo = $request->input('prazo');
        
        $request->validate([
            'cod_cliente' => 'required|integer|exists:clientes,cod_cliente',
            'cod_produtos' => 'required_if:pedido_tipos,produto|array',
            'cod_produtos.*' => 'integer|exists:produtos,cod_produto',
            'cod_endereco_cliente' => 'required|integer|exists:enderecos_clientes,cod_endereco_cliente',
            'pedido_tipos' => 'required|array',
            'pedido_tipos.*' => 'required|string|in:INSTALACAO,MANUTENCAO,PRODUTO',
            'quantidade' => 'required_if:pedido_tipos,produto|array',
            'quantidade.*' => 'integer|min:1',
            'valor_total' => 'required|numeric|min:0|max:99999999.99',
            'valor_adicional' => 'nullable|numeric|min:0',
            'prazo' => 'required|date',
        ]);

        $codFuncionario = $funcionario->cod_funcionario;
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
            DB::update("UPDATE PEDIDOS SET COD_CLIENTE = ?, COD_ENDERECO_CLIENTE = ?, COD_FUNCIONARIO = ?, DESCRICAO = ?, 
            VALOR_TOTAL = ?, VALOR_ADICIONAL = ?, PRAZO = ? WHERE COD_PEDIDO = ?", [$codCliente, $codEnderecoCliente, 
            $codFuncionario, $descricao, $valorTotal, $valorAdicional, $prazo, $id]);

            if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {
                DB::delete("DELETE FROM ENDERECOS_INST_MANU WHERE COD_PEDIDO = ?", [$id]);
                DB::insert("INSERT INTO ENDERECOS_INST_MANU (COD_PEDIDO, CIDADE, CEP, BAIRRO, RUA_NUMERO) VALUES (?, ?, ?, ?, ?)", [
                    $id, $cidade, $cep, $bairro, $ruaNumero
                ]);
            } 
            if (in_array('PRODUTO', $pedidoTipos)) {
                DB::delete("DELETE FROM ITENS_PRODUTOS WHERE COD_PEDIDO = ?", [$id]);
                foreach ($codProdutos as $codProduto) {
                    $quantidadeProduto = $quantidade[$codProduto] ?? 1;
                    DB::insert("INSERT INTO ITENS_PRODUTOS (COD_PEDIDO, COD_PRODUTO, QUANTIDADE) VALUES (?, ?, ?)", [$id, 
                    $codProduto, $quantidadeProduto]);
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
