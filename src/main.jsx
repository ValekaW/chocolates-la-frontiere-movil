import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Fuentes de la marca (las mismas de la web), dentro de la app para que no dependan de internet
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/libre-baskerville/700.css';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
