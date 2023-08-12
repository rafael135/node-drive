import { AuthResponseType, UserAuthContext } from "../../contexts/UserContext";
import AxiosInstance from "../../helpers/AxiosInstance";
import { useState, useContext } from "react";


const Register = () => {
    const authCtx = useContext(UserAuthContext);
    const axios = AxiosInstance;

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");


    const handleRegister = async () => {
        if(name != "" && email != "" && password != "" && confirmPassword != "") {
            let req = await axios.post("/user/register", {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword
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
        
            if(res.status == 201) {
                authCtx!.setToken(res.response.token);
                authCtx!.setUser(res.response.user);
                return;
            }
        }
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <form className="w-80 bg-gray-100 rounded-lg shadow-xl flex flex-col" onSubmit={(e) => { e.preventDefault(); }}>
                <input
                    type="text" 
                    autoComplete="name"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => { setName(e.target.value); }}
                />

                <input
                    type="email" 
                    autoComplete="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); }}
                />

                <input
                    type="password" 
                    autoComplete="new-password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); }}
                />

                <input
                    type="password" 
                    autoComplete="new-password"
                    placeholder="Repita a Senha"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); }}
                />

                <button
                    className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-600/95 active:bg-blue-700"
                    onClick={handleRegister}
                >
                    Registrar-se
                </button>
            </form>
        </div>
    );
}

export default Register;