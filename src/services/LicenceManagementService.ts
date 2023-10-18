import { Lisence } from "../utils/type"
import api from "./BaseService"

const urlLicence = '/licence'

const LicenceManagementService = {
    getAllLicences: async (): Promise<Lisence[]> => {
        return (await api.get(urlLicence)).data;
    }
}
export default LicenceManagementService