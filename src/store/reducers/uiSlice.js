import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        currentMenu: 'chat', // 默认是对话页面
        unreadMessageCount: 0, // 未读消息数量
        hasNewFriendRequest: false, // 是否有新的好友请求
    },
    reducers: {
        /**
         * @description 设置当前的界面页
         * @param state
         * @param action
         */
        setMenu: (state, action) => {
            state.currentMenu = action.payload;
        },
        /**
         * @description 添加未读消息数量
         * @param state
         * @param action
         */
        addUnreadMessage: (state, action) => {
            state.unreadMessageCount += action.payload || 1;
        },
        /**
         * @description 清空未读消息数量
         * @param state
         */
        clearUnreadMessage: (state) => {
            state.unreadMessageCount = 0;
        },
        /**
         * @description 设置是否有新的好友请求
         * @param state
         * @param action
         */
        setHasNewFriendRequest: (state, action) => {
            state.hasNewFriendRequest = !!action.payload;
        },
    },
})

export const {
    setMenu,
    addUnreadMessage,
    clearUnreadMessage,
    setHasNewFriendRequest,
} = uiSlice.actions;

export const selectCurrentMenu = (state) => state.ui.currentMenu;
export const selectUnreadMessageCount = (state) => state.ui.unreadMessageCount;
export const selectHasNewFriendRequest = (state) => state.ui.hasNewFriendRequest;

export default uiSlice.reducer;
