<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFuncionarioIsAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {   
        // Supabase envia o token no header Authorization
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token não fornecido'], 401);
        }

        // Verifica token com Supabase
        $funcionario = $this->validateSupabaseToken($token);

        if (!$funcionario) {
            return response()->json(['message' => 'Token inválido'], 401);
        }

        // Adicionar funcionario à request
        $request->attributes->set('funcionario', $funcionario);

        return $next($request);
    }

    private function validateSupabaseToken($token) {
        // Fazer request para Supabase para validar o token
        $client = new \GuzzleHttp\Client();

        try {
            $response = $client->get('https://uvwzveuytsxswmlgoskn.supabase.co/auth/v1/user', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                    'apikey' => env('SUPABASE_API_KEY')
                ]
            ]);

            $userData = json_decode($response->getBody(), true);

            // Buscar o funcionario pelo email do supabase
            return DB::select('FUNCIONARIOS_CRM')
                ->where('EMAIL', $userData['email'])
                ->first();
        } catch (\Exception $e) {
            return null;
        }
    }
}
