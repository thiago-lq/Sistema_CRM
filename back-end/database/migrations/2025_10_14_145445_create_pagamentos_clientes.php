<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    
    public function up()
    {
     DB::statement("
        CREATE TABLE PAGAMENTOS_CLIENTES(
        COD_CLIENTE INT NOT NULL,
        COD_PEDIDO SMALLINT NOT NULL,
        STATUS BOOLEAN NOT NULL,
        DATA_PAGAMENTO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (COD_CLIENTE, COD_PEDIDO),
        FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES (COD_CLIENTE),
        FOREIGN KEY (COD_PEDIDO) REFERENCES PEDIDOS (COD_PEDIDO)
        );
     ");  
    }

    public function down()
    {
         DB::statement("DROP TABLE IF EXISTS PAGAMENTOS_CLIENTES");
    }
};
