import { useState } from 'react';
import { ComponentContext } from './componentContext';

import { ReactNode } from 'react';

const ComponentProvider = ({children}: {children: ReactNode}) => {
    const [postDrawer, setPostDrawer] = useState(false);
    const openPostDrawer = () => setPostDrawer(true);
    const closePostDrawer = () => setPostDrawer(false);

    const [searchDialog, setSearchDialog] = useState(false);
    const openSearchDialog = () => setSearchDialog(true);
    const closeSearchDialog = () => setSearchDialog(false);

    const [loginDialog, setLoginDialog] = useState(false);
    const openLoginDialog = () => setLoginDialog(true);
    const closeLoginDialog = () => setLoginDialog(false);

    const [registerDialog, setRegisterDialog] = useState(false);
    const openRegisterDialog = () => setRegisterDialog(true);
    const closeRegisterDialog = () => setRegisterDialog(false);

    const [editUserDialog, setEditUserDialog] = useState(false);
    const openEditUserDialog = () => setEditUserDialog(true);
    const closeEditUserDialog = () => setEditUserDialog(false);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePostDrawer();
            closeSearchDialog();
            closeLoginDialog();
            closeRegisterDialog();
            closeEditUserDialog();
        }
    })

    return (
        <ComponentContext.Provider value={{
            postDrawer,
            openPostDrawer,
            closePostDrawer,

            searchDialog,
            openSearchDialog,
            closeSearchDialog,

            loginDialog,
            openLoginDialog,
            closeLoginDialog,

            registerDialog,
            openRegisterDialog,
            closeRegisterDialog,

            editUserDialog,
            openEditUserDialog,
            closeEditUserDialog
        }}>
            {children}
        </ComponentContext.Provider>
    )
}

export default ComponentProvider;