import React, { useEffect, useState } from 'react'
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import ToastComponent from '../components/toast/ToastComponent';
import usei18next from '../hooks/usei18next';
import { ROUTES } from '../utils/Constant';
import { User, Lisence, ResetPassword } from '../utils/type';

interface AuthContext {
    isLogin: boolean;
    externalLogin: (googleToken: string) => void;
    login: (user: any, saveAccount: boolean) => void;
    logout: () => void;
    register: (user: any) => void;
    changePass: (oldPassword: string, newPassword: string, rePassword: string) => void;
    user: User | undefined;
    lisence: Lisence | undefined;
    forgotPassword: (email: string) => void;
}

export const AuthContext = React.createContext<AuthContext>({
    isLogin: false,
    externalLogin: (googleToken: string) => { },
    login: (user: any, saveAccount: boolean) => { },
    logout: () => { },
    register: (user: any) => { },
    changePass: (oldPassword: string, newPassword: string, rePassword: string) => { },
    user: undefined,
    lisence: undefined,
    forgotPassword: (email: string) => {}
});

const AuthProvider = (props: { children: JSX.Element }) => {
    const { children } = props;
    const [isLogin, setIslogin] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = usei18next();
    const [user, setUser] = useState<User>();
    const [lisence, setLisence] = useState<Lisence>();

    useEffect(() => {
        setIslogin(UserService.isLoggedIn());
    }, [])

    useEffect(() => {
        getUser();
        getLisence();
    }, [isLogin])

    const getUser = async () => {
        try {
            const res: any = await UserService.getUserInfo();
            if (res.status === 200) {
                setUser(res.data);
            } else {
            }
        } catch (error) {
        }
    }

    const getLisence = async () => {
        try {
            const res: any = await UserService.getLisenceInfo();
            if (res.status === 200) {
                setLisence(res.data);
            } else {
            }
        } catch (error) {
        }
    }

    const externalLogin = async (googleToken: any) => {
        try {
            const response = await UserService.externalLogin({ accessToken: googleToken });

            if (response.status === 200) {
                ToastComponent(t("toast.login.success"), "success");
                navigate(ROUTES.user.userprofile);
            } else {
                ToastComponent(t("toast.login.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.login.error"), "error")
        }
        setIslogin(true);
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
                navigate(ROUTES.user.userprofile);
                window.location.reload();
            } else {
                ToastComponent(t("toast.login.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.login.error"), "error")
        }
    };

    const changePass = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        try {
            const response = await UserService.changePass(
                oldPassword,
                newPassword,
                confirmPassword
            );
            if (response.status === 200) {
                ToastComponent(t("toast.changepassword.success"), "success");
                //navigate(ROUTES.account.verifyrequired);
            } else {
                ToastComponent(t("toast.changepassword.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.changepassword.error"), "error")
        }
    };

    const logout = () => {
        setIslogin(false)
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
            } else {
                ToastComponent(t("toast.register.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.register.error"), "error")
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
        user,
        lisence,
        externalLogin,
        login,
        logout,
        register,
        changePass,
        forgotPassword
    };
    return (
        <AuthContext.Provider value={valueContext}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider