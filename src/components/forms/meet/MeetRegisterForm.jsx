import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown"; // Importa el Dropdown
import styled from 'styled-components';
import {getApplicationDomain, getBase64CredentialsFromSession} from "../../../utils/session";
import products from "./StripeProducts.json";

const RegisterContainer = styled.div`
  background-image: radial-gradient(circle at left top, var(--primary-400), var(--primary-700));
  color: white;
  padding: 20px;
  text-align: center;
  width: 400px; /* Ancho fijo para todos los campos */
  margin: 0 auto;
  border-radius: 10px;

  @media (max-width: 600px) {
    width: 90%;
    padding: 10px;
  }
`;

const Label = styled.label`
  text-align: left;
  color: var(--primary-50);
  font-weight: 600;
  margin-bottom: 5px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const StyledInputText = styled(InputText)`
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 12px;
  color: var(--primary-50);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const StyledDropdown = styled(Dropdown)`
  width: 200px;
  box-sizing: border-box;
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  box-sizing: border-box;
`;

const StyledButton = styled(Button)`
  padding: 12px;
  width: 100%;
  color: var(--primary-50);
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default function MeetRegisterForm() {
    const today = new Date();
    const [date, setDate] = useState(today);
    const [url, setUrl] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // Añadir estado para la imagen
    const domain = getApplicationDomain();
    const base64Credentials = getBase64CredentialsFromSession();
    const navigate = useNavigate();

    // Preprocesar los productos para mostrar nombre y precio con longitud fija
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
            alert('Solo se permiten archivos de imagen (JPEG, PNG, GIF)');
            event.target.value = '';
            return;
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('El archivo es demasiado grande. Máximo 5MB permitido.');
            event.target.value = '';
            return;
        }

        setSelectedImage(file);
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
        // Validar URL antes de enviar
        if (url && !validateUrl(url)) {
            alert('Por favor, ingrese una URL válida');
            return;
        }

        const product = products.find(item => item.stripeCode === selectedProduct);

        // Crear un FormData para manejar la imagen y los datos del formulario
        const formData = new FormData();
        formData.append('meetUrl', url);
        formData.append('meetDate', date);
        formData.append('product', JSON.stringify(product)); // Convertir a JSON para incluirlo
        if (selectedImage) {
            formData.append('image', selectedImage); // Añadir la imagen al FormData si existe
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
                navigate(0);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    return (
        <RegisterContainer>
            <div className="inline-flex flex-column gap-2" style={{marginBottom: '15px'}}>
                <Label htmlFor="url">Dirección de la Reunión Online</Label>
                <StyledInputText id="url" label="Url" placeholder={"https://meet.google.com/..."}
                                 onChange={event => setUrl(event.target.value)} value={url}
                />
            </div>
            <div className="inline-flex flex-column gap-2" style={{marginBottom: '15px'}}>
                <Label htmlFor="product">Producto</Label>
                <div
                    title={selectedProduct ? formattedProducts.find(p => p.stripeCode === selectedProduct).displayName : ''}>
                    <StyledDropdown
                        id="product"
                        value={selectedProduct}
                        onChange={e => setSelectedProduct(e.value)}
                        options={formattedProducts}
                        optionLabel="displayName"
                        optionValue="stripeCode"
                        placeholder="Selecciona un producto"
                    />
                </div>
            </div>
            <div className="inline-flex flex-column gap-2" style={{marginBottom: '15px'}}>
                <Label htmlFor="meetDate">Fecha de la Reunión</Label>
                <StyledCalendar
                    id="meetDate"
                    value={date}
                    onChange={(e) => setDate(e.value)}
                    dateFormat="dd/mm/yy"
                    minDate={today}
                    showTime
                    hourFormat="24"
                />
            </div>
            <div className="inline-flex flex-column gap-2" style={{marginBottom: '15px'}}>
                <Label htmlFor="image">Subir Imagen</Label>
                <input type="file" id="image" onChange={handleImageUpload} style={{width: '100%'}}/>
            </div>
            <div className="flex align-items-center gap-2">
                <StyledButton label="Registrar" onClick={saveMeet}/>
            </div>
        </RegisterContainer>
    );
}
