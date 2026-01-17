<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("
            CREATE TABLE REGISTROS(
                COD_REGISTRO SERIAL PRIMARY KEY,
                COD_CLIENTE INT NOT NULL,
                COD_FUNCIONARIO SMALLINT NOT NULL,
                MOTIVO VARCHAR(30) CHECK (MOTIVO IN ('COMPRAR PRODUTOS', 'FAZER INSTALACAO', 'MANUTENCAO EM CERCA ELÉTRICA', 
                'MANUTENCAO EM CONCERTINA', 'MANUTENCAO EM CAMERA', 'TROCA DE CABOS', 'TROCA DE CONECTORES', 'TROCA DE FONTE DE ENERGIA', 
                'TROCA DE DVR', 'MANUTENCAO EM DVR', 'TROCA DE HD', 'TROCA DE CENTRAL DE CHOQUE', 'MANUTENCAO EM CENTRAL', 
                'TROCA DE BATERIA DE CENTRAL', 'OUTRO')) NOT NULL,
                TIPO_INTERACAO VARCHAR(8) CHECK (TIPO_INTERACAO IN ('WHATSAPP', 'EMAIL', 'TELEFONE')) NOT NULL,
                DESCRICAO VARCHAR(500) NULL,
                CREATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                UPDATED_AT TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (COD_CLIENTE) REFERENCES CLIENTES(COD_CLIENTE),
                FOREIGN KEY (COD_FUNCIONARIO) REFERENCES FUNCIONARIOS_CRM(COD_FUNCIONARIO)
            );
        ");

        DB::statement("
            CREATE OR REPLACE FUNCTION set_created_at_registros()
            RETURNS TRIGGER AS \$\$
            BEGIN
                NEW.CREATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
                NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
                RETURN NEW;
            END;
            \$\$ LANGUAGE plpgsql;
        ");

        DB::statement("
            CREATE TRIGGER trigger_created_at_registros
            BEFORE INSERT ON REGISTROS
            FOR EACH ROW
            EXECUTE FUNCTION set_created_at_registros();
        ");

        DB::statement("
            CREATE OR REPLACE FUNCTION atualizar_updated_at_registros()
            RETURNS TRIGGER AS \$\$
            BEGIN
                NEW.UPDATED_AT := CURRENT_TIMESTAMP AT TIME ZONE 'America/Sao_Paulo';
                RETURN NEW;
            END;
            \$\$ LANGUAGE plpgsql;
        ");

        DB::statement("
            CREATE TRIGGER trigger_updated_at_registros
            BEFORE UPDATE ON REGISTROS
            FOR EACH ROW
            EXECUTE FUNCTION atualizar_updated_at_registros();
        ");
    }

    public function down()
    {
        DB::statement("DROP TRIGGER IF EXISTS trigger_created_at_registros ON REGISTROS;");
        DB::statement("DROP FUNCTION IF EXISTS set_created_at_registros;");
        DB::statement("DROP TRIGGER IF EXISTS trigger_updated_at_registros ON REGISTROS;");
        DB::statement("DROP FUNCTION IF EXISTS atualizar_updated_at_registros;");

        DB::statement("DROP TABLE IF EXISTS REGISTROS;");
    }
};
