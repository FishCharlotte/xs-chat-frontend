import { useState, useContext, useEffect } from "react";
import { Scrollbar } from 'react-scrollbars-custom';
import { useDispatch } from "react-redux";

import { LocalDatabaseContext } from 'components/Context/Context';
import Avatar from "components/Common/Avatar";

import {
    switchDialog,
} from "store/reducers/dialogSlice";

export const ChatList = () => {
    const [ chatList, setChatList ] = useState([]);
    const db = useContext(LocalDatabaseContext);

    const dispatch = useDispatch();

    useEffect(() => {
        if (db) {
            db.Chats.getDialogList().then(resp => {
                setChatList(resp);
            })
        }
    }, [db])

    return (
        <Scrollbar className='h-full'>
            <ul>
                {
                    chatList.map((item, index) => {
                        return (
                            <li
                                key={item.key}
                                onClick={() => {
                                    dispatch(switchDialog(db, item.key));
                                }}
                                className='border-t-[1px] border-[#8F8383] pl-[16px] py-[10px] bg-[#DDD7CF] hover:bg-[#C1B9AC] flex'>
                                <Avatar src={item.avatar}
                                        className="w-[50px] h-[50px] rounded-lg border-2 border-[#7C7979] object-cover"
                                        alt=''/>
                                <div className='ml-[15px] w-[calc(100%-80px)]'>
                                    <p className='truncate'>
                                        {item.name}
                                    </p>
                                    <p className='text-[#656565] truncate'>
                                        {item.msg}
                                    </p>
                                </div>
                            </li>
                    )
                    })
                }
            </ul>
        </Scrollbar>
    )
}

