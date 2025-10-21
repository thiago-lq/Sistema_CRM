<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
   
    public function up()
    {
        DB::statement("
            CREATE TABLE ENDERECO_INST_MANU(
            COD_INST_MANU INT PRIMARY KEY,
            COD_PEDIDO INT NOT NULL,
            CIDADE VARCHAR(100) NOT NULL,
            CEP CHAR(8) NOT NULL,
            BAIRRO VARCHAR(100) NOT NULL,
            RUA_NUMERO VARCHAR(100) NOT NULL
            FOREIGN KEY (COD_PEDIDO) REFERENCES PEDIDOS(COD_PEDIDO) ON DELETE CASCADE
            );
        ");
    }

    public function down()
    {
         DB::statement("DROP TABLE IF EXISTS ENDERECO_INST_MANU");
    }
};
