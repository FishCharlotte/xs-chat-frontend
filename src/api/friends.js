import * as requests from "./request";

/**
 * @description 获取当前用户所有好友的列表
 * @return {Promise<*>}
 */
export const getList = async () => {
    const resp = await requests.get('friends');
    return resp.data;
}

/**
 * @description 当前用户申请添加其他用户好友
 * @param friendId 目标好友的用户ID
 * @param invitationContent 邀请内容
 * @return {Promise<*>}
 */
export const add = async (friendId, invitationContent) => {
    const params = {
        friendId, invitationContent
    };
    const resp = await requests.post('friends', params);
    return resp.data;
}

/**
 * @description 当前用户删除指定用户好友
 * @param friendId 待删除好友的用户ID
 * @return {Promise<*>}
 */
export const remove = async (friendId) => {
    const resp = await requests.del('friends/' + friendId);
    return resp.data;
}

/**
 * @description 获取所有好友邀请的列表
 * @return {Promise<*>}
 */
export const getInvitationList = async () => {
    const resp = await requests.get('friends/invitation');
    return resp.data;
}

/**
 * @description 处理好友邀请
 * @param invitationId 好友邀请ID
 * @param status {string} 邀请结果：accepted / rejected
 * @return {Promise<*>}
 */
export const updateInvitation = async (invitationId, status) => {
    const params = {
        invitationId, status
    };
    const resp = await requests.put('friends/invitation', params);
    return resp.data;
}

