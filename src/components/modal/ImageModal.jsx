import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import './ImageModal.css';

export default function ImageModal({ isOpen, onClose, imageSrc }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={imageSrc} alt="Enlarged" className="modal-image" />
                <Button className="modal-close" onClick={onClose}>X</Button>
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