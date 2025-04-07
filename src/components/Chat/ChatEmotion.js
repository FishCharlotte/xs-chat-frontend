import { useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'

import { useClickOutside } from "hooks/clickOutside";
import { selectMessage, selectCursorPosition, selectTextSelection, setReplyMsg, setTextSelection} from "store/reducers/chatReplySlice";
import { selectInfo } from "store/reducers/dialogSlice";

import { IconEmotion } from "components/Common/Icons";

// 写这里的时候，其实碰到了一点麻烦，就是表情框收起的问题
// 这里有一个经验贴：https://github.com/aermin/ghChat/blob/master/src/components/InputArea/index.js
// 但是我不喜欢，所以我不打算采用这个实现

// TODO: 还没有进行弹框美化
const ChatEmotionPopup = (props) => {
    const emotionRef = useRef();
    const dispatch = useDispatch();
    const dialog = useSelector(selectInfo);
    const reply = useSelector(selectMessage);
    const cursorPosition = useSelector(selectCursorPosition);
    const selectionLength = useSelector(selectTextSelection);

    // 只在渲染popup的时候才调用的钩子
    useClickOutside(emotionRef, () => {
        if (props.onHide) {
            props.onHide();
        }
    });

    const onEmojiSelect = (emotion) => {
        const prevMsg = reply.content;
        console.log("prev msg: ", typeof prevMsg)
        let msg;
        if (!prevMsg) {
            msg = emotion.native;
        } else {
            if (selectionLength > 0) {
                msg = prevMsg.slice(0, cursorPosition) + emotion.native + prevMsg.slice(cursorPosition + selectionLength);
            } else {
                msg = prevMsg.slice(0, cursorPosition) + emotion.native + prevMsg.slice(cursorPosition);
            }
        }

        dispatch(setReplyMsg({
            type: 'text',
            recipient: dialog.recipient,
            recipientType: dialog.recipientType,
            chatId: dialog.chatId,
            content: msg
        }))
        console.log("new msg: ", msg)
        if (props.onHide) {
            props.onHide();
        }
        dispatch(setTextSelection(0));
    };

    return (
        <div className='absolute top-[-443px] right-[-150px]'
             // onBlur={props.onBlur}
             ref={emotionRef}
        >
            <Picker data={data}
                    onEmojiSelect={onEmojiSelect}/>
        </div>
    )
}

const ChatEmotion = (props) => {
    const [showEmojiModal, setShowEmojiModal] = useState(false);

    return (
        <>
            <button title='表情'
                    className='h-full flex items-center justify-center'
                    onClick={() => setShowEmojiModal(true)}
            >
                <IconEmotion/>
            </button>

            { showEmojiModal && (
                <ChatEmotionPopup onHide={() => setShowEmojiModal(false)}/>
            )}
        </>
    )
}

export default ChatEmotion;

