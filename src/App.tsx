
import './App.css';
import AppRoute from './routes/AppRoute';
import { ToastContainer } from 'react-toastify';
import Layout from './layouts/Layout';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import theme from './utils/CreateTheme';
import AuthProvider from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthProvider>
          <>
            <ToastContainer style={{ marginTop: '7vh' }} />
            <Layout>
              <div style={{ marginTop: '5vh' }}>
                <AppRoute />
              </div>
            </Layout>
          </>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
