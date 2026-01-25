<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function ordemServicoStatusSemana() {
        $result = DB::select("SELECT p.COD_PEDIDO, p.PRAZO, pg.STATUS, pg.DATA_HORA_PAGAMENTO 
        FROM PEDIDOS p LEFT JOIN PAGAMENTOS_CLIENTES pg ON p.COD_PEDIDO = pg.COD_PEDIDO 
        WHERE p.PRAZO BETWEEN NOW() - INTERVAL '7 days' AND NOW()
        ORDER BY p.PRAZO ASC");

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
