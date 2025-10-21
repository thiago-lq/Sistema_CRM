<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    public function index() {
        $pedido = DB::select("SELECT * FROM PEDIDOS");

        if ($pedido) {
            return response()->json($pedido, 200);
        }
    }

    public function show($id) {
        $pedido = DB::select("SELECT * FROM PEDIDOS WHERE COD_PEDIDO = ?", [$id]);

        if ($pedido) {
            return response()->json($pedido, 200);
        }
    }

    public function store(Request $request) {
        $codCliente->input('cod_cliente');
        $codIntalacaoManutencao->input('cod_intalacao_manutencao');
        $pedidoTipo->input('pedido_tipo');
        $valorTotal->input('valor_total');

        do {
            $codPedido = rand(1, 999999);
            $exists = DB::select("SELECT 1 FROM PEDIDOS WHERE COD_PEDIDO = ?", [$codPedido]);
        } while (!empty($exists));

        try {
            DB::insert("INSERT INTO PEDIDOS (COD_PEDIDO, COD_CLIENTE, COD_INTALACAO_MANUTENCAO, PEDIDO_TIPO, VALOR_TOTAL)
            VALUES (?, ?, ?, ?, ?)", [$codPedido, $codCliente, $codIntalacaoManutencao, $pedidoTipo, $valorTotal]);

            return response()->json(['message' => 'Pedido cadastrado com sucesso!', 'cod_pedido' => $codPedido], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao cadastrar o pedido', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id) {
        $codCliente->input('cod_cliente');
        $codIntalacaoManutencao->input('cod_intalacao_manutencao');
        $pedidoTipo->input('pedido_tipo');
        $valorTotal->input('valor_total');
        
        try {
            DB::update ("UPDATE PEDIDOS SET COD_CLIENTE = ?, COD_INTALACAO_MANUTENCAO = ?, PEDIDO_TIPO = ?, VALOR_TOTAL = ?
            WHERE COD_PEDIDO = ?", [$codCliente, $codIntalacaoManutencao, $pedidoTipo, $valorTotal, $id]);

            return response()->json(['message' => 'Pedido atualizado com sucesso!'], 201);
        } catch (\Exception $e) {
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
