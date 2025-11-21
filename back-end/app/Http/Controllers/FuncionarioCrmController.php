<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Funcionario_CrmController extends Controller
{

    // Controlador que busca os todos os funcionarios, ou busca um funcionario específico pelo nome

    public function index(Request $request) {
        // Pega todos os funcionarios do banco de dados
        $funciorarios = DB::select("SELECT * FROM FUNCIONARIOS_CRM");

        // Verifica se funcionarios está vazio, se estiver vazio retorna uma mensagem de erro, se não retorna os funcionarios
        if (!$funcionarios) {
            return response()->json(['message' => 'Nenhum funcionario encontrado'], 404);
        } else {
            return response()->json($funcionarios, 200);
        }
    }

    // Controlador que busca um funcionario pelo seu ID

    public function show($id) {
        // Pega o funcionario do bando de dados por ID enviado
        $funcionarios = DB::select("SELECT * FROM FUNCIONARIOS_CRM WHERE COD_FUNCIONARIO = ?", [$id]);

        // Verifica se funcionarios está vazio, se estiver vazio retorna uma mensagem de erro, se não retorna os funcionarios
        if (!$funcionarios) {
            return response()->json(['message' => 'Funcionario não encontrado'], 404);
        } else {
            return response()->json($funcionarios, 200);
        }
    }
}
