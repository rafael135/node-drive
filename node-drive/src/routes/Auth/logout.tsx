import { useContext } from "react"
import { UserAuthContext } from "../../contexts/UserContext"
import { Navigate } from "react-router-dom";


const Logout = () => {
    const authCtx = useContext(UserAuthContext);

    if(authCtx?.token != null) {
        authCtx.setToken(null);
        authCtx.setUser(null);

        return <Navigate to={"/login"} />
    } else {
        return <Navigate to={"/login"} />
    }

}

export default Logout;