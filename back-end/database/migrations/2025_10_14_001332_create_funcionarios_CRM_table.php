<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
       DB::statement("
        CREATE TABLE FUNCIONARIOS_CRM(
        COD_FUNCIONARIO SMALLINT PRIMARY KEY,
        CPF_FUNCIONARIO CHAR(11) NOT NULL UNIQUE,
        CARGO VARCHAR(20) NOT NULL,
        NOME_FUNCIONARIO VARCHAR(100) NOT NULL,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        );
       "); 
    }

   
    public function down()
    {
        DB::statement("DROP TABLE IF EXISTS FUNCIONARIOS");
    }
};
