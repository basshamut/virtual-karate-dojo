import React from 'react';

const KarateClassAd = () => {
    return (
        <div style={{ backgroundColor: 'purple', color: 'white', padding: '20px', textAlign: 'center' }}>
            <h1>SHOTOKAN KARATE</h1>
            <h2>Clase de Karate</h2>
            <p>Precio: <strong>15 €</strong></p>
            <button style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px', fontSize: '16px' }}>
                Comprar
            </button>
            {/*<div style={{ marginTop: '20px' }}>*/}
            {/*    <p>Métodos de pago aceptados:</p>*/}
            {/*    <img src="/path/to/visa.png" alt="VISA" />*/}
            {/*    <img src="/path/to/amex.png" alt="American Express" />*/}
            {/*    <img src="/path/to/discover.png" alt="Discover Network" />*/}
            {/*    <img src="/path/to/mastercard.png" alt="MasterCard" />*/}
            {/*</div>*/}
        </div>
    );
};

export default KarateClassAd;