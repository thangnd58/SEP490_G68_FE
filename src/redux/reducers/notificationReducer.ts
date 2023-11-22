import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../store";
import { Notification } from "../../utils/type";
import { NotificationService } from "../../services/NotificationService";
import { useSelector } from "react-redux";
import UserService from "../../services/UserService";

export interface NotificationInfo {
    userNotification: Notification[]
}

const initialState: NotificationInfo = {userNotification : []};

export const userNotificationReducer = createSlice({
    name: "userNotification",
    initialState,
    reducers: {
      updateNotification: (state, action) => {
        state.userNotification = action.payload
      }
    },
  });

export const getUserNotificationInfo = (): any => {
    return async (dispatch: AppDispatch, getState: RootState) => {
        try {
          // check if user is logged in
          if (!UserService.isLoggedIn()) return;
          const userNotificationInfo = await NotificationService.getAllUserNotification();
          //@ts-ignore
          dispatch(updateNotification(userNotificationInfo.data))
        } catch (err) { }
      };
};



export const { updateNotification } = userNotificationReducer.actions;
export default userNotificationReducer.reducer;
