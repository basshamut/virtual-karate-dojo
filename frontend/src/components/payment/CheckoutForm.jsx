import {useCallback} from "react"
import {loadStripe} from '@stripe/stripe-js'
import {format} from "date-fns"
import {getBase64CredentialsFromSession, getSession} from "../../utils/session.jsx";

// eslint-disable-next-line react/prop-types
export default function CheckoutForm({meet}) {
    const domain = import.meta.env.VITE_API_URL

    const stripePromise = loadStripe("pk_test_51PSHknKnVUk9u0R7xWznb2PU2LeYeOgFXDVB14wP4BvJQBJ3RdH0ZLF801Ka7oLlNd7pFV7VZndQa2soCDluMFf200UugFXgnD")
    const user = getSession()
    const base64Credentials = getBase64CredentialsFromSession()

    const fetchSessionId = useCallback(() => {
        return fetch(domain + "/api/stripe/create-checkout-session", {
            method: "POST",
            body: JSON.stringify({
                // eslint-disable-next-line react/prop-types
                meetId: meet.id,
                userId: user.id
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Basic ${base64Credentials}`
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok')
                }
                return res.json()
            })
            .then((data) => {
                if (!data.sessionId) {
                    throw new Error('Missing sessionId in response')
                }
                return data.sessionId
            })
            .catch((error) => {
                console.error('Error fetching sessionId:', error)
                throw error
            })
        // eslint-disable-next-line react/prop-types
    }, [meet.id, user.id])

    const handleCheckout = async () => {
        const stripe = await stripePromise
        try {
            const sessionId = await fetchSessionId()
            const { error } = await stripe.redirectToCheckout({ sessionId })

            if (error) {
                console.error('Stripe checkout error', error)
            }
        } catch (error) {
            console.error('Error during checkout', error)
        }
    }

    return (
        <div id="checkout">
            <div style={{ backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))', color: 'white', padding: '20px', textAlign: 'center' }}>
                <h1>SHOTOKAN KARATE</h1>
                <h2>Clase de Karate</h2>
                {/* eslint-disable-next-line react/prop-types */}
                <h2>Fecha: {format(meet.meetDate, 'dd/MM/yyyy HH:mm')}</h2>
                {/* eslint-disable-next-line react/prop-types */}
                <p>Precio: <strong>{meet.price} €</strong></p>
                <button onClick={handleCheckout} style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px', fontSize: '16px' }}>
                    Comprar
                </button>
            </div>
        </div>
    )
}
