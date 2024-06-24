import {useEffect, useState} from 'react';

function useFetchMeets(isUser, hasSession) {
    const [meets, setMeets] = useState([]);
    const [error, setError] = useState(null);
    // const domain = 'http://localhost:5000'
    const domain = 'http://86.38.204.61'

    useEffect(() => {
        async function fetchMeets() {
            try {
                const response = await fetch(domain + '/api/meets/all');

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
