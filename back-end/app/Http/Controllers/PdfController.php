<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class PdfController extends Controller
{
    public function pdfRegistro($id) {
        $registro = DB::select("
            SELECT 
                r.*,
                TO_CHAR(r.created_at, 'DD/MM/YYYY HH24:MI') as created_at,
                TO_CHAR(r.updated_at, 'DD/MM/YYYY HH24:MI') as updated_at,
                c.NOME,
                f.NOME_FUNCIONARIO,
                (
                    SELECT STRING_AGG(m.MOTIVO, ', ')
                    FROM MOTIVOS_REGISTRO m
                    WHERE m.COD_REGISTRO = r.COD_REGISTRO
                ) AS MOTIVO
            FROM REGISTROS r 
            LEFT JOIN CLIENTES c 
                ON r.COD_CLIENTE = c.COD_CLIENTE
            LEFT JOIN FUNCIONARIOS_CRM f 
                ON r.COD_FUNCIONARIO = f.COD_FUNCIONARIO
            WHERE r.COD_REGISTRO = ?
        ", [$id]);

        if (empty($registro)) {
            return response()->json(['message' => 'Registro não encontrado'], 404);
        }

        $pdf = Pdf::loadView('pdf.pdfregistro', [
            'registro' => $registro[0]
        ]);

        return $pdf->download("registro_{$id}.pdf");
    }

    public function pdfCliente($id) {
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

        $pdf = Pdf::loadView('pdf.pdfcliente', [
            'cliente' => $cliente
        ]);

        return $pdf->download("cliente_{$id}.pdf");
    }

    public function pdfPedido($id) {
        $pedido = DB::select("
        SELECT
            -- Definição dos dados que irão vir na query, com as suas respectivas variáveis
            p.*,
            TO_CHAR(p.created_at, 'DD/MM/YYYY HH24:MI') as created_at,
            TO_CHAR(p.updated_at, 'DD/MM/YYYY HH24:MI') as updated_at,
            TO_CHAR(p.prazo, 'DD/MM/YYYY HH24:MI') as prazo,
            c.NOME AS CLIENTE_NOME,
            c.CPF_CLIENTE AS CLIENTE_CPF,
            c.CNPJ_CLIENTE AS CLIENTE_CNPJ,
            e.CIDADE AS MANU_INST_CIDADE,
            e.CEP AS MANU_INST_CEP,
            e.BAIRRO AS MANU_INST_BAIRRO,
            e.RUA_NUMERO AS MANU_INST_RUA,
            ec.CIDADE AS CLI_CIDADE,
            ec.CEP AS CLI_CEP,
            ec.BAIRRO AS CLI_BAIRRO,
            ec.RUA_NUMERO AS CLI_RUA,
            pc.STATUS AS status_pagamento,
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
        LEFT JOIN CLIENTES c ON p.COD_CLIENTE = c.COD_CLIENTE
        LEFT JOIN ENDERECOS_INST_MANU e ON p.COD_PEDIDO = e.COD_PEDIDO 
        LEFT JOIN ENDERECOS_CLIENTES ec ON p.COD_ENDERECO_CLIENTE = ec.COD_ENDERECO_CLIENTE 
        LEFT JOIN PAGAMENTOS_CLIENTES pc ON pc.COD_PEDIDO = p.COD_PEDIDO
        LEFT JOIN FUNCIONARIOS_CRM f ON f.COD_FUNCIONARIO = p.COD_FUNCIONARIO
        WHERE p.COD_PEDIDO = ?", [$id]);
        
        if (empty($pedido)) {
            return response()->json(['message' => 'Pedido não encontrado'], 404);
        }
        
        $pdf = Pdf::loadView('pdf.pdfpedido', [
            'pedido' => $pedido[0]
        ]);

        return $pdf->download("pedido_{$id}.pdf");
    }
}
