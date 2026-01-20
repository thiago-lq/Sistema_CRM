<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class ClienteController extends Controller
{

    public function index(Request $request)
    {
        $termo = $request->query('termo');
        $cpf = null;
        $cnpj = null;

        if ($termo) {
            $termoLimpo = preg_replace('/[^0-9]/', '', $termo);
            $tamanho = strlen($termoLimpo);

            if ($tamanho === 11) {
                $cpf = $termoLimpo;
            } else if ($tamanho === 14) {
                $cnpj = $termoLimpo;
            }
        }

        if ($cpf) {
            $result = DB::select("
                SELECT c.COD_CLIENTE, c.NOME, c.EMAIL, c.CREATED_AT, t.TELEFONE
                FROM CLIENTES c
                LEFT JOIN TELEFONES_CLIENTES t ON c.COD_CLIENTE = t.COD_CLIENTE
                WHERE c.CPF_CLIENTE = ?
                ORDER BY c.COD_CLIENTE
            ", [$cpf]);

        } else if ($cnpj) {
            $result = DB::select("
                SELECT c.COD_CLIENTE, c.NOME, c.EMAIL, c.CREATED_AT, t.TELEFONE
                FROM CLIENTES c
                LEFT JOIN TELEFONES_CLIENTES t ON c.COD_CLIENTE = t.COD_CLIENTE
                WHERE c.CNPJ_CLIENTE = ?
                ORDER BY c.COD_CLIENTE
            ", [$cnpj]);

        } else {
            // 🔥 aqui estava o bug lógico
            $result = DB::select("
                SELECT c.COD_CLIENTE, c.NOME, c.EMAIL, c.CREATED_AT, t.TELEFONE
                FROM CLIENTES c
                LEFT JOIN TELEFONES_CLIENTES t ON c.COD_CLIENTE = t.COD_CLIENTE
                ORDER BY c.COD_CLIENTE
            ");
        }

        // Montagem do array (seu código está OK)
        $clientes = [];

        foreach ($result as $row) {
            $id = $row->cod_cliente;

            if (!isset($clientes[$id])) {
                $clientes[$id] = [
                    'cod_cliente' => $row->cod_cliente,
                    'nome' => $row->nome,
                    'email' => $row->email,
                    'created_at' => $row->created_at,
                    'telefones' => [],
                ];
            }

            if ($row->telefone && !in_array($row->telefone, $clientes[$id]['telefones'])) {
                $clientes[$id]['telefones'][] = $row->telefone;
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
                return response()->json(['message' => 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos'], 422);
            }
        }

        if ($cpf) {
            $clientes = DB::select("SELECT COD_CLIENTE, NOME FROM CLIENTES WHERE CPF_CLIENTE = ?", [$cpf]);
        } else if ($cnpj) {
            $clientes = DB::select("SELECT COD_CLIENTE, NOME FROM CLIENTES WHERE CNPJ_CLIENTE = ?", [$cnpj]);
        } else {
            return response()->json(['message' => 'Formato inválido'], 422);
        }

        // Verifica se encontrou algum cliente
        if (empty($clientes)) {
            return response()->json(['message' => 'Cliente não encontrado'], 404);
        }

        // Pega o primeiro cliente (deveria ser único)
        $cliente = $clientes[0];

        // Agora sim, usa o cod_cliente do cliente encontrado
        $enderecos = DB::select("SELECT * FROM ENDERECOS_CLIENTES WHERE COD_CLIENTE = ?", [$cliente->cod_cliente]);

        // Adiciona endereços ao cliente
        $cliente->enderecos = array_map(fn($e) => [
            'cod_endereco_cliente' => $e->cod_endereco_cliente,
            'cidade' => $e->cidade,
            'cep' => $e->cep,
            'bairro' => $e->bairro,
            'rua_numero' => $e->rua_numero,
        ], $enderecos);

        return response()->json($cliente, 200);
    }

    public function novosClientes() {
        try {
            $clientes = DB::select("SELECT COD_CLIENTE FROM CLIENTES WHERE CREATED_AT > NOW() - INTERVAL '7 days'");
            return response()->json($clientes, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao buscar novos clientes'], 500);
        }
    }

    public function dadosCliente($id)
{
    try {
        $result = DB::select("
            SELECT 
                c.*,
                t.TELEFONE AS telefone,
                e.CIDADE AS cidade,
                e.CEP AS cep,
                e.RUA_NUMERO AS rua_numero,
                e.BAIRRO AS bairro
            FROM CLIENTES c
            LEFT JOIN TELEFONES_CLIENTES t ON c.COD_CLIENTE = t.COD_CLIENTE
            LEFT JOIN ENDERECOS_CLIENTES e ON c.COD_CLIENTE = e.COD_CLIENTE
            WHERE c.COD_CLIENTE = ?
        ", [$id]);

        if (empty($result)) {
            return response()->json(['message' => 'Cliente não encontrado'], 404);
        }

        $firstRow = $result[0];

        $cliente = [
            'cod_cliente' => $firstRow->cod_cliente,
            'cpf_cliente' => $firstRow->cpf_cliente,
            'cnpj_cliente' => $firstRow->cnpj_cliente,
            'email' => $firstRow->email,
            'nome' => $firstRow->nome,
            'data_nascimento' => $firstRow->data_nascimento,
            'created_at' => $firstRow->created_at,
            'updated_at' => $firstRow->updated_at,
            'telefones' => [],
            'enderecos' => [],
        ];

        foreach ($result as $row) {
            if (!empty($row->telefone) && !in_array($row->telefone, $cliente['telefones'])) {
                $cliente['telefones'][] = $row->telefone;
            }

            if (!empty($row->cidade)) {
                $cliente['enderecos'][] = [
                    'cidade' => $row->cidade,
                    'cep' => $row->cep,
                    'bairro' => $row->bairro,
                    'rua_numero' => $row->rua_numero,
                ];
            }
        }

        $cliente['enderecos'] = array_values(array_unique($cliente['enderecos'], SORT_REGULAR));

        return response()->json($cliente, 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erro ao buscar cliente',
            'error' => $e->getMessage()
        ], 500);
    }
}

    // Controlador que cadastra um cliente

    public function store(Request $request) {
        // Valida os dados do cliente
        $request->validate([
            // Valida se o cpf é não nulo, string, existe no banco de dados e com no máximo 11 caracteres
            'cpf' => 'nullable|size:11|unique:clientes,cpf_cliente',
            // Valida se o cnpj é não nulo, string, existe no banco de dados e com no máximo 14 caracteres
            'cnpj' => 'nullable|size:14|unique:clientes,cnpj_cliente',
            // Valida se o email é não nulo, string, com no máximo 100 caracteres e é um email válido
            'email' => 'required|email|max:100|unique:clientes,email',
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
            return response()->json(['message' => 'Cliente cadastrado com sucesso!'], 201);
        } catch (QueryException $e) {

            // Rollback a transação e retorna uma mensagem de erro
            DB::rollBack();
            if ($e->getCode() === "23505") {
                return response()->json(['message' => 'Dados do cliente já existentes'], 409);
            }
            return response()->json(['message' => 'Erro ao cadastrar o cliente'], 500);
        }
    }

        // Controlador que atualiza os dados de um cliente
        public function update(Request $request, $id) {
        try {
            // Valida os dados do cliente
            $request->validate([
                'cpf' => 'nullable|size:11|unique:clientes,cpf_cliente,' . $id . ',cod_cliente',
                'cnpj' => 'nullable|size:14|unique:clientes,cnpj_cliente,' . $id . ',cod_cliente',
                'email' => 'required|email|max:100|unique:clientes,email,' . $id . ',cod_cliente',
                'nome' => 'required|string|max:100',
                'data_nascimento' => 'nullable|date',
                'telefones.*.telefone' => 'required|string|size:11',
                'enderecos.*.cidade' => 'required|string|max:100',
                'enderecos.*.cep' => 'required|size:8',
                'enderecos.*.bairro' => 'required|string|max:100',
                'enderecos.*.rua_numero' => 'required|string|max:100',
            ]);

            // Verifica se o request contém os dados do cliente
            $cpf = $request->input('cpf');
            $cnpj = $request->input('cnpj');
            $email = $request->input('email');
            $nome = $request->input('nome');
            $dataNascimento = $request->input('data_nascimento');
            $telefones = $request->input('telefones');
            $enderecos = $request->input('enderecos', []);

            // Verifica se os telefones não estão vazios e são um array de strings
            if (!empty($telefones)) {
                if (is_string($telefones[0] ?? null)) {
                    $telefones = array_map(fn($t) => ['telefone' => $t], $telefones);
                }
            }
            DB::beginTransaction();

            try {
                // Atualiza os dados do cliente
                DB::update("UPDATE CLIENTES SET CPF_CLIENTE = ?, CNPJ_CLIENTE = ?, EMAIL = ?, NOME = ?, DATA_NASCIMENTO = ? WHERE COD_CLIENTE = ?",
                [$cpf, $cnpj, $email, $nome, $dataNascimento, $id]);

                $enderecosInseridos = 0;
                
                foreach($enderecos as $index => $end) {
                    // Verifica se o endereço já existe para evitar duplicatas
                    $existing = DB::select("
                        SELECT COD_ENDERECO_CLIENTE 
                        FROM ENDERECOS_CLIENTES 
                        WHERE COD_CLIENTE = ? 
                        AND CIDADE = ? AND CEP = ? AND BAIRRO = ? AND RUA_NUMERO = ?
                    ", [$id, $end['cidade'], $end['cep'], $end['bairro'], $end['rua_numero']]);
                    
                    if (empty($existing)) {
                        DB::insert("INSERT INTO ENDERECOS_CLIENTES (COD_CLIENTE, CIDADE, CEP, BAIRRO, RUA_NUMERO) VALUES (?, ?, ?, ?, ?)",
                        [$id, $end['cidade'], $end['cep'], $end['bairro'], $end['rua_numero']]);
                        $enderecosInseridos++;
                    } else {
                    }
                }

                // Telefones podem ser deletados normalmente (provavelmente não têm FK)
                DB::delete("DELETE FROM TELEFONES_CLIENTES WHERE COD_CLIENTE = ?", [$id]);

                // Insere os telefones do cliente
                foreach($telefones as $index => $t) {
                    DB::insert("INSERT INTO TELEFONES_CLIENTES (COD_CLIENTE, TELEFONE) VALUES (?, ?)", [$id, $t['telefone']]);
                }

                // Commita a transação e retorna uma mensagem de sucesso
                DB::commit();
                
                return response()->json(['message' => 'Cliente atualizado com sucesso!'], 201);

            } catch (QueryException $e) {

            // Rollback a transação e retorna uma mensagem de erro
            DB::rollBack();
            if ($e->getCode() === "23505") {
                return response()->json(['message' => 'Dados do cliente já existentes'], 409);
            }
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e; // Laravel vai lidar com essa exceção automaticamente
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro inesperado', 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Controlador que exclui um cliente

    public function destroy($id) {
        // Inicia a transação, tentando excluir o cliente
        DB::beginTransaction();
        
        try {
            // Verifica se o cliente existe
            $cliente = DB::select("SELECT * FROM CLIENTES WHERE COD_CLIENTE = ?", [$id]);
            
            if (empty($cliente)) {
                return response()->json(['message' => 'Cliente não encontrado'], 404);
            }

            // Verifica se existem pedidos associados ao cliente
            $pedidos = DB::select("SELECT * FROM PEDIDOS WHERE COD_CLIENTE = ?", [$id]);
            
            if (!empty($pedidos)) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Não é possível excluir o cliente pois existem pedidos e registros associados a ele'
                ], 409);
            }

            // Verifica se existem registros associados ao cliente
            $registros = DB::select("SELECT * FROM REGISTROS WHERE COD_CLIENTE = ?", [$id]);

            if (!empty($registros)) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Não é possível excluir o cliente pois existem registros associados a ele'
                ], 409);
            }

            // Exclui os registros relacionados (na ordem correta)
            
            // Primeiro exclui os telefones
            DB::delete("DELETE FROM TELEFONES_CLIENTES WHERE COD_CLIENTE = ?", [$id]);
            
            // Depois exclui os endereços
            DB::delete("DELETE FROM ENDERECOS_CLIENTES WHERE COD_CLIENTE = ?", [$id]);
            
            // Finalmente exclui o cliente
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
