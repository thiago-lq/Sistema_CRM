<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Registro</title>

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

<h2>Relatório de Registro</h2>

<div class="container">

    <div class="linha">
        <span class="label">Código do Registro:</span>
        {{ $registro->cod_registro }}
    </div>

    <div class="linha">
        <span class="label">Cliente:</span>
        {{ $registro->nome }}
    </div>

    <div class="linha">
        <span class="label">Funcionário:</span>
        {{ $registro->nome_funcionario }}
    </div>

    <div class="linha">
        <span class="label">ID do funcionário:</span>
        {{ $registro->cod_funcionario }}
    </div>

    <div class="linha">
        <span class="label">Criado em:</span>
        {{ $registro->created_at }}
    </div>

    <div class="linha">
        <span class="label">Atualizado em:</span>
        {{ $registro->updated_at }}
    </div>

    <div class="linha">
        <span class="label">Contato:</span>
        {{ $registro->tipo_interacao }}
    </div>

    <div class="linha">
        @if ($registro->descricao !== null)
            <span class="label">Descrição:</span>
            {{ $registro->descricao }}
        @endif
    </div>

    <div class="box">
        <div class="titulo-box">Motivos do Registro</div>
        <div>
            {{ $registro->motivo }}
        </div>
    </div>

</div>

</body>
</html>
