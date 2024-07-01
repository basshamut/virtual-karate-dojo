import {useCallback} from 'react';
import {getApplicationDomain, getBase64CredentialsFromSession, getSession} from "../utils/session.jsx";

const domain = getApplicationDomain();
const base64Credentials = getBase64CredentialsFromSession();
const user = getSession();

const useSessionIds = () => {
    return useCallback((meet) => {
        return fetch(domain + "/api/stripe/create-checkout-session", {
            method: "POST",
            body: JSON.stringify({
                meetId: meet.id,
                userId: user.id
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Basic ${base64Credentials}`
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                if (!data.sessionId) {
                    throw new Error('Missing sessionId in response');
                }
                return data.sessionId;
            })
            .catch((error) => {
                console.error('Error fetching sessionId:', error);
                throw error;
            });
    }, [user.id]);
};

export default useSessionIds;
