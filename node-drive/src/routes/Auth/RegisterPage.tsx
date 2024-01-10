import { AuthResponseType, UserAuthContext } from "../../contexts/UserContext";
import AxiosInstance from "../../helpers/AxiosInstance";
import { useState, useContext, useRef, MutableRefObject, useEffect } from "react";
import { AuthError } from "../../types/Auth";
import { Navigate } from "react-router-dom";
import Register from "../../components/Pages/Auth/Register/Index";


const RegisterPage = () => {
    const authCtx = useContext(UserAuthContext)!;

    if(authCtx.token != null && authCtx.user != null) {
        //navigate("/");
        return <Navigate to={"/"} />;
    }

    return (
        <Register />
    );
}

export default RegisterPage;