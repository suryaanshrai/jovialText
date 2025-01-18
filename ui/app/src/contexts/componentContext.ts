import { createContext, useContext } from "react";

export const ComponentContext = createContext({
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

export const ComponentProvider = ComponentContext.Provider;


export default function useComponentContext() {
    return useContext(ComponentContext);
}