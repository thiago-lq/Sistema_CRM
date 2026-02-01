import { useState, useEffect, useRef } from "react";
import {
  CadastroRegistros,
  DetalhesRegistros,
  EditarRegistros,
  ListaRegistros,
} from "../components/registrosComponents";
import { notify } from "../utils/notify";

import { registrosIndex } from "../services/registro/registrosIndex";
import { registrosStore } from "../services/registro/registrosStore";
import { registrosDelete } from "../services/registro/registrosDelete";
import { registrosUpdate } from "../services/registro/registrosUpdate";
import { registrosShow } from "../services/registro/registrosShow";

export default function Registros() {
  // Constantes necessárias para o componente
  const [registros, setRegistros] = useState([]);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [registro, setRegistro] = useState(null);
  const registroProcessadoRef = useRef(null);
  const [abaAtiva, setAbaAtiva] = useState("lista");
  const [loading, setLoading] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  const [form, setForm] = useState({
    codCliente: "",
    motivo: [],
    tipoInteracao: "",
    descricao: "",
  });

  // Função que recarrega os dados do back-end no front-end
  const handleRecarregar = async () => {
    setLoading(true);
    if (termoBusca.trim().length > 0) {
      const dados = await registrosIndex({ termo: termoBusca });
      setLoading(false);
      setRegistros(dados);
    } else {
      const dados = await registrosIndex();
      setLoading(false);
      setRegistros(dados);
    }
  };

  // Função que lida com o formulário de cadastro
  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "motivo") {
      setForm((prev) =>
        checked
          ? { ...prev, [name]: [...prev[name], value] }
          : { ...prev, [name]: prev[name].filter((v) => v !== value) },
      );
      return;
    } else if (name === "descricao") {
      if (value.length <= 500) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
      return;
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dadosParaEnviar = {
        cod_cliente: Number(form.codCliente),
        motivo: form.motivo,
        tipo_interacao: form.tipoInteracao,
        descricao: form.descricao,
      };
      await registrosStore(dadosParaEnviar);
      notify.success("Registro cadastrado com sucesso", {
        position: "top-right",
      });
      setForm({ codCliente: "", motivo: [], tipoInteracao: "", descricao: "" });
      handleRecarregar();
      setAbaAtiva("lista")
    } catch (error) {
      if (error.response?.status === 422) {
        notify.error("Erro, dados enviados inválidos", {
          description: "Verifique os campos obrigatórios",
        });
      } else if (error.response === 500) {
        notify.error("Erro ao cadastrar o registro");
      } else {
        notify.error("Erro inesperado", {
          description: "Tente novamente mais tarde.",
        });
      }
    }
  };

  const handleExcluir = async (id) => {
    try {
      await registrosDelete(id);
      notify.info("Registro excluído com sucesso", {
        position: "top-right",
      });
      handleRecarregar();
    } catch (error) {
      if (error.response?.status === 404) {
        notify.error("Registro não encontrado no sistema", {
          position: "top-right",
        });
      } else if (error.response?.status === 500) {
        notify.error("Erro ao excluir o registro", {
          position: "top-right",
        });
      } else {
        notify.error("Erro inesperado", {
          position: "top-right",
          description: "Tente novamente mais tarde.",
        });
      }
    }
  };

  const [formEditar, setFormEditar] = useState({
    codRegistro: "", 
    codCliente: "",
    motivo: [],
    tipoInteracao: "",
    descricao: "",
  });

  const handleChangeEditar = (e) => {
    const { name, value, checked } = e.target;
    if (name === "motivo") {
      setFormEditar((prev) =>
        checked
          ? { ...prev, [name]: [...prev[name], value] }
          : { ...prev, [name]: prev[name].filter((v) => v !== value) },
      );
      return;
    } else if (name === "descricao") {
      if (value.length <= 500) {
        setFormEditar((prev) => ({ ...prev, descricao: value }));
      }
      return;
    }
    setFormEditar((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEditar = async (e) => {
    e.preventDefault();
    try {
      const dadosParaEnviar = {
        cod_registro: Number(formEditar.codRegistro),
        cod_cliente: Number(formEditar.codCliente),
        motivo: formEditar.motivo,
        tipo_interacao: formEditar.tipoInteracao,
        descricao: formEditar.descricao,
      };
      await registrosUpdate(dadosParaEnviar);
      notify.success("Registro editado com sucesso", {
        position: "top-right",
      });
      setAbaAtiva("lista");
      handleRecarregar();
    } catch (error) {
      if (error.response?.status === 422) {
        notify.error("Erro, dados enviados inválidos", {
          description: "Verifique se os campos estão preenchidos corretamente.",
        });
      } else if (error.response?.status === 500) {
        notify.error("Erro ao editar registro");
      } else {
        notify.error("Erro inesperado", {
          description: "Tente novamente mais tarde.",
        });
      }
    }
  };

  // UseEffect para carregar os dados do back-end
  useEffect(() => {
    // Temporizador, para que o componente não seja renderizado a cada mudança de estado
    const timeout = setTimeout(() => {
      setLoading(true);
      async function carregarRegistros() {
        if (termoBusca.trim().length > 0) {
          const dados = await registrosIndex({ termo: termoBusca });
          setLoading(false);
          setRegistros(dados);
        } else {
          const dados = await registrosIndex();
          setLoading(false);
          setRegistros(dados);
        }
      }
      carregarRegistros();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [termoBusca]);

  useEffect(() => {
    const fetchPedido = async () => {
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

    fetchPedido();
  }, [registroSelecionado?.cod_registro]);

  useEffect(() => {
    if (!registro) return;

    if (registro.cod_registro === registroProcessadoRef.current) return;

    registroProcessadoRef.current = registro.cod_registro;

    const motivosArray = registro.motivo
      ? registro.motivo.split(", ").map((t) => t.trim())
      : [];

    setFormEditar({
      codRegistro: registro.cod_registro || "",
      codCliente: registro.cod_cliente || "",
      motivo: motivosArray,
      tipoInteracao: registro.tipo_interacao || "",
      descricao: registro.descricao || "",
    });
  }, [registro]);

  const propsLista = {
    termoBusca,
    setTermoBusca,
    registros,
    setAbaAtiva,
    registroSelecionado,
    setRegistroSelecionado,
    handleExcluir,
    loading,
    handleRecarregar,
  };

  const propsCadastro = {
    form,
    setForm,
    handleChange,
    handleSubmit,
    setAbaAtiva,
  };

  const propsDetalhes = {
    registroSelecionado,
    setAbaAtiva,
  };

  const propsEditar = {
    setAbaAtiva,
    handleSubmitEditar,
    handleChangeEditar,
    formEditar,
    setFormEditar,
    loading,
  };

  return (
    <div className="w-[85%] mx-auto p-5 bg-white rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] mt-30 mb-5">
      {abaAtiva === "lista" && <ListaRegistros {...propsLista} />}
      {abaAtiva === "cadastro" && <CadastroRegistros {...propsCadastro} />}
      {abaAtiva === "detalhes" && <DetalhesRegistros {...propsDetalhes} />}
      {abaAtiva === "editar" && <EditarRegistros {...propsEditar} />}
    </div>
  );
}
