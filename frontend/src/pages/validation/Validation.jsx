import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react"
import {getApplicationDomain, getBase64CredentialsFromSession} from "../../utils/session"

export default function Validation() {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const mail = params.get('mail')
    const [state, setState] = useState("")

    useEffect(() => {
        const domain = getApplicationDomain()
        fetch(`${domain}/api/users/validate`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userMail: mail }),
        })
            .then(response => response.json())
            .then(() => {
                setState('succeeded')
            })
            .catch(() => {
                setState('canceled')
            })
    }, [mail])

    return (
        <div>
            {state === 'succeeded' && <p>Validación exitosa.</p>}
            {state === 'canceled' && <p>Este usuario no ha podido ser verificado.</p>}
            {!state && <p>Estado desconocido</p>}
        </div>
    )
}
