import api from "../api";

export async function pdfPedido(id) {
    const response = await api.get('/api/pdfPedido/' + id, {
        responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `pedido_${id}.pdf`);

    document.body.appendChild(link);
    link.click();

    link.remove();
}