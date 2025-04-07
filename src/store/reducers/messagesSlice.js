import { createSlice } from '@reduxjs/toolkit';

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        chatId: null,
        messages: [], // 待渲染的消息列表
        isLoading: false, // 是否有新消息
        count: 0, // 当前对话的消息总数
        shouldAppend: false, // 是否需要拉取最新的消息
        shouldScrollToBottom: false, // 是否需要滚到底部
        isOthersMessagesReceived: false, // 是否存在别人发的消息
    },
    reducers: {
        // 设置聊天房间号
        setChatId: (state, action) => {
            state.chatId = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        // 设置消息总数
        setCount: (state, action) => {
            state.count = action.payload;
        },
        // 往前添加历史消息
        addPreviousMessages: (state, action) => {
            state.messages = [...action.payload, ...state.messages];
        },
        // 往后面增加新加的消息
        addLatestMessages: (state, action) => {
            state.messages = [...state.messages, ...action.payload];
            state.count += action.payload.length;
        },
        setLoading: (state, action) => {
            state.isLoading = !!action.payload;
        },
        setShouldAppend: (state, action) => {
            state.shouldAppend = !!action.payload;
        },
        setShouldScrollToBottom: (state, action) => {
            state.shouldScrollToBottom = !!action.payload;
        },
        setIsOthersMessagesReceived: (state, action) => {
            state.isOthersMessagesReceived = !!action.payload;
        },
    },
})

export const {
    setChatId,
    setMessages,
    addPreviousMessages,
    addLatestMessages,
    setLoading,
    setCount,
    setShouldAppend,
    setShouldScrollToBottom,
    setIsOthersMessagesReceived,
} = messagesSlice.actions;

/**
 * @description 从DB中获取当前聊天的消息列表
 * @param db
 * @param chatId
 * @param n
 * @param index
 * @return {(function(*, *): Promise<void>)|*}
 */
export const getAndSetMessages = (db, chatId, n, index) => async (dispatch, getState) => {
    dispatch(setLoading(true)); // 开始加载
    dispatch(setChatId(chatId));
    dispatch(setMessages([]));

    try {
        // 先获取聊天中消息的总数
        dispatch(setCount(await db.count('Messages', index, chatId)));

        // 再获取最近n条的消息
        const resp = await db.getPrevMsg('Messages', chatId, n, index);
        dispatch(setMessages(resp.reverse()));
    } catch (e) {
        console.log("getAndSetMessages: error: ", e.message);
    } finally {
        dispatch(setLoading(false)); // 加载完成
    }
}

/**
 * @description 动态加载当前聊天的历史聊天消息
 * @param db
 * @param kNextMsgCnt
 * @param startId
 * @param index
 * @param chatId
 * @return {(function(*, *): Promise<void>)|*}
 */
export const loadPreviousMessages = (db, kNextMsgCnt, startId, index, chatId) => async (dispatch, getState) => {
    dispatch(setLoading(true)); // 开始加载
    console.log("addPreviousMessages:getState: ", getState().messages.chatId, chatId);

    try {
        const resp = await db.getNPrevMsg('Messages', kNextMsgCnt, chatId, startId, index);

        const prevChatId = getState().messages.chatId;
        console.log("addPreviousMessages: run chatId: ", chatId, 'getState id:',  prevChatId);

        if (chatId !== prevChatId) {
            dispatch(setLoading(false));
            return;
        }

        console.log("resp::", resp);
        dispatch(addPreviousMessages(resp)); // 添加新消息到当前状态
    } catch (e) {
        console.log("error: ", e.message);
    } finally {
        dispatch(setLoading(false));
    }
}

/**
 * @description 加载指定聊天的最新消息
 * @param db
 * @param chatId
 * @param index
 * @param myUserId
 * @return {(function(*, *): Promise<void>)|*}
 */
export const loadLatestMessages = (db, chatId, index, myUserId) => async (dispatch, getState) => {
    const messages = getState().messages.messages;
    if (!messages.length) return;

    db.getLatestMsg('Messages', chatId, messages[messages.length - 1].id, index)
        .then((result) => {
            console.log('loadLatestMessages: finish!', result);

            // 没有新的消息
            if (!result.length) return;

            // 自己发的消息则弹到最底下
            if (result.some(item => item.sender === myUserId)) {
                dispatch(setShouldScrollToBottom(true));
            } else {
                // 别人的消息则展示【有新消息】
                dispatch(setIsOthersMessagesReceived(true));
            }

            dispatch(addLatestMessages(result));
        });
}

export const selectMessages = (state) => state.messages.messages;
export const selectCount = (state) => state.messages.count;
export const selectShouldAppend = (state) => state.messages.shouldAppend;
export const selectShouldScrollToBottom = (state) => state.messages.shouldScrollToBottom;
export const selectIsOthersMessagesReceived = (state) => state.messages.isOthersMessagesReceived;

export default messagesSlice.reducer;
