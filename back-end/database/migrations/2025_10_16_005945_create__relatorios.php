<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
   
    public function up()
    {
        DB::statement("
            CREATE TABLE RELATORIOS(
            COD_RELATORIO SMALLINT PRIMARY KEY,
            COD_FUNCIONARIO SMALLINT NOT NULL,
            DADOS_RELATORIO VARCHAR(255) NOT NULL,
            CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (COD_FUNCIONARIO) REFERENCES FUNCIONARIOS_CRM (COD_FUNCIONARIO)
            ); 
        ");
    }

  
    public function down()
    {
        DB::statement("DROP TABLE IF EXISTS RELATORIOS");
    }
};
