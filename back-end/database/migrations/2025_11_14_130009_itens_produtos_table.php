<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("
            CREATE TABLE ITENS_PRODUTOS (
            COD_PEDIDO INT NOT NULL,
            COD_PRODUTO INT NOT NULL,
            QUANTIDADE SMALLINT NOT NULL,
            PRIMARY KEY (COD_PEDIDO, COD_PRODUTO),
            FOREIGN KEY (COD_PEDIDO) REFERENCES PEDIDOS(COD_PEDIDO),
            FOREIGN KEY (COD_PRODUTO) REFERENCES PRODUTOS(COD_PRODUTO)
            );
        ");
    }

    public function down()
    {
        DB::statement("DROP TABLE IF EXISTS ITENS_PRODUTOS");
    }
};
