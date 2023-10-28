import { useContext } from "react"
import { UserAuthContext } from "../../contexts/UserContext"
import { useNavigate } from "react-router-dom";


const Logout = () => {
    const authCtx = useContext(UserAuthContext);
    const navigate = useNavigate();

    if(authCtx?.token != null) {
        authCtx.setToken(null);
        authCtx.setUser(null);

        return navigate("/login");
    } else {
        return navigate("/login");
    }

}

export default Logout;