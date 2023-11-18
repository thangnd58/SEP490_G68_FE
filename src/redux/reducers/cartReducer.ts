import { createSlice } from "@reduxjs/toolkit";
import { ShoppingCart, UserFavourite } from "../../utils/type";
import { AppDispatch, RootState } from "../store";
import { BookingService } from "../../services/BookingService";

export interface ShoppingCartInfo {
    shoppingCart: null | ShoppingCart;
}

const initialState: ShoppingCartInfo = { shoppingCart : null};

export const shoppingCartReducer = createSlice({
    name: "shoppingCartInfo",
    initialState,
    reducers: {
        updateCart: (state, action) => {
            state.shoppingCart = action.payload;
        },
    },
});

// export const getCartInfo = (): any => {
//     return async (dispatch: AppDispatch, getState: RootState) => {
//         try {
//             const shoppingCartInfo = await BookingService.getListShoppingCart(
//                 "Km%2029%2C%20%C4%90%E1%BA%A1i%20l%E1%BB%99%20Th%C4%83ng%20Long%2C%20huy%E1%BB%87n%20Th%E1%BA%A1ch%20Th%E1%BA%A5t",
//                 "10-11-2023%2000%3A00",
//                 "11-11-2023%2000%3A00",
//                 "BANMOI"
//             );
//             //@ts-ignore
//             dispatch(updateCart(shoppingCartInfo.data));
//         } catch (err) {}
//     };
// };

export const { updateCart } = shoppingCartReducer.actions;
export default shoppingCartReducer.reducer;
