import { useSelector } from "react-redux";
import ChatMyUserInfo from "./ChatMyUserInfo";
import { ChatList } from "./ChatList";
import ChatObject from "./ChatObject";
import ChatContent from "./ChatContent";
import ChatReply from "./ChatReply";
import ChatEmpty from "./ChatEmpty";
import { selectChatId } from "store/reducers/dialogSlice";

const ChatDialog = () => {
    const chatId = useSelector(selectChatId);

    return (
        <div className='flex h-full'>
            <div className='w-[30%] h-full flex flex-col border-r border-[#7C7979]'>
                <ChatMyUserInfo />
                <div className='h-[calc(100%-90px)]'>
                    <ChatList/>
                </div>
            </div>

            <div className='w-[70%] h-full'>
                {
                    chatId && (
                        <div className='h-full flex flex-col select-text'>
                            <ChatObject />
                            <div className='bg-white h-[calc((100%-50px)*0.7)] shrink-0'>
                                <ChatContent />
                            </div>
                            <div className='h-[calc((100%-50px)*0.3)]'>
                                <ChatReply/>
                            </div>
                        </div>
                    )
                }
                {
                    // 未选择任何对话时
                    !chatId && (
                        <ChatEmpty />
                    )
                }
            </div>
        </div>
    )
}

export default ChatDialog;
