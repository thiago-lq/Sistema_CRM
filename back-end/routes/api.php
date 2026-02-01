<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\RegistroController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\EnsureFuncionarioIsAuthenticated;
use App\Http\Controllers\FuncionarioController;

// Rota de autenticação do supabase
//Route::middleware('auth.funcionario')->group(function() {
    // Rotas de Clientes e telefones de clientes
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::get('/clientes/{id}', [ClienteController::class, 'show']);
    Route::get('/novosClientes', [ClienteController::class, 'novosClientes']);
    Route::get('/dadosCliente/{id}', [ClienteController::class, 'dadosCliente']);
    Route::post('/clientes', [ClienteController::class, 'store']);
    Route::put('/clientes/{id}', [ClienteController::class, 'update']);
    Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']);

    // Rotas de Pedidos
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'show']);
    Route::get('/novosPedidos', [PedidoController::class, 'novosPedidos']);
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::put('/pedidos/{id}', [PedidoController::class, 'update']);
    Route::delete('/pedidos/{id}', [PedidoController::class, 'destroy']);

    // Rotas de Produtos
    Route::get('/produtos', [ProdutoController::class, 'index']);

    // Rotas de Registros
    Route::get('/registros', [RegistroController::class, 'index']);
    Route::get('/registros/{id}', [RegistroController::class, 'show']);
    Route::post('/registros', [RegistroController::class, 'store']);
    Route::put('/registros/{id}', [RegistroController::class, 'update']);
    Route::delete('/registros/{id}', [RegistroController::class, 'destroy']);
    Route::get('/buscaCliente/{id}', [RegistroController::class, 'buscaCliente']);

    // Rotas de Dashboard
    Route::get('/ordemServicoStatusSemana', [DashboardController::class, 'ordemServicoStatusSemana']);
    Route::get('/tabelaOrdemServicoSemana', [DashboardController::class, 'tabelaOrdemServicoSemana']);
    Route::get('/motivosContatoSemana', [DashboardController::class, 'motivosContatoSemana']);
    Route::get('/interacaoPorCanalMes', [DashboardController::class, 'interacaoPorCanalMes']);
    Route::get('/clientesContatosMes', [DashboardController::class, 'clientesContatosMes']);
    Route::get('/funcionariosRegistrosMes', [DashboardController::class, 'funcionariosRegistrosMes']);
    Route::get('/pedidosAnual', [DashboardController::class, 'pedidosAnual']);
    Route::get('/qualidadeDeServicoAnual', [DashboardController::class, 'qualidadeDeServicoAnual']);
    Route::get('/tendenciaDeInteracoes', [DashboardController::class, 'tendenciaDeInteracoes']);

    // Nova rota para buscar dados do funcionário logado
    Route::get('/funcionario', [FuncionarioController::class, 'buscarFuncionario']);
//});