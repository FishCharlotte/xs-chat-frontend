import { getInfoById } from 'api/users';

class ChatsDb {
    localDb = null;

    constructor(localDb) {
        this.localDb = localDb;
    }

    async getDialogInfo(key) {
        const [recipientType, recipient] = key.split('-').map(item => parseInt(item));

        const { value } = await this.localDb.get('Chats', [recipientType, recipient], 'recipient');

        let chatId;
        if (value) {
            // 已存在的对话，则直接提取chatId
            chatId = value.id;
        } else {
            // 创建一个新的对话，并获取其chatId
            const resp = await this.localDb.put('Chats', {
                recipientType,
                recipient,
                latestMessage: '',
                updatedAt: 0,
            });
            chatId = resp.key;
        }

        //
        let name = '';
        switch (recipientType) {
            case 1: // 私聊
            {
                const { value } = await this.localDb.get('Users', recipient);
                if (value) {
                    name = value.nickname;
                }
                break;
            }
            case 2: // 群聊
            {
                const { value } = await this.localDb.get('Groups', recipient);
                if (value) {
                    name = value.name;
                }
                break;
            }
            default:
                throw new Error('Invalid recipient type');
        }

        return {
            chatId: chatId,
            name: name,
            recipientType: recipientType, // 1 私聊 2 群聊
            recipient: recipient, // recipientType == 1 的时候是 userId，recipientType == 2 的时候是 groupId
        }
    }

    /**
     * @description 获取聊天列表
     * @return {Promise<*[]>}
     */
    async getDialogList() {
        const data = [];
        const chats = await this.localDb.getAllRecords('Chats');

        for (const chat of chats) {
            const chatId = chat.id;

            if (chat.recipientType === 2) {
                // 群聊
                const { value: { name } = {} } = await this.localDb.get('Groups', chat.recipient);

                // TODO: 群聊在本地不存在的话也要从服务器拉
                data.push({
                    id: chatId,
                    key: `${chat.recipientType}-${chat.recipient}`,
                    name: name,
                    avatar: '', // TODO: 改成群头像
                    msg: chat.latestMessage || '',
                })
            } else if (chat.recipientType === 1) {
                // 私聊
                const info = await this.localDb.Users.getUserInfo(chat.recipient);

                data.push({
                    id: chatId,
                    key: `${chat.recipientType}-${chat.recipient}`,
                    name: info.nickname,
                    avatar: info.avatar,
                    msg: chat.latestMessage || '',
                })
            }
        }
        return data;
    }
}

export default ChatsDb;
