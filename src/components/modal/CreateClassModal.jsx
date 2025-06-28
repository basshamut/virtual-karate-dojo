import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getApplicationDomain, getBase64CredentialsFromSession } from "../../utils/session";
import products from "../forms/meet/StripeProducts.json";
import './CreateClassModal.css';

const ModalContent = styled.div`
  padding: 1rem;
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--primary-700);
`;

const StyledInputText = styled(InputText)`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--primary-300);
  border-radius: 6px;
  
  &:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 2px var(--primary-100);
  }
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  
  .p-inputtext {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--primary-300);
    border-radius: 6px;
  }
`;

const StyledDropdown = styled(Dropdown)`
  width: 100%;
  
  .p-dropdown {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--primary-300);
    border-radius: 6px;
  }
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--primary-300);
  border-radius: 6px;
  background-color: white;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

export default function CreateClassModal({ isVisible, onClose, onSuccess }) {
    const today = new Date();
    const [date, setDate] = useState(today);
    const [url, setUrl] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const domain = getApplicationDomain();
    const base64Credentials = getBase64CredentialsFromSession();

    // Preprocesar los productos para mostrar nombre y precio
    const formattedProducts = products.map(product => {
        const maxLength = 40;
        const productName = product.name.length > 30 ? product.name.substring(0, 27) + '...' : product.name.padEnd(30);
        const productPrice = `€${product.price.toFixed(2)}`;
        const displayName = `${productName} - ${productPrice}`.padEnd(maxLength);

        return {
            ...product,
            displayName: displayName
        };
    });

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('Solo se permiten archivos de imagen (JPEG, PNG, GIF)');
            event.target.value = '';
            return;
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setErrorMessage('El archivo es demasiado grande. Máximo 5MB permitido.');
            event.target.value = '';
            return;
        }

        setSelectedImage(file);
        setErrorMessage('');
    }

    function validateUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
        } catch {
            return false;
        }
    }

    function saveMeet() {
        // Validar campos requeridos
        if (!url.trim()) {
            setErrorMessage('La URL de la reunión es requerida');
            return;
        }

        if (!validateUrl(url)) {
            setErrorMessage('Por favor, ingrese una URL válida');
            return;
        }

        if (!selectedProduct) {
            setErrorMessage('Por favor, seleccione un producto');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        const product = products.find(item => item.stripeCode === selectedProduct);

        // Crear un FormData para manejar la imagen y los datos del formulario
        const formData = new FormData();
        formData.append('meetUrl', url);
        formData.append('meetDate', date);
        formData.append('product', JSON.stringify(product));
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        fetch(domain + '/meets', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${base64Credentials}`
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                setIsLoading(false);
                onSuccess();
                onClose();
                // Limpiar formulario
                setUrl('');
                setDate(today);
                setSelectedProduct(null);
                setSelectedImage(null);
                setErrorMessage('');
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                setErrorMessage('Error al guardar la clase. Intente nuevamente.');
                setIsLoading(false);
            });
    }

    const header = (
        <div className="modal-header">
            <h2>Crear Nueva Clase</h2>
        </div>
    );

    const footer = (
        <div className="modal-footer">
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                onClick={onClose}
                className="p-button-secondary"
                disabled={isLoading}
            />
            <Button 
                label={isLoading ? "Guardando..." : "Crear Clase"} 
                icon={isLoading ? "pi pi-spinner pi-spin" : "pi pi-check"} 
                onClick={saveMeet}
                className="p-button-success"
                disabled={isLoading}
            />
        </div>
    );

    return (
        <Dialog
            header={header}
            visible={isVisible}
            onHide={onClose}
            footer={footer}
            style={{ width: '50vw' }}
            className="create-class-modal"
            modal
        >
            <ModalContent>
                {errorMessage && (
                    <ErrorMessage>
                        {errorMessage}
                    </ErrorMessage>
                )}

                <FormField>
                    <Label htmlFor="url">Dirección de la Reunión Online *</Label>
                    <StyledInputText 
                        id="url" 
                        placeholder="https://meet.google.com/..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </FormField>

                <FormField>
                    <Label htmlFor="product">Producto *</Label>
                    <StyledDropdown
                        id="product"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.value)}
                        options={formattedProducts}
                        optionLabel="displayName"
                        optionValue="stripeCode"
                        placeholder="Selecciona un producto"
                    />
                </FormField>

                <FormField>
                    <Label htmlFor="meetDate">Fecha de la Reunión *</Label>
                    <StyledCalendar
                        id="meetDate"
                        value={date}
                        onChange={(e) => setDate(e.value)}
                        dateFormat="dd/mm/yy"
                        minDate={today}
                        showTime
                        hourFormat="24"
                    />
                </FormField>

                <FormField>
                    <Label htmlFor="image">Subir Imagen</Label>
                    <FileInput 
                        type="file" 
                        id="image" 
                        onChange={handleImageUpload}
                        accept="image/*"
                    />
                </FormField>
            </ModalContent>
        </Dialog>
    );
}

CreateClassModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
}; 