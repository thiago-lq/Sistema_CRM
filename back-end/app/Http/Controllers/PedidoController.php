<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    // Controlador que busca todos os pedidos ou filtra por termo de busca
    public function index(Request $request)
    {
        $termoBusca = $request->query('termo', '');

        $query = "
            SELECT
                p.COD_PEDIDO   AS cod_pedido,
                p.COD_CLIENTE  AS cod_cliente,
                p.VALOR_TOTAL  AS valor_total,
                pc.STATUS      AS status_pagamento,
                p.CREATED_AT   AS created_at,
                STRING_AGG(pt.NOME_TIPO, ', ') AS tipos_pedido
            FROM PEDIDOS p
            LEFT JOIN PAGAMENTOS_CLIENTES pc 
                ON pc.COD_PEDIDO = p.COD_PEDIDO
            LEFT JOIN PEDIDOS_TIPOS pt 
                ON pt.COD_PEDIDO = p.COD_PEDIDO
        ";

        $bindings = [];

        if (!empty($termoBusca)) {
            $query .= "
                WHERE 
                    p.COD_PEDIDO::text LIKE ?
                    OR p.COD_CLIENTE::text LIKE ?
            ";
            $termoLike = "%{$termoBusca}%";
            $bindings = [$termoLike, $termoLike];
        }

        $query .= "
            GROUP BY 
                p.COD_PEDIDO,
                p.COD_CLIENTE,
                p.VALOR_TOTAL,
                pc.STATUS,
                p.CREATED_AT
            ORDER BY p.COD_PEDIDO
        ";

        $pedido = DB::select($query, $bindings);

        return response()->json($pedido);
    }

        public function show($id) {
        $pedido = DB::select("
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
        WHERE p.COD_PEDIDO = ?", [$id]);
        
        if (empty($pedido)) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }
        
        return response()->json($pedido[0]);
    }

    public function store(Request $request)
    {
        // =========================
        // VALIDAÇÃO
        // =========================
        $request->validate([
            'cod_cliente' => 'required|integer|exists:clientes,cod_cliente',

            'pedido_tipos' => 'required|array',
            'pedido_tipos.*' => 'required|string|in:INSTALACAO,MANUTENCAO,PRODUTO',

            'cod_produtos' => 'nullable|array',
            'cod_produtos.*' => 'integer|exists:produtos,cod_produto',

            'quantidade' => 'nullable|array',
            'quantidade.*' => 'integer|min:1',

            'cod_endereco_cliente' =>
                'nullable|required_if:pedido_tipos.*,PRODUTO|integer|exists:enderecos_clientes,cod_endereco_cliente',

            'descricao' => 'required|string|max:500',
            'valor_total' => 'required|numeric|min:0|max:99999999.99',
            'valor_adicional' => 'nullable|numeric|min:0',

            'metodo_pagamento' => 'required|string|in:PIX,CREDITO,DEBITO,DINHEIRO,BOLETO',
            'parcelas' => 'nullable|integer',
            'prazo' => 'required|date',

            'cidade' => 'sometimes|required|string|max:100',
            'cep' => 'sometimes|required|size:8',
            'bairro' => 'sometimes|required|string|max:100',
            'rua_numero' => 'sometimes|required|string|max:100',
        ]);

        $funcionario = $request->attributes->get('funcionario');
        $pedidoTipos = $request->pedido_tipos;

        // GERA COD_PEDIDO (SEM SELECT)

        $tentativas = 0;

        do {
            $codPedido = random_int(1, 999999);
            $tentativas++;

            DB::beginTransaction();

            try {
                // INSERT PEDIDO (TENTA DIRETO)
                DB::insert("
                    INSERT INTO pedidos
                    (cod_pedido, cod_cliente, cod_endereco_cliente, cod_funcionario,
                    descricao, valor_total, valor_adicional, metodo_pagamento, parcelas, prazo)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ", [
                    $codPedido,
                    $request->cod_cliente,
                    $request->cod_endereco_cliente,
                    $funcionario->cod_funcionario,
                    $request->descricao,
                    $request->valor_total,
                    $request->valor_adicional ?? 0,
                    $request->metodo_pagamento,
                    $request->parcelas ?? 0,
                    $request->prazo
                ]);

                // ENDEREÇO INST / MANU
                if (array_intersect(['INSTALACAO', 'MANUTENCAO'], $pedidoTipos)) {
                    DB::insert("
                        INSERT INTO enderecos_inst_manu
                        (cod_pedido, cidade, cep, bairro, rua_numero)
                        VALUES (?, ?, ?, ?, ?)
                    ", [
                        $codPedido,
                        $request->cidade,
                        $request->cep,
                        $request->bairro,
                        $request->rua_numero
                    ]);
                }

                // ITENS (LOTE)
                if (in_array('PRODUTO', $pedidoTipos)) {
                    $itens = [];

                    foreach ($request->cod_produtos as $i => $produto) {
                        $itens[] = [
                            'cod_pedido' => $codPedido,
                            'cod_produto' => $produto,
                            'quantidade' => $request->quantidade[$i],
                        ];
                    }

                    DB::table('itens_produtos')->insert($itens);
                }

                // TIPOS (LOTE)
                $tipos = array_map(fn ($tipo) => [
                    'cod_pedido' => $codPedido,
                    'nome_tipo' => $tipo,
                ], $pedidoTipos);

                DB::table('pedidos_tipos')->insert($tipos);

                DB::commit();

                return response()->json([
                    'message' => 'Pedido cadastrado com sucesso!'], 201);

            } catch (\Illuminate\Database\QueryException $e) {
                DB::rollBack();

                // colisão de cod_pedido → tenta de novo
                if ($e->getCode() === '23505' && $tentativas < 5) {
                    continue;
                }

                throw $e;
            }

        } while ($tentativas < 5);

        return response()->json([
            'message' => 'Falha ao gerar código do pedido'
        ], 500);
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
