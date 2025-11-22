<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdutoController extends Controller
{
    // Controlador que busca todos os produtos
    public function index(Request $request) {
        // Pega os produtos do banco de dados
        $produtos = DB::select("SELECT * FROM PRODUTOS");

        // Verifica se produtos esta vazio, se estiver vazio retorna uma mensagem de erro, se não retorna os produtos
        if (!$produtos) {
            return response()->json(['message' => 'Nenhum produto encontrado'], 404);
        }

        return response()->json($produtos, 200);
    }
}
