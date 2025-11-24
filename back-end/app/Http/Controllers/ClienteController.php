<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{

    // Controlador que busca os todos os clientes, ou busca um cliente específico pelo cpf ou cnpj

    public function index(Request $request) {
        // Verifica se o request contém o filtro de busca para cpf ou cnpj
        $termo = $request->query('termo');
        $cpf = null;
        $cnpj = null;

        // Verifica se há termo de busca
        if ($termo) {
            // Remove caracteres não numéricos
            $termoLimpo = preg_replace('/[^0-9]/', '', $termo);
            $tamanho = strlen($termoLimpo);
            
            if ($tamanho == 11) {
                $cpf = $termoLimpo;
            } else if ($tamanho == 14) {
                $cnpj = $termoLimpo;
            } else {
                // Se não for CPF/CNPJ válido, retorna erro
                return response()->json(['message' => 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos'], 400);
            }
        }

        // Busca os clientes pra cada caso, se for cpf, se for cnpj ou se não tiver filtro
        if ($cpf) {
            $result = DB::select("SELECT c.*, t.TELEFONE, e.CIDADE, e.CEP, e.BAIRRO, e.RUA_NUMERO FROM CLIENTES c 
            LEFT JOIN TELEFONES_CLIENTES t ON c.COD_CLIENTE = t.COD_CLIENTE 
            LEFT JOIN ENDERECOS_CLIENTES e ON c.COD_CLIENTE = e.COD_CLIENTE
            WHERE c.CPF_CLIENTE ILIKE ? ORDER BY c.COD_CLIENTE", ["%$cpf%"]);
        } else if ($cnpj) {
            $result = DB::select("SELECT c.*, t.TELEFONE, e.CIDADE, e.CEP, e.BAIRRO, e.RUA_NUMERO FROM CLIENTES c 
            LEFT JOIN TELEFONES_CLIENTES t ON c.COD_CLIENTE = t.COD_CLIENTE 
            LEFT JOIN ENDERECOS_CLIENTES e ON c.COD_CLIENTE = e.COD_CLIENTE
            WHERE c.CNPJ_CLIENTE ILIKE ? ORDER BY c.COD_CLIENTE", ["%$cnpj%"]);
        } else {
            $result = DB::select("SELECT c.*, t.TELEFONE, e.CIDADE, e.CEP, e.BAIRRO, e.RUA_NUMERO FROM CLIENTES c 
            LEFT JOIN TELEFONES_CLIENTES t ON c.COD_CLIENTE = t.COD_CLIENTE 
            LEFT JOIN ENDERECOS_CLIENTES e ON c.COD_CLIENTE = e.COD_CLIENTE
            ORDER BY c.COD_CLIENTE");
        }

        // Se não encontrar nenhum cliente, retorna uma mensagem de erro
        if (!$result) {
            return response()->json(['message' => 'Nenhum cliente encontrado'], 404);
        }

        // Cria um array de clientes, onde a chave é o ID do cliente
        $clientes = [];
        // Percorre cada cliente no resultado da consulta, como se fosse uma linha "row"
        foreach ($result as $row) {
            $id = $row->cod_cliente;
            // Verifica se o cliente já existe no array, se não existe, cria a estrutura básica para ele, se existe passa adiante
            if (!isset($clientes[$id])) {
                $clientes[$id] = [
                    'cod_cliente' => $row->cod_cliente,
                    'cpf_cliente' => $row->cpf_cliente,
                    'cnpj_cliente' => $row->cnpj_cliente,
                    'email' => $row->email,
                    'nome' => $row->nome,
                    'data_nascimento' => $row->data_nascimento,
                    'telefones' => [],
                    'enderecos' => [],
                ];
            }
            // Verifica se a query retornou a coluna telefone ou se ela veio nula.
            if (isset($row->telefone) && $row->telefone && !in_array($row->telefone, $clientes[$id]['telefones'])) {
                $clientes[$id]['telefones'][] = $row->telefone;
            }

            // Verifica se a query retornou a coluna cidade ou se ela veio nula.
            if (isset($row->cidade) && $row->cidade) {
                // Cria a estrutura para o endereço
                $endereco = [
                    'cidade' => $row->cidade,
                    'cep' => $row->cep,
                    'bairro' => $row->bairro,
                    'rua_numero' => $row->rua_numero,
                ];
                // Verifica se o endereço já existe no array de endereços do cliente, se não existe, adiciona
                if (!in_array($endereco, $clientes[$id]['enderecos'])) {
                    $clientes[$id]['enderecos'][] = $endereco;
                }
            }
        }
        return response()->json(array_values($clientes), 200);
    }

    // Controlador que busca um cliente pelo seu ID

    public function show($id) {
    $cpf = null;
    $cnpj = null;
    
    if ($id) {
        $idLimpo = preg_replace('/[^0-9]/', '', $id);
        $tamanho = strlen($idLimpo);
        
        if ($tamanho == 11) {
            $cpf = $idLimpo;
        } else if ($tamanho == 14) {
            $cnpj = $idLimpo;
        } else {
            return response()->json(['message' => 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos'], 400);
        }
    }

    if ($cpf) {
        $clientes = DB::select("SELECT * FROM CLIENTES WHERE CPF_CLIENTE = ?", [$cpf]);
    } else if ($cnpj) {
        $clientes = DB::select("SELECT * FROM CLIENTES WHERE CNPJ_CLIENTE = ?", [$cnpj]);
    } else {
        return response()->json(['message' => 'Formato inválido'], 400);
    }

    // Verifica se encontrou algum cliente
    if (empty($clientes)) {
        return response()->json(['message' => 'Cliente não encontrado'], 404);
    }

    // Pega o primeiro cliente (deveria ser único)
    $cliente = $clientes[0];

    // Agora sim, usa o cod_cliente do cliente encontrado
    $telefones = DB::select("SELECT * FROM TELEFONES_CLIENTES WHERE COD_CLIENTE = ?", [$cliente->cod_cliente]);
    $enderecos = DB::select("SELECT * FROM ENDERECOS_CLIENTES WHERE COD_CLIENTE = ?", [$cliente->cod_cliente]);

    // Adiciona telefones e endereços ao cliente
    $cliente->telefones = array_map(fn($t) => $t->telefone, $telefones);
    $cliente->enderecos = array_map(fn($e) => [
        'cod_endereco_cliente' => $e->cod_endereco_cliente,
        'cidade' => $e->cidade,
        'cep' => $e->cep,
        'bairro' => $e->bairro,
        'rua_numero' => $e->rua_numero,
    ], $enderecos);

    return response()->json($cliente, 200);
}

    // Controlador que cadastra um cliente

    public function store(Request $request) {
        // Verifica se o request contém os dados do cliente
        $cpf = $request->input('cpf');
        $cnpj = $request->input('cnpj');
        $email = $request->input('email');
        $nome = $request->input('nome');
        $dataNascimento = $request->input('data_nascimento');
        $telefones = $request->input('telefones');
        $enderecos = $request->input('enderecos', []);

        // Verifica se os telefones não estão vazios e são um array de strings
        if (!empty($telefones) && is_string($telefones[0] ?? null)) {
            // Mapeia cada telefone para um array com a chave "telefone"
            $telefones = array_map(fn($t) => ['telefone' => $t], $telefones);
        }
        
        // Valida os dados do cliente
        $request->validate([
            // Valida se o cpf é não nulo, string, existe no banco de dados e com no máximo 11 caracteres
            'cpf' => 'nullable|size:11|unique:clientes,cpf_cliente',
            // Valida se o cnpj é não nulo, string, existe no banco de dados e com no máximo 14 caracteres
            'cnpj' => 'nullable|size:14|unique:clientes,cnpj_cliente',
            // Valida se o email é não nulo, string, com no máximo 100 caracteres e é um email válido
            'email' => 'required|email|max:100',
            // Valida se o nome é não nulo, string, com no máximo 100 caracteres
            'nome' => 'required|string|max:100',
            // Valida se a data de nascimento é não nula e é uma data válida
            'data_nascimento' => 'nullable|date',
            // Valida se os telefones não estão vazios e com tamanho 11
            'telefones.*.telefone' => 'required|string|size:11',
            // Valida se os endereços não estão vazios e com tamanho 100
            'enderecos.*.cidade' => 'required|string|max:100',
            // Valida se os endereços não estão vazios e com tamanho 8
            'enderecos.*.cep' => 'required|size:8',
            // Valida se os endereços não estão vazios e com tamanho 100
            'enderecos.*.bairro' => 'required|string|max:100',
            // Valida se os endereços não estão vazios e com tamanho 100
            'enderecos.*.rua_numero' => 'required|string|max:100',
        ]);

        // Gera um ID aleatório para o cliente
        do {
            $codCliente = random_int(1, 999999);
            $exists = DB::select("SELECT 1 FROM CLIENTES WHERE COD_CLIENTE = ?", [$codCliente]);
        } while (!empty($exists));

        DB::beginTransaction();

        // Inicia a transação, tentando inserir os dados do cliente
        try {
            DB::insert("INSERT INTO CLIENTES (COD_CLIENTE, CPF_CLIENTE, CNPJ_CLIENTE, EMAIL, NOME, DATA_NASCIMENTO) VALUES (?, ?, ?, ?, ?, ?)", 
            [$codCliente, $cpf, $cnpj, $email, $nome, $dataNascimento]);

            // Insere os endereços do cliente
            foreach ($enderecos as $end) {
                DB::insert("INSERT INTO ENDERECOS_CLIENTES (COD_CLIENTE, CIDADE, CEP, BAIRRO, RUA_NUMERO) VALUES (?, ?, ?, ?, ?)",
                [$codCliente, $end['cidade'], $end['cep'], $end['bairro'], $end['rua_numero']]);
            }
            
            // Insere os telefones do cliente
            foreach ($telefones as $t) {
                DB::insert("INSERT INTO TELEFONES_CLIENTES (COD_CLIENTE, TELEFONE) VALUES (?, ?)", [$codCliente, $t['telefone']]);
            }

            DB::commit();

            // Commita a transação e retorna os dados do cliente com sucesso
            return response()->json(['message' => 'Cliente cadastrado com sucesso!', 'cod_cliente' => $codCliente, 'telefones' => $telefones], 201);
        } catch (\Exception $e) {

            // Rollback a transação e retorna uma mensagem de erro
            DB::rollBack();
            return response()->json(['message' => 'Erro ao cadastrar o cliente', 'error' => $e->getMessage()], 500);
        }
    }

    // Controlador que atualiza os dados de um cliente

    public function update(Request $request, $id) {
        // Verifica se o request contém os dados do cliente
        $cpf = $request->input('cpf');
        $cnpj = $request->input('cnpj');
        $email = $request->input('email');
        $nome = $request->input('nome');
        $dataNascimento = $request->input('data_nascimento');
        $telefones = $request->input('telefones');
        $enderecos = $request->input('enderecos', []);

        // Verifica se os telefones não estão vazios e são um array de strings
        if (!empty($telefones) && is_string($telefones[0] ?? null)) {
            $telefones = array_map(fn($t) => ['telefone' => $t], $telefones);
        }

        // Valida os dados do cliente
        $request->validate([
            // Valida se o cpf é não nulo, string, existe no banco de dados e com no máximo 11 caracteres
            'cpf' => 'nullable|size:11|unique:clientes,cpf_cliente,' . $id . ',cod_cliente',
            // Valida se o cnpj é não nulo, string, existe no banco de dados e com no máximo 14 caracteres
            'cnpj' => 'nullable|size:14|unique:clientes,cnpj_cliente,' . $id . ',cod_cliente',
            // Valida se o email é não nulo, string, com no máximo 100 caracteres e é um email válido
            'email' => 'required|email|max:100',
            // Valida se o nome é não nulo, string, com no máximo 100 caracteres
            'nome' => 'required|string|max:100',
            // Valida se a data de nascimento é não nula e é uma data válida
            'data_nascimento' => 'nullable|date',
            // Valida se os telefones não estão vazios e com tamanho 11
            'telefones.*.telefone' => 'required|string|size:11',
            // Valida se os endereços não estão vazios e com tamanho 100
            'enderecos.*.cidade' => 'required|string|max:100',
            // Valida se os endereços não estão vazios e com tamanho 8
            'enderecos.*.cep' => 'required|size:8',
            // Valida se os endereços não estão vazios e com tamanho 100
            'enderecos.*.bairro' => 'required|string|max:100',
            // Valida se os endereços não estão vazios e com tamanho 100
            'enderecos.*.rua_numero' => 'required|string|max:100',
        ]);

        DB::beginTransaction();
        // Inicia a transação, tentando atualizar os dados do cliente
        try {
            // Atualiza os dados do cliente
            DB::update("UPDATE CLIENTES SET CPF_CLIENTE = ?, CNPJ_CLIENTE = ?, EMAIL = ?, NOME = ?, DATA_NASCIMENTO = ? WHERE COD_CLIENTE = ?",
            [$cpf, $cnpj, $email, $nome, $dataNascimento, $id]);

            DB::delete("DELETE FROM ENDERECOS_CLIENTES WHERE COD_CLIENTE = ?", [$id]);
            // Insere os endereços do cliente, apagando os anteriores
            foreach($enderecos as $end) {
                DB::insert("INSERT INTO ENDERECOS_CLIENTES (COD_CLIENTE, CIDADE, CEP, BAIRRO, RUA_NUMERO) VALUES (?, ?, ?, ?, ?)",
                [$id, $end['cidade'], $end['cep'], $end['bairro'], $end['rua_numero']]);
            }

            DB::delete("DELETE FROM TELEFONES_CLIENTES WHERE COD_CLIENTE = ?", [$id]);
            // Insere os telefones do cliente, apagando os anteriores
            foreach($telefones as $t) {
                DB::insert("INSERT INTO TELEFONES_CLIENTES (COD_CLIENTE, TELEFONE) VALUES (?, ?)", [$id, $t['telefone']]);
            }

            // Commita a transação e retorna uma mensagem de sucesso
            DB::commit();
            return response()->json(['message' => 'Cliente atualizado com sucesso!'], 201);

        } catch (\Exception $e) {
            // Rollback a transação e retorna uma mensagem de erro
            DB::rollBack();
            return response()->json(['message' => 'Erro ao atualizar o cliente', 'error' => $e->getMessage()], 500);
        }
    }

    // Controlador que exclui um cliente

    public function destroy($id) {
        // Inicia a transação, tentando excluir o cliente
        DB::beginTransaction();
        
        try {
            // ⭐ 1. Verifica se o cliente existe
            $cliente = DB::select("SELECT * FROM CLIENTES WHERE COD_CLIENTE = ?", [$id]);
            
            if (empty($cliente)) {
                return response()->json(['message' => 'Cliente não encontrado'], 404);
            }

            // ⭐ 2. Verifica se existem pedidos associados ao cliente
            $pedidos = DB::select("SELECT * FROM PEDIDOS WHERE COD_CLIENTE = ?", [$id]);
            
            if (!empty($pedidos)) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Não é possível excluir o cliente pois existem pedidos associados a ele'
                ], 422);
            }

            // ⭐ 3. Exclui os registros relacionados (na ordem correta)
            
            // Primeiro exclui os telefones
            DB::delete("DELETE FROM TELEFONES_CLIENTES WHERE COD_CLIENTE = ?", [$id]);
            
            // Depois exclui os endereços
            DB::delete("DELETE FROM ENDERECOS_CLIENTES WHERE COD_CLIENTE = ?", [$id]);
            
            // ⭐ 4. Finalmente exclui o cliente
            $deleted = DB::delete("DELETE FROM CLIENTES WHERE COD_CLIENTE = ?", [$id]);

            DB::commit();
            
            return response()->json(['message' => 'Cliente excluído com sucesso!'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao excluir o cliente', 
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
