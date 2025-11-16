<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class EnsureFuncionarioIsAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {   
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token não fornecido'], 401);
        }

        $funcionario = $this->validateSupabaseToken($token);

        if (!$funcionario) {
            return response()->json(['message' => 'Token inválido'], 401);
        }

        $request->attributes->set('funcionario', $funcionario);

        return $next($request);
    }

    private function validateSupabaseToken($token) {
        $client = new \GuzzleHttp\Client();

        try {
            $response = $client->get('https://uvwzveuytsxswmlgoskn.supabase.co/auth/v1/user', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                    'apikey' => env('SUPABASE_ANON_KEY')
                ],
                'timeout' => 10
            ]);

            $userData = json_decode($response->getBody(), true);

            if (!isset($userData['email'])) {
                return null;
            }

            // Busca funcionário pelo email
            $funcionario = DB::table('funcionarios_crm')
                ->where('email', $userData['email'])
                ->first();

            return $funcionario;

        } catch (\Exception $e) {
            return null;
        }
    }
}