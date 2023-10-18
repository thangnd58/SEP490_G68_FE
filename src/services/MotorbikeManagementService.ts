import { Motorbike } from "../utils/type"
import api from "./BaseService"

const urlMotorbikes = '/motorbikes'

const MotorbikeManagementService = {
    getAllMotorbikes: async (): Promise<Motorbike[]> => {
        return (await api.get(urlMotorbikes)).data;
    }
}
export default MotorbikeManagementService