import api from "../api";

export async function pedidosUpdate(dados = {}) {
    const response = await api.put(`/api/pedidos/${dados.cod_pedido}`, dados);
    return response.data;
}