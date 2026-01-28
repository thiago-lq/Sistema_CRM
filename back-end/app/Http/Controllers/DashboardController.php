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

    public function interacaoPorCanalMes() {
        $result = DB::select("
            SELECT
                r.TIPO_INTERACAO AS canal,
                COUNT(*) AS total
            FROM REGISTROS r
            WHERE r.CREATED_AT >= NOW() - INTERVAL '30 DAYS'
            GROUP BY CANAL
            ORDER BY total DESC;
        ");

        return response()->json($result, 200);
    }

    public function clientesContatosMes() {
        $result = DB::select("
            SELECT
                r.COD_CLIENTE AS cliente,
                COUNT(*) AS total
                FROM REGISTROS r
                WHERE r.CREATED_AT >= NOW() - INTERVAL '30 DAYS'
                GROUP BY r.COD_CLIENTE
                ORDER BY total DESC
                LIMIT 10
        ");
        return response()->json($result, 200);
    }

    public function funcionariosRegistrosMes() {
        $result = DB::select("
            SELECT
                r.COD_FUNCIONARIO,
                f.NOME_FUNCIONARIO AS nome,
                COUNT(*) AS total,
                SUM(CASE WHEN r.TIPO_INTERACAO = 'WHATSAPP' THEN 1 ELSE 0 END) AS whatsapp,
                SUM(CASE WHEN r.TIPO_INTERACAO = 'EMAIL' THEN 1 ELSE 0 END) AS email,
                SUM(CASE WHEN r.TIPO_INTERACAO = 'TELEFONE' THEN 1 ELSE 0 END) AS telefone
            FROM REGISTROS r
            LEFT JOIN FUNCIONARIOS_CRM f
                ON r.COD_FUNCIONARIO = f.COD_FUNCIONARIO
            WHERE r.CREATED_AT >= NOW() - INTERVAL '30 DAYS'
            GROUP BY r.COD_FUNCIONARIO, f.NOME_FUNCIONARIO
            ORDER BY total DESC;
        ");

        return response()->json($result, 200);
    }

    public function pedidosAnual()
    {
        $hoje = now();
        
        // Preparar array dos últimos 6 meses
        $mesesInfo = [];
        $nomesMeses = [];
        
        for ($i = 5; $i >= 0; $i--) {
            $data = $hoje->copy()->subMonths($i);
            $mesesInfo[] = [
                'mes_numero' => $data->month,
                'mes_nome' => $data->locale('pt_BR')->translatedFormat('M'),
                'ano_atual' => $data->year,
                'ano_anterior' => $data->year - 1
            ];
            $nomesMeses[] = $data->locale('pt_BR')->translatedFormat('M');
        }
        
        // Inicializar arrays de resultados
        $resultadoAtual = [];
        $resultadoAnterior = [];
        
        // Para cada mês, buscar dados atual e anterior
        foreach ($mesesInfo as $mesInfo) {
            // Pedidos do mês atual (ano atual)
            $atualCount = DB::table('pedidos')
                ->whereRaw('EXTRACT(MONTH FROM created_at) = ?', [$mesInfo['mes_numero']])
                ->whereRaw('EXTRACT(YEAR FROM created_at) = ?', [$mesInfo['ano_atual']])
                ->count();
            
            // Pedidos do mês equivalente no ano anterior
            $anteriorCount = DB::table('pedidos')
                ->whereRaw('EXTRACT(MONTH FROM created_at) = ?', [$mesInfo['mes_numero']])
                ->whereRaw('EXTRACT(YEAR FROM created_at) = ?', [$mesInfo['ano_anterior']])
                ->count();
            
            $resultadoAtual[] = [
                'mes' => $mesInfo['mes_numero'],
                'mes_nome' => $mesInfo['mes_nome'],
                'total' => $atualCount
            ];
            
            $resultadoAnterior[] = [
                'mes' => $mesInfo['mes_numero'],
                'mes_nome' => $mesInfo['mes_nome'],
                'total' => $anteriorCount
            ];
        }
        
        return response()->json([
            'atual' => $resultadoAtual,
            'anterior' => $resultadoAnterior,
            'meses_nomes' => $nomesMeses,
        ]);
    }

    public function qualidadeDeServicoAnual() {
        $hoje = now();

        // Preparar array dos últimos 12 meses
        $mesesInfo = [];
        $nomesMeses = [];

        for ($i = 11; $i >= 0; $i--) {
            $data = $hoje->copy()->subMonths($i);
            $mesesInfo[] = [
                'mes_numero' => $data->month,
                'mes_nome' => $data->locale('pt_BR')->translatedFormat('M'),
                'ano' => $data->year,
                'mes_completo' => $data->format('Y-m')
            ];
            $nomesMeses[] = $data->locale('pt_BR')->translatedFormat('M');
        }

        $cases = [];
        $params = [];

        foreach($mesesInfo as $index => $mes) {
            $cases[] = "
                SUM(
                    CASE
                        WHEN EXTRACT(MONTH FROM pg.DATA_HORA_PAGAMENTO) = ?
                        AND EXTRACT(YEAR FROM pg.DATA_HORA_PAGAMENTO) = ?
                        AND pg.STATUS IS NOT NULL  -- Ignora nulos (em andamento)
                        THEN 1 ELSE 0
                    END
                ) AS total_{$index},
                SUM(
                    CASE
                        WHEN EXTRACT(MONTH FROM pg.DATA_HORA_PAGAMENTO) = ?
                        AND EXTRACT(YEAR FROM pg.DATA_HORA_PAGAMENTO) = ?
                        AND pg.STATUS = true        -- Boolean true, não string!
                        AND pg.DATA_HORA_PAGAMENTO <= p.PRAZO
                        THEN 1 ELSE 0
                    END
                ) AS dentro_{$index}";

            $params[] = $mes['mes_numero'];
            $params[] = $mes['ano'];
            $params[] = $mes['mes_numero'];
            $params[] = $mes['ano'];
        }

        $query = "SELECT " . implode(', ', $cases) . " 
                FROM PAGAMENTOS_CLIENTES pg
                LEFT JOIN PEDIDOS p ON pg.COD_PEDIDO = p.COD_PEDIDO";
        
        $result = DB::select($query, $params);
        $result = $result[0] ?? (object)[];

        $resultados = [];
        $somaPercentual = 0;
        $somaTotalOS = 0;
        $somaDentroSLA = 0;
        $mesesComDados = 0;

        foreach($mesesInfo as $index => $mes) {
            $totalOS = $result->{"total_{$index}"} ?? 0;
            $dentroSLA = $result->{"dentro_{$index}"} ?? 0;

            $percentual = $totalOS > 0 
                ? round(($dentroSLA / $totalOS) * 100, 1)
                : 0;

            $resultados[] = [
                'mes' => $mes['mes_numero'],
                'mes_nome' => $mes['mes_nome'],
                'ano' => $mes['ano'],
                'mes_completo' => $mes['mes_completo'],
                'total_os' => (int)$totalOS,
                'dentro_sla' => (int)$dentroSLA,
                'percentual' => $percentual,
                'fora_sla' => (int)$totalOS - (int)$dentroSLA
            ];

            if ($totalOS > 0) {
                $somaPercentual += $percentual;
                $somaTotalOS += $totalOS;
                $somaDentroSLA += $dentroSLA;
                $mesesComDados++;
            }
        }

        $mediaAnual = $mesesComDados > 0
            ? round($somaPercentual / $mesesComDados, 1)
            : 0;

        $percentualTotal = $somaTotalOS > 0 
            ? round(($somaDentroSLA / $somaTotalOS) * 100, 1) 
            : 0;

        // Identificar melhor e pior mês
        $melhorMes = null;
        $piorMes = null;
        
        foreach ($resultados as $mes) {
            if ($mes['total_os'] > 0) {
                if (!$melhorMes || $mes['percentual'] > $melhorMes['percentual']) {
                    $melhorMes = $mes;
                }
                if (!$piorMes || $mes['percentual'] < $piorMes['percentual']) {
                    $piorMes = $mes;
                }
            }
        }
        
        return response()->json([
            'dados' => $resultados,
            'meses_nomes' => $nomesMeses,
            'metricas' => [
                'media_anual' => $mediaAnual,
                'percentual_total' => $percentualTotal,
                'total_os' => $somaTotalOS,
                'total_dentro_sla' => $somaDentroSLA,
                'total_fora_sla' => $somaTotalOS - $somaDentroSLA,
                'melhor_mes' => $melhorMes,
                'pior_mes' => $piorMes,
                'meses_com_dados' => $mesesComDados
            ],
        ]);
    }
}
