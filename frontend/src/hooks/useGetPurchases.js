import {useEffect, useState} from 'react';
import {getApplicationDomain, getBase64CredentialsFromSession} from "../utils/session";

function useGetPurchases(isUser, hasSession) {
    const [purchases, setPurchases] = useState([]);
    const [error, setError] = useState(null);
    const base64Credentials = getBase64CredentialsFromSession()

    useEffect(() => {
        async function getPurchases() {
            try {
                const domain = getApplicationDomain()
                const response = await fetch(domain + '/purchases', {
                    headers: {
                        'Authorization': `Basic ${base64Credentials}`
                    }
                });

                if (!response.ok) {
                    console.error('Network response was not ok', error);
                    setError(error);
                }

                const purchaseList = await response.json();

                console.log("Lista -> " + purchaseList)

                setPurchases(purchaseList || []);
            } catch (error) {
                console.error('Error fetching meets:', error);
                setError(error);
            }
            setPurchases(purchases)
        }

        if (hasSession && isUser) {
            getPurchases()
        }
    }, [isUser, hasSession, purchases, base64Credentials, error]);

    return {purchases, error};
}

export default useGetPurchases;
