import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import { useState } from 'react';
import './ImageModal.css';

export default function ImageModal({ isOpen, onClose, imageSrc }) {
    const [imageError, setImageError] = useState(false);

    if (!isOpen) {
        return null;
    }

    const handleImageError = () => {
        setImageError(true);
    };

    const handleClose = () => {
        setImageError(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {imageError ? (
                    <div className="modal-error">
                        <p>No se pudo cargar la imagen</p>
                    </div>
                ) : (
                    <img 
                        src={imageSrc} 
                        alt="Enlarged" 
                        className="modal-image" 
                        onError={handleImageError}
                    />
                )}
                <Button className="modal-close" onClick={handleClose}>X</Button>
            </div>
        </div>
    );
}

// Añadir validación de las props con PropTypes
ImageModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Validar que isOpen sea un booleano requerido
    onClose: PropTypes.func.isRequired, // Validar que onClose sea una función requerida
    imageSrc: PropTypes.string.isRequired, // Validar que imageSrc sea un string requerido
};