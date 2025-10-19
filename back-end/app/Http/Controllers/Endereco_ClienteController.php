<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Endereco_ClienteController extends Controller
{
    public function index() {
        $enderecos = DB::select("SELECT * FROM ENDERECOS_CLIENTES");

        if ($enderecos) {
            return response()->json($enderecos, 200);
        } else {
            return response()->json(['message' => 'Nenhum endereço encontrado'], 404);
        }
    }

    public function show($id) {
        $enderecos = DB::select("SELECT * FROM ENDERECOS_CLIENTES WHERE COD_CLIENTE = ?", [$id]);

        if ($enderecos) {
            return response()->json($enderecos, 200);
        } else {
            return response()->json(['message' => 'Endereço não encontrado'], 404);
        }
    }

    public function store(Request $request) {
        $cod_cliente = $request->input('cod_cliente');
        $cidade = $request->input('cidade');
        $cep = $request->input('cep');
        $bairro = $request->input('bairro');
        $rua_numero = $request->input('rua_numero');

        try {
            DB::insert("INSERT INTO ENDERECOS_CLIENTES (COD_CLIENTE, CIDADE, CEP, BAIRRO, RUA_NUMERO) VALUES (?, ?, ?, ?, ?)",
            [$cod_cliente, $cidade, $cep, $bairro, $rua_numero]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao cadastrar o endereço', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id) {
        $cidade = $request->input('cidade');
        $cep = $request->input('cep');
        $bairro = $request->input('bairro');
        $rua_numero = $request->input('rua_numero');
        
        try {
            DB::update("UPDATE ENDERECOS_CLIENTES SET CIDADE = ?, CEP = ?, BAIRRO = ?, RUA_NUMERO = ? WHERE COD_CLIENTE = ?",
            [$cidade, $cep, $bairro, $rua_numero, $id]);

            return response()->json(['message' => 'Endereço atualizado com sucesso!'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar o endereço', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id) {
        try {
            $deleted = DB::delete("DELETE FROM ENDERECOS_CLIENTES WHERE COD_CLIENTE = ?", [$id]);

            if ($deleted) {
                return response()->json(['message' => 'Endereço excluído com sucesso!'], 200);
            } else {
                return response()->json(['message' => 'Endereço não encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao excluir o endereço', 'error' => $e->getMessage()], 500);
        }
    }
}
