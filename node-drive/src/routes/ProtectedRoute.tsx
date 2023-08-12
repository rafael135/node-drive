import { useContext } from "react";
import { UserAuthContext, checkToken } from "../contexts/UserContext";
import { Navigate, Outlet } from "react-router-dom";




const ProtectedRoute = () => {
    const authCtx = useContext(UserAuthContext);

    if(authCtx == null) {
        return <Navigate to={"/login"} />
    }

    if(authCtx.token == null || authCtx.user == null) {
        return <Navigate to={"/login"} />
    }

    checkToken(authCtx.token).then((res) => {
        if(res == true) {
            return <Outlet />;
        } else {
            return <Navigate to={"/login"} />
        }
    }).catch((err) => {
        return <Navigate to={"/login"} />
    });
}

export default ProtectedRoute;