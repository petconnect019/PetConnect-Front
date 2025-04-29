const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log(API_URL);


class OrderService {
    static async createOrder(orderData) {
        try {
            console.log('URL de la API:', `${API_URL}/api/orders`);
            console.log('Datos de la orden:', orderData);
            
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear la orden');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en createOrder:', error);
            throw error;
        }
    }

    static async confirmOrder(orderId, paymentData) {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            console.log('Confirmando pago para orden:', orderId);
            console.log('Datos del pago:', paymentData);

            const response = await fetch(`${API_URL}/api/orders/${orderId}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ paymentData })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al confirmar el pago');
            }

            const data = await response.json();

            // Verificar el estado del pago después de la confirmación
            const orderStatus = await this.getOrderById(orderId);
            console.log('Estado de la orden después de la confirmación:', orderStatus);

            if (orderStatus.order.paymentStatus !== 'completed') {
                console.warn('El estado del pago no se actualizó correctamente');
                // Intentar actualizar el estado manualmente
                await this.updatePaymentStatus(orderId, 'completed');
            }

            return data;
        } catch (error) {
            console.error('Error en confirmOrder:', error);
            throw error;
        }
    }

    static async updatePaymentStatus(orderId, status) {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ paymentStatus: status })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el estado del pago');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al actualizar el estado del pago:', error);
            throw error;
        }
    }

    static async getOrderById(orderId) {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener la orden');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getOrderById:', error);
            throw error;
        }
    }

    static async getUserOrders() {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${API_URL}/api/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener las órdenes');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en getUserOrders:', error);
            throw error;
        }
    }
}

export default OrderService; 