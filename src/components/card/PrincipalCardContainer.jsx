import { useState } from 'react';
import MeetRegisterForm from "../forms/meet/MeetRegisterForm.jsx";
import { hasSession, isAdmin, isUser } from "../../utils/session.jsx";
import useFetchMeets from '../../hooks/useFetchMeets.js';
import useSessionIds from '../../hooks/useSessionIds.js';
import { Button } from 'primereact/button';
import { DataScroller } from "primereact/datascroller";
import { Divider } from 'primereact/divider';
import { format } from "date-fns";
import { loadStripe } from "@stripe/stripe-js";
import './PrincipalCardContainer.css';
import PurchasesTable from "../table/PurchasesTable";
import ImageModal from '../modal/ImageModal';

export default function PrincipalCardContainer() {
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const userSession = hasSession();
    const isUserValue = isUser();
    const isAdminValue = isAdmin();
    const { meets, error } = useFetchMeets(isUserValue, userSession);

    const stripePromise = loadStripe("pk_test_51PSHknKnVUk9u0R7xWznb2PU2LeYeOgFXDVB14wP4BvJQBJ3RdH0ZLF801Ka7oLlNd7pFV7VZndQa2soCDluMFf200UugFXgnD");
    const fetchSessionId = useSessionIds();

    const handleCheckout = async (meet) => {
        const stripe = await stripePromise;
        try {
            const sessionId = await fetchSessionId(meet);
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                console.error('Stripe checkout error', error);
            }
        } catch (error) {
            console.error('Error during checkout', error);
        }
    };

    const openModal = (imagePath) => {
        if (!imagePath) return;
        setImageSrc(imagePath);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const formatMeetDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            return format(date, 'dd/MM/yyyy HH:mm');
        } catch (error) {
            console.error('Error formatting meet date:', error);
            return 'Error de fecha';
        }
    };

    const itemTemplate = (meet) => {
        if (!meet) return null;
        
        return (
            <div className="col-12 meet-item">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img
                        className="w-9 sm:w-4rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                        src={meet.imagePath || ''}
                        alt={meet.name || 'Clase'}
                        onClick={() => meet.imagePath && openModal(meet.imagePath)}  // Abrir modal al hacer clic
                        style={{ cursor: meet.imagePath ? 'pointer' : 'default' }}  // Cambiar el cursor para indicar clic
                    />
                    <div
                        className="flex flex-column lg:flex-row justify-content-between align-items-center xl:align-items-start lg:flex-1 gap-4">
                        <div className="flex flex-column align-items-center lg:align-items-start gap-3">
                            <div className="flex flex-column gap-1">
                                <div className="text-2xl font-bold text-900">{meet.name || 'Sin nombre'}</div>
                                <div className="text-2xl font-bold text-900">
                                    <span className="text-2xl font-semibold">{meet.price || 0}€</span>
                                </div>
                                <div className="text-900">Fecha: {formatMeetDate(meet.meetDate)}</div>
                            </div>
                        </div>
                        <div
                            className="flex flex-row lg:flex-column align-items-center lg:align-items-end gap-4 lg:gap-2">
                            <Button icon="pi pi-shopping-cart" label="Comprar"
                                    onClick={() => handleCheckout(meet)}></Button>
                        </div>
                    </div>
                </div>
                <Divider />
            </div>
        );
    };

    return (
        <div className="card principal-card-container">
            {isUserValue &&
                <div className="card">
                    <DataScroller value={meets} itemTemplate={itemTemplate} rows={50} buffer={0.2}
                                  header="Clases Programadas"/>
                </div>
            }
            {isAdminValue && (
                <div className="dashboard-container flex">
                    <div className="dashboard-section" style={{flex: 1, marginRight: '1rem'}}>
                        <MeetRegisterForm/>
                    </div>
                    <div className="dashboard-section" style={{flex: 2}}>
                        <PurchasesTable/>
                    </div>
                </div>
            )}
            {/* ImageModal para agrandar la imagen */}
            <ImageModal isOpen={isOpen} onClose={closeModal} imageSrc={imageSrc} />
        </div>
    );
}
