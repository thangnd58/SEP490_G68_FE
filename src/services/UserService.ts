import { User, Lisence, ResetPassword, UserFavourite } from "../utils/type";
import api from "./BaseService";
import { isExpired, decodeToken } from "react-jwt";

const apiUserLogin = '/login'
const apiUserLoginExternal = '/external-login'
const apiRegister = '/register'
const apiUser = '/user'
const apiVerify = '/user-verification'
const apiLisence = '/licence'
const apiForgotPassword = '/forgot-password'
const apiSetPassword = '/set-password'
const apiUserFavourite = '/favourite';
const apiVerifyGoogle = '/user/google-verify'

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
    changePass: async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        const accessToken = JSON.parse(localStorage.getItem('token')!);
        const decode: any = decodeToken(accessToken);
        const params = { oldPassword, newPassword, confirmPassword }
        return await api.put(`/user/${decode.UserId}/password`, params);
    },
    changeUserProfile: async (name: string,phone: string, gender: string, dob: string, address: string) => {
        const accessToken = JSON.parse(localStorage.getItem('token')!);
        const decode: any = decodeToken(accessToken);
        const params = { name,phone, gender, dob, address }
        return await api.put(`/user/${decode.UserId}`, params);
    },
    changeLicense: async (licenceNumber: string, fullName: string, dob: string, licenceImage: string) => {
        const params = { licenceNumber, fullName, dob, licenceImage}
        return await api.put('/licence', params);
    },

    externalLogin: async (accessToken: any) => {
        return await api.post(apiUserLoginExternal, accessToken).then((response) => {
            if (response && response.data) {
                localStorage.setItem("token", JSON.stringify(response.data.token));
            }
            return response
        });
    },

    linkGoogleAccount: async (accessToken: any) => {
        return await api.post(apiVerifyGoogle, accessToken);
    },

    unlinkGoogleAccount: async () => {
        return await api.delete(apiVerifyGoogle)
    },

    getToken: (): any => JSON.parse(localStorage.getItem('token')!),

    isLoggedIn: (): boolean => {
        const accessToken = JSON.parse(localStorage.getItem('token')!);
        if (accessToken) {
            const isExpiredToken = isExpired(accessToken);
            return !isExpiredToken;
        }
        return false;
    },
    getUserInfo: async (): Promise<User | string> => {
        const accessToken = JSON.parse(localStorage.getItem('token')!);
        if (accessToken) {
            const decode: any = decodeToken(accessToken);
            return await api.get(`${apiUser}/${decode.UserId}`);
        }
        return "";
    },
    verifyUserRegister: async (ticketValue: string) => {
        return await api.post(`${apiVerify}`, { ticket: ticketValue });
    },
    getLisenceInfo: async (id?: number) => {
        const accessToken = JSON.parse(localStorage.getItem('token')!);
        const decode: any = decodeToken(accessToken);
        return await api.get(`${apiLisence}/${decode.UserId}`);  
    },
    forgotPassword: async (email: string) => {
        return api.post(`${apiForgotPassword}`, { email: email });
    },
    setForgotPassword: async (resetObject: ResetPassword) => {
        return api.post(`${apiSetPassword}`, resetObject)
    },
    updateAvatarUser: async (userId: number, avatarName: string) => {
        return await api.put(`/user/${userId}/avatar`, { avatar: avatarName });
    },
    deleteAvatarUser: async (userId: number) => {
        return await api.delete(`/user/${userId}/avatar`);
    },
    requestVerifyPhone : async (phone:string,type :number) =>{
        return api.post('/user/phone/request-verify',{ phone: phone,type :type })
    },
    requestVerifyOtp : async (phone:string, otp : string) =>{
        return api.post('/user/phone/verify',{phone: phone, otp: otp })
    },
    getUserFavourite: async (): Promise<UserFavourite[]> => {
        return await api.get(apiUserFavourite);
    },
    deleteFavourite: async (Id: number) => {
        return await api.delete(`/favourite/${Id}`);
    },
    addFavourite: async (Id: number) => {
        return await api.post('/favourite',{ motorbikeId: Id });
    },
    getAllUserManage: async () : Promise<User[]> => {
        return (await api.get('/manager/user')).data;
    },
    getUserByIdManage: async (userId: number) => {
        return (await api.get(`/manager/user/${userId}`)).data;
    },
    updateUserByIdManage: async (userId: number,name: string,password: string,phone: string,gender: string,dob: string,address: string,avatar: string,roleId: number) => {
        const params = { name, password, phone , gender, dob, address, avatar, roleId}
        return await api.put(`/manager/user/${userId}`, params);
    },
    updateRoleUserByIdManage: async (userId: number,roleId: string) => {
        return await api.put(`/manager/user/${userId}/${roleId}`);
    },
    deleteUserByIdManage: async (userId: number) => {
        return await api.delete(`/manager/user/${userId}`);
    },
    getUserDetailInformation: async (userId: string) : Promise<User> => {
        const res = await api.get(`${apiUser}/${userId}`);
        return res.data;
    }
}

export default UserService 