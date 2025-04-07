import {useContext, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";

import {
    fetchInvitations,
    selectInvitees,
    updateFriendInvitation
} from "store/reducers/friendsSlice";

import {LocalDatabaseContext} from "components/Context/Context";
import ButtonMotion from "components/Common/ButtonMotion";
import Avatar from "components/Common/Avatar";

const FriendInvitationReceived = () => {
    // const { invitees, onRefreshInvitationList, onRefreshFriendsList } = props;
    const invitees = useSelector(selectInvitees);
    const dispatch = useDispatch();
    const db = useContext(LocalDatabaseContext);

    // TODO: 是否需要每次切换都触发？
    // 获取最新的好友邀请列表并更新状态
    useEffect(() => {
        console.log("获取发送好友申请列表")
        dispatch(fetchInvitations());
    }, [db, dispatch])

    /**
     * @description 同意好友邀请
     * @param id 好友邀请ID
     */
    const onAgreeInvitation = (id) => {
        dispatch(updateFriendInvitation(db, id, 'accepted'));
    }

    /**
     * @description 拒绝好友邀请
     * @param id 好友邀请ID
     */
    const onRejectInvitation = (id) => {
        dispatch(updateFriendInvitation(db, id, 'rejected'));
    }

    return (
        <div>
            <ul>
                {
                    invitees.length > 0 && invitees.map(v => (
                        <li className='flex bg-white h-[60px] focus:h-auto mb-[10px] last-of-type:mb-0 rounded-md items-center pl-[20px]'
                            id={v.invitation.invitationId}
                            key={'invitations-' + v.invitation.invitationId}>
                            <Avatar src={v.avatar}
                                    className="w-[50px] h-[50px] rounded-lg border-2 border-[#7C7979] object-cover"
                                    alt={v.nickname} />
                            <div className='mx-[18px]'>
                                {v.nickname}
                            </div>
                            <div className='flex-1 line-clamp-2 pr-2 text-slate-400 mr-2'>
                                {v.invitation.requestContent}
                            </div>
                            <div>
                                {
                                    v.invitation.status === 'waiting' ? (
                                        <div className='flex pt-2'>
                                            <ButtonMotion text='Agree'
                                                          onClick={() => onAgreeInvitation(v.invitation.invitationId)}
                                                          width={60} height={28} marginX={[0, 8]} paddingY={[0, 0]}
                                            />
                                            <ButtonMotion text='Reject'
                                                          onClick={() => onRejectInvitation(v.invitation.invitationId)}
                                                          width={60} height={28} marginX={[0, 8]} paddingY={[0, 0]}
                                            />
                                        </div>
                                    ) : (
                                        <div className='mr-2'
                                             style={{
                                                 textDecoration: 'underline',
                                                 textDecorationThickness: '0.7em',
                                                 textDecorationColor: 'rgba(221, 215, 207, 1)',
                                                 textUnderlineOffset: '-0.4em',
                                                 textDecorationSkipInk: 'none', }}>
                                            {v.invitation.status}
                                        </div>
                                    )
                                }
                                <div className='text-end pt-1 mr-2'>
                                    {new Date(v.invitation.updatedAt).getFullYear()}/{(new Date(v.invitation.updatedAt).getMonth() + 1).toString().padStart(2, '0')}
                                </div>
                            </div>
                        </li>
                    ))
                }
                {
                    !invitees.length && (
                        <div>暂时还没收到好友邀请</div>
                    )
                }
            </ul>
        </div>
    )
}

export default FriendInvitationReceived;