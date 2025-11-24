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
          COD_ENDERECO_CLIENTE INT NULL,
          COD_FUNCIONARIO SMALLINT NOT NULL,
          VALOR_TOTAL DECIMAL(8,2) NOT NULL,
          VALOR_ADICIONAL DECIMAL(7,2) NOT NULL DEFAULT 0,
          DESCRICAO VARCHAR(500) NULL,
          PRAZO DATE NOT NULL,
          CREATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          UPDATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES(COD_CLIENTE),
          FOREIGN KEY (COD_ENDERECO_CLIENTE) REFERENCES ENDERECOS_CLIENTES(COD_ENDERECO_CLIENTE),
          FOREIGN KEY (COD_FUNCIONARIO) REFERENCES FUNCIONARIOS_CRM(COD_FUNCIONARIO)
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
