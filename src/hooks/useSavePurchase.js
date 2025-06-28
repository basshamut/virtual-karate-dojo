import {useEffect, useState} from "react"
import {getApplicationDomain, getBase64CredentialsFromSession} from "../utils/session";

function useSavePurchase(isSuccess, meetId, userId) {
    const [response, setResponse] = useState({})
    const [error, setError] = useState(null);
    const domain = getApplicationDomain()
    const base64Credentials = getBase64CredentialsFromSession()

    useEffect(() => {
        async function savePurchase() {
            try {
                const response = await fetch(domain + '/purchases', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${base64Credentials}`
                    },
                    body: JSON.stringify({  meetId, userId}),
                })

                if (!response.ok) {
                    const errorMessage = `Network response was not ok: ${response.statusText}`;
                    console.error(errorMessage);
                    setError(new Error(errorMessage));
                    return;
                }

                const data = await response.json()
                setResponse(data)
            } catch (error) {
                console.error('Error saving purchase:', error)
                throw error
            }
        }

        if (isSuccess) {
            savePurchase()
        }
    }, [isSuccess, meetId, userId, domain, base64Credentials])

    return {response, error}
}

export default useSavePurchase