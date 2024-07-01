import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react"
import {getApplicationDomain} from "../../utils/session"

export default function Validation() {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const mail = params.get('mail')
    const [state, setState] = useState("")

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
