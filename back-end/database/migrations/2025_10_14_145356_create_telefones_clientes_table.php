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
          CREATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          UPDATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES (COD_CLIENTE)
        );
      ");

      DB::statement("
        CREATE OR REPLACE FUNCTION set_created_at()
        RETURNS TRIGGER AS \$\$
        BEGIN
          NEW.CREATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          RETURN NEW;
        END;
        \$\$ LANGUAGE plpgsql;
      ");

      DB::statement("
        CREATE TRIGGER trigger_created_at
        BEFORE INSERT ON TELEFONES_CLIENTES
        FOR EACH ROW
        EXECUTE FUNCTION set_created_at();
      ");

      DB::statement("
        CREATE OR REPLACE FUNCTION atualizar_updated_at()
        RETURNS TRIGGER AS \$\$
        BEGIN
          NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          RETURN NEW;
        END;
        \$\$ LANGUAGE plpgsql;
      ");

      DB::statement("
        CREATE TRIGGER trigger_updated_at
        BEFORE UPDATE ON TELEFONES_CLIENTES
        FOR EACH ROW
        EXECUTE FUNCTION atualizar_updated_at();
      ");
    }

    public function down()
    {
      DB::statement("DROP TRIGGER IF EXISTS trigger_created_at ON TELEFONES_CLIENTES;");
      DB::statement("DROP FUNCTION IF EXISTS set_created_at;");
      DB::statement("DROP TRIGGER IF EXISTS trigger_updated_at ON TELEFONES_CLIENTES;");
      DB::statement("DROP FUNCTION IF EXISTS atualizar_updated_at;");

      DB::statement("DROP TABLE IF EXISTS TELEFONES_CLIENTES;");
    }
};
