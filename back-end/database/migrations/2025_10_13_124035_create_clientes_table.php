<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    public function up()
    {
        DB::statement("
          CREATE TABLE CLIENTES(
            COD_CLIENTE INT PRIMARY KEY,
            CPF_CLIENTE CHAR(11) UNIQUE,
            CNPJ_CLIENTE CHAR(14) UNIQUE,
            EMAIL VARCHAR(100) NOT NULL,
            NOME VARCHAR(100) NOT NULL,
            DATA_NASCIMENTO DATE,
            CREATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            UPDATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
          ); 
        ");

        DB::statement("
          CREATE OR REPLACE FUNCTION set_created_at_clientes()
          RETURNS TRIGGER AS \$\$
          BEGIN
            NEW.CREATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
            NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
            RETURN NEW;
          END;
          \$\$ LANGUAGE plpgsql;
        ");

        DB::statement("
          CREATE TRIGGER trigger_created_at_clientes
          BEFORE INSERT ON CLIENTES
          FOR EACH ROW
          EXECUTE FUNCTION set_created_at_clientes();
        ");

        DB::statement("
          CREATE OR REPLACE FUNCTION atualizar_updated_at_clientes()
          RETURNS TRIGGER AS \$\$
          BEGIN
            NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
            RETURN NEW;
          END;
          \$\$ LANGUAGE plpgsql;
        ");

        DB::statement("
          CREATE TRIGGER trigger_updated_at_clientes
          BEFORE UPDATE ON CLIENTES
          FOR EACH ROW
          EXECUTE FUNCTION atualizar_updated_at_clientes();
        ");
    }

    public function down()
    {
        DB::statement("DROP TRIGGER IF EXISTS trigger_created_at_clientes ON CLIENTES;");
        DB::statement("DROP FUNCTION IF EXISTS set_created_at_clientes;");
        DB::statement("DROP TRIGGER IF EXISTS trigger_updated_at_clientes ON CLIENTES;");
        DB::statement("DROP FUNCTION IF EXISTS atualizar_updated_at_clientes;");

        DB::statement("DROP TABLE IF EXISTS CLIENTES;");
    }
};
