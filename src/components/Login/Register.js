import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "shadcn-ui/card";
import {Label} from "shadcn-ui/label";
import {Input} from "shadcn-ui/input";
import {Button} from "shadcn-ui/button";

import {register} from "api/users";
import {Alert, AlertDescription, AlertTitle} from "../../shadcn-ui/alert";
import {AlertCircle} from "lucide-react";
import {useState} from "react";

const Register = () => {
    const [msg, setMsg] = useState(null);

    const handleRegister = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const username = formData.get('username');
        const nickname = formData.get('nickname');
        const password = formData.get('password');
        try {
            // TODO 防抖节流
            await register(username, nickname, password);
            setTimeout(() => {
                alert('注册成功')
            }, 500)
        } catch (e) {
            console.error('[RegisterComponent:handleRegister]', e);
            setMsg(e.message || 'Unknown error!')
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <Card>
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                        Write your information here.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="username">用户名</Label>
                        <Input name="username" type="text"/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="username">昵称</Label>
                        <Input name="nickname" type="text"/>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="new">密码</Label>
                        <Input name="password" type="password"/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button>Register</Button>
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

export default Register;
