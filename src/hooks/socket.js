import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectInfo } from "store/reducers/myUserSlice";
import { loadLatestMessages, setShouldAppend } from 'store/reducers/messagesSlice';

const useSocket = (db) => {
    const [socket, setSocket] = useState(null);

    const userInfo = useSelector(selectInfo);
    const dispatch = useDispatch();

    useEffect(() => {
        // 确保db已初始化
        if (!db) {
            return;
        }

        const socketInstance = io();
        setSocket(socketInstance);

        socketInstance.on("connect_error", (err) => {
            console.log(`connect_error due to: ${err.message}`);
        });

        socketInstance.on("connect", () => {
            console.log('connection');
        });

        socketInstance.on("disconnect", () => {
            console.log('socket 断开了');
        });

        socketInstance.on("message", async (data) => {
            const msg = data.data;
            console.log('message::', socketInstance.id, data);

            let latestMessage;
            let msgContent; // 消息内容，存储到本地数据库
            switch (msg.type) {
                case "text":
                    latestMessage = msg.text.content;
                    msgContent = msg.text.content;
                    break;
                case "image":
                    latestMessage = '[image]';
                   break;
                case "voice":
                    latestMessage = '[voice]';
                    break;
                case "video":
                    latestMessage = '[video]';
                    break;
                case "file":
                    latestMessage = '[file]';
                    break;
                case "emotion":
                    latestMessage = '[emotion]';
                    break;
                case "userCard":
                    latestMessage = '[user card]';
                    break;
                default:
                    latestMessage = '[unknown message]';
            }

            // 寻找消息所属对话
            let dialogKey = `${msg.recipientType}-${msg.recipient}`;
            if (msg.recipientType === 1 && msg.recipient === userInfo.userId) {
                // 私聊接收方是自己的话，对话的目标应该是 sender
                dialogKey = `${msg.recipientType}-${msg.sender}`;
            }
            const chat = await db.Chats.getDialogInfo(dialogKey);
            const { chatId } = chat;
            await db.update('Chats', chatId, {
                latestMessage: latestMessage, // 消息
                updatedAt: msg.time, // 最新消息的时间
            })

            // 记录消息到本地的聊天数据表
            if (!await db.has('Messages', msg.id, 'msgId')) {
                await db.put('Messages',  {
                    chatId: chatId,
                    msgId: msg.id,
                    type: msg.type,
                    sender: msg.sender,
                    value: msgContent,
                    time: msg.time,
                });
            }

            // fixme 要当前对话的才触发这个逻辑，这个是为了让当前的对话获取更新的消息
            dispatch(loadLatestMessages(db, chatId, 'chatId_id', userInfo.userId));

            // todo 此处更新chats的最新消息 并通知渲染

            // 发送消息ack确认收到消息
            socketInstance.emit("message.read", msg.id, (resp) => {
                console.log(`${msg.id}已确认`)
            });
        });

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
                console.log('disconnect!');
            }
        }
    }, [db, dispatch, userInfo.userId]);

    // type {Number} 发送目标类型。1：私聊；2：群聊
    // target {Number} 发送目标。userId或groupId
    const sendMessage = async (chatId, type, recipient, content) => {

        // 产生一个本地消息ID
        const data = {
            chatId: chatId,
            msgId: null,
            type: 'text',
            sender: userInfo.userId,
            value: content,
            time: Date.now(),
        }

        // 记录本地的消息到本地的聊天数据表
        const { key } = await db.put('Messages', data);

        // 通知chatContent更新
        dispatch(setShouldAppend(true));

        return new Promise((resolve, reject) => {
            if (!socket) {
                return reject(new Error('socket must be init'))
            }
            if (!socket.connected) {
                return reject(new Error('socket is not connected'))
            }
            if (socket.disconnected) {
                return reject(new Error('socket is closed'))
            }

            try {
                socket.emit('send.message.text', type, recipient, content, (response) => {
                    // 更新本地消息ID，表示消息已发送
                    db.update('Messages', key, {
                        msgId: response.id
                    });

                    resolve(response);
                });
            } catch (e) {
                return reject(e)
            }
        })
    };

    return {
        socket,
        sendMessage,
    };
}

export default useSocket;
