import { useContext, useEffect } from "react";
import { UserAuthContext, checkToken } from "../contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const authCtx = useContext(UserAuthContext);

    if(authCtx == null) {
        return <Navigate to={"/login"} />;
    }

    if(authCtx.token == null) {
        return <Navigate to={"/login"} />;
    }

    const checkAuth = async () => {
        let res = await checkToken(authCtx.token!);

        if(res == true) {
            return;
        }

        return <Navigate to={"/login"} />;
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return <Outlet />;
}

export default ProtectedRoute;