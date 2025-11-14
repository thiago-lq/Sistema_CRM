<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("
            CREATE TABLE PRODUTOS (
            COD_PRODUTO INT PRIMARY KEY,
            NOME_PRODUTO VARCHAR(50) NOT NULL,
            VALOR_UNITARIO DECIMAL(7,2) NOT NULL,
            )
        ");
    }

    public function down()
    {
        DB::statement("DROP TABLE IF EXISTS PRODUTOS");
    }
};
