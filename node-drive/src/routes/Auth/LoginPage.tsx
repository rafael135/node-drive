import { useContext, useRef, useState } from "react";
import AxiosInstance from "../../helpers/AxiosInstance";
import style from "./Login.module.css";
import { AuthResponseType, UserAuthContext } from "../../contexts/UserContext";
import { Navigate } from "react-router-dom";
import { AuthError } from "../../types/Auth";
import Login from "../../components/Pages/Auth/Login/Index";

const LoginPage = () => {
    const authCtx = useContext(UserAuthContext)!;

    if(authCtx.token != null && authCtx.user != null) {
        return <Navigate to={"/"} />
    }

    return (
        <Login />
    );
}

export default LoginPage;