import React, { useContext, useEffect, useState } from 'react'
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import ToastComponent from '../components/toast/ToastComponent';
import usei18next from '../hooks/usei18next';
import { ROUTES } from '../utils/Constant';
import { User, Role } from '../utils/type';

interface AuthContext {
    isLogin: boolean;
    externalLogin: (googleToken: string) => void;
    login: (user: any, saveAccount: boolean) => void;
    logout: () => void;
    register: (user: any) => void;
    user: User | undefined;
    forgotPassword: (email: string) => void;
    getUser: () => void;
}

export const AuthContext = React.createContext<AuthContext>({
    isLogin: false,
    externalLogin: (googleToken: string) => { },
    login: (user: any, saveAccount: boolean) => { },
    logout: () => { },
    register: (user: any) => { },
    user: undefined,
    forgotPassword: (email: string) => { },
    getUser: () => { }
});

const AuthProvider = (props: { children: JSX.Element }) => {
    const { children } = props;
    const [isLogin, setIslogin] = useState<boolean>(false);
    const navigate = useNavigate();
    const { t } = usei18next();
    const [user, setUser] = useState<User>();

    useEffect(() => {
        setIslogin(UserService.isLoggedIn());
    }, [isLogin])

    const getUser = async () => {
        try {
            const res: any = await UserService.getUserInfo();
            if (res.status === 200) {
                const data = res.data;
                const userRole: Role = {
                    createUserId: data.role.createUserId,
                    createDatetime: data.role.createDatetime,
                    deleted: data.role.deleted,
                    roleId: data.role.roleId,
                    roleName: data.role.roleName,
                    updateDatetime: data.role.updateDatetime,
                    updateUserId: data.role.updateUserId,
                }
                const userResponse: User = {
                    address: data.address,
                    avatar: data.avatar,
                    dob: data.dob,
                    email: data.email,
                    gender: data.gender,
                    name: data.name,
                    phone: data.phone,
                    role: userRole,
                    userId: data.userId,
                    password: ""
                }
                setUser(userResponse);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getUser();
    }, [])

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
                navigate(ROUTES.homepage);

            } else {
                ToastComponent(t("toast.login.warning"), "warning");
            }
        } catch (error) {
            ToastComponent(t("toast.login.error"), "error")
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
        externalLogin,
        login,
        logout,
        register,
        forgotPassword,
        getUser
    };
    return (
        <AuthContext.Provider value={valueContext}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider

export const useAuth = () => useContext(AuthContext);