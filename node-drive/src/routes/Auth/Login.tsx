import { useContext, useState } from "react";
import AxiosInstance from "../../helpers/AxiosInstance";
import style from "./Login.module.css";
import { AuthResponseType, UserAuthContext } from "../../contexts/UserContext";
import { Navigate, useNavigate } from "react-router-dom";

const Login = () => {
    let navigate = useNavigate();
    const authCtx = useContext(UserAuthContext);

    if(authCtx?.token != null && authCtx.user != null) {
        return <Navigate to={"/"} />
    }

    let axios = AxiosInstance;

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    const handleLogin = async () => {
        let req = await axios.post("/user/login", {
            email: email,
            password: password
        });

        let res: AuthResponseType = req.data;

        if(res.status == 406) {
            let errors = res.response.errors;
    
            if(errors == undefined) {
                return;
            }
    
            return;
        }
        if(res.response.token == null || res.response.user == null) {
            return;
        }

        if(res.status == 200) {
            authCtx!.setToken(res.response.token);
            authCtx!.setUser(res.response.user);
            return;
        }

    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form className="w-80 bg-gray-100 rounded-lg shadow-xl flex flex-col" onSubmit={(e) => { e.preventDefault(); }}>
                <h1 className="bg-blue-600 text-white text-2xl font-bold text-center py-2 rounded-t-lg">Login</h1>

                <div className="p-4 w-full flex flex-col gap-4">
                    <input
                        type="email" 
                        autoComplete="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); }}
                        className="w-full text-slate-900 outline-none bg-white/70 border-t-0 border-l-0 border-r-0 border-b-2 border-solid border-b-gray-600/60 focus:border-b-gray-600/90 focus:bg-white/90 focus:ring-0"
                    />

                    <input
                        type="password" 
                        autoComplete="current-password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); }}
                        className="w-full text-slate-900 outline-none bg-white/70 border-t-0 border-l-0 border-r-0 border-b-2 border-solid border-b-gray-600/60 focus:border-b-gray-600/90 focus:bg-white/90 focus:ring-0"
                    />
                </div>
            </form>
        </div>
    );
}

export default Login;