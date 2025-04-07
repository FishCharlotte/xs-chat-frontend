import * as requests from "./request";
import {BadRequestError} from "./errors";


/**
 * @description 登录
 * @param username 用户名
 * @param password 密码
 * @return {Promise<{result}>}
 */
export const login = async (username, password) => {
    const param = {
        username: username,
        password: password,
    };
    const resp = await requests.post('users/login', param);
    return resp.data;
};

/**
 * @description 注册
 * @param username 用户名
 * @param nickname 昵称
 * @param password 密码
 * @return {Promise<*>}
 */
export const register = async (username, nickname, password) => {
    const param = {
        username: username,
        nickname: nickname,
        password: password,
    };
    const resp = await requests.post('users/register', param);
    return resp.data;
}

/**
 * @description 获取当前用户的信息
 * @return {Promise<*>}
 */
export const getInfo = async () => {
    const resp = await requests.get('users');
    return resp.data;
}


/**
 * @description 通过输入的userId获取用户信息
 * @param userId
 * @return {Promise<*>}
 */
export const getInfoById = async (userId) => {
    const resp = await requests.get('users/' + userId);
    return resp.data;
}

/**
 * @description 根据用户名搜索好友
 * @param keyword
 * @return {Promise<*>}
 */
export const search = async (keyword) => {
    const resp = await requests.get('users/search?keyword=' + encodeURIComponent(keyword)); // urlEncode
    return resp.data;
}

/**
 * @description 修改用户信息
 * @param {Object} newData 信息内容
 * @param {String} index 信息标签
 * @return {Promise<*>}
 */
export const modifyInfo = async (newData, index) => {
    let resp;
    switch (index) {
        case 'username':
            resp = await requests.put('users', newData);
            break;
        case 'nickname':
            resp = await requests.put('users', newData);
            break;
        case 'avatar':
            break;
        case 'password' :
            break
        default:
            throw new BadRequestError('待修改的内容类型不正确');
    }
    return resp.data;
}

/**
 * @description 登出
 * @return {Promise<*>}
 */
export const logout = async () => {
    const resp = await requests.get('users/logout');
    return resp;
}
