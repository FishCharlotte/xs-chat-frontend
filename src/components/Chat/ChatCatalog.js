import { IconChat, IconFriends, IconMe } from "../Common/Icons";
import {useDispatch, useSelector} from "react-redux";
import { setMenu, selectHasNewFriendRequest, selectUnreadMessageCount } from "store/reducers/uiSlice";

const ChatCatalog = () => {
    const dispatch = useDispatch();
    const hasNewFriendRequest = useSelector(selectHasNewFriendRequest);
    const unreadMessageCount = useSelector(selectUnreadMessageCount);

    const handleClick = (e) => {
        dispatch(setMenu(e.currentTarget.id));
    }

    return (
        <div className='flex flex-col h-full justify-center'>
            <button
                id='chat'
                onClick={handleClick}
                className='relative mx-auto my-0 py-4'>
                <IconChat/>
                <p className='text-[#4F2011]'>聊天</p>
                {
                    // 有未读消息时显示红点
                    unreadMessageCount > 0 && (
                        <span
                            className='absolute top-2 right-[-7px] flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs border-gray-600 border-[1px]'>
                            {unreadMessageCount > 100 ? '...' : unreadMessageCount}
                        </span>
                    )
                }
            </button>
            <button
                id='friends'
                onClick={handleClick}
                className='relative mx-auto my-0 py-4'>
                <IconFriends/>
                <p className='text-[#4F2011]'>好友</p>
                {
                    // 有好友请求时显示红点
                    hasNewFriendRequest && (
                        <span className='absolute top-3 right-[-7px] block h-3 w-3 rounded-full bg-red-500 border-gray-600 border-[1px]'></span>
                    )
                }
            </button>
            <button
                id='me'
                onClick={handleClick}
                className='relative mx-auto my-0 py-4'>
                <IconMe/>
                <p className='text-[#4F2011]'>个人</p>
            </button>
        </div>
    )
}

export default ChatCatalog;
