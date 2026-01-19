import { useState, useEffect } from "react";
import { registrosShow } from "../../services/registro/registrosShow";
import { notify } from "../../utils/notify";

export default function DetalhesRegistros() {
    const [registro, setRegistro] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchRegistro = async () => {
          if (!registroSelecionado?.cod_registro) {
            setRegistro(null);
            return;
          }
    
          setLoading(true);
          try {
            const dados = await registrosShow(registroSelecionado.cod_registro);
            setRegistro(dados);
          } catch (error) {
            if (error.response?.status === 404) {
              notify.error("Registro não encontrado no sistema", {
                position: "top-right",
              });
            } else if (error.response?.status === 500) {
              notify.error("Erro ao buscar dados do registro", {
                position: "top-right",
              });
            } else {
              notify.error("Erro inesperado", {
                description: "Tente novamente mais tarde.",
                position: "top-right",
              });
            }
          } finally {
            setLoading(false);
          }
        };
      }, [registroSelecionado?.cod_registro]);
    
    return <div>DetalhesRegistros</div>
}