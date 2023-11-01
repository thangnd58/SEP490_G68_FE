import authReducer  from "./authReducer";
import userFavouriteReducer  from "./userFavouriteReducer";

export const rootReducer = {
    userFavouriteInfo : userFavouriteReducer,
    userInfo: authReducer
    
}