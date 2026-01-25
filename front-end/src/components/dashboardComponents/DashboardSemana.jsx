import { GraficoBarrasSemana } from "../graficosRelatorios"
export default function DashboardSemana({ dados1Semana, handleRecarregar, loading }) {
    return (
        <div className="bg-white mt-3 rounded-lg shadow-sm">
            <div>{<GraficoBarrasSemana dados1Semana={dados1Semana} />}</div>
        </div>
    )
}