import {createContext, useContext} from "react";

interface AuthContextProps {
    user: string;
    authToken: string;
    refreshToken: string;
    signedIn: boolean;
    login: (username: string, password: string) => void;
    register: (username: string, password: string) => void;
    logout: () => void;
    updateToken: () => void;
    loadValues: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    user: "",
    authToken: "",
    refreshToken: "",
    signedIn: false,
    login: () => {},
    register: () => {},
    logout: () => {},
    updateToken: () => {},
    loadValues: () => {},
});

export default function useAuthContext() {
    return useContext(AuthContext);
}
