import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import styled from 'styled-components';

const RegisterContainer = styled.div`
    background-image: radial-gradient(circle at left top, var(--primary-400), var(--primary-700));
    color: white;
    padding: 20px;
    text-align: center;
    width: 90%;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 10px;

    @media (max-width: 600px) {
        padding: 10px;
    }
`;

const Label = styled.label`
    text-align: left;
    color: var(--primary-50);
    font-weight: 600;

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

    @media (max-width: 600px) {
        padding: 8px;
    }
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
    const [price, setPrice] = useState(0);
    // const domain = "http://localhost:5000"
    const domain = "http://86.38.204.61";

    function saveMeet() {
        fetch(domain + '/api/meets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ meetUrl: url, meetDate: date, price: price })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                setUrl('');
                setDate(today);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    return (
        <RegisterContainer>
            <div className="inline-flex flex-column gap-2" style={{ marginBottom: '15px' }}>
                <Label htmlFor="url">Dirección de la Reunión Online</Label>
                <StyledInputText id="url" label="Url" placeholder={"https://meet.google.com/..."}
                                 onChange={event => setUrl(event.target.value)} value={url}
                />
            </div>
            <div className="inline-flex flex-column gap-2" style={{ marginBottom: '15px' }}>
                <Label htmlFor="price">Costo (€)</Label>
                <StyledInputText id="price" label="Costo" placeholder={"0.0"}
                                 onChange={event => setPrice(parseFloat(event.target.value))}
                />
            </div>
            <div className="inline-flex flex-column gap-2" style={{ marginBottom: '15px' }}>
                <Label htmlFor="meetDate">Fecha de la Reunión</Label>
                <Calendar id="meetDate" value={date} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy"
                          minDate={today} showTime hourFormat="24" style={{ width: '100%' }}
                />
            </div>
            <div className="flex align-items-center gap-2">
                <StyledButton label="Registrar" onClick={saveMeet} />
            </div>
        </RegisterContainer>
    );
}
