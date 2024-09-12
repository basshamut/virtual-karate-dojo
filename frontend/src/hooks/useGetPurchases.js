import {useEffect, useState} from 'react';
import {getApplicationDomain, getBase64CredentialsFromSession} from "../utils/session";

function useGetPurchases(isUser, hasSession, page = 1, limit = 10, startDate, endDate) {
    const [purchases, setPurchases] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0); // Total de registros para la paginación
    const [error, setError] = useState(null);
    const base64Credentials = getBase64CredentialsFromSession()

    useEffect(() => {
        async function getPurchases() {
            try {
                const domain = getApplicationDomain();
                let url = `${domain}/purchases?page=${page}&limit=${limit}`;

                // Añadir los parámetros de filtrado por fecha si están seleccionados
                if (startDate) {
                    url += `&startDate=${startDate.toISOString()}`;  // Enviar la fecha en formato ISO
                }
                if (endDate) {
                    url += `&endDate=${endDate.toISOString()}`;
                }

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Basic ${base64Credentials}`
                    }
                });

                if (!response.ok) {
                    const errorMessage = `Network response was not ok: ${response.statusText}`;
                    console.error(errorMessage);
                    setError(errorMessage);
                    return;
                }

                const { paginationInfo, data } = await response.json();

                setPurchases(data || []);
                setTotalRecords(paginationInfo.totalItems); // Guarda el total de registros para la paginación
            } catch (error) {
                console.error('Error fetching purchases:', error);
                setError(error.message);
            }
        }

        // Llamar al servicio solo si el usuario tiene sesión y es válido
        if (hasSession) {
            getPurchases();
        }
    }, [isUser, hasSession, page, limit, startDate, endDate, base64Credentials]);

    return {purchases, totalRecords, error};
}

export default useGetPurchases;
