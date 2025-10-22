<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
      DB::statement("
        CREATE TABLE PEDIDOS(
            COD_PEDIDO INT PRIMARY KEY,
            COD_CLIENTE INT NOT NULL,
            COD_INTALACAO_MANUTENCAO INT NULL,
            PEDIDO_TIPO VARCHAR(20) CHECK (PEDIDO_TIPO IN ('INSTALACAO', 'MANUTENCAO', 'PRODUTO')) NOT NULL,
            VALOR_TOTAL DECIMAL(8,2) NOT NULL,
            CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UPDATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES(COD_CLIENTE)
        );

      "); 
    }

   
    public function down()
    {
        DB::statement("DROP TABLE IF EXISTS PEDIDOS");
    }
};
