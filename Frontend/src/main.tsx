// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { AppProvider } from './context/contextAPI';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
      <AppProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </AppProvider>
  // </React.StrictMode>
);
