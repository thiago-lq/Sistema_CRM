<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
 
    public function up()
    {
      DB::statement("
        CREATE TABLE ENDERECOS_CLIENTES(
        COD_CLIENTE INT PRIMARY KEY,
        CIDADE VARCHAR(50) NOT NULL,
        CEP CHAR(8) NOT NULL,
        BAIRRO VARCHAR(50) NOT NULL,
        RUA_NUMERO VARCHAR(50) NOT NULL,
        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES (COD_CLIENTE)
        );

      "); 
    }

 
    public function down()
    {
      DB::statement("DROP TABLE IF EXISTS ENDERECOS_CLIENTES"); 
    }
};
