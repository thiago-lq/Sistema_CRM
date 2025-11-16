<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\Funcionario_CrmController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\PagamentosClientesController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\ProdutoController;
use App\Http\Middleware\EnsureFuncionarioIsAuthenticated;

// Rota de autenticação do supabase
Route::middleware('auth.funcionario')->group(function() {
    // Rotas de Clientes e telefones de clientes
    Route::get('/clientes', [ClienteController::class, 'index']);
    Route::get('/clientes/{id}', [ClienteController::class, 'show']);
    Route::post('/clientes', [ClienteController::class, 'store']);
    Route::put('/clientes/{id}', [ClienteController::class, 'update']);
    Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']);

    // Rotas de Funcionarios_CRM
    Route::get('/funcionarios_crm', [Funcionario_CrmController::class, 'index']);
    Route::get('/funcionarios_crm/{id}', [Funcionario_CrmController::class, 'show']);

    // Rotas de Pedidos
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'show']);
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::put('/pedidos/{id}', [PedidoController::class, 'update']);
    Route::delete('/pedidos/{id}', [PedidoController::class, 'destroy']);

    // Rotas de Pagamentos de Clientes
    Route::get('/pagamentos_clientes', [PagamentosClientesController::class, 'index']);
    Route::get('/pagamentos_clientes/{id1}/{id2}', [PagamentosClientesController::class, 'show']);

    // Rotas de Relatórios
    Route::get('/relatorios', [RelatorioController::class, 'index']);
    Route::get('/relatorios/{id}', [RelatorioController::class, 'show']);
    Route::post('/relatorios', [RelatorioController::class, 'store']);
    Route::put('/relatorios/{id}', [RelatorioController::class, 'update']);
    Route::delete('/relatorios/{id}', [RelatorioController::class, 'destroy']);

    // Rotas de Produtos
    Route::get('/produtos', [ProdutoController::class, 'index']);
});