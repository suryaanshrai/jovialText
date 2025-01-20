import { createContext, useContext } from "react";

export const AuthContext = createContext({
    user: "",
    token: "",
    signedIn: false,
    login: () => {},
    logout:() => {},
    register: () => {},
});

export const AuthProvider = AuthContext.Provider;


export default function useAuthContext() {
    return useContext(AuthContext);
}