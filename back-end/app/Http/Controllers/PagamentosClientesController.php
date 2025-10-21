<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PagamentosClientesController extends Controller
{
    public function index() {
        $pagamentos = DB::select("SELECT * FROM PAGAMENTOS_CLIENTES");

        if ($pagamentos) {
            return response()->json($pagamentos, 200);
        } else {
            return response()->json(['message' => 'Nenhum pagamento encontrado'], 404);
        }
    }

    public function show($id1, $id2) {
        $pagamentos = DB::select("SELECT * FROM PAGAMENTOS_CLIENTES WHERE COD_CLIENTE = ? AND COD_PAGAMENTO = ?", [$id1, $id2]);

        if ($pagamentos) {
            return response()->json($pagamentos, 200);
        } else {
            return response()->json(['message' => 'Pagemento não encontrado'], 404);
        }
    }
}
