import ReactDOM from 'react-dom/client';
import './index.css';
import './utils/i18n';
import React, { useEffect } from 'react';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import { Slide, ToastContainer } from 'react-toastify';
import AppRoute from './routes/AppRoute';
import theme from './utils/theme';
import { Provider, useDispatch } from 'react-redux'
import store from './redux/store';
import { getUserInfo } from './redux/reducers/authReducer';
import ModalProvider, { ModalContext } from './contexts/ModalContext';
import { getUserFavouriteInfo } from './redux/reducers/userFavouriteReducer';
import { getUserNotificationInfo } from './redux/reducers/notificationReducer';

const rootElement = document.getElementById('fb-root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);
store.dispatch(getUserInfo());
store.dispatch(getUserNotificationInfo())
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ModalProvider>
        <div className='rcs-container'>
          <BrowserRouter >
            <AuthProvider>
              <>
              <ModalContext.Consumer>
                {({ contentModal }) => {
                  return (
                    <>
                      {contentModal}
                    </>
                  );
                }}
              </ModalContext.Consumer>
                <ToastContainer
                  bodyStyle={{ color: theme.palette.text.primary }}
                  position="bottom-left"
                  transition={Slide}
                  pauseOnHover={false}
                  autoClose={1000}
                  pauseOnFocusLoss={false}
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
        </div>
      </ModalProvider>
    </ThemeProvider>
  </Provider>
);