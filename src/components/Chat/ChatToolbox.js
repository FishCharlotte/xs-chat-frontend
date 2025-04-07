import { IconAttachment, IconPhone, IconPosition, IconVideo } from "components/Common/Icons";
import ChatEmotion from "components/Chat/ChatEmotion";
import PhoneCall from "components/Chat/PhoneCall";


const ChatToolbox = () => {

    return (
        <div className='flex items-center h-full'>
            <div className='mx-[30px] relative h-full'>
                <ChatEmotion />
            </div>
            <div className='mr-[30px] relative h-full'>
                <PhoneCall />
            </div>
            <button className='mr-[30px]' title='视频通话'>
                <IconVideo/>
            </button>
            <button className='mr-[30px]' title='发送附件'>
                <IconAttachment/>
            </button>
            <button title='位置'>
                <IconPosition/>
            </button>
        </div>
    )
}

export default ChatToolbox;
