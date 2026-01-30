<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FuncionarioController extends Controller
{
    public function buscarFuncionario(Request $request) {
        $email = $request->query('email');
        
        // Valida se o e-mail foi fornecido
        if (!$email) {
            return response()->json(['error' => 'E-mail não fornecido.'], 400);
        }

        // Busca o funcionário na tabela 'funcionarios_crm' (mesma do middleware)
        $funcionario = DB::table('funcionarios_crm')
                        ->where('email', $email)
                        ->first();

        // Se não encontrar, retorna um erro 404
        if (!$funcionario) {
            return response()->json(['error' => 'Funcionário não encontrado no sistema.'], 404);
        }

        // Retorna os dados do funcionário (incluindo o cargo)
        return response()->json($funcionario);
    }
}
