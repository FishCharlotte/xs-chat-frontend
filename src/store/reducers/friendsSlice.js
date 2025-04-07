import { createSlice } from '@reduxjs/toolkit';
import { getList, getInvitationList, updateInvitation } from "api/friends";

export const friendsSlice = createSlice({
    name: 'friends',
    initialState: {
        list: [],
        inviters: [], // 发送的好友请求
        invitees: [], // 收到的好友请求
        needInit: true,

    },
    reducers: {
        // 设置好友列表
        setList: (state, action) => {
            state.list = action.payload;
        },
        // 设置发送出去的好友请求
        setInviters: (state, action) => {
            state.inviters = action.payload;
        },
        // 设置收到的好友请求
        setInvitees: (state, action) => {
            state.invitees = action.payload;
        },
        setNeedInit: (state, action) => {
            state.needInit = action.payload;
        },
    },
})

export const {
    setList,
    setInviters,
    setInvitees,
    setNeedInit,
} = friendsSlice.actions;

/**
 * @description 从后端获取用户好友列表
 * @param db
 * @return {(function(*, *): Promise<void>)|*}
 */
export const fetchFriends = (db) => async (dispatch, getState) => {
    // fetch friends
    const { friends } = await getList();
    console.log("fetchFriends::", friends)
    dispatch(setList(friends)); // 开始加载
    db.refresh('Friends', friends);
}

/**
 * @description 从DB中获取用户好友列表
 * @param db
 * @return {(function(*, *): Promise<void>)|*}
 */
export const loadFriends = (db) => async (dispatch, getState) => {
    try {
        const resp = await db.getAllRecords('Friends');
        dispatch(setList(resp));
    } catch (e) {
        console.log('loadFriends: error', e.message)
    }
}

/**
 * @description 从后端获取好友申请列表
 * @return {(function(*, *): Promise<void>)|*}
 */
export const fetchInvitations = () => async (dispatch, getState) => {
    try {
        const data = await getInvitationList();
        dispatch(setInvitees(data.invitees));
        dispatch(setInviters(data.inviters));
    } catch (e) {
        console.log('fetchInvitations: error', e.message)
    }

}

/**
 * @description 对好友请求做出反应
 * @param db
 * @param id 好友请求的id
 * @param action 同意或拒绝等
 * @return {(function(*, *): Promise<void>)|*}
 */
export const updateFriendInvitation = (db, id, action) => async (dispatch, getState) => {
    try {
        switch (action) {
            case 'accepted':
                await updateInvitation(id, action);
                dispatch(fetchFriends(db));
                dispatch(fetchInvitations());
                break
            case 'rejected':
                await updateInvitation(id, action);
                dispatch(fetchInvitations());
                break
            default:
                console.log('unknown action')
        }
    } catch (e) {
        console.log('updateInvitation: error', e.message)
    }
}

export const selectFriendsList = (state) => state.friends.list;
export const selectNeedInit = (state) => state.friends.needInit;
export const selectInviters = (state) => state.friends.inviters;
export const selectInvitees = (state) => state.friends.invitees;

export default friendsSlice.reducer;
