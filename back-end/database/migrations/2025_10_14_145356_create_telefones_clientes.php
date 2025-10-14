<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  
    public function up()
    {
      DB::statement("
        CREATE TABLE TELEFONES_CLIENTES(
            COD_CLIENTE INT PRIMARY KEY,
            TELEFONE CHAR(11) NOT NULL,
            FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES (COD_CLIENTE)
        );
      ");  
    }

    public function down()
    {
        DB::statement("DROP TABLE IF EXISTS TELEFONES_CLIENTES");
    }
};
