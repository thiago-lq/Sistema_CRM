import { useState, useEffect } from "react";
import { buscaCliente } from "../../services/registro/buscaCliente";
import { notify } from "../../utils/notify";

export default function EditarRegistros() {
    const [buscaClienteEditar, setBuscaClienteEditar] = useState("");
    const [cliente, setCliente] = useState({});
    
    useEffect(() => {
    if (!buscaClienteEditar) {
      setCliente({});
      return;
    }

    const fetchClienteEditar = async () => {
      try {
        const dadosClienteEditar = await buscaCliente(buscaClienteEditar);
        setCliente(dadosClienteEditar);
        if (dadosClienteEditar && dadosClienteEditar.cod_cliente) {
          setFormEditar((prev) => ({
            ...prev,
            codCliente: dadosClienteEditar.cod_cliente,
          }));
        }
      } catch (error) {
        if (error.response?.status === 422) {
          notify.error("Erro, número de identificação inválido", {
            description:
              "Verifique se os campo CNPJ ou CPF estão preenchidos corretamente.",
            position: "top-right",
          });
        } else if (error.response?.status === 404) {
          notify.error("Erro, cliente não encontrado no sistema", {
            position: "top-right",
            description: "Verifique se o cliente existe no sistema.",
          });
        } else if (error.response?.status === 500) {
          notify.error("Erro ao buscar cliente");
        } else {
          notify.error("Erro inesperado", {
            description: "Tente novamente mais tarde.",
            position: "top-right",
          });
        }
        setCliente({});
      }
    };
    fetchClienteEditar;
  }, [buscaClienteEditar]);
    
    return <div>EditarRegistros</div>
}