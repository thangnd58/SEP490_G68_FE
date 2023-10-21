import React, { useContext, useEffect, useState } from 'react'
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import ToastComponent from '../components/toast/ToastComponent';
import usei18next from '../hooks/usei18next';
import { ROUTES } from '../utils/Constant';
import { User, Role } from '../utils/type';
import { useDispatch } from 'react-redux';
import { getUserInfo } from '../redux/reducers/authReducer';

interface AuthContext {
    isLogin: boolean;
    externalLogin: (googleToken: string) => void;
    login: (user: any, saveAccount: boolean) => void;
    logout: () => void;
    register: (user: any) => void;
    forgotPassword: (email: string) => void;
}

export const AuthContext = React.createContext<AuthContext>({
    isLogin: false,
    externalLogin: (googleToken: string) => { },
    login: (user: any, saveAccount: boolean) => { },
    logout: () => { },
    register: (user: any) => { },
    forgotPassword: (email: string) => { },
});

const AuthProvider = (props: { children: JSX.Element }) => {
    const { children } = props;
    const [isLogin, setIslogin] = useState<boolean>(UserService.isLoggedIn());
    const navigate = useNavigate();
    const { t } = usei18next();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = UserService.getToken();
        if (token) {
            setIslogin(true);
        }
    }, [])

    const externalLogin = async (googleToken: any) => {
        try {
            const response = await UserService.externalLogin({ accessToken: googleToken });
            if (response.status === 200) {
                ToastComponent(t("toast.login.success"), "success");
                navigate(ROUTES.homepage);
                dispatch(getUserInfo())
                setIslogin(true);
            }
        } catch (error) {
            ToastComponent(t("toast.login.warning_external"), "warning");
        }
    };

    const login = async (user: any, saveAccount: boolean) => {
        try {
            const response = await UserService.login({
                email: user.email,
                password: user.password
            });
            if (response.status === 200) {
                if (!saveAccount) {
                    const account = { email: user.email, password: user.password }
                    localStorage.setItem("acccount", JSON.stringify(account));
                } else {
                    localStorage.removeItem("acccount");
                }
                ToastComponent(t("toast.login.success"), "success");
                setIslogin(true);
                navigate(ROUTES.homepage);
                dispatch(getUserInfo())
            }
        } catch (error) {
            ToastComponent(t("toast.login.warning"), "warning");
        }
    };

    const logout = () => {
        setIslogin(false)
        localStorage.setItem("token", JSON.stringify(""));
        localStorage.removeItem("userInfo");
        ToastComponent(t("toast.logout.success"), "success");
        navigate(ROUTES.homepage);
    };

    const register = async (user: any) => {
        try {
            const response = await UserService.register({
                name: user.name,
                email: user.email,
                password: user.password
            });
            if (response.status === 200) {
                navigate(`${ROUTES.account.verifyrequired}/register`);
            }
        } catch (error) {
            ToastComponent(t("toast.register.warning"), "warning");
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            const response = await UserService.forgotPassword(email);
            if (response.status === 200) {
                navigate(`${ROUTES.account.verifyrequired}/reset-password`);
            }
        } catch (error) {
            ToastComponent(t("toast.resetpassword.error"), "error")
        }
    };

    const valueContext = {
        isLogin,
        externalLogin,
        login,
        logout,
        register,
        forgotPassword
    };
    return (
        <AuthContext.Provider value={valueContext}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider

export const useAuth = () => useContext(AuthContext);