import { createContext, useContext } from "react";

export const SearchDialogContext = createContext({
    searchDialog: false,
    openSearchDialog: () => {},
    closeSearchDialog: () => {},
});

export const SearchDialogProvider = SearchDialogContext.Provider;


export default function useSearchDialog() {
    return useContext(SearchDialogContext);
}