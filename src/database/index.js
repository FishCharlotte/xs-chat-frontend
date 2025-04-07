import ChatsDb from "./chats";
import UsersDb from "./users";

class LocalDatabase {
    db = null;
    Chats = new ChatsDb(this);
    Users = new UsersDb(this);

    constructor(userId, onSuccess) {
        this.databaseName = 'xxschat-' + userId;

        const request = window.indexedDB.open(this.databaseName, 3);
        request.onerror = (e) => {
            console.error("open DB failed: ", e);
        };

        request.onsuccess = () => {
            this.db = request.result;

            if (this.db) {
                if (onSuccess) {
                    onSuccess(this.db);
                }

                this.db.onerror = (event) => {
                    // 针对此数据库请求的所有错误的通用错误处理器！
                    console.error(`数据库错误：${event.target.errorCode}`);
                };
            }
        };

        // 该事件仅在最新的浏览器中实现
        request.onupgradeneeded = (event) => {
            // 保存 IDBDatabase 接口
            const db = event.target.result;

            // Table: Users
            // - userId -> keyPath, unique = true
            // - nickname -> index, unique = false
            // - username -> index, unique = true
            // - avatar

            const usersStore = db.createObjectStore("Users", { keyPath: "userId" });
            usersStore.createIndex("nickname", "nickname", { unique: false });
            usersStore.createIndex("username", "username", { unique: true });

            // Table: Friends
            // - id -> keyPath, unique = true
            // - userId -> index, unique = false
            // - friendId -> index, unique = false

            const friendsStore = db.createObjectStore("Friends", { keyPath: "id", autoIncrement: true });
            friendsStore.createIndex("userId", "userId", { unique: false });
            friendsStore.createIndex("friendId", "friendId", { unique: false });

            // Table: Chats
            // - id -> keyPath, unique = true
            // - recipientType: index-A, unique = true // 1 私聊 2 群聊
            // - recipient: index-A, unique = true // recipientType == 1 的时候是 userId，recipientType == 2 的时候是 groupId
            // - latestMessage:
            // - updatedAt

            const chatsStore = db.createObjectStore("Chats", { keyPath: "id", autoIncrement: true });
            chatsStore.createIndex("recipient", ["recipientType", "recipient"], { unique: true });

            // Table: Groups
            // - id -> keyPath, unique = true
            // - name -> index, unique = false
            // - handle -> index, unique = true

            const groupsStore = db.createObjectStore("Groups", { keyPath: "id" });
            groupsStore.createIndex("name", "name", { unique: false });
            groupsStore.createIndex("handle", "handle", { unique: true });

            // Table: Messages
            // - id -> keyPath, unique = true
            // - msgId -> index, unique = true
            // - type -> index
            // - value -> index
            // - sender -> index
            // - chatId -> index
            // - time -> index

            const messagesStore = db.createObjectStore("Messages", { keyPath: "id", autoIncrement: true });
            messagesStore.createIndex("msgId", "msgId", { unique: false });
            messagesStore.createIndex("chatId_id", ["chatId", "id"], { unique: false });
            messagesStore.createIndex("type", ["chatId", "type"], { unique: false });
            messagesStore.createIndex("value", ["chatId", "value"], { unique: false });
            messagesStore.createIndex("sender", ["chatId", "sender"], { unique: false });
            messagesStore.createIndex("chatId", "chatId", { unique: false });
            messagesStore.createIndex("time", ["chatId", "time"], { unique: false });
        };

    };

