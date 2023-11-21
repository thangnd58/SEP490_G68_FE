import { createSlice } from "@reduxjs/toolkit";
import { CartInforResponse } from "../../utils/type";
import { AppDispatch, RootState } from "../store";
import { BookingService } from "../../services/BookingService";

export interface BookingInfo {
    reloadStatus: boolean;
}

const initialState: BookingInfo = { reloadStatus: false };

export const bookingReducer = createSlice({
    name: "bookingInfo",
    initialState,
    reducers: {
        updateStatus: (state, action) => {
            state.reloadStatus = action.payload;
        },
    },
});

export const getBookingInfo = (status : boolean): any => {
    return async (dispatch: AppDispatch, getState: RootState) => {
        try {
            const bookingInfo: BookingInfo = { reloadStatus: status };
            //@ts-ignore
            dispatch(updateStatus(bookingInfo));
        } catch (err) { }
    };
};

export const { updateStatus } = bookingReducer.actions;
export default bookingReducer.reducer;
