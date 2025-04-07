import { useState, useRef, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import ChatToolbox from "./ChatToolbox";
import { IconReply } from "components/Common/Icons";
import { SocketContext } from "components/Context/Context";
import { selectInfo } from "store/reducers/dialogSlice";
import { setReplyMsg, setCursorPosition, setTextSelection, selectMessage } from "store/reducers/chatReplySlice";

const ChatReply = () => {
    const [message, setMessage] = useState('')
    const messageRef = useRef('');
    const dispatch = useDispatch();
    const { sendMessage } = useContext(SocketContext);
    const dialog = useSelector(selectInfo);
    const reply = useSelector(selectMessage);
    const [isComposing, setIsComposing] = useState(false);

    useEffect(() => {
        setMessage(reply.content);
    }, [reply.content]);

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
            e.preventDefault();
            onSendMessage();
        }
    }

    const updateCursorPosition = () => {
        const position_start = messageRef.current.selectionStart;
        const position_end = messageRef.current.selectionEnd;
        if (position_start !== position_end) {
            dispatch(setTextSelection(position_end - position_start));
        }
        dispatch(setCursorPosition(position_start));
    };

    const handleChange = (e) => {
        if (!dialog.chatId) {
            console.error('[ChatReply] handleChange: chatId is empty!');
            return;
        }
        setMessage(e.target.value);
        dispatch(setReplyMsg({
            type: 'text',
            recipient: dialog.recipient,
            recipientType: dialog.recipientType,
            chatId: dialog.chatId,
            content: e.target.value
        }))

        // console.log("cursorPosition:", e.target.selectionStart)
    }

    const onSendMessage = () => {
        console.log("reply:", reply)

        if (!dialog.chatId) {
            console.error('[ChatReply] sendReply: chatId is empty!');
            return;
        }

        if (!reply.content.trim().length) {
            console.info('[ChatReply] onSendMessage: 不能发送空的消息'); // TODO: 需要展示给用户不能发送空的消息
            return;
        }

        // 发送消息
        sendMessage(reply.chatId, reply.recipientType, reply.recipient, reply.content)
            .then(() => {})
            .catch(e => {
                console.error('[ChatReply] sendMessage:', e);
            });

        // 发送后清空输入框
        setMessage('');
    }

    return (
        <div className='h-full'>
            <div className='border-b-[2px] h-[30px] border-t-[2px] pl-[20px]'>
                <ChatToolbox/>
            </div>
            <div className='w-full h-[calc(100%-30px)] relative'>
                <textarea className='w-full h-full outline-none px-2 py-1 resize-none caret-border'
                          ref={messageRef}
                          value={message}
                          onKeyUp={updateCursorPosition}
                          onKeyDown={handleKeyDown}
                          onMouseUp={updateCursorPosition}
                          onCompositionStart={handleCompositionStart}
                          onCompositionEnd={handleCompositionEnd}
                          onChange={handleChange}
                          onClick={updateCursorPosition}
                />
                <button className='absolute bottom-0 right-3 m-2' onClick={onSendMessage}>
                    <IconReply/>
                </button>
            </div>
        </div>
    )
}

export default ChatReply;