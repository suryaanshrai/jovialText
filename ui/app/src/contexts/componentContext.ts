import { createContext, useContext } from "react";

interface ComponentContextProps {
    postDrawer: boolean;
    openPostDrawer: () => void;
    closePostDrawer: () => void;

    searchDialog: boolean;
    openSearchDialog: () => void;
    closeSearchDialog: () => void;

    loginDialog: boolean;
    openLoginDialog: () => void;
    closeLoginDialog: () => void;

    registerDialog: boolean;
    openRegisterDialog: () => void;
    closeRegisterDialog: () => void;

    editUserDialog: boolean;
    openEditUserDialog: () => void;
    closeEditUserDialog: () => void;
}

export const ComponentContext = createContext<ComponentContextProps>({
    postDrawer: false,
    openPostDrawer: () => {},
    closePostDrawer: () => {},

    searchDialog: false,
    openSearchDialog: () => {},
    closeSearchDialog: () => {},

    loginDialog: false,
    openLoginDialog: () => {},
    closeLoginDialog: () => {},

    registerDialog: false,
    openRegisterDialog: () => {},
    closeRegisterDialog: () => {},

    editUserDialog: false,
    openEditUserDialog: () => {},
    closeEditUserDialog: () => {},
});


export default function useComponentContext() {
    return useContext(ComponentContext);
}