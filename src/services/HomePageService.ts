import { PopularLocation, PopularProvince } from './../utils/type';
import { Motorbike } from "../utils/type";
import api from "./BaseService"

const apiGetListPopularMotorbike = "/popular-motorbike";
const apiGetPopularProvince = "/popular-province/count-motorbike";
const apiGetPopularLocation = "/popular-location/count-motorbike";

export const HomePageService = {
    getListPopularMotorbike: async (): Promise<Motorbike[]> => {
        const response = await api.get(apiGetListPopularMotorbike);
        return response.data;
    },
    getPopularProvince: async (): Promise<PopularProvince[]> => {
        const response = await api.get(apiGetPopularProvince);
        return response.data;
    },
    getPopularLocation: async (): Promise<PopularLocation[]> => {
        const response = await api.get(apiGetPopularLocation);
        return response.data;
    },
    
}
