import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import './MeetDetailsModal.css';

export default function MeetDetailsModal({ isVisible, onClose, meetData }) {
    if (!meetData) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';
            return format(date, 'dd/MM/yyyy HH:mm');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Error de fecha';
        }
    };

    const header = (
        <div className="modal-header">
            <h2>Detalles de la Clase</h2>
        </div>
    );

    const footer = (
        <div className="modal-footer">
            <Button label="Cerrar" icon="pi pi-times" onClick={onClose} />
        </div>
    );

    return (
        <Dialog
            header={header}
            visible={isVisible}
            onHide={onClose}
            footer={footer}
            style={{ width: '50vw' }}
            className="meet-details-modal"
        >
            <div className="meet-details-content">
                <div className="meet-image-section">
                    {meetData.meet?.imagePath && (
                        <img 
                            src={meetData.meet.imagePath} 
                            alt={meetData.meet.name || 'Clase'} 
                            className="meet-image"
                        />
                    )}
                </div>
                
                <div className="meet-info-section">
                    <div className="info-row">
                        <label className="info-label">Nombre de la Clase:</label>
                        <span className="info-value">{meetData.meet?.name || 'N/A'}</span>
                    </div>
                    
                    <div className="info-row">
                        <label className="info-label">Fecha de la Clase:</label>
                        <span className="info-value">{formatDate(meetData.meet?.meetDate)}</span>
                    </div>
                    
                    <div className="info-row">
                        <label className="info-label">URL de la Reunión:</label>
                        <span className="info-value">
                            {meetData.meet?.meetUrl ? (
                                <a 
                                    href={meetData.meet.meetUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="meet-url"
                                >
                                    {meetData.meet.meetUrl}
                                </a>
                            ) : 'N/A'}
                        </span>
                    </div>
                    
                    <div className="info-row">
                        <label className="info-label">Precio:</label>
                        <span className="info-value price">€{meetData.price || 'N/A'}</span>
                    </div>
                </div>

                <div className="purchase-info-section">
                    <h3>Información de Compra</h3>
                    <div className="info-row">
                        <label className="info-label">Email del Cliente:</label>
                        <span className="info-value">{meetData.user?.email || 'N/A'}</span>
                    </div>
                    
                    <div className="info-row">
                        <label className="info-label">Fecha de Compra:</label>
                        <span className="info-value">{formatDate(meetData.purchaseDate)}</span>
                    </div>
                    
                    <div className="info-row">
                        <label className="info-label">ID de Compra:</label>
                        <span className="info-value purchase-id">{meetData.id || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}

MeetDetailsModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    meetData: PropTypes.object
}; 