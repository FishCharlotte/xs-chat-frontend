import { createSlice } from '@reduxjs/toolkit';

export const chatReplySlice = createSlice({
    name: 'chatReply',
    initialState: {
        replyMsg: {}, // 回复的消息
        cursorPosition: 0,
        textSelection: 0,
    },
    reducers: {
        setReplyMsg: (state, action) => {
            state.replyMsg = action.payload;
        },
        setCursorPosition: (state, action) => {
            state.cursorPosition = action.payload;
        },
        setTextSelection: (state, action) => {
            state.textSelection = action.payload;
        }
    },
})

export const { setReplyMsg, setCursorPosition, setTextSelection } = chatReplySlice.actions;

// export const setMessage = () => async (dispatch, getState) => {
//
// }

export const selectMessage = (state) => state.chatReply.replyMsg;
export const selectCursorPosition = (state) => state.chatReply.cursorPosition;
export const selectTextSelection = (state) => state.chatReply.textSelection;

export default chatReplySlice.reducer