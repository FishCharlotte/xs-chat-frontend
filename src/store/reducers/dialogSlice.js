import { createSlice } from '@reduxjs/toolkit';
import { setMenu } from "./uiSlice";

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState: {
        chatId: null,
        info: {},
    },
    reducers: {
        setChatId: (state, action) => {
            state.chatId = action.payload;
        },
        setInfo: (state, action) => {
            state.info = action.payload;
            state.chatId = action.payload.chatId;
        },
    },
})

export const {
    setChatId,
    setInfo,
} = dialogSlice.actions;

export const switchDialog = (db, recipientKey) => async (dispatch) => {
    if (!db) {
        console.error('[dialogSlice] switchDialog: needs db!');
        return;
    }

    try {
        const info = await db.Chats.getDialogInfo(recipientKey);
        dispatch(setInfo(info));
        dispatch(setMenu('chat'));
    } catch (e) {
        console.error("[dialogSlice] switchDialog: error: ", e.message);
    }
}

export const selectChatId = (state) => state.dialog.chatId;
export const selectInfo = (state) => state.dialog.info;

export default dialogSlice.reducer;
