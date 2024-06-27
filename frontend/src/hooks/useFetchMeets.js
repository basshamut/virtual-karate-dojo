import {useEffect, useState} from 'react';
import {getApplicationDomain, getBase64CredentialsFromSession} from "../utils/session";

function useFetchMeets(isUser, hasSession) {
    const [meets, setMeets] = useState([]);
    const [error, setError] = useState(null);
    const base64Credentials = getBase64CredentialsFromSession()

    useEffect(() => {
        async function fetchMeets() {
            try {
                const domain = getApplicationDomain()
                console.log("Domain: " + domain)
                const response = await fetch(domain + '/api/meets/all', {
                    headers: {
                        'Authorization': `Basic ${base64Credentials}`
                    }
                });

                if (!response.ok) {
                    console.error('Network response was not ok', error);
                    setError(error);
                }

                const meets = await response.json();
                setMeets(meets || []);
            } catch (error) {
                console.error('Error fetching meets:', error);
                setError(error);
            }
        }

        if (hasSession && isUser) {
            fetchMeets();
        }
    }, [isUser, hasSession]);

    return {meets, error};
}

export default useFetchMeets;
