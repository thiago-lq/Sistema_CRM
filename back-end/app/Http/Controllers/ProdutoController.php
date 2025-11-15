<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdutoController extends Controller
{
    public function index(Request $request) {
        $produtos = DB::select("SELECT * FROM PRODUTOS");

        if (!$produtos) {
            return response()->json(['message' => 'Nenhum produto encontrado'], 404);
        }

        return response()->json($produtos, 200);
    }
}
