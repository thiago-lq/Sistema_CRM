<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
   
    public function up()
    {
        DB::statement("
            CREATE TABLE ENDERECO_INST_MANU('
            COD_INST_MANU INT PRIMARY KEY,
            CIDADE VARCHAR(50) NOT NULL,
            CEP CHAR(8) NOT NULL,
            BAIRRO VARCHAR(50) NOT NULL,
            RUA_NUMERO VARCHAR(50) NOT NULL
            ');
        ");
    }

    public function down()
    {
         DB::statement("DROP TABLE IF EXISTS ENDERECO_INST_MANU");
    }
};
