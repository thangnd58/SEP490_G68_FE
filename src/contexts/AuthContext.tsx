import React, { useContext, useEffect, useState } from 'react'
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import ToastComponent from '../components/toast/ToastComponent';
import usei18next from '../hooks/usei18next';
import { ROUTES } from '../utils/Constant';
import { User, Role } from '../utils/type';
import { deleteUserInfor, getUserInfo } from '../redux/reducers/authReducer';
import { useAppDispatch, useAppSelector } from '../hooks/useAction';

interface AuthContext {
    isLogin: boolean;
    externalLogin: (googleToken: string, isModal?: boolean) => void;
    login: (user: any, saveAccount: boolean, isModal?: boolean) => void;
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
    const dispatch = useAppDispatch();
    const { userLoggedIn } = useAppSelector((state: any) => state.userInfo);


    useEffect(() => {
        const token = UserService.getToken();
        if (token && userLoggedIn && UserService.isLoggedIn()) {
            setIslogin(true);
        }
    }, [])

    const externalLogin = async (googleToken: any, isModal?: boolean) => {
        try {
            const response = await UserService.externalLogin({ accessToken: googleToken });
            if (response.status === 200) {
                ToastComponent(t("toast.login.success"), "success");
                if (!isModal || isModal === undefined) {
                    if (response.data.userInfo.role.roleName === "Customer") {
                        navigate(ROUTES.homepage);
                    } else if (response.data.userInfo.role.roleName === "Admin") {
                        navigate(ROUTES.admin.managemotorbikes);
                    } else {
                        navigate(ROUTES.other.pagenotfound);
                    }
                }
                dispatch(getUserInfo())
                setIslogin(true);
            }
        } catch (error) {
            ToastComponent(t("toast.login.warning_external"), "warning");
        }
    };


    const login = async (user: any, saveAccount: boolean, isModal?: boolean) => {
        console.log("A")
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
                if (!isModal || isModal === undefined) {
                    if (response.data.userInfo.role.roleName === "Customer") {
                        navigate(ROUTES.homepage);
                    } else if (response.data.userInfo.role.roleName === "Admin") {
                        navigate(ROUTES.admin.managemotorbikes);
                    } else {
                        navigate(ROUTES.other.pagenotfound);
                    }
                }
                ToastComponent(t("toast.login.success"), "success");
                setIslogin(true);
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
        dispatch(deleteUserInfor())
        ToastComponent(t("toast.logout.success"), "success");
        navigate(ROUTES.account.login);
    };

    const register = async (user: any) => {
        try {
            const response = await UserService.register({
                name: user.name,
                email: user.email,
                password: user.password,
                phone: user.phone
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