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
