import { useState } from 'react';
import { AuthContext } from './authContext';

import { ReactNode } from 'react';
import conf from '@/conf/conf';
import { toast } from 'sonner';
import useResponseHandler from '@/hooks/useResponseHandler';

const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState("");
    const [authToken, setAuthToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
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
            setAuthToken(data.access);
            setRefreshToken(data.refresh);
            
            localStorage.setItem('jovialUser', `${conf.api_url}user/${data.user.pk}`);
            localStorage.setItem('jovialAuthToken', data.access);
            localStorage.setItem('jovialRefreshToken', data.refresh);

            toast('Successfully Logged In')
        })
    }


    const logout = () => {
        toast('Logging you out');
        fetch(`${conf.api_url}auth/logout/`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => useResponseHandler(response))
        .then(data => {
            if (data.invalid) return;
            setUser("");
            setAuthToken("");
            setRefreshToken("");
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


    const updateToken = () => {
        const refreshToken = localStorage.getItem('jovialRefreshToken');
        if (refreshToken && refreshToken !== "") {
            fetch(`${conf.api_url}auth/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh: refreshToken
                })
            })
            .then(response => useResponseHandler(response))
            .then(data => {
                if (data.invalid) return;
                setAuthToken(data.access);
                setRefreshToken(data.refresh);
                localStorage.setItem('jovialAuthToken', data.access);
                localStorage.setItem('jovialRefreshToken', data.refresh);
            })
        }
    }


    const loadValues = () => {
        const userItem = localStorage.getItem('jovialUser');
        const userAuthToken = localStorage.getItem('jovialAuthToken');
        const userRefreshToken = localStorage.getItem('jovialRefreshToken');

        console.log(userItem, userAuthToken, userRefreshToken) 

        if (userItem && userItem !== "" && userAuthToken && userAuthToken !== "" && userRefreshToken && userRefreshToken !== "") {
            setUser(userItem);
            setAuthToken(userAuthToken);
            setRefreshToken(userRefreshToken);
            setSignedIn(true);
        }
    }


    return (
        <AuthContext.Provider value={{
            user,
            authToken,
            refreshToken,
            signedIn,
            login,
            register,
            logout,
            updateToken,
            loadValues
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;