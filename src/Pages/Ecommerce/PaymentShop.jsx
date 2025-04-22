import React, { useEffect, useState } from 'react'
import { isTokenExpired } from '../../Utils/Helpers/IsTokenExpired/IsTokenExpired';
import { FetchRefreshToken } from '../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken';
import { useForm } from 'react-hook-form';
import OrderService from '../../Utils/OrderPayment/orderService';
import { NavButton } from '../../Components/NavButton/NavButton';
import { useNavigate } from 'react-router-dom';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import { InputField } from '../../Components/InputField/InputField';
import WarningImg from '../../assets/images/advertising.png';
import ErrorImg from '../../assets/images/error.png';
import SuccessImg from '../../assets/images/succes.png';
import { ModalResponseEpayco } from '../../Components/ModalBasic/ModalResponseEpayco';

export const PaymentShop = () => {
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        quantity: 1,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        shippingAddress: '',
        shippingCity: '',
        shippingState: '',
        shippingCountry: 'Colombia',
        shippingPostalCode: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [error, setError] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        mode: 'onChange',
        defaultValues: formData
    });

    useEffect(() => {
        const checkSession = async () => {
            const token = sessionStorage.getItem('accessToken');
            if (!token || await isTokenExpired(token)) {
                try {
                    const newToken = await FetchRefreshToken();
                    if (!newToken) {
                        setSessionExpired(true);
                    }
                } catch (error) {
                    setSessionExpired(true);
                }
            }
        };
        checkSession();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setValue(name, value);
    };

    const createOrder = async (formData) => {
        setIsLoading(true);
        setError(null);

        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token || await isTokenExpired(token)) {
                throw new Error('Sesión expirada');
            }

            const orderData = {
                quantity: parseInt(formData.quantity),
                customer: {
                    name: formData.customerName.trim(),
                    email: formData.customerEmail.trim(),
                    phone: formData.customerPhone.trim()
                },
                shipping: {
                    address: formData.shippingAddress.trim(),
                    city: formData.shippingCity.trim(),
                    state: formData.shippingState.trim(),
                    country: formData.shippingCountry.trim(),
                    postalCode: formData.shippingPostalCode.trim()
                },
                status: 'pending',
                paymentStatus: 'pending'
            };

            const data = await OrderService.createOrder(orderData);
            
            if (data.success) {
                setOrderCreated(true);
                sessionStorage.setItem('currentOrderId', data.order._id);
            } else {
                throw new Error(data.message || 'Error al crear la orden');
            }
        } catch (error) {
            console.error('Error en createOrder:', error);
            setError(error.message);
            if (error.message === 'Sesión expirada') {
                setSessionExpired(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayWithEpayco = async () => {
        try {
            const orderId = sessionStorage.getItem('currentOrderId');
            if (!orderId) {
                throw new Error('No se encontró la orden');
            }

            const token = sessionStorage.getItem('accessToken');
            if (!token || await isTokenExpired(token)) {
                throw new Error('Sesión expirada');
            }

            // Cargar el script de ePayco si aún no está cargado
            if (!window.ePayco) {
                const script = document.createElement('script');
                script.src = 'https://checkout.epayco.co/checkout.js';
                script.async = true;
                document.body.appendChild(script);
                
                // Esperar a que se cargue el script
                await new Promise(resolve => script.onload = resolve);
            }
            
            // Configurar ePayco
            const handler = window.ePayco.checkout.configure({
                key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
                test: true // Forzar modo de prueba
            });
            
            // Abrir el checkout
            handler.open({
                name: 'Códigos QR PetConnect',
                description: `Orden de ${formData.quantity || 1} códigos QR`,
                currency: 'cop',
                amount: (formData.quantity || 1) * 10000,
                tax_base: '0',
                tax: '0',
                country: 'co',
                lang: 'es',
                external: 'false',
                confirmation: import.meta.env.VITE_EPAYCO_CONFIRMATION_URL || 'http://localhost:5000/api/payments/confirmation', // Webhook que ePayco llamará para notificar al backend
                response: import.meta.env.VITE_EPAYCO_RESPONSE_URL || 'https://secure.epayco.co/landingresume', // URL donde el usuario será redirigido después del pago
                name_billing: formData.customerName || '',
                address_billing: formData.shippingAddress || '',
                email_billing: formData.customerEmail || '',
                mobilephone_billing: formData.customerPhone || '',
                extra1: orderId
            });
        } catch (error) {
            console.error('Error en handlePayWithEpayco:', error);
            setError(error.message);
            if (error.message === 'Sesión expirada') {
                setSessionExpired(true);
            }
        }
    };

    return (
        <div className='w-full flex flex-col items-center justify-center bg-gray-100'>
            <div className='w-full max-w-2xl bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8'>
                <NavButton onClick={() => navigate(-1)} />
                <div className="text-left space-y-4">
                    <div className="bg-white p-4">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className='text-2xl font-bold text-gray-800'>QR personalizado para tu mascota</h2>
                        </div>
                        <div className="space-y-4">
                            <ul className="list-none pl-0 space-y-3">
                                <li className="flex items-center bg-orange-50 p-3 rounded-lg">
                                    <span className="text-green-500 mr-3 text-xl">✓</span>
                                    <span className="text-gray-700">Diseño único</span>
                                </li>
                                <li className="flex items-center bg-orange-50 p-3 rounded-lg">
                                    <span className="text-green-500 mr-3 text-xl">✓</span>
                                    <span className="text-gray-700">Vinculación a perfil de mascota</span>
                                </li>
                                <li className="flex items-center bg-orange-50 p-3 rounded-lg">
                                    <span className="text-green-500 mr-3 text-xl">✓</span>
                                    <span className="text-gray-700">Acceso a información de contacto</span>
                                </li>
                            </ul>
                            <div className="flex items-center mt-6 p-4 bg-teal-50 rounded-lg">
                                <label htmlFor="quantity" className="font-bold text-gray-700 mx-4">Cantidad:</label>
                                <div className="flex justify-center w-full">
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min="1"
                                        max="10"
                                        value={formData.quantity}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 1 && value <= 10) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    quantity: value
                                                }));
                                            }
                                        }}
                                        className="w-full bg-gray-50 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                                    />
                                </div>
                                {errors.quantity && <span className="text-red-500 text-sm block mt-2 text-center">{errors.quantity.message}</span>}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(createOrder)} className="p-2 bg-white">
                        <div className='border-b border-gray-200 pb-4 mb-4' />
                        <div className="space-y-6">
                            <div className="bg-white p-4">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Datos del Cliente</h2>
                                
                                <div className="space-y-4">
                                    <div className="relative">
                                        <InputField
                                            label="Nombre"
                                            name="customerName"
                                            register={register}
                                            placeholder="Nombre"
                                            validation={{
                                                required: "Nombre es requerido",
                                                minLength: { value: 2, message: "Mínimo 2 caracteres" }
                                            }}
                                            disabled={isLoading}
                                        />
                                        {errors.customerName && <span className="text-red-500 text-sm block mt-1">{errors.customerName.message}</span>}
                                    </div>

                                    <div className="relative">
                                        <InputField
                                            label="Email"
                                            name="customerEmail"
                                            register={register}
                                            placeholder="Email"
                                            validation={{
                                                required: "Email es requerido",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Email inválido"
                                                }
                                            }}
                                            disabled={isLoading}
                                        />
                                        {errors.customerEmail && <span className="text-red-500 text-sm block mt-1">{errors.customerEmail.message}</span>}
                                    </div>

                                    <div className="relative">
                                        <InputField
                                            label="Teléfono"
                                            name="customerPhone"
                                            register={register}
                                            placeholder="Teléfono"
                                            validation={{
                                                required: "Teléfono es requerido",
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: "Teléfono inválido (10 dígitos)"
                                                }
                                            }}
                                            disabled={isLoading}
                                        />
                                        {errors.customerPhone && <span className="text-red-500 text-sm block mt-1">{errors.customerPhone.message}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Datos de Envío</h2>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <InputField
                                            label="Dirección"
                                            name="shippingAddress"
                                            register={register}
                                            placeholder="Dirección"
                                            validation={{
                                                required: "Dirección es requerida",
                                                minLength: { value: 5, message: "Mínimo 5 caracteres" }
                                            }}
                                            disabled={isLoading}
                                        />
                                        {errors.shippingAddress && <span className="text-red-500 text-sm block mt-1">{errors.shippingAddress.message}</span>}
                                    </div>

                                    <div className="relative">
                                        <InputField
                                            label="Ciudad"
                                            name="shippingCity"
                                            register={register}
                                            placeholder="Ciudad"
                                            validation={{
                                                required: "Ciudad es requerida",
                                                minLength: { value: 2, message: "Mínimo 2 caracteres" }
                                            }}
                                            disabled={isLoading}
                                        />
                                        {errors.shippingCity && <span className="text-red-500 text-sm block mt-1">{errors.shippingCity.message}</span>}
                                    </div>

                                    <div className="relative">
                                        <InputField
                                            label="Departamento"
                                            name="shippingState"
                                            register={register}
                                            placeholder="Departamento"
                                            validation={{
                                                required: "Departamento es requerido",
                                                minLength: { value: 2, message: "Mínimo 2 caracteres" }
                                            }}
                                            disabled={isLoading}
                                        />
                                        {errors.shippingState && <span className="text-red-500 text-sm block mt-1">{errors.shippingState.message}</span>}
                                    </div>

                                    <div className="relative">
                                        <InputField
                                            label="Código postal"
                                            name="shippingPostalCode"
                                            register={register}
                                            placeholder="Código postal"
                                            validation={{
                                                required: "Código postal es requerido",
                                                pattern: {
                                                    value: /^[0-9]{6}$/,
                                                    message: "Código postal inválido (6 dígitos)"
                                                }
                                            }}
                                            disabled={isLoading}
                                        />
                                        {errors.shippingPostalCode && <span className="text-red-500 text-sm block mt-1">{errors.shippingPostalCode.message}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <ButtonPrimary text={isLoading ? 'Creando orden...' : 'Crear Orden'} />
                        </div>
                    </form>
                </div>
            </div>

            {/* Modales - Orden de prioridad */}
            {sessionExpired ? (
                <ModalResponseEpayco
                    imgProfile={WarningImg}
                    setModalOpen={setSessionExpired}
                    navigate={navigate}
                    path="/login"
                    textResponse="Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
                    buttonText="Iniciar sesión"
                />
            ) : error ? (
                <ModalResponseEpayco
                    imgProfile={ErrorImg}
                    setModalOpen={() => setError(null)}
                    navigate={navigate}
                    path="/payment/shop"
                    textResponse={error}
                    buttonText="Volver a intentarlo"
                />
            ) : orderCreated ? (
                <ModalResponseEpayco
                    imgProfile={SuccessImg}
                    setModalOpen={setOrderCreated}
                    navigate={navigate}
                    path="/payment/shop"
                    textResponse="Tu orden ha sido creada y está lista para el pago."
                    onClick={handlePayWithEpayco}
                    buttonText="Pagar con ePayco"
                />
            ) : isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Creando tu orden...</p>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
