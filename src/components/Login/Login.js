import { AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "shadcn-ui/alert"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "shadcn-ui/card";
import {Label} from "shadcn-ui/label";
import {Input} from "shadcn-ui/input";
import {Button} from "shadcn-ui/button";
import {login} from "api/users";

import { useNavigate } from "react-router-dom";
import {useState} from "react";

const Login = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        try {
            // TODO 防抖节流

            await login(username, password);

            // 延迟后跳转到聊天页面
            setTimeout(() => {
                navigate("/chat");
            }, 500)
        } catch (e) {
            console.error('[LoginComponent:handleLogin]', e);
            setMsg(e.message || 'Unknown error!')
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Log in here. Click save when you're done.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="username">用户名</Label>
                        <Input name="username" defaultValue="admin" type="text"/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">密码</Label>
                        <Input name="password" defaultValue="12345678" type="password"/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className='text-black border-[1px] border-black border-solid'>
                        Login
                    </Button>
                </CardFooter>
            </Card>
            {
                msg &&
                <div className='mt-[10px]'>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            { msg }
                        </AlertDescription>
                    </Alert>
                </div>
            }
        </form>
    );
}

export default Login