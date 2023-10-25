import { MotorbikeRequest } from './../utils/type';
import { Brand, Model, Motorbike } from "../utils/type"
import api from "./BaseService"

const apiGetAllBrand = '/brands'
const apiGetAllMotorbike = '/models'
const apiPostMotorbike = '/motorbike'
const apiGetListRegisterMotorbike = '/motorbikes'
const apiGetMotorbikeById = '/motobike'
const apiUpdateMotorbike = '/motobike'


export const PostMotorbikeService = {
    getAllBrand: async (): Promise<Brand[]> => {
        const response = await api.get(apiGetAllBrand)
        return response.data
    },
    getModelByBrandId: async (brandId: string): Promise<Model[]> => {
        const response = await api.get(apiGetAllMotorbike + '/' + brandId)
        return response.data
    },
    postMotorbike: async (motorbike: MotorbikeRequest): Promise<string> => {
        const response = await api.post(apiPostMotorbike, motorbike)
        return response.data
    },

    getListRegisterMotorbike: async (): Promise<Motorbike[]> => {
        const response = await api.get(apiGetListRegisterMotorbike)
        return response.data
    },

    getMotorbikeById: async (id: string): Promise<Motorbike> => {
        const response = await api.get(apiGetMotorbikeById + '/' + id)
        return response.data
    },

    updateMotorbike: async (motorbike: MotorbikeRequest): Promise<string> => {
        const response = await api.put(`${apiUpdateMotorbike}/${motorbike.id}`, motorbike)
        return response.data
    },

    
}

