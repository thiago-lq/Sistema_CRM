<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function ordemServicoStatusSemana() {
        $result = DB::select("
            SELECT
                CASE 
                    WHEN pg.STATUS = true THEN 'PAGO'
                    WHEN pg.STATUS = false THEN 'PENDENTE'
                    ELSE 'EM ANDAMENTO'
                END AS status,
                COUNT(*) AS total
            FROM PEDIDOS p
            LEFT JOIN PAGAMENTOS_CLIENTES pg
                ON pg.COD_PEDIDO = p.COD_PEDIDO
            WHERE p.PRAZO BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW() + INTERVAL '7 DAYS'
            GROUP BY
                CASE
                    WHEN pg.STATUS = true THEN 'PAGO'
                    WHEN pg.STATUS = false THEN 'PENDENTE'
                    ELSE 'EM ANDAMENTO'
                END
            ");
        return response()->json($result, 200);
    }

    public function tabelaOrdemServicoSemana() {
        $result = DB::select("SELECT p.COD_PEDIDO, p.PRAZO, pg.STATUS, pg.DATA_HORA_PAGAMENTO FROM PEDIDOS p
        LEFT JOIN PAGAMENTOS_CLIENTES pg ON p.COD_PEDIDO = pg.COD_PEDIDO
        WHERE p.PRAZO BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW() + INTERVAL '7 DAYS'
        ORDER BY p.PRAZO ASC");

        return response()->json($result, 200);
    }

    public function motivosContatoSemana() {
        $result = DB::select("
            SELECT
                CASE
                    WHEN m.MOTIVO = 'COMPRAR PRODUTOS' THEN 'COMPRAR PRODUTOS'
                    WHEN m.MOTIVO = 'FAZER INSTALACAO' THEN 'FAZER INSTALAÇÃO'
                    WHEN m.MOTIVO = 'MANUTENCAO EM CERCA ELETRICA' THEN 'MANUTENÇÃO EM CERCA ELÉTRICA'
                    WHEN m.MOTIVO = 'MANUTENCAO EM CONCERTINA' THEN 'MANUTENÇÃO EM CONCERTINA'
                    WHEN m.MOTIVO = 'MANUTENCAO EM CAMERA' THEN 'MANUTENÇÃO EM CÂMERA'
                    WHEN m.MOTIVO = 'TROCA DE CABOS' THEN 'TROCA DE CABOS'
                    WHEN m.MOTIVO = 'TROCA DE CONECTORES' THEN 'TROCA DE CONECTORES'
                    WHEN m.MOTIVO = 'TROCA DE FONTE DE ENERGIA' THEN 'TROCA DE FONTE DE ENERGIA'
                    WHEN m.MOTIVO = 'TROCA DE DVR' THEN 'TROCA DE DVR'
                    WHEN m.MOTIVO = 'MANUTENCAO EM DVR' THEN 'MANUTENÇÃO EM DVR'
                    WHEN m.MOTIVO = 'TROCA DE HD' THEN 'TROCA DE HD'
                    WHEN m.MOTIVO = 'TROCA DE CENTRAL DE CHOQUE' THEN 'TROCA DE CENTRAL DE CHOQUE'
                    WHEN m.MOTIVO = 'MANUTENCAO EM CENTRAL' THEN 'MANUTENÇÃO EM CENTRAL'
                    WHEN m.MOTIVO = 'TROCA DE BATERIA DE CENTRAL' THEN 'TROCA DE BATERIA DE CENTRAL'
                    WHEN m.MOTIVO = 'OUTRO' THEN 'OUTRO'
                END AS MOTIVO,
                COUNT(*) AS total
                FROM MOTIVOS_REGISTRO m
                LEFT JOIN REGISTROS r
                    ON m.COD_REGISTRO = r.COD_REGISTRO
                WHERE r.CREATED_AT BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW() + INTERVAL '7 DAYS'
                GROUP BY
                    CASE
                        WHEN m.MOTIVO = 'COMPRAR PRODUTOS' THEN 'COMPRAR PRODUTOS'
                        WHEN m.MOTIVO = 'FAZER INSTALACAO' THEN 'FAZER INSTALAÇÃO'
                        WHEN m.MOTIVO = 'MANUTENCAO EM CERCA ELETRICA' THEN 'MANUTENÇÃO EM CERCA ELÉTRICA'
                        WHEN m.MOTIVO = 'MANUTENCAO EM CONCERTINA' THEN 'MANUTENÇÃO EM CONCERTINA'
                        WHEN m.MOTIVO = 'MANUTENCAO EM CAMERA' THEN 'MANUTENÇÃO EM CÂMERA'
                        WHEN m.MOTIVO = 'TROCA DE CABOS' THEN 'TROCA DE CABOS'
                        WHEN m.MOTIVO = 'TROCA DE CONECTORES' THEN 'TROCA DE CONECTORES'
                        WHEN m.MOTIVO = 'TROCA DE FONTE DE ENERGIA' THEN 'TROCA DE FONTE DE ENERGIA'
                        WHEN m.MOTIVO = 'TROCA DE DVR' THEN 'TROCA DE DVR'
                        WHEN m.MOTIVO = 'MANUTENCAO EM DVR' THEN 'MANUTENÇÃO EM DVR'
                        WHEN m.MOTIVO = 'TROCA DE HD' THEN 'TROCA DE HD'
                        WHEN m.MOTIVO = 'TROCA DE CENTRAL DE CHOQUE' THEN 'TROCA DE CENTRAL DE CHOQUE'
                        WHEN m.MOTIVO = 'MANUTENCAO EM CENTRAL' THEN 'MANUTENÇÃO EM CENTRAL'
                        WHEN m.MOTIVO = 'TROCA DE BATERIA DE CENTRAL' THEN 'TROCA DE BATERIA DE CENTRAL'
                        WHEN m.MOTIVO = 'OUTRO' THEN 'OUTRO'
                    END
                ORDER BY total DESC
        ");
        return response()->json($result, 200);
    }
}
