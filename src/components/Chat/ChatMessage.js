import Avatar from "../Common/Avatar";
import { useSelector } from "react-redux";
import { selectInfo } from "store/reducers/myUserSlice";
import { LocalDatabaseContext } from 'components/Context/Context';
import { useContext, useEffect, useState, memo } from "react";

const textToParagraph = (text) => {
    // 替换空格和TAB为占位符，否则影响展示 TODO 这里很值得写一个博文
    const formattedText = (text) => text.replace(/\t/g, '  ').replace(/ /g, '\u00A0');
    return text.split('\n').map((item, index) => {
        if (!item.length) item = ' '; // 空行必须留一个占位符
        return (
            <p className="break-words whitespace-normal w-full" key={'item-' + index}>
                {formattedText(item)}
            </p>
        )
    })
}

/**
 * @description 渲染聊天消息的内容
 * @param data 聊天消息
 * @return {*}
 */
const renderValue = (data) => {
    switch (data.type) {
        case 'text':
            return textToParagraph(data.value);
        // TODO: 根据data的类型渲染，例如图像
        default:
            console.error('[ChatMessage] renderValue type is unknown', data);
    }
}

const MyMessage = memo((props) => {
    return (
        <div className='flex relative flex-row-reverse items-center pl-[20%] py-2'
             key={props.data.id}>
            <Avatar src={props.userInfo.avatar}
                    className="w-[50px] h-[50px] rounded-lg border-2 border-[#7C7979] object-cover self-start"
                    alt={props.userInfo.nickname}
                    title={props.userInfo.nickname} />
            <div className='flex flex-col justify-center items-center
             mr-[18px] px-[8px] py-[4px] min-w-[10px] min-h-[40px]
            border-[1px] border-[#7C7979] bg-[#D9D9D9] rounded-sm
            after:origin-center after:rotate-45 after:absolute
            after:right-[61px] after:top-[25px] after:w-[16px] after:h-[16px] after:rounded-tr-sm
            after:bg-gradient-to-bl from-[#D9D9D9] from-50% to-transparent to-50%
            after:bg-origin-border
            after:border-t-[#7C7979] after:border-t-[1px]
            after:border-r-[#7C7979] after:border-r-[1px]
            after:border-b-transparent after:border-b-[1px]
            after:border-l-transparent after:border-l-[1px]'>
                {renderValue(props.data)}
            </div>
        </div>
    )
});

const OtherMessage = memo((props) => {
    const db = useContext(LocalDatabaseContext);
    const [avatar, setAvatar] = useState('');
    const [nickname, setNickname] = useState('');
    
    useEffect(() => {
        const sender = props.data.sender; // userId
        
        if (db) {
            db.Users.getUserInfo(sender).then((info) => {
                setAvatar(info.avatar);
                setNickname(info.nickname);
            })
        }
    }, [db, props.data, props.data.sender]);

    return (
        <div className='flex relative pr-[20%] py-2 items-center'
             key={props.data.id}>
            <Avatar className="w-[50px] h-[50px] rounded-lg border-2 border-[#7C7979] object-cover self-start"
                    src={avatar} alt={nickname} title={nickname} />
            <div className='flex flex-col justify-center items-center
            ml-[18px] px-[8px] py-[4px] min-w-[10px] min-h-[40px]
            border-[1px] border-[#7C7979] bg-[#D9D9D9] rounded-sm
            after:origin-center after:rotate-45 after:absolute
            after:left-[61px] after:top-[25px] after:w-[16px] after:h-[16px] after:rounded-bl-sm
            after:bg-gradient-to-tr from-[#D9D9D9] from-50% to-transparent to-0%
            after:bg-origin-border
            after:border-b-[#7C7979] after:border-b-[1px]
            after:border-l-[#7C7979] after:border-l-[1px]
            after:border-t-transparent after:border-t-[1px]
            after:border-r-transparent after:border-r-[1px]'>
                {renderValue(props.data)}
            </div>
        </div>
    )
});

const ChatMessage = memo((props) => {
    if (!props.data) {
        throw new Error('<ChatMessage> need param of `data`')
    }

    const sender = props.data.sender;
    const userInfo = useSelector(selectInfo);
    if (sender === userInfo.userId) {
        return <MyMessage data={props.data} userInfo={userInfo} />
    } else {
        return <OtherMessage data={props.data} />
    }
})

export default ChatMessage;
