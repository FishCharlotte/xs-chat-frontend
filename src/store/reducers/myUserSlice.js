import { createSlice } from '@reduxjs/toolkit';
import { getInfo, logout } from "api/users";

export const myUserSlice = createSlice({
    name: 'myUser',
    initialState: {
        info: {}, // 我的用户信息
        isNeededLogIn: false, // 是否需要登录
        isPending: false, // 正在获取用户信息
    },
    reducers: {
        setInfo: (state, action) => {
            state.info = action.payload;
        },
        setNeedLogIn: (state, action) => {
            state.isNeededLogIn = action.payload;
        },
        setIsPending: (state, action) => {
            state.isPending = action.payload;
        },
    },
})

export const { setInfo, setNeedLogIn, setIsPending  } = myUserSlice.actions;

export const fetchAndSetUserInfo = () => async (dispatch, getState) => {
    const { isPending } = getState().myUser;

    // 如果请求已经在进行中，直接返回，避免死循环
    if (isPending) return;

    try {
        const resp = await getInfo();

        // 成功获取用户信息
        dispatch(setInfo(resp));
        dispatch(setNeedLogIn(false));
    } catch (e) {
        // 出错时无条件前往登录界面
        console.log("error: ", e.message);
        dispatch(setNeedLogIn(true));
    } finally {
        dispatch(setIsPending(false));
    }
}

export const logOut = () => async (dispatch) => {
    try {
        await logout();
        dispatch(setInfo({}));
        dispatch(setNeedLogIn(true));
    } catch (e) {
        console.log("error: ", e.message);
    }
}

export const selectInfo = (state) => state.myUser.info
export const selectIsNeededLogIn = (state) => state.myUser.isNeededLogIn
export const selectIsPending = (state) => state.myUser.isPending

export default myUserSlice.reducer
