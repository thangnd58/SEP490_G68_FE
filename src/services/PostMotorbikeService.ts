import { MotorbikeRequest } from './../utils/type';
import { Brand, Model, Motorbike } from "../utils/type"
import api from "./BaseService"

const apiGetAllBrand = '/brands'
const apiGetAllMotorbike = '/models'
const apiPostMotorbike = '/motorbike'

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
    }
    
}

