import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    ArcElement
);

const getUltimos12Meses = () => {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const hoy = new Date();
    let mesActual = hoy.getMonth();
    let ultimos12Meses = [];

    for (let i = 0; i < 12; i++) {
        ultimos12Meses.unshift(meses[mesActual]);
        mesActual = (mesActual - 1 + 12) % 12;
    }

    return ultimos12Meses;
};

const renderChartsForEmpresa = (empresaData) => {
    const meses = getUltimos12Meses();

    // Depurar datos antes de usarlos
    console.log('Datos de la empresa:', empresaData);

    const barData = {
        labels: meses,
        datasets: [{
            label: `Trabajos Realizados en los últimos 12 meses`,
            data: empresaData.trabajosPorMes || Array(12).fill(0),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    const lineData = {
        labels: meses,
        datasets: [{
            label: `Horas Trabajadas en los últimos 12 meses`,
            data: empresaData.horasTrabajadasPorMes || Array(12).fill(0),
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1,
        }],
    };

    const lugaresData = {
        labels: Object.keys(empresaData.lugares),
        datasets: [{
            data: Object.values(empresaData.lugares),
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
            borderWidth: 1,
        }],
    };

    const trabajosLabels = empresaData.tiempoPorTrabajo
        .slice(-13)
        .map(trabajo => trabajo.fecha.toLocaleDateString());
    const trabajosData = empresaData.tiempoPorTrabajo
        .slice(-13)
        .map(trabajo => trabajo.horasTrabajadas);

    const tiempoPorTrabajoData = {
        labels: trabajosLabels,
        datasets: [{
            label: 'Tiempo Invertido en Cada Trabajo',
            data: trabajosData,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        }],
    };

    return (
        <div className='contenedor1'>
            <div className="contenedor2">
                <div className="graficas">
                    <Bar data={barData} />
                    <p className='nombre-graficas'>TRABAJOS REALIZADOS POR MES</p>
                </div>
                <div className="graficas">
                    <Line data={lineData} />
                    <p className='nombre-graficas'>HORAS TRABAJADAS POR MES</p>
                </div>

                <div className="circular1">
                    <Pie data={lugaresData} />
                    <p className='nombre-graficas'>LUGARES DE TRABAJO</p>
                </div>

                <div className="graficas">
                    <Bar data={tiempoPorTrabajoData} />
                    <p className='nombre-graficas'>TIEMPO INVERTIDO EN CADA TRABAJO</p>
                </div>
            </div>
        </div>
    );
};

export default renderChartsForEmpresa;
