import AuthProvider, { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuth=()=>{
    const contextData= useContext(AuthContext)

    if(!contextData) throw new Error('useAuth must be inside an authprovider')

    return contextData
}