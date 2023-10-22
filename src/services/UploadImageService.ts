import axios from "axios";
import { ImageUpload } from "../utils/type";
import api from "./BaseService";

const API_GEN_UPLOAD_URL = "/generate-upload-url";
const API_EXTRACT_FOLDER = "/unzip";

const UploadImageService = {
    generateUrlUpload: async (params: ImageUpload) => {
        return await api.get(API_GEN_UPLOAD_URL, { params: params });
    },

    uploadImage: async (uploadUrl: string, file: File) => {
        return await axios.put(uploadUrl, file);
    },

    uploadZipFile: async (uploadUrl: string, file: Blob) => {
        return await axios.put(uploadUrl, file);
    },

    extractFolder: async (params: ImageUpload) => {
        return await api.get(API_EXTRACT_FOLDER, { params: params });
    },


}

export default UploadImageService