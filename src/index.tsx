import ReactDOM from 'react-dom/client';
import './index.css';
import './utils/i18n';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import AppRoute from './routes/AppRoute';
import theme from './utils/CreateTheme';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <>
          <ToastContainer style={{ marginTop: '7vh' }} />

          <AppRoute />
        </>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);