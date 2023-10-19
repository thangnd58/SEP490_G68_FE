import { Motorbike } from "../utils/type"
import api from "./BaseService"

const urlMotorbikes = '/motorbikes'

const MotorbikeManagementService = {
    getAllMotorbikes: async (): Promise<Motorbike[]> => {
        return (await api.get(urlMotorbikes)).data;
    },
    getMotorbikesById:async (id: number): Promise<Motorbike> => {
        return (await api.get(`/motobike/${id}`)).data
    },
    changeStatus: async (id: number,status: number, statusComment: string) => {
        const params = { status, statusComment}
        return await api.put(`/motorbike/${id}`, params);
    }
}
export default MotorbikeManagementService