    /**
     * @description 根据关键词从indexedDB内搜索
     * @param tableName 指定的数据表名
     * @param key 搜索的匹配词
     * @param index 搜索的索引。若无提供，则按照key Path查询
     * @return {Promise<unknown>}
     */
    get(tableName, key, index) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);
            let request;

            if (index) {
                const myIndex = objectStore.index(index);
                request = myIndex.get(key);
            } else {
                request = objectStore.get(key);
            }

            request.onsuccess = (event) => {
                const value = event.target.result;
                resolve({
                    key, value
                });
            }

            request.onerror = (e) => {
                console.error('get::request::error', e);
                reject(e)
            }
        })
    }

    /**
     * @description 查询指定的表中某一索引的特定记录
     * @param tableName 表名
     * @param key 索引值
     * @param index 索引名
     * @return {Promise<boolean>}
     */
    async has(tableName, key, index) {
        const res = await this.get(tableName, key, index);
        return res.value !== undefined
    }

    /**
     * @description 根据关键词从indexedDB内搜索多条匹配结果
     * @param tableName 指定的数据表名
     * @param key 搜索的匹配词
     * @param count 要指定的搜索的记录数
     * @param index 搜索的索引。若无提供，则按照key Path查询
     * @return {Promise<unknown>}
     */
    getAllMatchingRecords(tableName, key, count, index) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'readonly');
            const objectStore = transaction.objectStore(tableName);
            let request;

            if (index) {
                const myIndex = objectStore.index(index);
                request = myIndex.getAll(key, count);
            } else {
                request = objectStore.getAll(key, count);
            }

            request.onsuccess = (event) => {
                const value = event.target.result;
                resolve({
                    key, value
                });
            }

            request.onerror = (e) => {
                console.error('getAllMatchingRecords::request::error', e);
                reject(e)
            }
        })
    }


    getAllRecords(tableName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(tableName, "readonly");
            const objectStore = transaction.objectStore(tableName);
            const request = objectStore.openCursor();

            const data = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    data.push(cursor.value)
                    cursor.continue();
                } else {
                    resolve(data);
                }
            };
            request.onerror = (e) => {
                console.error('getAllRecords::request::error', e);
                reject(e);
            }
        })
    }

    /**
     * @description 获取聊天记录当中从新到旧的指定数量的Msg
     * @param tableName
     * @param key 待搜索的值
     * @param index 待搜索的索引，“键”
     * @param limit 加载前N条
     * @return {Promise<unknown>}
     */
    getPrevMsg(tableName, key, limit, index) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(tableName, "readonly");
            const objectStore = transaction.objectStore(tableName);
            let request;
            const messages = [];
            let count = 0;

            if (index) {
                const myIndex = objectStore.index(index);
                request = myIndex.openCursor(IDBKeyRange.only(key), 'prev')
            } else {
                request = objectStore.openCursor(IDBKeyRange.only(key), 'prev');
            }

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && count < limit) {
                    messages.push(cursor.value);
                    count++;
                    cursor.continue();
                } else {
                    resolve(messages);
                }


            };
            request.onerror = (e) => {
                console.error('getLatestMsg::request::error', e);
                reject(e);
            }
        })
    }

    /**
     * @description 获取当前消息的前N条消息
     * @param tableName
     * @param n 获取条数
     * @param chatId 对话的Id
     * @param startId 开始检索的本地消息ID
     * @param index 待搜索的索引
     */
    getNPrevMsg(tableName, n, chatId, startId, index) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(tableName, "readonly");
            const objectStore = transaction.objectStore(tableName);

            const myIndex = objectStore.index(index);
            const keyRangeValue = IDBKeyRange.bound(
                [chatId],
                [chatId, startId],
                false, true);
            const request = myIndex.openCursor(keyRangeValue, 'prev');

            let count = 0;
            const result = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (count < n) {
                        result.unshift(cursor.value);
                        count++;
                        return cursor.continue();
                    }
                }
                resolve(result);
            };

            request.onerror = (e) => {
                console.error('getNPrevMsg::request::error', e);
                reject(e);
            }
        })
    }

    getLatestMsg(tableName, chatId, startId, index) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(tableName, "readonly");
            const objectStore = transaction.objectStore(tableName);

            const myIndex = objectStore.index(index);
            const keyRangeValue = IDBKeyRange.bound(
                [chatId, startId],
                [chatId, Infinity],
                true, true);
            const request = myIndex.openCursor(keyRangeValue, 'next');

            const result = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    result.push(cursor.value);
                    return cursor.continue();
                }
                resolve(result);
            };

            request.onerror = (e) => {
                console.error('getLatestMsg::request::error', e);
                reject(e);
            }
        })
    }

    count(tableName, index, query) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(tableName, "readonly");
            const objectStore = transaction.objectStore(tableName);

            const myIndex = objectStore.index(index);
            const request = myIndex.count(query);

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (e) => {
                console.error('count::request::error', e);
                reject(e);
            }
        })
    }

    /**
     * @description 获取index下标开始的聊天内容
     * @param tableName
     * @param key
     * @param start
     * @param end
     * @param index
     * @return {Promise<unknown>}
     */
    getIndexMsg(tableName, key, start, end, index) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(tableName, "readonly");
            const objectStore = transaction.objectStore(tableName);

            let request;
            const messages = [];
            let count = 0;

            if (index) {
                const myIndex = objectStore.index(index);
                request = myIndex.openCursor(IDBKeyRange.only(key), 'prev')
            } else {
                request = objectStore.openCursor(IDBKeyRange.only(key), 'prev');
            }

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (count >= start && count < end) {
                        messages.push(cursor.value);
                        count++;
                        cursor.continue();
                    } else {
                        count++;
                        cursor.continue();
                    }
                } else {
                    resolve(messages);
                }


            };
            request.onerror = (e) => {
                console.error('getLatestMsg::request::error', e);
                reject(e);
            }
        })
    }

    /**
     * @description 将数据存储到数据库内的某个表内
     * @param tableName 指定的数据表名
     * @param value 待存储的数据
     * @return {Promise<unknown>}
     */
    put(tableName, value) {
        return new Promise((resolve, reject) => {
            let key = null;
            const transaction = this.db.transaction([tableName], 'readwrite');
            transaction.oncomplete = () => {
                resolve({
                    key, value
                });
            }

            transaction.onerror = (e) => {
                console.error('put::transaction::error', e);
                reject(e)
            }

            const objectStore = transaction.objectStore(tableName);
            const request = objectStore.put(value);
            request.onsuccess = (event) => {
                key = event.target.result;
                console.log("put::request::onsuccess", tableName, value, key);
            }
        })
    }

    /**
     * @description 将数据库内的某个表内的指定数据更新
     * @param tableName 指定的数据表名
     * @param key 搜索的匹配词
     * @param values 待更新的数据
     * @return {Promise<unknown>}
     */
    update(tableName, key, values) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'readwrite');
            transaction.oncomplete = () => {
                console.info('update transaction.oncomplete');
                resolve();
            }

            transaction.onerror = (e) => {
                console.error(e);
                reject(e)
            }

            const objectStore = transaction.objectStore(tableName);
            const request = objectStore.get(key);

            request.onsuccess = ()=> {
                const record = request.result;
                for (const col in values) {
                    record[col] = values[col];
                }
                objectStore.put(record);
            }
        })
    }

    /**
     * @description 根据关键词从indexedDB内删除
     * @param tableName 指定的数据表名
     * @param key 搜索的匹配词
     * @return {Promise<unknown>}
     */
    remove(tableName, key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'readwrite');
            transaction.oncomplete = () => {
                resolve();
            }

            transaction.onerror = (e) => {
                console.error(e);
                reject(e)
            }

            const objectStore = transaction.objectStore(tableName);
            const request = objectStore.delete(key);

            request.onsuccess = ()=> {
                console.log('remove::request::success');
            }
        })
    }

    /**
     * @description 将好友列表重新刷新
     * @param tableName
     * @param {Array} values
     * @return {Promise<unknown>}
     */

    refresh(tableName, values) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([tableName], 'readwrite');
            const objectStore = transaction.objectStore(tableName);

            transaction.oncomplete = () => {
                resolve({
                    values
                });
            }

            transaction.onerror = (e) => {
                console.error('put::transaction::error', e);
                reject(e)
            }

            const clearRequest = objectStore.clear();
            clearRequest.onsuccess = (event) => {
                for (let value of values) {
                    const addRequest = objectStore.put(value);
                    addRequest.onerror = (e) => {
                        console.error('refresh::addRequest::error', e);
                        reject(e)
                    }
                }
            }

            clearRequest.onerror = (e) => {
                console.error('refresh::clearRequest::error', e);
                reject(e)
            }
        })
    }
}

export default LocalDatabase;
