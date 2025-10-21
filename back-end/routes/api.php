<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\Funcionario_CrmController;

// Rotas de Clientes
Route::get('/clientes', [ClienteController::class, 'index']);
Route::get('/clientes/{id}', [ClienteController::class, 'show']);
Route::post('/clientes', [ClienteController::class, 'store']);
Route::put('/clientes/{id}', [ClienteController::class, 'update']);
Route::delete('/clientes/{id}', [ClienteController::class, 'destroy']);

// Rotas de Funcionarios_CRM
Route::get('/funcionarios_crm', [Funcionario_CrmController::class, 'index']);
Route::get('/funcionarios_crm/{id}', [Funcionario_CrmController::class, 'show']);

// Rotas de Endereços de Clientes
Route::get('/enderecos_clientes', [Endereco_ClienteController::class, 'index']);
Route::get('/enderecos_clientes/{id}', [Endereco_ClienteController::class, 'show']);
Route::post('/enderecos_clientes', [Endereco_ClienteController::class, 'store']);
Route::put('/enderecos_clientes/{id}', [Endereco_ClienteController::class, 'update']);
Route::delete('/enderecos_clientes/{id}', [Endereco_ClienteController::class, 'destroy']);

// Rotas de Pedidos
Route::get('/pedidos', [PedidoController::class, 'index']);
Route::get('/pedidos/{id}', [PedidoController::class, 'show']);
Route::post('/pedidos', [PedidoController::class, 'store']);
Route::put('/pedidos/{id}', [PedidoController::class, 'update']);
Route::delete('/pedidos/{id}', [PedidoController::class, 'destroy']);

// Rotas de endereços ou manutenções (PEDIDOS)
Route::get('/enderecos_inst_manu', [EnderecoInstManuController::class, 'index']);
Route::get('/enderecos_inst_manu/{id}', [EnderecoInstManuController::class, 'show']);
Route::post('/enderecos_inst_manu', [EnderecoInstManuController::class, 'store']);
Route::put('/enderecos_inst_manu/{id}', [EnderecoInstManuController::class, 'update']);
Route::delete('/enderecos_inst_manu/{id}', [EnderecoInstManuController::class, 'destroy']);

// Rotas de Telefones de Clientes
Route::get('/telefones_clientes', [TelefoneClienteController::class, 'index']);
Route::get('/telefones_clientes/{id}', [TelefoneClienteController::class, 'show']);
Route::post('/telefones_clientes', [TelefoneClienteController::class, 'store']);
Route::put('/telefones_clientes/{id}', [TelefoneClienteController::class, 'update']);
Route::delete('/telefones_clientes/{id}', [TelefoneClienteController::class, 'destroy']);

// Rotas de Pagamentos de Clientes
Route::get('/pagamentos_clientes', [PagamentosClientesController::class, 'index']);
Route::get('/pagamentos_clientes/{id1}/{id2}', [PagamentosClientesController::class, 'show']);

// Rotas de Relatórios
Route::get('/relatorios', [RelatorioController::class, 'index']);
Route::get('/relatorios/{id}', [RelatorioController::class, 'show']);
Route::post('/relatorios', [RelatorioController::class, 'store']);
Route::put('/relatorios/{id}', [RelatorioController::class, 'update']);
Route::delete('/relatorios/{id}', [RelatorioController::class, 'destroy']);