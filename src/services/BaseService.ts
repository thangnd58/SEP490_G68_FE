import axios from 'axios';
import { BASE_URL } from '../utils/Constant';

const api = axios.create();

api.interceptors.request.use(
    function (config : any) {
        const urlConfig = `${BASE_URL}${config.url}`;
        let newConfig = {
            ...config,
            url: urlConfig
        };
        if (urlConfig.includes('image')) {
            newConfig.headers = {
                ...config.headers,
                'Co ntent-Type': 'multipart/form-data'
            };
        };
        // const tokenObject = UserService.getToken();
        // if (tokenObject) {
        //     config.headers.Authorization = `Bearer ${tokenObject.token}`;
        // }
        return { ...newConfig };
    }
);

api.interceptors.response.use(
    function (response) {
        return response;
    }
);

export default api;