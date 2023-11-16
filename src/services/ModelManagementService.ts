import { Model } from "../utils/type";
import api from "./BaseService"

const urlModel = '/model'

const ModelManagementService = {
    getAllModel: async (): Promise<Model[]> => {
        return (await api.get('/models')).data;
    },
    getModelById: async (id: number):Promise<Model> => {
        return (await api.get(`${urlModel}/${id}`)).data;
    },
    editModel: async (id: number, modelName: string , modelImage : string , brandId : number) => {
        return await api.put(`${urlModel}/${id}`, {modelName : modelName , modelImage : modelImage ,brandId :brandId})
    },
    addModel: async (modelName: string , modelImage : string , brandId : number) => {
        return await api.post(`${urlModel}`,{ modelName : modelName , modelImage : modelImage ,brandId :brandId})
    },
    deleteModel: async (id: number) => {
        return await api.delete(`${urlModel}/${id}`)
    }
}
export default ModelManagementService