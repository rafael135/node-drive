import { useContext, useRef, useState } from "react";
import { AuthResponseType, UserAuthContext } from "../../../../contexts/UserContext";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthError } from "../../../../types/Auth";
import { login } from "../../../../api/Auth";
import { checkInputsErrors } from "../../../../helpers/Input";
import { Link } from "react-router-dom";

const Login = () => {
    let navigate = useNavigate();
    const authCtx = useContext(UserAuthContext)!;

    if (authCtx.token != null && authCtx.user != null) {
        return <Navigate to={"/"} />
    }

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    let emailInput = useRef<HTMLInputElement | null>(null);
    let passwordInput = useRef<HTMLInputElement | null>(null);

    let placeholders = ["E-mail", "Senha"];

    const handleLogin = async () => {
        if (email != "" && password != "") {
            let res = await login(email, password);

            if (res.success == false) {
                let errors = res.errors ?? [];

                errors.forEach((error) => {
                    switch (error.target) {
                        case "email":
                            setEmail("");
                            break;
                    }
                });

                checkInputsErrors([emailInput, passwordInput], placeholders, errors);
                return;
            }

            authCtx.setToken(res.token);
            authCtx.setUser(res.user);
            return;
        }

        let errors: AuthError[] = [];

        if(email == "") { errors.push({ target: "email", msg: "E-mail não preenchido!" }); }

        if(password == "") { errors.push({ target: "password", msg: "Senha não preenchida!" }); }

        checkInputsErrors([emailInput, passwordInput], placeholders, errors);
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

                <span className="text-sm text-slate-800 px-4 mb-2.5">
                    Ainda não possui uma conta? <Link className="text-blue-500 px-1 rounded-md hover:text-blue-600 hover:bg-black/5 active:text-blue-700" to={"/register"}>Clique aqui</Link>
                </span>

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