<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("
            CREATE TABLE PEDIDOS_TIPOS (
                COD_PEDIDO_TIPO SERIAL PRIMARY KEY,
                COD_PEDIDO INT NOT NULL,
                NOME_TIPO VARCHAR(10) CHECK (NOME_TIPO IN ('INSTALACAO', 'MANUTENCAO', 'PRODUTO')) NOT NULL,
                FOREIGN KEY (COD_PEDIDO) REFERENCES PEDIDOS(COD_PEDIDO)
            );
        ");
    }

    public function down()
    {
        DB::statement("DROP TABLE IF EXISTS PEDIDOS_TIPOS");
    }
};
