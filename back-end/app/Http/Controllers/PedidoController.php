<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    // Controlador que busca todos os pedidos ou filtra por termo de busca
    public function index(Request $request) {
        // Recebe o termo de busca da query string
        $termoBusca = $request->query('termo', '');
        
        $query = "
        SELECT
            -- Definição dos dados que irão vir na query, com as suas respectivas variáveis
            p.*,
            e.CIDADE AS MANU_INST_CIDADE,
            e.CEP AS MANU_INST_CEP,
            e.BAIRRO AS MANU_INST_BAIRRO,
            e.RUA_NUMERO AS MANU_INST_RUA,
            ec.CIDADE AS CLI_CIDADE,
            ec.CEP AS CLI_CEP,
            ec.BAIRRO AS CLI_BAIRRO,
            ec.RUA_NUMERO AS CLI_RUA,
            pc.STATUS AS status_pagamento,
            p.CREATED_AT AS created_at,
            f.NOME_FUNCIONARIO AS funcionario_nome,
            -- Agregação dos tipos em uma subquery para evitar duplicação
            (
                SELECT STRING_AGG(pt.NOME_TIPO, ', ')
                FROM PEDIDOS_TIPOS pt 
                WHERE pt.COD_PEDIDO = p.COD_PEDIDO
            ) AS tipos_pedido,
            -- Agregação dos itens do pedido COM OS NOMES CORRETOS
            (
                SELECT JSON_AGG(
                    json_build_object(
                        'cod_produto', ip.COD_PRODUTO,
                        'nome_produto', ip.NOME_PRODUTO,  -- NOME CORRETO
                        'quantidade', it.QUANTIDADE,
                        'preco_unitario', ip.VALOR_UNITARIO  -- NOME CORRETO
                    )
                )
                -- Faz a comparação de chaves estrangeiras, e junta os dados em uma tabela (json) de acordo com a chave (inner join)
                FROM ITENS_PRODUTOS it
                INNER JOIN PRODUTOS ip ON it.COD_PRODUTO = ip.COD_PRODUTO
                WHERE it.COD_PEDIDO = p.COD_PEDIDO
            ) AS itens_pedido

        FROM PEDIDOS p
        LEFT JOIN ENDERECOS_INST_MANU e ON p.COD_PEDIDO = e.COD_PEDIDO 
        LEFT JOIN ENDERECOS_CLIENTES ec ON p.COD_ENDERECO_CLIENTE = ec.COD_ENDERECO_CLIENTE 
        LEFT JOIN PAGAMENTOS_CLIENTES pc ON pc.COD_PEDIDO = p.COD_PEDIDO
        LEFT JOIN FUNCIONARIOS_CRM f ON f.COD_FUNCIONARIO = p.COD_FUNCIONARIO
        ";
        
        // Adiciona WHERE se houver termo de busca
        if (!empty($termoBusca)) {
            $query .= " WHERE p.COD_PEDIDO::text LIKE ? OR f.NOME_FUNCIONARIO ILIKE ? OR ec.CIDADE ILIKE ?";
            $termoLike = '%' . $termoBusca . '%';
            $pedido = DB::select($query . " ORDER BY p.COD_PEDIDO", [$termoLike, $termoLike, $termoLike]);
        } else {
            $query .= " ORDER BY p.COD_PEDIDO";
            $pedido = DB::select($query);
        }

        return response()->json($pedido);
    }

        public function show($id) {
        $pedido = DB::select("SELECT * FROM PEDIDOS WHERE COD_PEDIDO = ?", [$id]);
        
        if (empty($pedido)) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }

        $enderecosInstManu = DB::select("SELECT * FROM ENDERECOS_INST_MANU WHERE COD_PEDIDO = ?", [$id]);
        $itensProdutos = DB::select("SELECT * FROM ITENS_PRODUTOS WHERE COD_PEDIDO = ?", [$id]);
        $pedidoTipos = DB::select("SELECT * FROM PEDIDOS_TIPOS WHERE COD_PEDIDO = ?", [$id]);
        $enderecosClientes = DB::select("SELECT * FROM ENDERECOS_CLIENTES WHERE COD_ENDERECO_CLIENTE = ?", 
        [$pedido[0]->COD_ENDERECO_CLIENTE]);
        $pagamentoCliente = DB::select("SELECT * FROM PAGAMENTOS_CLIENTES WHERE COD_PEDIDO = ?", [$id]);
        $funcionario = DB::select("SELECT * FROM FUNCIONARIOS_CRM WHERE COD_FUNCIONARIO = ?", 
        [$pedido[0]->COD_FUNCIONARIO]);

        $produtos = [];
        if (!empty($itensProdutos)) {
            $codigos = array_column($itensProdutos, 'COD_PRODUTO');
            $placeholders = implode(',', array_fill(0, count($codigos), '?'));
            $produtos = DB::select("SELECT * FROM PRODUTOS WHERE COD_PRODUTO IN ($placeholders)", $codigos);
        }
        
        return response()->json([
            'pedido' => $pedido[0],
            'funcionario' => !empty($funcionario) ? $funcionario[0] : null,
            'enderecos_inst_manu' => !empty($enderecosInstManu) ? $enderecosInstManu[0] : null,
            'enderecos_clientes' => !empty($enderecosClientes) ? $enderecosClientes[0] : null,
            'itens_produtos' => $itensProdutos,
            'pedidos_tipos' => $pedidoTipos,
            'produtos' => $produtos,
        ], 200);
    }

    // Controlador que cadastra um pedido
    public function store(Request $request) {
        // Validação dos dados enviados do pedido
        $request->validate([
            // Valida se o código do cliente é não nulo, inteiro e existe no banco de dados
            'cod_cliente' => 'required|integer|exists:clientes,cod_cliente',
            // Valida se os códigos dos produtos são necessários de acordo com o tipo do pedido
            'cod_produtos' => 'nullable|required_if:pedido_tipos.*,PRODUTO|array',
            // Valida se os códigos dos produtos são números inteiros e existem no banco de dados
            'cod_produtos.*' => 'integer|exists:produtos,cod_produto',
            // Valida se o código do endereço do cliente pode ser nulo, se é necessário de acordo com o tipo do pedido
            // inteiro, e se existe no banco de dados
            'cod_endereco_cliente' => 'nullable|required_if:pedido_tipos.*,PRODUTO|integer|exists:enderecos_clientes,cod_endereco_cliente',
            // Valida se o pedido_tipos é um array
            'pedido_tipos' => 'required|array',
            // Válida se pedido_tipos não é nulo, string e é uma das 3 opções permitidas
            'pedido_tipos.*' => 'required|string|in:INSTALACAO,MANUTENCAO,PRODUTO',
            // Valida se as quantidade é necessária de acordo com o tipo do pedido
            'quantidade' => 'required_if:pedido_tipos.*,PRODUTO|array',
            // Valida se as quantidade são números inteiros e maiores que 0
            'quantidade.*' => 'integer|min:1',
            // Valida se a descrição é não nula, string, e com no máximo 500 caracteres
            'descricao' => 'required|string|max:500',
            // Valida se o valor_total é não nulo, numérico, e com o valor máximo de 99.999.999,99
            'valor_total' => 'required|numeric|min:0|max:99999999.99',
            // Valida se o valor_adicional é não nulo, numérico, e com o valor minimo de 0
            'valor_adicional' => 'nullable|numeric|min:0',
            'metodo_pagamento' => 'required|string|in:PIX,CREDITO,DEBITO,DINHEIRO,BOLETO',
            'parcelas' => 'nullable|integer',
            // Valida se o prazo é não nulo, data
            'prazo' => 'required|date',
        ]);

        // Pega os dados do pedido para cadastrar
        $funcionario = $request->attributes->get('funcionario');
        $codFuncionario = $funcionario->cod_funcionario; // Codigo do funcionário vem do middleware
        // Os dados abaixo vem dos inputs do request enviado
        $codCliente = $request->input('cod_cliente');
        $codProdutos = $request->input('cod_produtos');
        $codEnderecoCliente = $request->input('cod_endereco_cliente');
        $pedidoTipos = $request->input('pedido_tipos');
        $quantidade = $request->input('quantidade');
        $descricao = $request->input('descricao');
        $valorTotal = $request->input('valor_total');
        $valorAdicional = $request->input('valor_adicional', 0);
        $metodoPagamento = $request->input('metodo_pagamento');
        $parcelas = $request->input('parcelas', 0);
        $prazo = $request->input('prazo');

        // Pega o request input cod_produtos e converte por meio do array_map cada valor para inteiro
        $codProdutos = array_map('intval', $request->input('cod_produtos'));

        // Gera um código aleatório para o pedido, verifica se o código já existe no banco de dados
        do {
            $codPedido = random_int(1, 999999);
            $exists = DB::select("SELECT 1 FROM PEDIDOS WHERE COD_PEDIDO = ?", [$codPedido]);
        } while (!empty($exists));

        // Se o pedido tiver tipo de instalação ou manutenção, entra em mais validações
        if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {
            // Valida se as cidades, cep, bairro e rua_numero são necessárias de acordo com o tipo do pedido
            $request->validate([
                // Valida se é string e com no máximo 100 caracteres
                'cidade' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|string|max:100',
                // Valida se é string e com no máximo 8 caracteres
                'cep' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|size:8',
                // Valida se é string e com no máximo 100 caracteres
                'bairro' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|string|max:100',
                // Valida se é string e com no máximo 100 caracteres
                'rua_numero' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|string|max:100',
            ]);

            $cidade = $request->input('cidade');
            $cep = $request->input('cep');
            $bairro = $request->input('bairro');
            $ruaNumero = $request->input('rua_numero');
        }

        DB::beginTransaction();
        // Inicia transação
        try {
            // Insere os dados do pedido no banco de dados
            DB::insert("INSERT INTO PEDIDOS (COD_PEDIDO, COD_CLIENTE, COD_ENDERECO_CLIENTE, COD_FUNCIONARIO, DESCRICAO, 
            VALOR_TOTAL, VALOR_ADICIONAL, METODO_PAGAMENTO, PARCELAS, PRAZO) VALUES (?, ?, ?, ?, ?, ?, ? , ?, ?, ?)", [$codPedido, 
            $codCliente, $codEnderecoCliente, $codFuncionario, $descricao, $valorTotal, $valorAdicional, $metodoPagamento, $parcelas, $prazo]);
            // Se o pedido tiver tipo de instalação ou manutenção, insere os dados do endereço no banco de dados
            if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {
                DB::insert("INSERT INTO ENDERECOS_INST_MANU (COD_PEDIDO, CIDADE, CEP, BAIRRO, RUA_NUMERO)
                VALUES (?, ?, ?, ?, ?)", [$codPedido, $cidade, $cep, $bairro, $ruaNumero]);
            }
            // Se o pedido tiver tipo de produto, insere os dados do produto no banco de dados
            if (in_array('PRODUTO', $pedidoTipos)) {
                // Verifica se há produtos
                if (empty($codProdutos)) {
                    return response()->json([
                        'message' => 'Nenhum produto selecionado para pedido do tipo PRODUTO'
                    ], 422);
                }
                
                // Loop para pegar os códigos dos produtos
                foreach ($codProdutos as $index => $codProduto) {
                    // Verifica se a quantidade para este índice existe
                    if (!isset($quantidade[$index])) {
                        return response()->json([
                            'erro' => "Quantidade não informada para o produto $codProduto"
                        ], 422);
                    }
                    
                    $quantidadeProduto = $quantidade[$index];
                    
                    // Valida se a quantidade é válida
                    if ($quantidadeProduto < 1) {
                        return response()->json([
                            'erro' => "Quantidade inválida para o produto $codProduto"
                        ], 422);
                    }
                    
                    // Insere os dados em itens_produtos no banco de dados
                    DB::insert("INSERT INTO ITENS_PRODUTOS (COD_PEDIDO, COD_PRODUTO, QUANTIDADE) VALUES (?, ?, ?)", [
                        $codPedido, 
                        $codProduto, 
                        $quantidadeProduto
                    ]);
                }
            }
            // Loop para pegar cada tipo pedido
            foreach ($pedidoTipos as $pedidoTipo) {
                // Insere os dados em pedidos_tipos no banco de dados
                DB::insert("INSERT INTO PEDIDOS_TIPOS (COD_PEDIDO, NOME_TIPO) VALUES (?, ?)", [$codPedido, $pedidoTipo]);
            }
            // Commit a transação e retona o pedido com sucesso
            DB::commit();
            return response()->json(['message' => 'Pedido cadastrado com sucesso!', 'cod_pedido' => $codPedido], 201);
        } catch (\Exception $e) {
            // Rollback a transação e retorna o erro
            DB::rollback();
            return response()->json(['message' => 'Erro ao cadastrar o pedido', 'error' => $e->getMessage()], 500);
        }
    }

    public function novosPedidos() {
        try {
            $novosPedidos = DB::select("SELECT COD_PEDIDO FROM PEDIDOS WHERE CREATED_AT > NOW() - INTERVAL '7 days'");
            return response()->json($novosPedidos, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao buscar novos pedidos'], 500);
        }
    }

    public function pedidosAtrasados() {
        try {
            $pedidosAtrasados = DB::select("SELECT COD_PEDIDO FROM PEDIDOS WHERE PRAZO < NOW()");
            return response()->json($pedidosAtrasados, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao buscar pedidos atrasados'], 500);
        }
    }

    // Controlador que atualiza um pedido
    public function update(Request $request, $id) {
        $request->validate([
            'cod_cliente' => 'required|integer|exists:clientes,cod_cliente',
            'cod_produtos' => 'required_if:pedido_tipos.*,PRODUTO|array',
            'cod_produtos.*' => 'integer|exists:produtos,cod_produto',
            'cod_endereco_cliente' => 'nullable|required_if:pedido_tipos.*,PRODUTO|integer|exists:enderecos_clientes,cod_endereco_cliente',
            'pedido_tipos' => 'required|array',
            'pedido_tipos.*' => 'required|string|in:INSTALACAO,MANUTENCAO,PRODUTO',
            'quantidade' => 'required_if:pedido_tipos.*,PRODUTO|array',
            'quantidade.*' => 'integer|min:1',
            'descricao' => 'required|string|max:500',
            'valor_total' => 'required|numeric|min:0|max:99999999.99',
            'valor_adicional' => 'nullable|numeric|min:0',
            'metodo_pagamento' => 'required|string|in:PIX,CREDITO,DEBITO,DINHEIRO,BOLETO',
            'parcelas' => 'nullable|integer',
            'prazo' => 'required|date',
        ]);

        // Pega os dados do pedido para atualizar
        $funcionario = $request->attributes->get('funcionario');
        $codFuncionario = $funcionario->cod_funcionario;
        // Os dados abaixo vem dos inputs do request enviado
        $codCliente = $request->input('cod_cliente');
        $codProdutos = $request->input('cod_produtos');
        $codEnderecoCliente = $request->input('cod_endereco_cliente');
        $pedidoTipos = $request->input('pedido_tipos');
        $quantidade = $request->input('quantidade');
        $descricao = $request->input('descricao');
        $valorTotal = $request->input('valor_total');
        $valorAdicional = $request->input('valor_adicional', 0);
        $metodoPagamento = $request->input('metodo_pagamento');
        $parcelas = $request->input('parcelas', 0);
        $prazo = $request->input('prazo');

        // Converte produtos em inteiros
        $codProdutos = array_map('intval', $request->input('cod_produtos'));

        // Se o pedido tiver tipo de instalação ou manutenção
        if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {

            $request->validate([
                'cidade' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|string|max:100',
                'cep' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|size:8',
                'bairro' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|string|max:100',
                'rua_numero' => 'required_if:pedido_tipos,INSTALACAO,MANUTENCAO|string|max:100',
            ]);

            $cidade = $request->input('cidade');
            $cep = $request->input('cep');
            $bairro = $request->input('bairro');
            $ruaNumero = $request->input('rua_numero');

        }

        DB::beginTransaction();

        try {

            DB::update("UPDATE PEDIDOS SET COD_CLIENTE = ?, COD_ENDERECO_CLIENTE = ?, COD_FUNCIONARIO = ?, DESCRICAO = ?, 
            VALOR_TOTAL = ?, VALOR_ADICIONAL = ?, METODO_PAGAMENTO = ?, PARCELAS = ?, PRAZO = ? WHERE COD_PEDIDO = ?", [
                $codCliente, $codEnderecoCliente, $codFuncionario, $descricao, $valorTotal, $valorAdicional, $metodoPagamento, $parcelas, 
                $prazo, $id
            ]);

            // CORREÇÃO: LÓGICA MELHORADA PARA INSTALAÇÃO / MANUTENÇÃO
            // Sempre apaga primeiro os registros existentes
            DB::delete("DELETE FROM ENDERECOS_INST_MANU WHERE COD_PEDIDO = ?", [$id]);

            // Só insere novo endereço se INSTALACAO ou MANUTENCAO estiverem selecionados
            if (in_array('INSTALACAO', $pedidoTipos) || in_array('MANUTENCAO', $pedidoTipos)) {

                $cidade = $request->input('cidade');
                $cep = $request->input('cep');
                $bairro = $request->input('bairro');
                $ruaNumero = $request->input('rua_numero');

                DB::insert("INSERT INTO ENDERECOS_INST_MANU (COD_PEDIDO, CIDADE, CEP, BAIRRO, RUA_NUMERO)
                VALUES (?, ?, ?, ?, ?)", [
                    $id, $cidade, $cep, $bairro, $ruaNumero
                ]);

            } else {
            }

            // CORREÇÃO: LÓGICA MELHORADA PARA PRODUTOS
            // Sempre apaga primeiro os registros existentes
            DB::delete("DELETE FROM ITENS_PRODUTOS WHERE COD_PEDIDO = ?", [$id]);

            // Só insere novos produtos se PRODUTO estiver selecionado E houver produtos
            if (in_array('PRODUTO', $pedidoTipos) && !empty($codProdutos)) {

                // Validação de compatibilidade entre arrays
                if (count($codProdutos) !== count($quantidade)) {
                    return response()->json(['message' => 'Arrays de produtos e quantidades incompatíveis'], 422);
                }

                foreach ($codProdutos as $codProduto) {

                    if (!isset($quantidade[$codProduto])) {
                        return response()->json(['erro' => "Quantidade não informada para o produto $codProduto"], 422);
                    }

                    $quantidadeProduto = $quantidade[$codProduto];

                    DB::insert("INSERT INTO ITENS_PRODUTOS (COD_PEDIDO, COD_PRODUTO, QUANTIDADE)
                    VALUES (?, ?, ?)", [$id, $codProduto, $quantidadeProduto]);
                    

                }
            }

            // Sempre apaga e reinsere os tipos
            DB::delete("DELETE FROM PEDIDOS_TIPOS WHERE COD_PEDIDO = ?", [$id]);

            foreach ($pedidoTipos as $tipo) {
                DB::insert("INSERT INTO PEDIDOS_TIPOS (COD_PEDIDO, NOME_TIPO) VALUES (?, ?)", [$id, $tipo]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Pedido atualizado com sucesso!',
                'cod_pedido' => $id
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Erro ao atualizar o pedido',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Controlador que apaga um pedido
    public function destroy($id) {
        DB::beginTransaction();
        try {
            //1. Verifica se o pedido existe
            $pedido = DB::select("SELECT * FROM PEDIDOS WHERE COD_PEDIDO = ?", [$id]);
            
            if (empty($pedido)) {
                return response()->json(['message' => 'Pedido não encontrado'], 404);
            }

            //2. Verifica se existe pagamento associado ao pedido
            $pagamento = DB::select("SELECT * FROM PAGAMENTOS_CLIENTES WHERE COD_PEDIDO = ?", [$id]);
            
            if (!empty($pagamento)) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Não é possível excluir o pedido pois existe um pagamento associado a ele'
                ], 422);
            }

            //3. Exclui os registros relacionados (na ordem correta)
            
            // Primeiro exclui os itens do pedido
            DB::delete("DELETE FROM ITENS_PRODUTOS WHERE COD_PEDIDO = ?", [$id]);
            
            // Exclui os tipos do pedido
            DB::delete("DELETE FROM PEDIDOS_TIPOS WHERE COD_PEDIDO = ?", [$id]);
            
            // Exclui os endereços de instalação/manutenção
            DB::delete("DELETE FROM ENDERECOS_INST_MANU WHERE COD_PEDIDO = ?", [$id]);
            
            //4. Finalmente exclui o pedido
            $deleted = DB::delete("DELETE FROM PEDIDOS WHERE COD_PEDIDO = ?", [$id]);

            DB::commit();
            
            return response()->json(['message' => 'Pedido excluído com sucesso!'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao excluir o pedido', 
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
