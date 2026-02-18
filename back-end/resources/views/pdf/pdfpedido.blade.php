<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pedido</title>
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

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }

        th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
        }
    </style>
</head>
<body>
    
    <h2>Relatório de Pedido</h2>

    <div class="container">

        <div class="linha">
            <span class="label">Código do pedido:</span>
            {{ $pedido->cod_pedido }}
        </div>

        <div class="linha">
            <span class="label">Data de criação:</span>
            {{ $pedido->created_at }}
        </div>

        <div class="linha">
            <span class="label">Última atualização:</span>
            {{ $pedido->updated_at }}
        </div>

        <div class="linha">
            <span class="label">Prazo:</span>
            {{ $pedido->prazo }}
        </div>

        <div class="linha">
            <span class="label">Funcionário responsável:</span>
            {{ $pedido->funcionario_nome }}
        </div>

        <div class="linha">
            <span class="label">ID do funcionário:</span>
            {{ $pedido->cod_funcionario }}
        </div>

        <div class="linha">
            <span class="label">Tipos do pedido:</span>
            {{ $pedido->tipos_pedido }}
        </div>

        <div class="linha">
            <span class="label">Valor adicional:</span>
            R$ {{ $pedido->valor_adicional }}
        </div>

        <div class="linha">
            <span class="label">Valor total:</span>
            R$ {{ $pedido->valor_total }}
        </div>

        <div class="linha">
            <span class="label">Método de pagamento:</span>
            {{ $pedido->metodo_pagamento }}
        </div>

        @if ($pedido->parcelas)
        <div class="linha">
            <span class="label">Parcelas:</span>
            {{ $pedido->parcelas }}
        </div>
        @endif

        <div class="linha">
            <span class="label">Status de pagamento:</span>
            {{ $pedido->status_pagamento ?? 'Em andamento' }}
        </div>

        <div class="box">
            <div class="titulo-box">Cliente</div>
            <div class="linha">
                <span class="label">Nome:</span>
                {{ $pedido->cliente_nome }}
            </div>

            <div class="linha">
                <span class="label">Código:</span>
                {{ $pedido->cod_cliente }}
            </div>

            @if ($pedido->cliente_cpf)
                <div class="linha">
                    <span class="label">CPF:</span>
                    {{ $pedido->cliente_cpf }}
                </div>
            @endif

            @if ($pedido->cliente_cnpj)
                <div class="linha">
                    <span class="label">CNPJ:</span>
                    {{ $pedido->cliente_cnpj }}
                </div>
            @endif
        </div>

        @if ($pedido->manu_inst_rua || $pedido->manu_inst_cidade)
        <div class="box">
            <div class="titulo-box">Endereço de Instalação/Manutenção</div>
            <div>
                {{ $pedido->manu_inst_rua }},
                {{ $pedido->manu_inst_bairro }},
                {{ $pedido->manu_inst_cidade }} -
                CEP: {{ $pedido->manu_inst_cep }}
            </div>
        </div>
        @endif

        @if ($pedido->cli_rua || $pedido->cli_cidade)
        <div class="box">
            <div class="titulo-box">Endereço do Cliente</div>
            <div>
                {{ $pedido->cli_rua }},
                {{ $pedido->cli_bairro }},
                {{ $pedido->cli_cidade }} -
                CEP: {{ $pedido->cli_cep }}
            </div>
        </div>
        @endif

        @php
            $itens = $pedido->itens_pedido ? json_decode($pedido->itens_pedido, true) : [];
        @endphp

        @if (!empty($itens))
        <div class="box">
            <div class="titulo-box">Itens do pedido</div>

            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Valor unitário</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($itens as $item)
                        <tr>
                            <td>{{ $item['nome_produto'] }}</td>
                            <td>{{ $item['quantidade'] }}</td>
                            <td>R$ {{ $item['preco_unitario'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <div class="linha">
            <span class="label">Descrição:</span>
            {{ $pedido->descricao }}
        </div>

    </div>
</body>
</html>
