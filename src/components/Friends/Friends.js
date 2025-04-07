import { useState } from "react";

import FriendList from "./FriendList";
import FriendInvitationSend from "./FriendInvitationSend";
import FriendInvitationReceived from "./FriendInvitationReceived";

const Friends = () => {
    const [actions, setActions] = useState('list');

    const renderContent = () => {
        switch (actions) {
            case 'list':
                return <FriendList />
            case 'send':
                return <FriendInvitationSend />
            case 'received':
                return <FriendInvitationReceived />
            default:
                return <div></div>;
        }
    };

    return (
        <div className='h-full w-full flex flex-col justify-end relative'>
            <div className='absolute bottom-[calc(80%-2px)]'>
                <div className='w-full h-full'>
                    <button
                        onClick={() => setActions('list')}
                        className={`border-t-border border-t-[2px] border-r-[2px] border-l-[2px] rounded-t-xl ml-[48px] mr-[20px] py-[8px] px-[16px] bg-[#DDD7CF]
                                    hover:shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]
                                    active:shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]
                                    focus:shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]
                                    transition ease-in-out duration-300
                    ${actions === 'list' ? 'shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]' : ''}`}>
                        好友
                    </button>
                    <button
                        onClick={() => setActions('send')}
                        className={`border-border border-t-[2px] border-r-[2px] border-l-[2px] rounded-t-xl mr-[20px] py-[8px] px-[16px] bg-[#DDD7CF]
                                    hover:shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]
                                    active:shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]
                                    focus:shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]
                                    transition ease-in-out duration-300
                    ${actions === 'send' ? 'shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]' : ''}`}>
                        发出的申请
                    </button>
                    <button
                        onClick={() => setActions('received')}
                        className={`border-border border-t-[2px] border-r-[2px] border-l-[2px] rounded-t-xl py-[8px] px-[16px] bg-[#DDD7CF]
                                    hover:shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]
                                    active:shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]
                                    focus:shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]
                                    transition ease-in-out duration-300
                        ${actions === 'received' ? 'shadow-[3px_-4px_3px_0_rgba(0,0,0,0.25)]' : ''}`}>
                        收到的申请
                    </button>
                </div>
            </div>
            <div className='w-full h-[calc(80%)] border-t-[2px] mt-[-1px] bg-[#DDD7CF] px-[66px] py-[45px]'>
                {renderContent()}
            </div>
        </div>

    )
}
export default Friends;