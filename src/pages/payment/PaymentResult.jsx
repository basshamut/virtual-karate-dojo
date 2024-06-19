import { useLocation } from 'react-router-dom';

export default function PaymentResult() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const state = params.get('state');

    return (
        <div>
            {state === 'succeeded' && <p>Pago exitoso</p>}
            {state === 'canceled' && <p>Pago cancelado</p>}
            {!state && <p>Estado desconocido</p>}
        </div>
    );
}
