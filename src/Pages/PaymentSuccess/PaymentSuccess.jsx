import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { order, qrCodes } = location.state || {};

    if (!order || !qrCodes) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>No se encontró la información del pago</p>
                <button onClick={() => navigate('/')}>Volver al inicio</button>
            </div>
        );
    }

    return (
        <div className="payment-success">
            <h1>¡Pago Exitoso!</h1>
            <div className="order-details">
                <h2>Detalles de la Orden</h2>
                <p>Número de Orden: {order._id}</p>
                <p>Cantidad de códigos QR: {order.quantity}</p>
                <p>Total pagado: ${order.totalAmount}</p>
            </div>

            <div className="qr-codes">
                <h2>Tus Códigos QR</h2>
                <div className="qr-list">
                    {qrCodes.map((qr, index) => (
                        <div key={qr._id} className="qr-item">
                            <h3>Código QR #{index + 1}</h3>
                            <img src={qr.qrImage} alt={`Código QR ${index + 1}`} />
                            <p>ID: {qr.qrId}</p>
                            <p>Estado: {qr.isActive ? 'Activo' : 'Inactivo'}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="actions">
                <button onClick={() => navigate('/profile')}>Ver en mi perfil</button>
                <button onClick={() => navigate('/')}>Volver al inicio</button>
            </div>
        </div>
    );
};

export default PaymentSuccess; 