import React, { createContext, useContext, useState } from 'react';

const ClienteContext = createContext();

export const ClienteProvider = ({ children }) => {
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');

    return (
        <ClienteContext.Provider value={{ clienteSeleccionado, setClienteSeleccionado }}>
            {children}
        </ClienteContext.Provider>
    );
};

export const useCliente = () => useContext(ClienteContext);
