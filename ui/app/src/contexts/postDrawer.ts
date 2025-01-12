import { createContext, useContext } from "react";

export const PostDrawerContext = createContext({
    postDrawer: false,
    openPostDrawer: () => {},
    closePostDrawer: () => {},
});

export const PostDrawerProvider = PostDrawerContext.Provider;


export default function usePostDrawer() {
    return useContext(PostDrawerContext);
}