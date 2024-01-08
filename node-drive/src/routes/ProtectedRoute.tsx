import { useContext, useEffect } from "react";
import { UserAuthContext } from "../contexts/UserContext";
import { Navigate, Outlet, RedirectFunction, useNavigate } from "react-router-dom";
import { checkToken } from "../api/Auth";

const ProtectedRoute = () => {
    const authCtx = useContext(UserAuthContext);
    const navigate = useNavigate();

    if(authCtx == null) {
        //return <Navigate to={"/login"} />;
        navigate("/login", {
            replace: true
        });
    }

    

    if(authCtx!.token == null) {
        authCtx!.setUser(null);

        //return <Navigate to={"/login"} />;
        navigate("/login", {
            replace: true
        });
    }

    const checkAuth = async () => {
        let res = await checkToken(authCtx!.token!);

        if(res == true) {
            return;
        }

        authCtx!.setToken(null);
        authCtx!.setUser(null);
        
        //return <Navigate to={"/login"} />;
        return navigate("/login", {
            replace: true
        });
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return <Outlet />;
}

export default ProtectedRoute;