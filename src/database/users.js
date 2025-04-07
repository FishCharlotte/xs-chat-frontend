import { getInfoById } from "api/users";

class UsersDb {
    localDb = null;

    constructor(localDb) {
        this.localDb = localDb;
    }

    /**
     * @description 获取指定用户ID的用户信息（优先使用本地数据库缓存）
     * @param {Number} userId 用户ID
     * @param {Boolean} force 是否强制从服务器拉取用户信息，默认为 false
     * @return {Promise<*|null>}
     */
    async getUserInfo(userId, force = false) {
        if (!force) {
            // 优先从本地数据库缓存的信息查询
            const { value: info } = await this.localDb.get('Users', userId);

            // 找到了就直接返回
            if (info) return info;
        }

        // 从网络查询
        const info = await getInfoById(userId);
        if (!info) return null;

        // 缓存最新的结果到数据库
        await this.localDb.put('Users', {
            avatar: info.avatar,
            nickname: info.nickname,
            userId: info.userId,
            username: info.username
        });

        return info;
    }
}

export default UsersDb;
