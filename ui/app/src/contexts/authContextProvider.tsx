import { useState } from 'react';
import { AuthContext } from './authContext';

import { ReactNode } from 'react';
import conf from '@/conf/conf';
import { toast } from 'sonner';
import useResponseHandler from '@/hooks/useResponseHandler';
import useAuthFetch from '@/hooks/useAuthFetch';

const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState("");
    const [signedIn, setSignedIn] = useState(false);


    const login = (username: string, password: string) => {
        toast('Logging you in')
        fetch(`${conf.api_url}auth/login/`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        })
        .then(response => useResponseHandler(response))
        .then(data => {
            if (data.invalid) return;
            setUser(`${conf.api_url}user/${data.user.pk}`)
            setSignedIn(true);
            
            localStorage.setItem('jovialUser', `${conf.api_url}user/${data.user.pk}`);
            localStorage.setItem('jovialAuthToken', data.access);
            localStorage.setItem('jovialRefreshToken', data.refresh);

            toast('Successfully Logged In')
        })
    }


    const logout = () => {
        toast('Logging you out');
        useAuthFetch(`${conf.api_url}auth/logout/`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        })
        .then(response => useResponseHandler(response))
        .then(data => {
            if (data.invalid) return;
            setUser("");
            setSignedIn(false);

            localStorage.removeItem('jovialUser');
            localStorage.removeItem('jovialAuthToken');
            localStorage.removeItem('jovialRefreshToken');

            toast('Successfully Logged Out')
        })
    }


    const register = (username: string, password: string) => {
        toast('Not Implemented Yet')
    }


    const loadValues = () => {
        const userItem = localStorage.getItem('jovialUser');
        const userAuthToken = localStorage.getItem('jovialAuthToken');
        const userRefreshToken = localStorage.getItem('jovialRefreshToken');

        if (userItem && userItem !== "" && userAuthToken && userAuthToken !== "" && userRefreshToken && userRefreshToken !== "") {
            setUser(userItem);
            setSignedIn(true);
        }
    }


    return (
        <AuthContext.Provider value={{
            user,
            signedIn,
            login,
            register,
            logout,
            loadValues
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;