import { AuthResponseType, UserAuthContext } from "../../contexts/UserContext";
import AxiosInstance from "../../helpers/AxiosInstance";
import { useState, useContext, useRef, MutableRefObject, useEffect } from "react";
import { AuthError } from "../../types/Auth";
import { Navigate, useNavigate } from "react-router-dom";


const Register = () => {
    const navigate = useNavigate();
    const authCtx = useContext(UserAuthContext);

    const axios = AxiosInstance;

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");


    const nameInput = useRef<HTMLInputElement | null>(null);
    const emailInput = useRef<HTMLInputElement | null>(null);
    const passwordInput = useRef<HTMLInputElement | null>(null);
    const confirmPasswordInput = useRef<HTMLInputElement | null>(null);

    let placeholders = ["Nome", "E-mail", "Senha", "Repita a Senha"];

    const errorEvent = (e: FocusEvent) => {
        let input = (e.target as HTMLInputElement);

        switch(input.id) {
            case "name":
                nameInput.current!.classList.remove("error");
                nameInput.current!.placeholder = placeholders[0];
                break;

            case "email":
                emailInput.current!.classList.remove("error");
                emailInput.current!.placeholder = placeholders[1];
                break;

            case "password":
                passwordInput.current!.classList.remove("error");
                passwordInput.current!.placeholder = placeholders[2];
                break;

            case "confirmPassword":
                confirmPasswordInput.current!.classList.remove("error");
                confirmPasswordInput.current!.placeholder = placeholders[3];
                break;
        }

        removeErrorEvent(input);
    }

    const removeErrorEvent = (input: HTMLInputElement) => {
        input.removeEventListener("focus", errorEvent);
    }

    const showError = (error: AuthError) => {
        switch(error.field) {
            case "name":
                nameInput.current!.classList.add("error");
                setName("");
                nameInput.current!.placeholder = error.msg;
                nameInput.current?.addEventListener("focus", errorEvent);
                break;

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
            case "confirmPassword":
                confirmPasswordInput.current!.classList.add("error");
                setConfirmPassword("");
                confirmPasswordInput.current!.placeholder = error.msg;
                confirmPasswordInput.current!.addEventListener("focus", errorEvent);
                break;
        }
    }

    const handleRegister = async () => {
        if(name != "" && email != "" && password != "" && confirmPassword != "") {
            let req = await fetch("http://127.0.0.1:3333/api/user/register", {
            method: "POST",
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
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
        
            if(res.status == 201) {
                let usr = {...res.response.user, maxStorage: res.response.maxSpace };

                authCtx!.setToken(res.response.token);
                authCtx!.setUser(usr);
                return;
            }
        }
    }

    useEffect(() => {
        if(authCtx?.token != null && authCtx.user != null) {
            navigate("/");
            //return <Navigate to={"/"} />;
        }
    }, [authCtx]);

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