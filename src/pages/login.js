import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "shadcn-ui/tabs"

import Login from "components/Login/Login";
import Register from "components/Login/Register";
import LoadingPopup from "components/Common/LoadingPopup";

import { fetchAndSetUserInfo, selectInfo, selectIsNeededLogIn, selectIsPending } from "store/reducers/myUserSlice";

function LoginPage() {
    const userInfo = useSelector(selectInfo);
    const isNeededLogIn = useSelector(selectIsNeededLogIn);
    const isPending = useSelector(selectIsPending);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect( () => {
        dispatch(fetchAndSetUserInfo())
    }, [dispatch]);

    useEffect(() => {
        if (!isNeededLogIn && userInfo.userId) {
            return navigate("/chat");
        }
    }, [isNeededLogIn, navigate, userInfo]);

    return (
        <div>
            <div className="my-0 mx-auto w-[400px]">
                <Tabs defaultValue="login" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    {/* Login Panel */}
                    <TabsContent value="login">
                        <Login/>
                    </TabsContent>

                    {/* Register Panel */}
                    <TabsContent value="register">
                        <Register/>
                    </TabsContent>
                </Tabs>
            </div>
            {
                isPending && <LoadingPopup />
            }
        </div>
    );
}

export default LoginPage;
