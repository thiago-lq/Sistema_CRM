<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PagamentosClientesController extends Controller
{

    // Controlador que busca todos os pagamentos

    public function index() {
        // Pega todos os pagamentos do banco de dados
        $pagamentos = DB::select("SELECT * FROM PAGAMENTOS_CLIENTES");

        // Verifica se pagamentos está vazio, se estiver vazio retorna uma mensagem de erro, se não retorna os pagamentos
        if (!$pagamentos) {
            return response()->json(['message' => 'Nenhum pagamento encontrado'], 404);
        } else {
            return response()->json($pagamentos, 200);
        }
    }

    // Controlador que busca um pagamento pelo ID de cliente e ID de pedido

    public function show($id1, $id2) {
        // Pega o pagamento do bando de dados por dois IDs enviados, cod_cliente e cod_pedido
        $pagamentos = DB::select("SELECT * FROM PAGAMENTOS_CLIENTES WHERE COD_CLIENTE = ? COD_PEDIDO = ?", [$id1, $id2]);

        if (!$pagamentos) {
            return response()->json(['message' => 'Pagamento não encontrado'], 404);
        } else {
            return response()->json($pagamentos, 200);
        }
    }
}
