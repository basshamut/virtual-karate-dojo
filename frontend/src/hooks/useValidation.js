import { useEffect, useState } from "react"
import { getApplicationDomain } from "../utils/session"

export function useValidation(mail) {
    const [state, setState] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const domain = getApplicationDomain()
        const login = btoa(import.meta.env.VITE_SERVICE_USR + ':' + import.meta.env.VITE_SERVICE_PASS)
        fetch(`${domain}/api/users/validate`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${login}`
            },
            body: JSON.stringify({ userMail: mail }),
        })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(({ status, body }) => {
                if (status === 200) {
                    setState('succeeded')
                } else {
                    setState('canceled')
                    setErrorMessage(body.message)
                }
            })
            .catch(() => {
                setState('canceled')
                setErrorMessage('Hubo un problema con la operación de validación.')
            })
    }, [mail])

    return { state, errorMessage }
}
