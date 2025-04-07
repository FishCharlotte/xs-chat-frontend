import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { search } from "api/users";
import { add as addFriend } from "api/friends";

import { IconSearch } from "components/Common/Icons";
import Avatar from "components/Common/Avatar";
import ButtonMotion from "components/Common/ButtonMotion";
import { LocalDatabaseContext } from "components/Context/Context";

import { fetchFriends, fetchInvitations, selectInviters } from "store/reducers/friendsSlice";

// TODO: 现在是对方通过了好友申请后，不会刷新好友列表。
const FriendInvitationSend = () => {
    const [isSearched, setIsSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const dispatch = useDispatch();
    const db = useContext(LocalDatabaseContext);
    const inviters = useSelector(selectInviters);

    // TODO: 用socket通知好友申请结果
    // TODO: 是否需要每次切换都触发？
    // 获取最新的好友邀请列表并更新状态
    useEffect(() => {
        if (db) {
            console.log("获取好友申请列表")
            dispatch(fetchInvitations())
            // TODO: 在这里添加好友列表刷新就好了，但是！很消耗性能，感觉要加上socket？
            dispatch(fetchFriends(db));
        }
    }, [db, dispatch]);

    /**
     * @description 搜索用户，用于加好友
     * @param e 点击事件
     */
    const onSearch = (e) => {
        e.preventDefault();

        const params = new FormData(e.target);
        const keyword = params.get('keyword');
        search(keyword).then(data => {
            setSearchResults(data);
            setIsSearched(true);
            console.log('onSearch', data)
        }).catch(e => {
            console.error('onSearch', e.message)
        })
    }

    /**
     * @description 添加新的好友
     * @param friendId
     */
    const onAddFriend = (friendId) => {
        const invitationContent = prompt('请填写请求好友的留言，可以留空');
        console.log(friendId, invitationContent);

        addFriend(friendId, invitationContent).then(data => {
            console.log(data);
            dispatch(fetchInvitations());
        }).catch(e => {
            console.error(e.message)
        })
    }

    return (
        <div>
            <div>
                <form onSubmit={onSearch} className='relative h-[46px] mb-2'>
                    <input type="text" name="keyword" placeholder='keyword' required className='w-full h-full rounded-[3px] px-3 focus:outline-none'/>
                    <button type='submit' className='absolute right-0 px-3 h-full'>
                        <IconSearch />
                    </button>
                </form>

                {
                    isSearched && (
                        <div>
                            {
                                searchResults.length > 0 ? (
                                    <ul>
                                        {
                                            searchResults.map(item => (
                                                <li className='flex bg-white h-[60px] mb-[10px] rounded-md items-center pl-[20px]'
                                                    key={'search-item-' + item.id}>
                                                    <Avatar src={item.avatar}
                                                            className="w-[50px] h-[50px] rounded-lg border-2 border-[#7C7979] object-cover"
                                                            alt={item.nickname} />
                                                    <div className='flex flex-col flex-1 mx-[18px]'>
                                                        <p style={{
                                                            textDecoration: 'underline',
                                                            textDecorationThickness: '0.7em',
                                                            textDecorationColor: 'rgba(221, 215, 207, 1)',
                                                            textUnderlineOffset: '-0.4em',
                                                            textDecorationSkipInk: 'none', }}>
                                                            {item.nickname}
                                                        </p>
                                                        <p className='text-slate-400 drop-shadow-xl'>
                                                            @{item.username}
                                                        </p>
                                                    </div>
                                                    <ButtonMotion text='Make friends!'
                                                                  onClick={() => {onAddFriend(item.id)}}
                                                                  width={135}
                                                                  height={38}
                                                                  marginX={[0, 6]}
                                                    />
                                                </li>
                                            ))
                                        }
                                    </ul>
                                ) : (
                                    <div>
                                        没有搜索结果
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
            <ul>
                {
                    inviters.length > 0 && inviters.map(v => (
                        <li className='flex bg-white h-[60px] mb-[10px] last-of-type:mb-0 rounded-md items-center pl-[20px]'
                            id={v.invitation.invitationId}
                            key={'invitations-' + v.invitation.invitationId}>
                            <Avatar src={v.avatar}
                                    className="w-[50px] h-[50px] rounded-lg border-2 border-[#7C7979] object-cover"
                                    alt={v.nickname} />
                            <p className='flex-1 mx-[18px]'>
                                {v.nickname}
                            </p>
                            <div className='px-3 flex flex-col items-end'>
                                <p style={{
                                    textDecoration: 'underline',
                                    textDecorationThickness: '0.7em',
                                    textDecorationColor: 'rgba(221, 215, 207, 1)',
                                    textUnderlineOffset: '-0.4em',
                                    textDecorationSkipInk: 'none', }}>
                                    {v.invitation.status}
                                </p>
                                <p>
                                    {new Date(v.invitation.updatedAt).getFullYear()}/{(new Date(v.invitation.updatedAt).getMonth() + 1).toString().padStart(2, '0')}
                                </p>
                            </div>
                        </li>
                    ))
                }
                {
                !inviters.length && (
                        <div>我没有发起好友邀请</div>
                    )
                }
            </ul>
        </div>
    )
}

export default FriendInvitationSend;