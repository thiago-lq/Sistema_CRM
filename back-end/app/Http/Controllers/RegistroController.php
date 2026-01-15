<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class RegistroController extends Controller
{
    public function index(Request $request) {
        $termo = $request->query('termo');

        // Verifica se há termo de busca
        if ($termo) {
            // Remove caracteres não numéricos
            $termoLimpo = preg_replace('/[^0-9]/', '', $termo);
            $tamanho = strlen($termoLimpo);
            
            if ($tamanho == 11) {
                $cpf = $termoLimpo;
                $codCliente = DB::select("SELECT COD_CLIENTE FROM CLIENTES WHERE CPF_CLIENTE = ?", [$cpf]);
            } else if ($tamanho == 14) {
                $cnpj = $termoLimpo;
                $codCliente = DB::select("SELECT COD_CLIENTE FROM CLIENTES WHERE CNPJ_CLIENTE = ?", [$cnpj]);
            } else {
                // Se não for CPF/CNPJ válido, retorna erro
                return response()->json(['message' => 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos'], 422);
            }
        }

        if ($codCliente) {
            $registros = DB::select("SELECT r.COD_REGISTRO, r.COD_CLIENTE, r.COD_FUNCIONARIO, r.CREATED_AT, r.UPDATED_AT FROM REGISTROS r
            WHERE r.COD_CLIENTE = ? ORDER BY r.COD_REGISTRO", [$codCliente]);
        } else {
            // Busca os registros
            $registros = DB::select("SELECT r.COD_REGISTRO, r.COD_CLIENTE, r.COD_FUNCIONARIO, r.CREATED_AT, r.UPDATED_AT FROM REGISTROS r
            ORDER BY r.COD_REGISTRO");
        }
        
        if (empty($registros)) {
            return response()->json(['message' => 'Nenhum registro encontrado'], 404);
        }

        return response()->json($registros, 200);
    }

    public function show($id) {
        $registro = DB::select("SELECT r.*, c.NOME FROM REGISTROS r LEFT JOIN CLIENTES c ON r.COD_CLIENTE = c.COD_CLIENTE
        WHERE r.COD_REGISTRO = ?", [$id]);

        if (empty($registro)) {
            return response()->json(['message' => 'Registro não encontrado'], 404);
        }

        return response()->json($registro[0], 200);
    }

    public function store(Request $request) {
        $request->validate([
            'cod_cliente' => 'required|integer|exists:clientes,cod_cliente',
            'motivo' => 'required|array',
            'motivo.*' => 'required|string|in:COMPRAR PRODUTOS,FAZER INSTALACAO,MANUTENCAO EM CERCA ELÉTRICA,MANUTENCAO EM CONCERTINA,
            MANUTENCAO EM CAMERA,TROCA DE CABOS,TROCA DE CONECTORES,TROCA DE FONTE DE ENERGIA,TROCA DE DVR,MANUTENCAO EM DVR,TROCA DE HD,
            TROCA DE CENTRAL DE CHOQUE,MANUTENCAO EM CENTRAL,TROCA DE BATERIA DE CENTRAL,OUTRO',
            'tipo_interacao' => 'required|array',
            'tipo_interacao.*' => 'required|string|in:WHATSAPP,EMAIL,TELEFONE',
            'descricao' => 'required|string|max:500',
        ]);

        $funcionario = $request->attributes->get('funcionario');
        $motivo = $request->motivo;
        $tipoInteracao = $request->tipo_interacao;
        $descricao = $request->descricao;

        // Gera um ID aleatório para o registro
        do {
            $codRegistro = random_int(1, 999999);
            $exists = DB::select("SELECT 1 FROM REGISTROS WHERE COD_REGISTRO = ?", [$codRegistro]);
        } while (!empty($exists));

        DB::beginTransaction();

        try {
            DB::insert("INSERT INTO REGISTROS (COD_REGISTRO, COD_CLIENTE, COD_FUNCIONARIO, MOTIVO, TIPO_INTERACAO, DESCRICAO) VALUES (?, ?, ?, ?, ?, ?)", 
            [$codRegistro, $request->cod_cliente, $funcionario->cod_funcionario, $motivo, $tipoInteracao, $descricao]);

            DB::commit();

            return response()->json(['message' => 'Registro cadastrado com sucesso!'], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao cadastrar o registro'], 500);
        }
    }

    public function update(Request $request, $id) {
        $request->validate([
            'cod_cliente' => 'required|integer|exists:clientes,cod_cliente',
            'motivo' => 'required|array',
            'motivo.*' => 'required|string|in:COMPRAR PRODUTOS,FAZER INSTALACAO,MANUTENCAO EM CERCA ELÉTRICA,MANUTENCAO EM CONCERTINA,
            MANUTENCAO EM CAMERA,TROCA DE CABOS,TROCA DE CONECTORES,TROCA DE FONTE DE ENERGIA,TROCA DE DVR,MANUTENCAO EM DVR,TROCA DE HD,
            TROCA DE CENTRAL DE CHOQUE,MANUTENCAO EM CENTRAL,TROCA DE BATERIA DE CENTRAL,OUTRO',
            'tipo_interacao' => 'required|array',
            'tipo_interacao.*' => 'required|string|in:WHATSAPP,EMAIL,TELEFONE',
            'descricao' => 'required|string|max:500',
        ]);
        $funcionario = $request->attributes->get('funcionario');
        $motivo = $request->motivo;
        $tipoInteracao = $request->tipo_interacao;
        $descricao = $request->descricao;

        DB::beginTransaction();

        try {
            DB::update("UPDATE REGISTROS SET COD_CLIENTE = ?, COD_FUNCIONARIO = ?, MOTIVO = ?, TIPO_INTERACAO = ?, DESCRICAO = ? WHERE COD_REGISTRO = ?", [
                $request->cod_cliente, $funcionario->cod_funcionario, $motivo, $tipoInteracao, $descricao, $id
            ]);

            DB::commit();

            return response()->json(['message' => 'Registro atualizado com sucesso!'], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao atualizar o registro'], 500);
        }
    }

    public function destroy($id) {
        DB::beginTransaction();
        try {
            $registro = DB::select("SELECT * FROM REGISTROS WHERE COD_REGISTRO = ?", [$id]);
            
            if (empty($registro)) {
                return response()->json(['message' => 'Registro não encontrado'], 404);
            }

            DB::delete("DELETE FROM REGISTROS WHERE COD_REGISTRO = ?", [$id]);

            DB::commit();
            
            return response()->json(['message' => 'Registro excluído com sucesso!'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao excluir o registro'], 500);
        }
    }
}
