<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    public function index(Request $request) {
        
        $nome = $request->query('nome');
        
        if ($nome) {
            $clientes = DB::select("SELECT * FROM CLIENTES WHERE NOME ILIKE ?", ["%$nome%"]);
        } else {
            $clientes = DB::select("SELECT * FROM CLIENTES");
        }

        if ($clientes) {
            return response()->json($clientes, 200);
        } else {
            return response()->json(['message' => 'Nenhum cliente encontrado'], 404);
        }
    }

    public function show($id) {
        $cliente = DB::select("SELECT * FROM CLIENTES WHERE COD_CLIENTE = ?", [$id]);

        if ($cliente) {
            return response()->json($cliente, 200);
        } else {
            return response()->json(['message' => 'Cliente não encontrado'], 404);
        }
    }

    public function store(Request $request) {
        $cpf = $request->input('cpf_cliente');
        $email = $request->input('email');
        $nome = $request->input('nome');
        $data_nascimento = $request->input('data_nascimento');

        do {
            $codCliente = rand(1, 999999);
            $exists = DB::select("SELECT 1 FROM CLIENTES WHERE COD_CLIENTE = ?", [$codCliente]);
        } while (!empty($exists));

        try {
            DB::insert("INSERT INTO CLIENTES (COD_CLIENTE, CPF_CLIENTE, EMAIL, NOME, DATA_NASCIMENTO) VALUES (?, ?, ?, ?, ?)", 
            [$codCliente, $cpf, $email, $nome, $data_nascimento]);
            
            return response()->json(['message' => 'Cliente cadastrado com sucesso!', 'cod_cliente' => $codCliente], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao cadastrar o cliente', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id) {
        $cpf = $request->input('cpf_cliente');
        $email = $request->input('email');
        $nome = $request->input('nome');
        $data_nascimento = $request->input('data_nascimento');

        try {
            DB::update("UPDATE CLIENTES SET CPF_CLIENTE = ?, EMAIL = ?, NOME = ?, DATA_NASCIMENTO = ? WHERE COD_CLIENTE = ?",
            [$cpf, $email, $nome, $data_nascimento, $id]);

            return response()->json(['message' => 'Cliente atualizado com sucesso!'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar o cliente', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id) {
        try {
            $deleted = DB::delete("DELETE FROM CLIENTES WHERE COD_CLIENTE = ?", [$id]);

            if ($deleted) {
                return response()->json(['message' => 'Cliente excluído com sucesso!'], 200);
            } else {
                return response()->json(['message' => 'Cliente não encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao excluir o cliente', 'error' => $e->getMessage()], 500);
        }
    }
}
