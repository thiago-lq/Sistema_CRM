<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    
    public function up()
    {
     DB::statement("
        CREATE TABLE PAGAMENTOS_CLIENTES
        COD_CLIENTE INT PRIMARY KEY,
        COD_PEDIDO SMALLINT PRIMARY KEY,
        STATUS BOOLEAN NOT NULL,
        DATA_PAGAMENTO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES,
        FOREING KEY (COD_PEDIDO) REFERENCES PEDIDOS
     ");  
    }

    public function down()
    {
         DB::statement("DROP TABLE IF EXISTS PAGAMENTOS_CLIENTES");
    }
};
