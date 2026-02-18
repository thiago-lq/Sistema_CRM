import api from "../api";

export async function pdfRegistro(id) {
    const response = await api.get('/api/pdfRegistro/' + id, {
        responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `registro_${id}.pdf`);

    document.body.appendChild(link);
    link.click();

    link.remove();
}