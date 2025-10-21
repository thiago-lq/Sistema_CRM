<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RelatorioController extends Controller
{
    public function index() {
        $relatorios = DB::select("SELECT * FROM RELATORIOS");

        if ($relatorios) {
            return response()->json($relatorios, 200);
        } else {
            return response()->json(['message' => 'Nenhum relatório encontrado'], 404);
        }
    }

    public function show($id) {
        $relatorios = DB::select("SELECT * FROM RELATORIOS WHERE COD_RELATORIO = ?", [$id]);

        if ($relatorios) {
            return response()->json($relatorios, 200);
        } else {
            return response()->json(['message' => 'Relatório não encontrado'], 404);
        }
    }

    public function store(Request $request) {
        $codFuncionario = $request->input('cod_funcionario');
        $dadosRelatorio = $request->input('dados_relatorio');

        do {
            $codRelatorio = rand(1, 999999);
            $exists = DB::select("SELECT 1 FROM RELATORIOS WHERE COD_RELATORIO = ?", [$codRelatorio]);
        } while (!empty($exists));

        try {
            DB::insert("INSERT INTO RELATORIOS (COD_RELATORIO, COD_FUNCIONARIO, DADOS_RELATORIO) VALUES (?, ?, ?)",
            [$codRelatorio, $codFuncionario, $dadosRelatorio]);

            return response()->json(['message' => 'Relatório cadastrado com sucesso!', 'cod_relatorio' => $codRelatorio], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao cadastrar o relatório', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id) {
        $codFuncionario = $request->input('cod_funcionario');
        $dadosRelatorio = $request->input('dados_relatorio');

        try {
            DB::update("UPDATE RELATORIOS SET COD_FUNCIONARIO = ?, DADOS_RELATORIO = ? WHERE COD_RELATORIO = ?",
            [$codFuncionario, $dadosRelatorio, $id]);

            return response()->json(['message' => 'Relatório atualizado com sucesso!'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar o relatório', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id) {
        try {
            $deleted = DB::delete("DELETE FROM RELATORIOS WHERE COD_RELATORIO = ?", [$id]);

            if ($deleted) {
                return response()->json(['message' => 'Relatório excluído com sucesso!'], 200);
            } else {
                return response()->json(['message' => 'Relatório não encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao excluir o relatório', 'error' => $e->getMessage()], 500);
        }
    }
}
