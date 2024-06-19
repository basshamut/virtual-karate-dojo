import React, { useCallback } from "react";
import { loadStripe } from '@stripe/stripe-js';

export default function CheckoutForm() {
    const stripePromise = loadStripe("pk_test_51PSHknKnVUk9u0R7xWznb2PU2LeYeOgFXDVB14wP4BvJQBJ3RdH0ZLF801Ka7oLlNd7pFV7VZndQa2soCDluMFf200UugFXgnD");

    const fetchSessionId = useCallback(() => {
        return fetch("http://localhost:5000/api/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                if (!data.sessionId) {
                    throw new Error('Missing sessionId in response');
                }
                return data.sessionId;
            })
            .catch((error) => {
                console.error('Error fetching sessionId:', error);
                throw error;
            });
    }, []);

    const handleCheckout = async () => {
        const stripe = await stripePromise;
        try {
            const sessionId = await fetchSessionId();
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                console.error('Stripe checkout error', error);
            }
        } catch (error) {
            console.error('Error during checkout', error);
        }
    };

    return (
        <div id="checkout">
            <div style={{ backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))', color: 'white', padding: '20px', textAlign: 'center' }}>
                <h1>SHOTOKAN KARATE</h1>
                <h2>Clase de Karate</h2>
                <p>Precio: <strong>15 €</strong></p>
                <button onClick={handleCheckout} style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px', fontSize: '16px' }}>
                    Comprar
                </button>
            </div>
        </div>
    );
}
