import {createContext, useContext} from "react";

interface AuthContextProps {
    user: string;
    signedIn: boolean;
    login: (username: string, password: string) => void;
    register: (username: string, email: string, password1: string, password2: string) => void;
    logout: () => void;
    loadValues: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    user: "",
    signedIn: false,
    login: () => {},
    register: () => {},
    logout: () => {},
    loadValues: () => {},
});

export default function useAuthContext() {
    return useContext(AuthContext);
}
