import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OrderService from '../../Utils/OrderPayment/orderService';
import './Payment.css';

export const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentData, setPaymentData] = useState({
        name: '',
        email: '',
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvc: ''
    });

    useEffect(() => {
        const loadOrder = async () => {
            try {
                const orderId = location.state?.orderId;
                if (!orderId) {
                    throw new Error('No se encontró la orden');
                }

                sessionStorage.setItem('currentOrderId', orderId);
                const data = await OrderService.getOrderById(orderId);
                
                if (data.success) {
                    setOrder(data.order);
                } else {
                    throw new Error(data.message || 'Error al cargar la orden');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const epayco = new window.Epayco({
                key: process.env.REACT_APP_EPAYCO_PUBLIC_KEY,
                test: true
            });

            const tokenResponse = await epayco.token.create({
                "card[number]": paymentData.cardNumber.replace(/\s/g, ''),
                "card[exp_year]": paymentData.expYear,
                "card[exp_month]": paymentData.expMonth,
                "card[cvc]": paymentData.cvc
            });

            if (tokenResponse.status) {
                const orderId = sessionStorage.getItem('currentOrderId');
                const paymentData = {
                    token: tokenResponse.id,
                    customerName: paymentData.name,
                    customerEmail: paymentData.email,
                    amount: order.totalAmount
                };

                const response = await OrderService.confirmOrder(orderId, paymentData);
                
                if (response.success) {
                    sessionStorage.removeItem('currentOrderId');
                    navigate('/payment/success', {
                        state: {
                            orderId: orderId,
                            paymentId: response.paymentId
                        }
                    });
                } else {
                    throw new Error(response.message || 'Error al procesar el pago');
                }
            } else {
                throw new Error('Error al crear el token de la tarjeta');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="payment-container">
                <div className="loading-spinner">Cargando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-container">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/ecommerce')}>Volver a intentar</button>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="payment-container">
                <div className="error-message">
                    <h2>Orden no encontrada</h2>
                    <button onClick={() => navigate('/ecommerce')}>Volver al inicio</button>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <div className="payment-card">
                <h1>Procesar Pago</h1>
                
                <div className="order-summary">
                    <h2>Resumen de la Orden</h2>
                    <p>Cantidad de códigos QR: {order.quantity}</p>
                    <p>Total a pagar: ${order.totalAmount.toLocaleString()} COP</p>
                </div>

                <form onSubmit={handleSubmit} className="payment-form">
                    <div className="form-group">
                        <label>Nombre en la tarjeta</label>
                        <input
                            type="text"
                            name="name"
                            value={paymentData.name}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={paymentData.email}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Número de tarjeta</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="card-details">
                        <div className="form-group">
                            <label>Mes de expiración</label>
                            <input
                                type="text"
                                name="expMonth"
                                value={paymentData.expMonth}
                                onChange={handleInputChange}
                                placeholder="MM"
                                maxLength="2"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Año de expiración</label>
                            <input
                                type="text"
                                name="expYear"
                                value={paymentData.expYear}
                                onChange={handleInputChange}
                                placeholder="YY"
                                maxLength="2"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>CVC</label>
                            <input
                                type="text"
                                name="cvc"
                                value={paymentData.cvc}
                                onChange={handleInputChange}
                                placeholder="123"
                                maxLength="3"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="pay-button"
                        disabled={loading}
                    >
                        {loading ? 'Procesando pago...' : 'Pagar ahora'}
                    </button>
                </form>
            </div>
        </div>
    );
}; 