<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cliente</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        h2 {
            text-align: center;
            margin-bottom: 20px;
        }

        .container {
            width: 100%;
        }

        .linha {
            margin-bottom: 8px;
        }

        .label {
            font-weight: bold;
        }

        .box {
            border: 1px solid #000;
            padding: 10px;
            margin-top: 15px;
        }

        .titulo-box {
            font-weight: bold;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    
    <h2>Relatório de Cliente</h2>

    <div class= "container">
        <div class = "linha">
            <span class = "label">Código do cliente:</span>
            {{ $cliente['cod_cliente'] }}
        </div>
        <div class= "linha">
            <span class = "label">Nome:</span>
            {{ $cliente['nome'] }}
        </div>
        <div class="linha">
            @if ($cliente['cpf_cliente'] !== null)
                <span class="label">CPF:</span>
                {{ $cliente['cpf_cliente'] }}
            @endif
        </div>
        <div class="linha">
            @if ($cliente['cnpj_cliente'] !== null)
                <span class="label">CNPJ:</span>
                {{ $cliente['cnpj_cliente'] }}
            @endif
        </div>
        <div class="linha">
            @if ($cliente['data_nascimento'] !== null)
                <span class="label">Data de nascimento:</span>
                {{ $cliente['data_nascimento'] }}
            @endif
        </div>
        <div class = "linha">
            <span class = "label">Email:</span>
            {{ $cliente['email'] }}
        </div>
        <div class="box">
            <div class="titulo-box">Telefones</div>
            @foreach ($cliente['telefones'] as $telefone)
                <div>{{ $telefone }}</div>
            @endforeach
        </div>
        <div class="box">
            <div class="titulo-box">Endereços</div>
            @foreach ($cliente['enderecos'] as $endereco)
                <div>
                    {{ $endereco['rua_numero'] }},
                    {{ $endereco['bairro'] }},
                    {{ $endereco['cidade'] }} -
                    CEP: {{ $endereco['cep'] }}
                </div>
            @endforeach
        </div>
    </div>
</body>
</html>