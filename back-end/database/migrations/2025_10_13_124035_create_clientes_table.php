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
            CPF_CLIENTE CHAR(11) NOT NULL UNIQUE,
            EMAIL VARCHAR(100) NOT NULL,
            NOME VARCHAR(100) NOT NULL,
            DATA_NASCIMENTO DATE NOT NULL,
            CREATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo',
            UPDATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo' 
          ); 
        ");

        DB::statement("
          CREATE OR REPLACE FUNCTION atualizar_updated_at()
          RETURNS TRIGGER AS \$\$
          BEGIN
            NEW.UPDATED_AT = CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
            RETURN NEW;
          END;
          \$\$ LANGUAGE plpgsql;
        ");

        DB::statement("
          CREATE TRIGGER trigger_updated_at
          BEFORE UPDATE ON CLIENTES
          FOR EACH ROW
          EXECUTE FUNCTION atualizar_updated_at();
        ");
    }

    public function down()
    {
        DB::statement("DROP TRIGGER IF EXISTS trigger_updated_at ON CLIENTES;");
        DB::statement("DROP FUNCTION IF EXISTS atualizar_updated_at;");

        DB::statement("DROP TABLE IF EXISTS CLIENTES;");
    }
};
