import { createContext, useContext } from "react";

export const AuthContext = createContext({
    user: "",
    token: "",
    login: () => {},
    logout:() => {}
});

export const AuthProvider = AuthContext.Provider;


export default function useAuthContext() {
    return useContext(AuthContext);
}