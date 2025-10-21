<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
      DB::statement("
        CREATE TABLE FUNCIONARIOS_CRM(
          COD_FUNCIONARIO SMALLINT PRIMARY KEY,
          CPF_FUNCIONARIO CHAR(11) NOT NULL UNIQUE,
          CARGO VARCHAR(20) NOT NULL,
          NOME_FUNCIONARIO VARCHAR(100) NOT NULL,
          CREATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          UPDATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP 
        );
      ");

      DB::statement("
        CREATE OR REPLACE FUNCTION set_created_at_funcionarios_CRM()
        RETURNS TRIGGER AS \$\$
        BEGIN
          NEW.CREATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          RETURN NEW;
        END;
        \$\$ LANGUAGE plpgsql;
      ");

      DB::statement("
        CREATE TRIGGER trigger_created_at_funcionarios_CRM
        BEFORE INSERT ON FUNCIONARIOS_CRM
        FOR EACH ROW
        EXECUTE FUNCTION set_created_at_funcionarios_CRM();
      ");

      DB::statement("
        CREATE OR REPLACE FUNCTION atualizar_updated_at_funcionarios_CRM()
        RETURNS TRIGGER AS \$\$
        BEGIN
          NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
          RETURN NEW;
        END;
        \$\$ LANGUAGE plpgsql;
      ");

      DB::statement("
        CREATE TRIGGER trigger_updated_at_funcionarios_CRM
        BEFORE UPDATE ON FUNCIONARIOS_CRM
        FOR EACH ROW
        EXECUTE FUNCTION atualizar_updated_at_funcionarios_CRM();
      ");
    }
   
    public function down()
    {
      DB::statement("DROP TRIGGER IF EXISTS trigger_created_at_funcionarios_CRM ON FUNCIONARIOS_CRM;");
      DB::statement("DROP FUNCTION IF EXISTS set_created_at_funcionarios_CRM;");
      DB::statement("DROP TRIGGER IF EXISTS trigger_updated_at_funcionarios_CRM ON FUNCIONARIOS_CRM;");
      DB::statement("DROP FUNCTION IF EXISTS atualizar_updated_at_funcionarios_CRM;");

      DB::statement("DROP TABLE IF EXISTS FUNCIONARIOS_CRM;");
    }
};
