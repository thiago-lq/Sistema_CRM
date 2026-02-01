<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    // Domínios específicos do seu projeto Vercel
    'allowed_origins' => [
        'https://sistema-crm-ten.vercel.app',
        'https://sistema-crm-thiagos-projects-7e80f3b8.vercel.app',
        'https://sistema-crm-git-main-thiagos-projects-7e80f3b8.vercel.app',
        'https://sistema-aoszdxoic-thiagos-projects-7e80f3b8.vercel.app',
    ],

    // Padrões regex para permitir QUALQUER subdomínio .vercel.app
    'allowed_origins_patterns' => [
        '/^https?:\/\/(.+\.)?vercel\.app$/',
        '/^https?:\/\/localhost(:\d+)?$/',
        '/^https?:\/\/127\.0\.0\.1(:\d+)?$/',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
