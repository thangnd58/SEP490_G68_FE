import { createSlice } from "@reduxjs/toolkit";
import { CartInforResponse } from "../../utils/type";
import { AppDispatch, RootState } from "../store";
import { BookingService } from "../../services/BookingService";

export interface ShoppingCartInfo {
    shoppingCart: CartInforResponse[];
}

const initialState: ShoppingCartInfo = { shoppingCart: [] };

export const shoppingCartReducer = createSlice({
    name: "shoppingCartInfo",
    initialState,
    reducers: {
        updateCart: (state, action) => {
            state.shoppingCart = action.payload;
        },
    },
});

export const getCartInfo = (): any => {
    return async (dispatch: AppDispatch, getState: RootState) => {
        try {
            const shoppingCartInfo = await BookingService.getListShoppingCart();
            //@ts-ignore
            dispatch(updateCart(shoppingCartInfo.data));
        } catch (err) { }
    };
};

export const { updateCart } = shoppingCartReducer.actions;
export default shoppingCartReducer.reducer;
