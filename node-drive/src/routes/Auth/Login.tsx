import { useContext, useRef, useState } from "react";
import AxiosInstance from "../../helpers/AxiosInstance";
import style from "./Login.module.css";
import { AuthResponseType, UserAuthContext } from "../../contexts/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthError } from "../../types/Auth";

const Login = () => {
    //let navigate = useNavigate();
    const authCtx = useContext(UserAuthContext);

    if(authCtx?.token != null && authCtx.user != null) {
        return <Navigate to={"/"} />
    }

    let axios = AxiosInstance;

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    
    let emailInput = useRef<HTMLInputElement | null>(null);
    let passwordInput = useRef<HTMLInputElement | null>(null);

    let placeholders = ["E-mail", "Senha"];

    const errorEvent = (e: FocusEvent) => {
        let input = (e.target as HTMLInputElement);

        switch(input.id) {
            case "email":
                emailInput.current!.classList.remove("error");
                emailInput.current!.placeholder = placeholders[0];
                break;

            case "password":
                passwordInput.current!.classList.remove("error");
                passwordInput.current!.placeholder = placeholders[1];
                break;
        }

        removeErrorEvent(input);
    }

    const removeErrorEvent = (input: HTMLInputElement) => {
        input.removeEventListener("focus", errorEvent);
    }

    const showError = (error: AuthError) => {
        switch(error.field) {
            case "email":
                emailInput.current!.classList.add("error");
                setEmail("");
                emailInput.current!.placeholder = error.msg;
                emailInput.current!.addEventListener("focus", errorEvent);
                break;
            case "password":
                passwordInput.current!.classList.add("error");
                setPassword("");
                passwordInput.current!.placeholder = error.msg;
                passwordInput.current!.addEventListener("focus", errorEvent);
                break;
        }
    }

    const handleLogin = async () => {
        let req = await fetch("http://127.0.0.1:3333/api/user/login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
            
        });

        let res: AuthResponseType = await req.json();

        if(res.status == 406) {
            let errors = res.response.errors;
    
            if(errors == undefined) {
                return;
            }

            errors.forEach((err) => {
                showError(err);
            });
    
            return;
        }
        if(res.response.token == null || res.response.user == null) {
            return;
        }

        if(res.status == 200) {
            let usr = {...res.response.user, maxStorage: res.response.maxSpace };

            authCtx!.setToken(res.response.token);
            authCtx!.setUser(usr);
            return;
        }

    }

    return (
        <div className="auth-screen">
            <form className="input-form" onSubmit={(e) => { e.preventDefault(); }}>
                <h1>Login</h1>

                <div className="inputs-container">
                    <input
                        type="email" 
                        autoComplete="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); }}
                        ref={emailInput}
                        id="email"
                    />

                    <input
                        type="password" 
                        autoComplete="current-password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); }}
                        ref={passwordInput}
                        id="password"
                    />
                </div>

                <button
                    onClick={handleLogin}
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;