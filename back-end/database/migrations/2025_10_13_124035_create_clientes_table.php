<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    public function up()
    {
        DB::statement("
          CREATE TABLE CLIENTES(
            COD_CLIENTE INT PRIMARY KEY,
            CPF_CLIENTE CHAR(11) NOT NULL UNIQUE,
            EMAIL VARCHAR(100) NOT NULL,
            NOME VARCHAR(100) NOT NULL,
            CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
          ); 
        ");
    }

    public function down()
    {
        DB::statement("DROP TABLE IF EXISTS CLIENTES;");
    }
};
