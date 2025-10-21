<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TelefoneClienteController extends Controller
{
    public function index(Request $request) {
        $telefones = DB::select("SELECT * FROM TELEFONES_CLIENTES");

        if ($telefones) {
            return response()->json($telefones, 200);
        } else {
            return response()->json(['message' => 'Nenhum telefone encontrado'], 404);
        }
    }

    public function show($id) {
        $telefones = DB::select("SELECT * FROM TELEFONES_CLIENTES WHERE COD_CLIENTE = ?", [$id]);

        if ($telefones) {
            return response()->json($telefones, 200);
        } else {
            return response()->json(['message' => 'Telefone não encontrado'], 404);
        }
    }

    public function store(Request $request) {
        $codCliente = $request->input('cod_cliente');
        $telefone = $request->input('telefone');

        try {
            DB::insert("INSERT INTO TELEFONES_CLIENTES (COD_CLIENTE, TELEFONE) VALUES (?, ?)", [$codCliente, $telefone]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao cadastrar o telefone', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id) {
        $telefone = $request->input('telefone');

        try {
            DB::update("UPDATE TELEFONES_CLIENTES SET TELEFONE = ? WHERE COD_CLIENTE = ?", [$telefone, $id]);

            return response()->json(['message' => 'Telefone atualizado com sucesso!'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar o telefone', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id) {
        try {
            $deleted = DB::delete("DELETE FROM TELEFONES_CLIENTES WHERE COD_CLIENTE = ?", [$id]);

            if ($deleted) {
                return response()->json(['message' => 'Telefone excluído com sucesso!'], 200);
            } else {
                return response()->json(['message' => 'Telefone não encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao excluir o telefone', 'error' => $e->getMessage()], 500);
        }
    }
}
