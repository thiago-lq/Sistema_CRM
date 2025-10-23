<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    public function index(Request $request) {
        
        $nome = $request->query('nome');

        if ($nome) {
            $result = DB::select("SELECT c.*, t.TELEFONE, e.CIDADE, e.CEP, e.BAIRRO, e.RUA_NUMERO FROM CLIENTES c 
            LEFT JOIN TELEFONES_CLIENTES t ON c.COD_CLIENTE = t.COD_CLIENTE 
            LEFT JOIN ENDERECOS_CLIENTES e ON c.COD_CLIENTE = e.COD_CLIENTE
            WHERE c.NOME ILIKE ? ORDER BY c.COD_CLIENTE", ["%$nome%"]);
        } else {
            $result = DB::select("SELECT c.*, t.TELEFONE, e.CIDADE, e.CEP, e.BAIRRO, e.RUA_NUMERO FROM CLIENTES c 
            LEFT JOIN TELEFONES_CLIENTES t ON c.COD_CLIENTE = t.COD_CLIENTE 
            LEFT JOIN ENDERECOS_CLIENTES e ON c.COD_CLIENTE = e.COD_CLIENTE
            ORDER BY c.COD_CLIENTE");
        }

        if (!$result) {
            return response()->json(['message' => 'Nenhum cliente encontrado'], 404);
        }

        $clientes = [];
        foreach ($result as $row) {
            $id = $row->cod_cliente;
            if (!isset($clientes[$id])) {
                $clientes[$id] = [
                    'cod_cliente' => $row->cod_cliente,
                    'cpf_cliente' => $row->cpf_cliente,
                    'email' => $row->email,
                    'nome' => $row->nome,
                    'data_nascimento' => $row->data_nascimento,
                    'telefones' => [],
                    'endereço' => [],
                ];
            }
            if (isset($row->telefone) && $row->telefone && !in_array($row->telefone, $clientes[$id]['telefones'])) {
                $clientes[$id]['telefones'][] = $row->telefone;
            }

            if (isset($row->cidade) && $row->cidade) {
                $endereco = [
                    'cidade' => $row->cidade,
                    'cep' => $row->cep,
                    'bairro' => $row->bairro,
                    'rua_numero' => $row->rua_numero,
                ];
                if (!in_array($endereco, $clientes[$id]['endereço'])) {
                    $clientes[$id]['endereço'][] = $endereco;
                }
            }
        }
        return response()->json(array_values($clientes), 200);
    }

    public function show($id) {
        $cliente = DB::select("SELECT * FROM CLIENTES WHERE COD_CLIENTE = ?", [$id]);
        if (!$cliente) {
            return response()->json(['message' => 'Cliente não encontrado'], 404);
        }

        $telefones = DB::select("SELECT * FROM TELEFONES_CLIENTES WHERE COD_CLIENTE = ?", [$id]);
        $enderecos = DB::select("SELECT * FROM ENDERECOS_CLIENTES WHERE COD_CLIENTE = ?", [$id]);

        $cliente = $cliente[0];
        $cliente->telefones = array_map(fn($t) => $t->telefone, $telefones);
        $cliente->enderecos = array_map(fn($e) => [
            'cidade' => $e->cidade,
            'cep' => $e->cep,
            'bairro' => $e->bairro,
            'rua_numero' => $e->rua_numero,
        ], $enderecos);

        return response()->json($cliente, 200);
    }

    public function store(Request $request) {
        $cpf = $request->input('cpf');
        $email = $request->input('email');
        $nome = $request->input('nome');
        $dataNascimento = $request->input('data_nascimento');
        $telefones = $request->input('telefones');
        $cidade = $request->input('cidade');
        $cep = $request->input('cep');
        $bairro = $request->input('bairro');
        $ruaNumero = $request->input('rua_numero');

        $request->validate([
            'cpf' => 'required|size:11|unique:clientes,cpf_cliente',
            'email' => 'required|email|max:100',
            'nome' => 'required|string|max:100',
            'data_nascimento' => 'required|date',
            'telefones.*' => 'required|string|size:11',
            'cidade' => 'required|string|max:100',
            'cep' => 'required|size:8',
            'bairro' => 'required|string|max:100',
            'rua_numero' => 'required|string|max:100',
        ]);
        do {
            $codCliente = random_int(1, 999999);
            $exists = DB::select("SELECT 1 FROM CLIENTES WHERE COD_CLIENTE = ?", [$codCliente]);
        } while (!empty($exists));

        DB::beginTransaction();

        try {
            DB::insert("INSERT INTO CLIENTES (COD_CLIENTE, CPF_CLIENTE, EMAIL, NOME, DATA_NASCIMENTO) VALUES (?, ?, ?, ?, ?)", 
            [$codCliente, $cpf, $email, $nome, $dataNascimento]);

            DB::insert("INSERT INTO ENDERECOS_CLIENTES (COD_CLIENTE, CIDADE, CEP, BAIRRO, RUA_NUMERO) VALUES (?, ?, ?, ?, ?)",
            [$codCliente, $cidade, $cep, $bairro, $ruaNumero]);

            $telefones = is_array($telefones) ? $telefones : [$telefones];
            foreach ($telefones as $telefone) {
                DB::insert("INSERT INTO TELEFONES_CLIENTES (COD_CLIENTE, TELEFONE) VALUES (?, ?)", [$codCliente, $telefone]);
            }

            DB::commit();

            return response()->json(['message' => 'Cliente cadastrado com sucesso!', 'cod_cliente' => $codCliente, 'telefones' => $telefones], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao cadastrar o cliente', 'error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id) {
        $cpf = $request->input('cpf');
        $email = $request->input('email');
        $nome = $request->input('nome');
        $dataNascimento = $request->input('data_nascimento');
        $telefones = $request->input('telefones');
        $cidade = $request->input('cidade');
        $cep = $request->input('cep');
        $bairro = $request->input('bairro');
        $ruaNumero = $request->input('rua_numero');

        $request->validate([
            'cpf' => 'required|size:11|unique:clientes,cpf_cliente,' . $id . ',cod_cliente',
            'email' => 'required|email|max:100',
            'nome' => 'required|string|max:100',
            'data_nascimento' => 'required|date',
            'telefones.*' => 'required|string|size:11',
            'cidade' => 'required|string|max:100',
            'cep' => 'required|size:8',
            'bairro' => 'required|string|max:100',
            'rua_numero' => 'required|string|max:100',
        ]);

        DB::beginTransaction();

        try {
            DB::update("UPDATE CLIENTES SET CPF_CLIENTE = ?, EMAIL = ?, NOME = ?, DATA_NASCIMENTO = ? WHERE COD_CLIENTE = ?",
            [$cpf, $email, $nome, $dataNascimento, $id]);

            DB::update("UPDATE ENDERECO_CLIENTES SET CIDADE = ?, CEP = ?, BAIRRO = ?, RUA_NUMERO = ? WHERE COD_CLIENTE = ?",
            [$cidade, $cep, $bairro, $ruaNumero, $id]);

            DB::delete("DELETE FROM TELEFONES_CLIENTES WHERE COD_CLIENTE = ?", [$id]);
            foreach($telefones as $telefone) {
                DB::insert("INSERT INTO TELEFONES_CLIENTES (COD_CLIENTE, TELEFONE) VALUES (?, ?)", [$id, $telefone['telefone']]);
            }

            DB::commit();
            return response()->json(['message' => 'Cliente atualizado com sucesso!'], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao atualizar o cliente', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id) {
        
        DB::beginTransaction();
        
        try {
            $deleted = DB::delete("DELETE FROM CLIENTES WHERE COD_CLIENTE = ?", [$id]);

            DB::commit();

            if ($deleted) {
                return response()->json(['message' => 'Cliente excluído com sucesso!'], 200);
            } else {
                return response()->json(['message' => 'Cliente não encontrado'], 404);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erro ao excluir o cliente', 'error' => $e->getMessage()], 500);
        }
    }
}
