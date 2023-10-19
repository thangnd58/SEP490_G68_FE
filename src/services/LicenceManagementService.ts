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
    }
}
export default LicenceManagementService