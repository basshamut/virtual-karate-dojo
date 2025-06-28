import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import './CourseDetailsModal.css';

export default function CourseDetailsModal({ isVisible, onClose, meetData, onPurchase }) {
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
            <h2>Detalles del Curso</h2>
        </div>
    );

    const footer = (
        <div className="modal-footer">
            <Button 
                label="Comprar Curso" 
                icon="pi pi-shopping-cart" 
                onClick={() => {
                    onPurchase(meetData);
                    onClose();
                }}
                className="p-button-success"
            />
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
            className="course-details-modal"
        >
            <div className="course-details-content">
                <div className="course-image-section">
                    {meetData.imagePath && (
                        <img 
                            src={meetData.imagePath} 
                            alt={meetData.name || 'Curso'} 
                            className="course-image"
                        />
                    )}
                </div>
                
                <div className="course-info-section">
                    <div className="info-row">
                        <label className="info-label">Nombre del Curso:</label>
                        <span className="info-value course-name">{meetData.name || 'N/A'}</span>
                    </div>
                    
                    <div className="info-row">
                        <label className="info-label">Fecha del Curso:</label>
                        <span className="info-value">{formatDate(meetData.meetDate)}</span>
                    </div>
                    
                    <div className="info-row">
                        <label className="info-label">Precio:</label>
                        <span className="info-value price">€{meetData.price || 'N/A'}</span>
                    </div>
                    
                    {meetData.description && (
                        <div className="info-row description-row">
                            <label className="info-label">Descripción:</label>
                            <span className="info-value description">{meetData.description}</span>
                        </div>
                    )}
                </div>

                <div className="course-features-section">
                    <h3>¿Qué incluye este curso?</h3>
                    <ul className="features-list">
                        <li>✅ Clase en vivo con instructor certificado</li>
                        <li>✅ Material de apoyo incluido</li>
                        <li>✅ Acceso a la grabación (si está disponible)</li>
                        <li>✅ Certificado de participación</li>
                        <li>✅ Soporte técnico durante la clase</li>
                    </ul>
                </div>

                <div className="course-requirements-section">
                    <h3>Requisitos</h3>
                    <ul className="requirements-list">
                        <li>📱 Conexión a internet estable</li>
                        <li>💻 Dispositivo con cámara y micrófono</li>
                        <li>⏰ Disponibilidad en la fecha y hora programada</li>
                        <li>🧘‍♀️ Ropa cómoda para practicar</li>
                    </ul>
                </div>
            </div>
        </Dialog>
    );
}

CourseDetailsModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onPurchase: PropTypes.func.isRequired,
    meetData: PropTypes.object
}; 