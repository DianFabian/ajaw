import React from 'react';

const ClienteSelect = ({ clientes = [], onChange }) => {
    const sortedClientes = clientes.sort((a, b) => a.localeCompare(b));

    return (
        <select onChange={onChange}>
            <option value="">Seleccione una empresa</option>
            {sortedClientes.map(cliente => (
                <option key={cliente} value={cliente}>
                    {cliente.toUpperCase()}
                </option>
            ))}
        </select>
    );
};

export default ClienteSelect;
