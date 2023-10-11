import axios from "axios";
import { ImageUpload } from "../utils/type";
import api from "./BaseService";

const API_GEN_UPLOAD_URL = "/generate-upload-url";

const UploadImageService = {
    generateUrlUpload: async (params: ImageUpload) => {
        return await api.get(API_GEN_UPLOAD_URL, { params: params });
    },

    uploadImage: async (uploadUrl: string, file: File) => {
        return await axios.put(uploadUrl, file);
    }

}

export default UploadImageService