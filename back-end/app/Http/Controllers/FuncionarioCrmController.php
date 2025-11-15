<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Funcionario_CrmController extends Controller
{

    // Controlador que busca os todos os funcionarios, ou busca um funcionario específico pelo nome

    public function index(Request $request) {
        
        $funciorarios = DB::select("SELECT * FROM FUNCIONARIOS_CRM");

        if (!$funcionarios) {
            return response()->json(['message' => 'Nenhum funcionario encontrado'], 404);
        } else {
            return response()->json($funcionarios, 200);
        }
    }

    // Controlador que busca um funcionario pelo seu ID

    public function show($id) {
        $funcionarios = DB::select("SELECT * FROM FUNCIONARIOS_CRM WHERE COD_FUNCIONARIO = ?", [$id]);

        if (!$funcionarios) {
            return response()->json(['message' => 'Funcionario não encontrado'], 404);
        } else {
            return response()->json($funcionarios, 200);
        }
    }
}
