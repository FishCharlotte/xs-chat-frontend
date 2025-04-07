import { IconEdit } from "components/Common/Icons";
import { useSelector } from "react-redux";
import { selectInfo } from "store/reducers/myUserSlice";
import Avatar from "components/Common/Avatar";

const ChatMyUserInfo = () => {
    const userInfo = useSelector(selectInfo);

    return (
        <div className='flex h-[90px] p-[20px]'>
            <Avatar src={userInfo.avatar}
                    className="w-[50px] h-[50px] rounded-lg border-2 border-[#7C7979] object-cover"
                    alt='我的头像'/>
            <p className="not-italic pt-0 pl-4 flex-1 overflow-hidden whitespace-pre text-ellipsis"
               title={userInfo.nickname}>
                {userInfo.nickname}
            </p>
            <button type="button" className='flex items-end'>
                <IconEdit/>
            </button>
        </div>
    )
}

export default ChatMyUserInfo;
