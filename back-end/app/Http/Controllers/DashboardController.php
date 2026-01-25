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
            WHERE p.PRAZO BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW()
            GROUP BY
                CASE
                    WHEN pg.STATUS = true THEN 'PAGO'
                    WHEN pg.STATUS = false THEN 'PENDENTE'
                    ELSE 'EM ANDAMENTO'
                END
            ");
        return response()->json($result, 200);
    }

    public function motivosContatoSemana() {
        $result = DB::select("SELECT r.COD_REGISTRO, r.CREATED_AT,
        (
            SELECT STRING_AGG(m.MOTIVO, ', ')
            FROM MOTIVOS_REGISTRO m
            WHERE m.COD_REGISTRO = r.COD_REGISTRO
        ) AS MOTIVO
        FROM REGISTROS r
        WHERE r.CREATED_AT BETWEEN NOW() - INTERVAL '7 DAYS' AND NOW()
        ORDER BY r.CREATED_AT ASC"
        );

        return response()->json($result, 200);
    }
}
