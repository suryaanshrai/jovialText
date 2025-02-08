import conf from "@/conf/conf";

export default async function useAuthFetch(url: string, body: RequestInit) {
    let authToken = localStorage.getItem('jovialAuthToken');
    if (!authToken) {
        throw new Error('No auth token found');
    }

    const verifyResponse = await fetch(`${conf.api_url}auth/token/verify/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: localStorage.getItem('jovialAuthToken')
        })
    });

    if (verifyResponse.status === 401) {
        const refreshToken = localStorage.getItem('jovialRefreshToken');
        const refreshResponse = await fetch(`${conf.api_url}auth/token/refresh/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });

        if (refreshResponse.status === 200) {
            const data = await refreshResponse.json();
            authToken = data.access;
            localStorage.setItem('jovialAuthToken', authToken || "");
        } else {
            throw new Error('Invalid refresh token');
        }
    }

    authToken = localStorage.getItem('jovialAuthToken');

    body.headers = {
        ...body.headers,
        'Authorization': `Bearer ${authToken}`
    };

    return fetch(url, body);
}
