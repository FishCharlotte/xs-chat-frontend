import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { fetchAndSetUserInfo, logOut, selectInfo, selectIsNeededLogIn } from "store/reducers/myUserSlice";

import { Icon4GNetwork, IconFullSignal, IconLogout } from "components/Common/Icons";
import {
    SocketContext,
    LocalDatabaseContext,
} from 'components/Context/Context';

import ChatCatalog from "components/Chat/ChatCatalog";
import ChatDialog from "components/Chat/ChatDialog";
import Me from "components/Me/Me";
import Friends from "components/Friends/Friends";

import useLocalDatabase from "hooks/db";
import useSocket from 'hooks/socket';

import { selectCurrentMenu } from "store/reducers/uiSlice";

// TODO: 验证是否是好友，是好友才能聊天！
function Chat() {
    const isNeededLogIn = useSelector(selectIsNeededLogIn);
    const userInfo = useSelector(selectInfo);
    const currentMenu = useSelector(selectCurrentMenu);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const db = useLocalDatabase(userInfo.userId);
    const socket = useSocket(db);

    useEffect(() => {
        if (db && userInfo) {
            db.put('Users', userInfo).then(({ key, value }) => {
                console.log('save userInfo: ', value, 'key: ', key)
            }).catch(e => {
                console.log('save userInfo error: ', e)
            })
        }
    }, [db, userInfo]);


    // 初始化用户信息
    useEffect(() => {
        dispatch(fetchAndSetUserInfo())
    }, [dispatch]);

    // 未登录时跳转到登录页面
    useEffect(() => {
        if (isNeededLogIn) {
            navigate("/login");
        }
    }, [isNeededLogIn, navigate]);

    const renderContent = () => {
        switch (currentMenu) {
            case 'chat':
                return <ChatDialog />;
            case 'friends':
                return <Friends />;
            case 'me':
                return <Me />;
            default:
                return <div></div>;
        }
    };

    return (
        <LocalDatabaseContext.Provider value={db}>
            <SocketContext.Provider value={socket}>
                <div className='w-[80%] max-w-[1800px] min-w-[calc(800px+12px)]
                                min-h-[400px] aspect-[9/7]
                                mx-auto border-[6px] border-solid border-border rounded-[8px]
                                overflow-hidden
                                shadow-[18px_16px_16px_2px_rgba(0,0,0,0.25)]
                                flex flex-col bg-[#E0DEE5]'>
                    <div className='w-full h-[60px] my-auto flex items-center pr-[15px]'>
                        <h1 className='flex-1 ml-[57px] pl-[2px] invisible '>xxschat</h1>
                        <button type="button" onClick={() => dispatch(logOut())}>
                            <IconLogout />
                        </button>
                    </div>
                    <div className='w-[100%] h-[calc(100%-95px)] flex'>
                        <div className='w-[57px] h-full'>
                            <ChatCatalog />
                        </div>

                        <div className='w-[calc(100%-57px-57px)] h-full bg-white
                                        border-t-[3px] border-l-[2px] border-r-[2px] border-b-[2px] border-solid border-border'>
                            {renderContent()}
                        </div>

                        <div className='w-[57px] h-full'>
                        </div>
                    </div>

                    <div className='w-full h-[35px] flex shrink-0 items-center justify-end pr-[58px]'>
                        <div className='mr-2'>
                            <IconFullSignal/>
                        </div>
                        <div>
                            <Icon4GNetwork/>
                        </div>
                    </div>
                </div>
            </SocketContext.Provider>
        </LocalDatabaseContext.Provider>
    );
}

export default Chat