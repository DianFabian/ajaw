import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClienteProvider } from './context/ClienteContext'; // Importa el proveedor de contexto
import './index.css';
import Datos from './components/Datos';

ReactDOM.render(
    <React.StrictMode>
        <ClienteProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Datos/>}/>
                </Routes>
            </BrowserRouter>
        </ClienteProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
