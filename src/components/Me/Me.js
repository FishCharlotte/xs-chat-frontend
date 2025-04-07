import {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAndSetUserInfo, selectInfo } from "store/reducers/myUserSlice";
import {BadRequestError, InternalServerError} from "api/errors";
import { modifyInfo } from 'api/users';

import Avatar from "components/Common/Avatar";
import './Me.css';

// TODO: MOOD功能暂未在后台存储
const Me = () => {
    const [mood, setMood] = useState('暂无');

    const userInfo = useSelector(selectInfo);
    const dispatch = useDispatch();

    const [editing, setEditing] = useState(null); // 编辑状态：null/nickname/username/mood/password
    const [isBlur, setIsBlur] = useState(false);
    const [editValue, setEditValue] = useState(''); // 要修改为的值

    function validateInput(str) {
        const regex = /^[\u4E00-\u9FA5a-zA-Z0-9]+$/;
        return regex.test(str);
    }

    function validatePassword(str) {
        const regex = /^[a-zA-Z0-9]{3,30}$/;
        return regex.test(str)
    }
    // TODO: 防抖节流
    const handleChangeSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        switch (editing) {
            case 'nickname':
                const nickname = formData.get('nickname');
                console.log(nickname)
                if (nickname === '') {
                    console.log("输入的内容为空");
                    alert("输入的内容不能为空");
                    break;
                }
                // 验证输入的nickname合法性
                if (nickname.length > 15) {
                    console.log("昵称过长");
                    alert("修改失败，昵称过长");
                    break;
                }
                if (!validateInput(nickname)) {
                    console.log("存在非法字符")
                    alert("修改失败，存在非法字符");
                    break;
                }
                // 如果重复就不发请求
                if (nickname === userInfo.nickname) break;
                try {
                    await modifyInfo({
                        newNickname: nickname
                    }, 'nickname')
                    dispatch(fetchAndSetUserInfo())
                } catch (e) {
                    console.log(e.message);
                    throw InternalServerError('Internal Server Error')
                }
                break;

            case 'username':
                const username = formData.get('username');
                if (username === '') {
                    console.log("输入的内容为空");
                    alert("输入的内容不能为空");
                    break;
                }
                if (username.length > 15) {
                    console.log("用户名过长");
                    alert("修改失败，用户名过长");
                    break
                }
                if (!validateInput(username)) {
                    console.log("存在非法字符")
                    alert("修改失败，存在非法字符");
                    break;
                }
                console.log("prev username: ", userInfo.username)
                if (username === userInfo.username) break
                // TODO: 如果数据库已经存在了这个username，就不允许修改
                try {
                    await modifyInfo({
                        newUsername: username
                    }, 'username');
                    dispatch(fetchAndSetUserInfo());
                } catch (e) {
                    if (e instanceof BadRequestError) {
                        alert('用户名已存在')
                    } else {
                        console.log(e)
                    }
                    break
                }
                console.log("change username: ", username)
                break
            case 'mood':
                const newMood = formData.get('mood');
                if (newMood === '') {
                    console.log("输入的内容为空");
                    alert("输入的内容不能为空");
                    break;
                }
                setMood(newMood);
                console.log("change mood: ", mood)
                break
            case 'password':
                // TODO: 接入后端修改密码
                const password = formData.get('password');
                if (password === '' || !password) {
                    console.log("输入的内容为空");
                    alert("输入的内容不能为空");
                    break;
                }
                // TODO: 验证输入的password合法性
                if (!validatePassword(password)) {
                    console.log("新密码不符合要求");
                    alert("修改失败，新密码不符合要求");
                    break;
                }
                console.log("change password: ", password)
                break
            default:
                alert('要更改的内容不对')
        }
        console.log(`更改${editing}完毕`, editing)
        setEditing(null);
    }
    // 为了及时回收状态，避免保存却没发出去的情况
    useEffect(() => {
        let timer = null;
        console.log('isBlur', isBlur)
        if (isBlur) {
            timer = setTimeout(() => {
                setEditing(null); // 退出编辑模式
                setIsBlur(false);
                console.log("调用了：onBlur!", editing)
            }, 100);
        }

        return () => {
            if (timer) clearTimeout(timer);
        }
    }, [editing, isBlur]);

    return (
        <div className='flex h-full relative'>
            <div className='w-[calc(40%)] flex justify-center items-center pl-[20px]
                            relative
                            before:block before:absolute before:bg-green-400 before:w-[30px] before:h-[30px]
                            before:rounded-full before:border-2 before:top-[calc(50%+70px)] before:left-[calc(50%+65px)]
                            before:border-[#7C7979]'>
                <Avatar className="w-[220px] h-[220px] rounded-full border-4 border-border object-cover"/>
            </div>
            <form onSubmit={handleChangeSubmit}
                  className='list-none w-[calc(60%)] h-full flex flex-col justify-center pl-[30px] pr-[10px] pb-[20px]'>
                <li>
                    { editing === 'nickname' ? (
                        <div className='transition-shadow'>
                            <label htmlFor="nickname" className='text-2xl'>
                                <strong>
                                    昵称:
                                </strong>
                            </label>
                            <input
                                name='nickname'
                                type="text"
                                defaultValue={userInfo.nickname}
                                onKeyUp={(event) => {
                                    if (event.key === "Escape") {
                                        console.log("!!escape!!")
                                        setEditing(null); // 退出编辑模式
                                    }
                                }}
                                onBlur={() => setIsBlur(true)}
                                autoFocus
                                className="border p-2 w-[60%] text-2xl"
                            />
                        </div>
                    ) : (
                        <p onDoubleClick={() => setEditing('nickname')}
                           className='mb-[25px] text-5xl text-left hover:scale-110 origin-top-left md:transform-none transition-all ease-in-out'>
                            {userInfo.nickname}
                        </p>
                    )}
                </li>
                <li>
                    { editing === 'username' ? (
                        <div className='transition-all'>
                            <label htmlFor="username" className='text-2xl'>
                                <strong>
                                    账号:
                                </strong>
                            </label>
                            <input
                                name='username'
                                type="text"
                                defaultValue={userInfo.username}
                                onKeyUp={(event) => {
                                    if (event.key === "Escape") {
                                        console.log("!!escape!!")
                                        setEditing(null); // 退出编辑模式
                                    }
                                }}
                                onBlur={() => setIsBlur(true)}
                                autoFocus
                                className="border p-2 w-[60%] text-2xl transition-all"
                            />
                        </div>
                    ) : (
                        <p onDoubleClick={() => setEditing('username')}
                           className='my-[5px] text-left text-2xl hover:scale-110 origin-top-left md:transform-none transition-all ease-in-out'>
                            账号: {userInfo.username}
                        </p>
                    )}
                </li>
                <li>
                    { editing === 'mood' ? (
                        <div>
                            <label htmlFor="username" className='text-2xl'>
                                <strong>
                                    Mood:
                                </strong>
                            </label>
                            <input
                                name='mood'
                                type="text"
                                defaultValue={mood}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                                onBlur={() => setIsBlur(true)}
                                onKeyUp={(event) => {
                                    if (event.key === "Escape") {
                                        console.log("!!escape!!")
                                        setEditing(null); // 退出编辑模式
                                    }
                                }}
                                className="border p-2 w-[60%] text-2xl"
                            />
                        </div>

                    ) : (
                        <p className='my-[5px] text-left text-2xl hover:scale-110 origin-top-left md:transform-none transition-all ease-in-outl'
                           onDoubleClick={() => {
                               setEditing('mood')
                               console.log("editValue:", editValue)
                        }}>
                            Mood: {mood}
                        </p>
                    )}
                </li>
                <li>
                    {editing === 'password' ? (
                        <div>
                            <label htmlFor="username" className='text-2xl'>
                                <strong>
                                    密码:
                                </strong>
                            </label>
                            <input
                                type="password"
                                defaultValue={""}
                                name='password'
                                onBlur={() => setIsBlur(true)}
                                onKeyUp={(event) => {
                                    if (event.key === "Escape") {
                                        console.log("!!escape!!")
                                        setEditing(null); // 退出编辑模式
                                    }
                                }}
                                autoFocus
                                className="border p-2 w-[60%] text-2xl"
                            />
                        </div>
                    ) : (
                        <p className='mt-[5px] text-left text-2xl hover:scale-110 origin-top-left md:transform-none transition-all  ease-in-out'
                           onDoubleClick={() => setEditing('password')}>
                            change Password
                        </p>
                    )}

                </li>
                <div className={`absolute bottom-[20%] right-[10%] transition-opacity duration-100`}> {/* invisible */}
                    <button
                        type='submit'
                        className={`save-btn border-border border-2 w-[80px] h-[40px] self-end
                                    ${editing !== null ? 'opacity-100':'hidden'} transition-opacity duration-100 ease-in-out`}>
                        save
                    </button>
                </div>
                <div className='absolute bottom-0 right-0 text-gray-600 text-sm'>*双击内容修改信息,点击空白处返回</div>
            </form>
        </div>
    )
}
export default Me;