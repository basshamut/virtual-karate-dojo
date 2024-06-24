import { useEffect, useState } from 'react';

function useFetchMeets(isUser, hasSession) {
    const [meets, setMeets] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMeets() {
            try {
                const response = await fetch('http://localhost:5000/api/meets/all');

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

    return { meets, error };
}

export default useFetchMeets;
