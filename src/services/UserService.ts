import { User } from "../utils/type";
import api from "./BaseService";
import { isExpired, decodeToken } from "react-jwt";

const apiUserLogin = '/login'
const apiUserLoginExternal = '/external-login'
const apiRegister = '/register'
const apiUser = '/user'

const UserService = {
    login: async (user: any) => {
        return await api.post(apiUserLogin, user).then((response) => {
            if (response && response.data) {
                localStorage.setItem("token", JSON.stringify(response.data.token));
            }
            return response
        });
    },

    logout: () => {
        localStorage.removeItem("token");
    },

    register: async (user: any) => {
        return await api.post(apiRegister, user);
    },

    externalLogin: async (accessToken: any) => {
        return await api.post(apiUserLoginExternal, accessToken).then((response) => {
            if (response && response.data) {
                localStorage.setItem("token", JSON.stringify(response.data.token));
            }
            return response
        });
    },

    getToken: () => JSON.parse(localStorage.getItem('token')!),

    isLoggedIn: () : boolean => {
        const accessToken = JSON.parse(localStorage.getItem('token')!);
        if (accessToken) {
            const isExpiredToken = isExpired(accessToken);
            return !isExpiredToken;
        }
        return false;
    },
    getUserInfo: async () : Promise<User | undefined> => {
        const accessToken = JSON.parse(localStorage.getItem('token')!);
        if (accessToken) {
            const decode: any = decodeToken(accessToken);
            return await api.get(`${apiUser}/${decode.UserId}`);
        }
        return undefined;
    }
}

export default UserService 