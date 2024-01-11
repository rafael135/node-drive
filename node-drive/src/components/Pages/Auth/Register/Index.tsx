import { UserAuthContext } from "../../../../contexts/UserContext";
import { useState, useContext, useRef, useEffect } from "react";
import { AuthError } from "../../../../types/Auth";
import { Navigate, useNavigate } from "react-router-dom";
import { register } from "../../../../api/Auth";
import { checkInputsErrors } from "../../../../helpers/Input";
import { Link } from "react-router-dom";


const Register = () => {
    const navigate = useNavigate();
    const authCtx = useContext(UserAuthContext)!;

    if (authCtx.token != null && authCtx.user != null) {
        return <Navigate to={"/"} />;
    }

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");


    const nameInput = useRef<HTMLInputElement | null>(null);
    const emailInput = useRef<HTMLInputElement | null>(null);
    const passwordInput = useRef<HTMLInputElement | null>(null);
    const confirmPasswordInput = useRef<HTMLInputElement | null>(null);

    let placeholders = ["Nome", "E-mail", "Senha", "Repita a Senha"];

    const handleRegister = async () => {
        if ((name != "" && email != "" && password != "" && confirmPassword != "") && password == confirmPassword) {

            let res = await register(name, email, password, confirmPassword);

            if (res.success == false) {
                let errors = res.errors ?? [];

                setPassword("");
                setConfirmPassword("");

                errors.forEach((error) => {
                    switch (error.target) {
                        case "name":
                            setName("");
                            break;
                        case "email":
                            setEmail("");
                            break;
                    }
                });

                checkInputsErrors([nameInput, emailInput, passwordInput, confirmPasswordInput], placeholders, errors)
                return;
            }

            authCtx.setToken(res.token);
            authCtx.setUser(res.user);
            return;
        }

        let errors: AuthError[] = [];

        if(name == "") { errors.push({ target: "name", msg: "Nome não preenchido!" }); }

        if(email == "") { errors.push({ target: "email", msg: "E-mail não preenchido!" }); }

        if(password == "") { errors.push({ target: "password", msg: "Senha não preenchida!" }); }

        if(confirmPassword == "") { errors.push({ target: "confirmPassword", msg: "Senha não preenchida!" }); }

        if(confirmPassword != password) { errors.push({ target: "confirmPassword", msg: "A senha é diferente!" }); }

        checkInputsErrors([nameInput, emailInput, passwordInput, confirmPasswordInput], placeholders, errors);
    }

    return (
        <div className="auth-screen">
            <form className="input-form" onSubmit={(e) => { e.preventDefault(); }}>
                <h1>Registro</h1>

                <div className="inputs-container">
                    <input
                        type="text"
                        autoComplete="name"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => { setName(e.target.value); }}
                        ref={nameInput}
                        id="name"
                    />

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
                        autoComplete="new-password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); }}
                        ref={passwordInput}
                        id="password"
                    />

                    <input
                        type="password"
                        autoComplete="new-password"
                        placeholder="Repita a Senha"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); }}
                        ref={confirmPasswordInput}
                        id="confirmPassword"
                    />

                    <span className="text-sm text-slate-800 px-1">
                        Já possui uma conta? <Link className="text-blue-500 px-1 rounded-md hover:text-blue-600 hover:bg-black/5 active:text-blue-700" to={"/login"}>Clique aqui</Link>
                    </span>

                    <button
                        onClick={handleRegister}
                    >
                        Registrar-se
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;