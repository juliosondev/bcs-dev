<?php

use App\Http\Controllers\AiController;
use App\Http\Controllers\RegistrationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Registo / abertura de conta — guarda no banco e envia SMS de confirmação
Route::post('/registrations', [RegistrationController::class, 'store']);

// BCS AI — assistente sobre financiamento e crédito
Route::post('/ai/chat', [AiController::class, 'chat']);

// Health check — usado pelo frontend para verificar a conexão com a API
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
        'time' => now()->toIso8601String(),
    ]);
});

// Usuário autenticado (Sanctum)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
