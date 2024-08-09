import React, { useEffect, useState } from 'react';
import Logo from "../assets/images/LOGO AJAW.png";
import { useCliente } from '../context/ClienteContext';
import useFetchData from '../hooks/useFetchData';
import renderChartsForEmpresa from './common/Charts';
import ClienteSelect from './common/ClienteSelect';
import TrabajoDetalles from './common/TrabajoDetalles';
import '../styles/style.css';

function Datos() {
    const { data, loading, error } = useFetchData('/job/list');
    const { clienteSeleccionado, setClienteSeleccionado } = useCliente();
    const [dataPorEmpresa, setDataPorEmpresa] = useState({});
    const [datosEmpresa, setDatosEmpresa] = useState(null);
    const [clienteData, setClienteData] = useState({ trabajos: [] });
    const [, setMesSeleccionado] = useState(null);
    const [progress, setProgress] = useState(0);
    const [showMesSelector, setShowMesSelector] = useState(false);

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    const diff = 4;
                    return Math.min(oldProgress + diff, 100);
                });
            }, 100);
            return () => {
                clearInterval(interval);
            };
        }
    }, [loading]);

    useEffect(() => {
        if (!data || data.length === 0) return;
    
        const allClientes = data.map(job => {
            if (job.customer && job.customer.id && job.customer.name) {
                return {
                    id: job.customer.id,
                    nombre: job.customer.name,
                    date: new Date(job.dateCreated),
                    actualStart: job.actualStart ? new Date(job.actualStart) : null,
                    actualEnd: job.actualEnd ? new Date(job.actualEnd) : null,
                    addressCity: job.addressCity,
                    year: new Date(job.dateCreated).getFullYear(),
                    month: new Date(job.dateCreated).getMonth(),
                };
            } else {
                return null;
            }
        }).filter(cliente => cliente !== null);
    
        const dataGroupedByEmpresa = {};
        const hoy = new Date();
        const mesActual = hoy.getMonth();
        const anyoActual = hoy.getFullYear();
    
        allClientes.forEach(cliente => {
            const { year, month, actualStart, actualEnd, nombre, addressCity } = cliente;
            const mesesAtras = (anyoActual - year) * 12 + (mesActual - month);
    
            if (mesesAtras >= 0 && mesesAtras < 12) {
                if (!dataGroupedByEmpresa[nombre]) {
                    dataGroupedByEmpresa[nombre] = {
                        trabajosPorMes: Array(12).fill(0),
                        horasTrabajadasPorMes: Array(12).fill(0),
                        lugares: {},
                        tiempoPorTrabajo: []
                    };
                }
    
                const index = 11 - mesesAtras;
    
                dataGroupedByEmpresa[nombre].trabajosPorMes[index] += 1;
    
                if (actualStart && actualEnd) {
                    const horasTrabajadas = (actualEnd - actualStart) / (1000 * 60 * 60);
                    dataGroupedByEmpresa[nombre].horasTrabajadasPorMes[index] += parseFloat(horasTrabajadas.toFixed(1));
    
                    dataGroupedByEmpresa[nombre].tiempoPorTrabajo.push({
                        fecha: actualStart,
                        horasTrabajadas,
                    });
                }
    
                if (!dataGroupedByEmpresa[nombre].lugares[addressCity]) {
                    dataGroupedByEmpresa[nombre].lugares[addressCity] = 1;
                } else {
                    dataGroupedByEmpresa[nombre].lugares[addressCity] += 1;
                }
            }
        });
    
        //console.log('Datos agrupados por empresa:', dataGroupedByEmpresa);
        setDataPorEmpresa(dataGroupedByEmpresa);
    }, [data]);

    const handleEmpresaChange = (event) => {
        const selectedEmpresa = event.target.value;
        setClienteSeleccionado(selectedEmpresa);
        setDatosEmpresa(dataPorEmpresa[selectedEmpresa] || null);
        setShowMesSelector(true);
    };

    const handleMesChange = (event) => {
        const selectedMes = parseInt(event.target.value);
        setMesSeleccionado(selectedMes);
        if (selectedMes !== null && data && data.length > 0) {
            const trabajosMes = data.filter(job => {
                const jobDate = new Date(job.dateCreated);
                return job.customer && job.customer.name === clienteSeleccionado &&
                    jobDate.getMonth() === selectedMes;
            }).map(job => {
                const actualStart = new Date(job.actualStart);
                const actualEnd = job.actualEnd ? new Date(job.actualEnd) : null;
                const tiempoTrabajado = job.actualEnd
                    ? calculateTimeDifference(actualStart, actualEnd)
                    : "N/A";

                return {
                    type: job.type?.name,
                    description: job.description,
                    addressCity: job.addressCity,
                    equipmentName: job.equipment?.name,
                    technicianName: job.technician?.name,
                    sitio: job.site?.name,
                    actualStart: actualStart.toLocaleDateString(),
                    actualEnd: job.actualEnd ? actualEnd.toLocaleDateString() : "N/A",
                    tiempoTrabajado,
                };
            });

            setClienteData({ trabajos: trabajosMes });
        } else {
            setClienteData({ trabajos: [] });
        }
    };

    const calculateTimeDifference = (start, end) => {
        const diff = end - start;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    if (loading) {
        return (
            <div className="loading">
                <h2>Recopilando Datos</h2>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}>
                        {Math.round(progress)}%
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="error">Error: {error.message}</div>;
    }

    const uniqueClientes = [...new Set(data.filter(job => job.customer && job.customer.name).map(job => job.customer.name))];

    return (
        <div>
            <header className='encabezado'>
                <div className='logo'>
                    <img src={Logo} alt="LOGO AJAW" className="logo-img-ini" />
                    <ClienteSelect clientes={uniqueClientes} onChange={handleEmpresaChange} />
                </div>

                <div className='nombre'>
                    <h2 className="empresa">{clienteSeleccionado}</h2>
                </div>
            </header>

            {datosEmpresa ? renderChartsForEmpresa(datosEmpresa) :
                <h2 className="anuncio1">Seleccione su empresa.</h2>}
            
            {showMesSelector && (
                <>
                    <center><h2 className="detalles-trabajos">DETALLES DE TRABAJOS</h2></center>
                    <center>
                        <div className="filtro-mes">
                            <label htmlFor="mesSelect">Seleccionar Mes: </label>
                            <select id="mesSelect" onChange={handleMesChange}>
                                <option value="">Seleccione un mes</option>
                                <option value="0">Enero</option>
                                <option value="1">Febrero</option>
                                <option value="2">Marzo</option>
                                <option value="3">Abril</option>
                                <option value="4">Mayo</option>
                                <option value="5">Junio</option>
                                <option value="6">Julio</option>
                                <option value="7">Agosto</option>
                                <option value="8">Septiembre</option>
                                <option value="9">Octubre</option>
                                <option value="10">Noviembre</option>
                                <option value="11">Diciembre</option>
                            </select>
                        </div>
                    </center>
                </>
            )}
            <TrabajoDetalles trabajos={clienteData.trabajos} />
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    );
}

export default Datos;
