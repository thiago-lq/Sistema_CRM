<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    public function up()
    {
       DB::statement("CREATE TABLE MOTIVOS_REGISTRO(
           COD_MOTIVO_REGISTRO SERIAL PRIMARY KEY,
           COD_REGISTRO INT NOT NULL,
           MOTIVO VARCHAR(30) CHECK (MOTIVO IN ('COMPRAR PRODUTOS', 'FAZER INSTALACAO', 'MANUTENCAO EM CERCA ELÉTRICA', 
                'MANUTENCAO EM CONCERTINA', 'MANUTENCAO EM CAMERA', 'TROCA DE CABOS', 'TROCA DE CONECTORES', 'TROCA DE FONTE DE ENERGIA', 
                'TROCA DE DVR', 'MANUTENCAO EM DVR', 'TROCA DE HD', 'TROCA DE CENTRAL DE CHOQUE', 'MANUTENCAO EM CENTRAL', 
                'TROCA DE BATERIA DE CENTRAL', 'OUTRO')) NOT NULL,
           FOREIGN KEY (COD_REGISTRO) REFERENCES REGISTROS(COD_REGISTRO)
       );
    ");
    }
    public function down()
    {
        DB::statement("DROP TABLE IF EXISTS MOTIVOS_REGISTRO");
    }
};
