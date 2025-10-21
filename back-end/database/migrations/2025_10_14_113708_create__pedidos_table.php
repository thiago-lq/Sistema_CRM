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
          PEDIDO_TIPO VARCHAR(20) CHECK (PEDIDO_TIPO IN ('INSTALACAO', 'MANUTENCAO', 'PRODUTO')) NOT NULL,
          VALOR_TOTAL DECIMAL(8,2) NOT NULL,
          CREATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          UPDATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES(COD_CLIENTE) ON DELETE CASCADE
        );
      ");
      
      DB::statement("
        CREATE OR REPLACE FUNCTION set_created_at_pedidos()
        RETURNS TRIGGER AS \$\$
        BEGIN
          NEW.CREATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          RETURN NEW;
        END;
        \$\$ LANGUAGE plpgsql;
      ");

      DB::statement("
        CREATE TRIGGER trigger_created_at_pedidos
        BEFORE INSERT ON PEDIDOS
        FOR EACH ROW
        EXECUTE FUNCTION set_created_at_pedidos();
      ");

      DB::statement("
        CREATE OR REPLACE FUNCTION atualizar_updated_at_pedidos()
        RETURNS TRIGGER AS \$\$
        BEGIN
          NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          RETURN NEW;
        END;
        \$\$ LANGUAGE plpgsql;
      ");

      DB::statement("
        CREATE TRIGGER trigger_updated_at_pedidos
        BEFORE UPDATE ON PEDIDOS
        FOR EACH ROW
        EXECUTE FUNCTION atualizar_updated_at_pedidos();
      ");
    }

   
    public function down()
    {
      DB::statement("DROP TRIGGER IF EXISTS trigger_created_at_pedidos ON PEDIDOS;");
      DB::statement("DROP FUNCTION IF EXISTS set_created_at_pedidos;");
      DB::statement("DROP TRIGGER IF EXISTS trigger_updated_at_pedidos ON PEDIDOS;");
      DB::statement("DROP FUNCTION IF EXISTS atualizar_updated_at_pedidos;");

      DB::statement("DROP TABLE IF EXISTS PEDIDOS;");
    }
};
