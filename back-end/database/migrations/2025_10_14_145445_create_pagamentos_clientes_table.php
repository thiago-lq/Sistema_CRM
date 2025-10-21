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
        DATA_HORA_PAGAMENTO TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (COD_CLIENTE, COD_PEDIDO),
        FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES (COD_CLIENTE),
        FOREIGN KEY (COD_PEDIDO) REFERENCES PEDIDOS (COD_PEDIDO)
        );
     ");
     DB::statement("
          CREATE OR REPLACE FUNCTION set_created_at_pagamentos_clientes()
          RETURNS TRIGGER AS \$\$
          BEGIN
            NEW.DATA_HORA_PAGAMENTO := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
            RETURN NEW;
          END;
          \$\$ LANGUAGE plpgsql;
        ");

        DB::statement("
          CREATE TRIGGER trigger_created_at_pagamentos_clientes
          BEFORE INSERT ON PAGAMENTOS_CLIENTES
          FOR EACH ROW
          EXECUTE FUNCTION set_created_at_pagamentos_clientes();
        ");
    }

    public function down()
    {
        DB::statement("DROP TRIGGER IF EXISTS trigger_created_at_pagamentos_clientes ON PAGAMENTOS_CLIENTES;");
        DB::statement("DROP FUNCTION IF EXISTS set_created_at_pagamentos_clientes;");
        DB::statement("DROP TABLE IF EXISTS PAGAMENTOS_CLIENTES");
    }
};
