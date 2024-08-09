import React from 'react';

const TrabajoDetalles = ({ trabajos }) => {
    return (
        <div className='trabajo-detalles'>
            {trabajos.map((trabajo, index) => (
                <div key={index} className='estilo-tablas'>
                    <div className='servicio'>
                        <h3>{trabajo.type}</h3>
                    </div>
                    <div className='datos'>
                        <p>Descripción:</p>
                        <input type="text" value={trabajo.description} disabled />
                        <p>Sitio:</p>
                        <input type="text" value={trabajo.sitio} disabled />
                        <p>Equipo:</p>
                        <input type="text" value={trabajo.equipmentName} disabled />
                        <p>Técnico:</p>
                        <input type="text" value={trabajo.technicianName} disabled />
                        <p>Ciudad:</p>
                        <input type="text" value={trabajo.addressCity} disabled />
                        <p>Tiempo Trabajado:</p>
                        <input type="text" value={trabajo.tiempoTrabajado} disabled />
                        <p>Fecha:</p>
                        <input type="text" value={trabajo.actualStart} disabled />
                        <br/>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrabajoDetalles;
