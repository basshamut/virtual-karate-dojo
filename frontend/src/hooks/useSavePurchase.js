import {useEffect, useState} from "react"

function useSavePurchase(isSuccess, meetId, userId) {
    const [response, setResponse] = useState({})
    const [error, setError] = useState(null);
    // const domain = 'http://localhost:5000'
    const domain = 'http://86.38.204.61'
    useEffect(() => {
        async function savePurchase() {
            try {
                const response = await fetch(domain + '/api/purchases', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({  meetId, userId}),
                })

                if (!response.ok) {
                    console.error('Network response was not ok', error);
                    setError(error);
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
    }, [isSuccess, meetId, userId])

    return {response, error}
}

export default useSavePurchase