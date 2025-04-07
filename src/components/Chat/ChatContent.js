import { useContext, useEffect, useRef, useState, useCallback, useMemo, memo } from "react";
import { Virtuoso } from 'react-virtuoso';
import { LocalDatabaseContext } from "components/Context/Context";
import { useDispatch, useSelector } from "react-redux";
import {
    getAndSetMessages,
    selectMessages,
    loadPreviousMessages,
    loadLatestMessages,
    selectCount,
    selectShouldAppend,
    setShouldAppend,
    selectShouldScrollToBottom, 
    setShouldScrollToBottom,
    setIsOthersMessagesReceived,
    selectIsOthersMessagesReceived,
} from "store/reducers/messagesSlice";
import { selectInfo } from "store/reducers/dialogSlice";
import { selectInfo as selectMyUserInfo } from "store/reducers/myUserSlice";
import ChatMessage from "./ChatMessage";

const kInitMsgCnt = 30; // 第一次加载的消息条目数
const kNextMsgCnt = 10; // 每次上拉加载的消息条目数
const kAutoScrollDistance = 10; // 来新消息时需要自动滚动到最底部的消息距离

const ChatContent = () => {
    const virtuoso = useRef(null);

    const db = useContext(LocalDatabaseContext);

    const dispatch = useDispatch();
    const messages = useSelector(selectMessages);
    const messageCount = useSelector(selectCount);
    const dialog = useSelector(selectInfo);
    const shouldAppend = useSelector(selectShouldAppend);
    const shouldScrollToBottom = useSelector(selectShouldScrollToBottom);
    const isOthersMessagesReceived = useSelector(selectIsOthersMessagesReceived);
    const userInfo = useSelector(selectMyUserInfo);

    const [firstItemIndex, setFirstItemIndex] = useState(messageCount);
    const [visibleRange, setVisibleRange] = useState({
        startIndex: 0,
        endIndex: 0,
    })

    /**
     * @description 原始消息的加载
     */
    useEffect(() => {
        if (!dialog || !dialog.chatId) return;

        // console.info('[ChatContent] Reload recently messages, chatId=', dialog.chatId);
        dispatch(getAndSetMessages(db, dialog.chatId, kInitMsgCnt, 'chatId'));

    }, [db, dialog, dialog.chatId, dispatch]);

    // 向上滚动拉取更旧的聊天
    useEffect(() => {
        if (db && shouldAppend) {
            dispatch(setShouldAppend(false));

            // 从DB获取最新的若干条消息，并更新 messages 状态
            dispatch(loadLatestMessages(db, dialog.chatId, 'chatId_id', userInfo.userId))
        }
    }, [db, shouldAppend, dispatch, dialog.chatId, messages, userInfo.userId])

    // 自己发了消息后自动滚动到最底部
    useEffect(() => {
        if (shouldScrollToBottom && messages.length > 0 && virtuoso.current) {
            // 统一清理新消息的状态
            dispatch(setShouldScrollToBottom(false));
            dispatch(setIsOthersMessagesReceived(false));

            // TODO: 理解宏任务微任务
            setTimeout(() => {
                virtuoso.current.scrollToIndex({
                    index: messages.length - 1,
                    align: "end",
                    behavior: "smooth",
                });
            })
        }
    }, [dispatch, messages.length, shouldScrollToBottom]);
    
    // 对方发送了消息，在一定视窗范围内才自动滚动到最底部
    useEffect(() => {
        if (isOthersMessagesReceived && !shouldScrollToBottom && messages.length > 0 && virtuoso.current) {
            // 统一清理新消息的状态
            dispatch(setShouldScrollToBottom(false));
            dispatch(setIsOthersMessagesReceived(false));

            // 在N条消息以内会自动触发向下滚动
            const distance = messageCount - visibleRange.endIndex;
            if (distance < kAutoScrollDistance) {
                setTimeout(() => {
                    virtuoso.current.scrollToIndex({
                        index: messages.length - 1,
                        align: "end",
                        behavior: "smooth",
                    });
                })
            }
        }
    }, [
        dispatch, isOthersMessagesReceived, messages.length, shouldScrollToBottom,
        visibleRange.endIndex, messageCount,
    ]);

    const internalMessages = useMemo(() => {
        if (!messageCount) return [];

        // console.info('[ChatContent] internalMessages=', messageCount);

        const nextFirstItemIndex = messageCount - messages.length;
        setFirstItemIndex(nextFirstItemIndex);
        return messages;
    }, [messages, messageCount]);

    /**
     * @description 当滑动到scroller顶部时发生的操作，包括拉取新消息、渲染新消息
     * @type {(function(): void)|*}
     */
    const startReached = useCallback(() => {
        console.log("[ChatContent] oadMore!!");
        dispatch(loadPreviousMessages(db, kNextMsgCnt, messages[0].id, 'chatId_id', dialog.chatId));

    }, [dispatch, db, dialog.chatId, messages]);

    // console.info('[ChatContent] render!! chatId=', dialog.chatId,
    //     'messageCount=', messageCount,
    //     'firstItemIndex=', Math.max(0, firstItemIndex),
    //     'internalMessages.len=', internalMessages.length);

    return (
        <div className='pl-[24px] w-full h-full pr-[24px]'>
            { !internalMessages.length ? (
                <></>
            ) : (
                <Virtuoso
                    ref={virtuoso}
                    style={{ height: '100%' }}
                    initialTopMostItemIndex={messageCount}
                    firstItemIndex={Math.max(0, firstItemIndex)}
                    rangeChanged={setVisibleRange}
                    data={internalMessages}
                    startReached={startReached}
                    itemContent={(index, item) => (<ChatMessage data={item} />)}
                />
            )}
        </div>
    )
}

export default ChatContent;