import ReactDOM from 'react-dom/client';
import './index.css';
import './utils/i18n';
import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import { Slide, ToastContainer } from 'react-toastify';
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

            bodyStyle={{ color: theme.palette.text.primary }}
            position="bottom-left"
            transition={Slide}
            pauseOnHover={false}
            autoClose={2000}
            toastStyle={{
              border: "3px solid " + theme.palette.action.disabledBackground, borderRadius: '8px', width: '350px'
            }}
            style={{
              fontSize: '16px',
              fontWeight: '500',
            }}
          />
          <AppRoute />
        </>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
);