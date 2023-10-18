import ReactDOM from 'react-dom/client';
import './index.css';
import './utils/i18n';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import AppRoute from './routes/AppRoute';
import theme from './utils/theme';
// Load environment variables
// require('dotenv').config();

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AuthProvider>
        <>
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            style={{ 
              marginBottom: '10vh',
              fontSize: '14px'
            }}
          />
          <AppRoute />
        </>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);