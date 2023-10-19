import { Lisence } from "../utils/type"
import api from "./BaseService"

const urlLicence = '/licence'
const urlLicences = '/licences'

const LicenceManagementService = {
    getAllLicences: async (): Promise<Lisence[]> => {
        return (await api.get(urlLicence)).data;
    },
    getLicenceById:async (id: number): Promise<Lisence> => {
        return (await api.get(`${urlLicences}/${id}`)).data
    },
    changeStatus: async (id: number,status: number, statusComment: string) => {
        const params = { status, statusComment}
        return await api.put(`${urlLicence}/${id}/status`, params);
    }
}
export default LicenceManagementService