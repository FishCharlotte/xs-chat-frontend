import { useContext, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion"

import { useDispatch, useSelector } from "react-redux";

import { remove } from "api/friends";
import { LocalDatabaseContext } from 'components/Context/Context';


import Avatar from "components/Common/Avatar";
import { IconDelete } from "components/Common/Icons";
import Modal from "components/Common/Modal";

import { switchDialog } from "store/reducers/dialogSlice";

import { fetchFriends,
    loadFriends,
    selectNeedInit,
    setNeedInit,
    selectFriendsList
} from "store/reducers/friendsSlice";
import { useClickOutside } from "hooks/clickOutside";

// TODO: 登录的时候必须要拉取一次好友列表
const FriendList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const modalRef = useRef();
    const delRefs = useRef({});

    const dispatch = useDispatch();
    const db = useContext(LocalDatabaseContext);
    const friends = useSelector(selectFriendsList);
    const isNeedInit = useSelector(selectNeedInit);

    // 第一次加载的时候加载好友列表
    useEffect(() => {
        if (db && isNeedInit) {
            console.log("登录拉取好友")
            dispatch(fetchFriends(db));
            dispatch(setNeedInit(false));
        }
    }, [db, dispatch, isNeedInit])

    // 从DB内拉取好友列表
    useEffect(() => {
        if (db && !isNeedInit) {
            dispatch(loadFriends(db));
        }
    }, [db, dispatch, isNeedInit]);

    useClickOutside(modalRef, () => {
        console.log('click outside');
        setIsModalOpen(false);
    });


    /**
     * @description 删除好友
     * @param friendId 好友的用户ID
     * @param nickname 好友的昵称（仅用于展示是否删除弹窗）
     */
    const onRemoveFriend = (friendId, nickname) => {
        // TODO: 最后这部分可以删掉
        if (window.confirm(`您真的要删除好友【${nickname}】吗?`)) {
            remove(friendId).then(data => {
                console.log('remove', data);
                // TODO: 重新拉取好友列表
                dispatch(fetchFriends(db));
            }).catch(e => {
                console.error('remove', e.message)
            })
        }
    }

    const onConfirm = (e) => {
        if (selectedFriend !== null) {
            onRemoveFriend(selectedFriend.userId, selectedFriend.nickname);
        }
        setIsModalOpen(false);
    };

    const onOpenModal = (event, v) => {
        setIsModalOpen(true);
        setSelectedFriend(v);
        // TODO: 这里设置弹窗的开始位置
        // const triggerBBox = delRefs.current[v.userId]?.getBoundingClientRect();
    }

    const handleNewChatObject = async (e) => {
        // e.preventDefault();  只在表单提交的时候才需要阻止页面跳转
        // e.stopPropagation(); // TODO: 理解这两个的差别

        if (!db) {
            return console.error('[FriendList] handleNewChatObject: db is empty!', db);
        }

        const recipientType = 1;  // 1 -> 私聊
        const recipient = parseInt(e.currentTarget.id);

        // 检查数据库内是否存在对话
        // 若不存在则创建对话
        const key = `${recipientType}-${recipient}`;

        // 跳转对话界面
        dispatch(switchDialog(db, key));
    }

    return (
        <div>
            {
                isModalOpen && (

                    <Modal
                        onConfirm={onConfirm}
                        onCancel={() => setIsModalOpen(false)}
                    >
                        <div className='flex flex-col items-center'>
                            <p>你确定要删除好友?</p>
                            <p style={{
                                display: 'inline',
                                textDecoration: 'underline',
                                textDecorationThickness: '0.7em',
                                textDecorationColor: 'rgba(221, 215, 207, 1)',
                                textUnderlineOffset: '-0.4em',
                                textDecorationSkipInk: 'none',
                            }}>
                                {selectedFriend?.nickname}
                            </p>
                        </div>
                    </Modal>
                )
            }
            <div>
                <ul className='flex flex-wrap justify-between'>
                    {
                        friends.length > 0 && friends.map(v => (
                            <li className='flex w-[calc(50%-5px)] bg-white rounded-md h-[60px] items-center pl-[20px] mb-[10px] last-of-type:mb-0
                            max-[900px]:w-full  hover:shadow-lg transition ease-in-out duration-150'
                                key={'friends-' + v.userId}
                                id={v.userId}
                                onDoubleClick={handleNewChatObject}>
                                <Avatar src={v.avatar}
                                        className="w-[50px] h-[50px] rounded-lg border-2 border-[#7C7979] object-cover"
                                        alt={v.nickname} />
                                <div className='flex-1 mx-[18px]'>
                                    <p>
                                        {v.nickname}
                                    </p>
                                </div>
                                <div className='mr-2 mb-8'>
                                    <button className="modal-trigger"
                                            ref={(element) => {
                                                if (element !== null) {
                                                    delRefs.current[v.userId] = element
                                                }
                                            }}
                                            onClick={(event) => onOpenModal(event, v)}>
                                        <IconDelete/>
                                    </button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                {
                    !friends.length && (
                        <div>我没有好友</div>
                    )
                }
            </div>
        </div>
    )
}

export default FriendList;