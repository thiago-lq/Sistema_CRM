<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  
    public function up()
    {
      DB::statement("
        CREATE TABLE TELEFONES_CLIENTES(
          COD_TELEFONE SERIAL PRIMARY KEY,
          COD_CLIENTE INT NOT NULL,
          TELEFONE CHAR(11) UNIQUE NOT NULL,
          CREATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          UPDATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES (COD_CLIENTE)
        );
      ");

      DB::statement("
        CREATE OR REPLACE FUNCTION set_created_at_telefones_clientes()
        RETURNS TRIGGER AS \$\$
        BEGIN
          NEW.CREATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          RETURN NEW;
        END;
        \$\$ LANGUAGE plpgsql;
      ");

      DB::statement("
        CREATE TRIGGER trigger_created_at_telefones_clientes
        BEFORE INSERT ON TELEFONES_CLIENTES
        FOR EACH ROW
        EXECUTE FUNCTION set_created_at_telefones_clientes();
      ");

      DB::statement("
        CREATE OR REPLACE FUNCTION atualizar_updated_at_telefones_clientes()
        RETURNS TRIGGER AS \$\$
        BEGIN
          NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          RETURN NEW;
        END;
        \$\$ LANGUAGE plpgsql;
      ");

      DB::statement("
        CREATE TRIGGER trigger_updated_at_telefones_clientes
        BEFORE UPDATE ON TELEFONES_CLIENTES
        FOR EACH ROW
        EXECUTE FUNCTION atualizar_updated_at_telefones_clientes();
      ");
    }

    public function down()
    {
      DB::statement("DROP TRIGGER IF EXISTS trigger_created_at_telefones_clientes ON TELEFONES_CLIENTES;");
      DB::statement("DROP FUNCTION IF EXISTS set_created_at_telefones_clientes;");
      DB::statement("DROP TRIGGER IF EXISTS trigger_updated_at_telefones_clientes ON TELEFONES_CLIENTES;");
      DB::statement("DROP FUNCTION IF EXISTS atualizar_updated_at_telefones_clientes;");

      DB::statement("DROP TABLE IF EXISTS TELEFONES_CLIENTES;");
    }
};
