<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    public function index() {
        $pedido = DB::select("SELECT p.*, e.CIDADE, e.CEP, e.BAIRRO, e.RUA_NUMERO FROM PEDIDOS p LEFT JOIN ENDERECOS_INST_MANU e
        ON p.COD_INST_MANU = e.COD_INST_MANU ORDER BY p.COD_PEDIDO");

        if (!$pedido) {
            return response()->json(['message' => 'Nenhum pedido encontrado'], 404);
        }

        return response()->json($pedido, 200);
    }

    public function show($id) {
        $pedido = DB::select("SELECT * FROM PEDIDOS WHERE COD_PEDIDO = ?", [$id]);

        if (!$pedido) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }

        $pedido = $pedido[0];
        $enderecosInstManu= DB::select("SELECT * FROM ENDERECOS_INST_MANU WHERE COD_INST_MANU = ?", [$pedido->COD_INST_MANU]);
        $pedido->enderecos_inst_manu = array_map(fn($e) => [
            'cidade' => $e->cidade,
            'cep' => $e->cep,
            'bairro' => $e->bairro,
            'rua_numero' => $e->rua_numero,
        ], $enderecosInstManu);

        return response()->json($pedido, 200);
    }

    public function store(Request $request) {
        $codCliente = $request->input('cod_cliente');
        $pedidoTipo = $request->input('pedido_tipo');
        $valorTotal = $request->input('valor_total');

        $request->validate([
            'cod_cliente' => 'required|integer|exists:CLIENTES,COD_CLIENTE',
            'pedido_tipo' => 'required|string|in:INSTALACAO,MANUTENCAO,PRODUTO',
            'valor_total' => 'required|numeric|min:0|max:99999999.99',
        ]);

        do {
            $codPedido = random_int(1, 999999);
            $exists = DB::select("SELECT 1 FROM PEDIDOS WHERE COD_PEDIDO = ?", [$codPedido]);
        } while (!empty($exists));

        if ($pedidoTipo == 'INSTALACAO' || $pedidoTipo == 'MANUTENCAO') {
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

            do {
                $codInstManu = random_int(1, 999999);
                $exists = DB::select("SELECT 1 FROM ENDERECOS_INST_MANU WHERE COD_INST_MANU = ?", [$codInstManu]);
            } while (!empty($exists));
        }

        DB::beginTransaction();

        try {
            if ($pedidoTipo == 'PRODUTO') {
                DB::insert("INSERT INTO PEDIDOS (COD_PEDIDO, COD_CLIENTE, PEDIDO_TIPO, VALOR_TOTAL)
                VALUES (?, ?, ?, ?)", [$codPedido, $codCliente, $pedidoTipo, $valorTotal]);
            } else {
                DB::insert("INSERT INTO PEDIDOS (COD_PEDIDO, COD_CLIENTE, COD_INST_MANU, PEDIDO_TIPO, VALOR_TOTAL) 
                VALUES (?, ?, ?, ?, ?)", [$codPedido, $codCliente, $codInstManu, $pedidoTipo, $valorTotal]);

                DB::insert("INSERT INTO ENDERECOS_INST_MANU (COD_INST_MANU, COD_PEDIDO, CIDADE, CEP, BAIRRO, RUA_NUMERO)
                VALUES (?, ?, ?, ?, ?, ?)", [$codInstManu, $codPedido, $cidade, $cep, $bairro, $ruaNumero]);
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
        $pedidoTipo = $request->input('pedido_tipo');
        $valorTotal = $request->input('valor_total');
        
        $request->validate([
            'cod_cliente' => 'required|integer|exists:CLIENTES,COD_CLIENTE',
            'pedido_tipo' => 'required|string|in:INSTALACAO,MANUTENCAO,PRODUTO',
            'valor_total' => 'required|numeric|min:0|max:99999999.99',
        ]);

        if ($pedidoTipo == 'INSTALACAO' || $pedidoTipo == 'MANUTENCAO') {
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
            if ($pedidoTipo == 'PRODUTO') {
                DB::update ("UPDATE PEDIDOS SET COD_CLIENTE = ?, PEDIDO_TIPO = ?, VALOR_TOTAL = ?
                WHERE COD_PEDIDO = ?", [$codCliente, $pedidoTipo, $valorTotal, $id]); 
            } else {
                DB::update ("UPDATE PEDIDOS SET COD_CLIENTE = ?, PEDIDO_TIPO = ?, VALOR_TOTAL = ?
                WHERE COD_PEDIDO = ?", [$codCliente, $pedidoTipo, $valorTotal, $id]);

                DB::update ("UPDATE ENDERECOS_INST_MANU SET CIDADE = ?, CEP = ?, BAIRRO = ?, RUA_NUMERO = ?
                WHERE COD_PEDIDO = ?",[$cidade, $cep, $bairro, $ruaNumero, $id]);
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
