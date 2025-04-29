import React, { useEffect, useState, useCallback } from 'react'
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
import { ModalSpinner } from '../../Components/ModalBasic/ModalSpinner';

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

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        mode: 'onChange',
        defaultValues: formData
    });

    const [showSpinner, setShowSpinner] = useState(false);

    // Cargar datos del usuario existente
    useEffect(() => {
        const loadUserData = () => {
            const userData = sessionStorage.getItem('userData');
            if (userData) {
                try {
                    const parsedUserData = JSON.parse(userData);
                    setFormData(prev => ({
                        ...prev,
                        customerName: parsedUserData.name || '',
                        customerEmail: parsedUserData.email || '',
                        customerPhone: parsedUserData.phone || '',
                        shippingAddress: parsedUserData.address || '',
                        shippingCity: parsedUserData.city || '',
                        shippingState: parsedUserData.state || '',
                        shippingCountry: parsedUserData.country || 'Colombia'
                    }));

                    // Actualizar los valores del formulario
                    setValue('customerName', parsedUserData.name || '');
                    setValue('customerEmail', parsedUserData.email || '');
                    setValue('customerPhone', parsedUserData.phone || '');
                    setValue('shippingAddress', parsedUserData.address || '');
                    setValue('shippingCity', parsedUserData.city || '');
                    setValue('shippingState', parsedUserData.state || '');
                    setValue('shippingCountry', parsedUserData.country || 'Colombia');
                } catch (error) {
                    console.error('Error al cargar datos del usuario:', error);
                }
            }
        };

        loadUserData();
    }, [setValue]);

    const [isLoading, setIsLoading] = useState(false);
    const [orderCreated, setOrderCreated] = useState(false);
    const [error, setError] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('ref_payco')) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, []);

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

    // Función optimizada para cargar el script de ePayco
    const loadEpaycoScript = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (window.ePayco) {
                resolve(window.ePayco);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://checkout.epayco.co/checkout.js';
            script.async = true;
            script.onload = () => resolve(window.ePayco);
            script.onerror = () => reject(new Error('No se pudo cargar el script de ePayco'));
            document.body.appendChild(script);
        });
    }, []);

    const handlePayWithEpayco = useCallback(async () => {
        try {
            const orderId = sessionStorage.getItem('currentOrderId');
            if (!orderId) {
                throw new Error('No se encontró la orden');
            }

            const token = sessionStorage.getItem('accessToken');
            if (!token || await isTokenExpired(token)) {
                throw new Error('Sesión expirada');
            }

            // Cargar el script de ePayco usando la función optimizada
            const ePayco = await loadEpaycoScript();
            
            // Configurar ePayco
            const backendUrl = 'https://petconnect-backend-production.up.railway.app';
            const frontendUrl = 'https://pet-connect-front-nu.vercel.app';

            const handler = ePayco.checkout.configure({
                key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
                test: true
            });
            
            // Abrir el checkout con interfaz mejorada
            handler.open({
                // Parámetros de compra (obligatorios)
                name: 'Códigos QR PetConnect',
                description: `Orden de ${formData.quantity || 1} códigos QR para tu mascota`,
                currency: 'cop',
                amount: (formData.quantity || 1) * 15000,
                tax_base: '0',
                tax: '0',
                country: 'co',
                lang: 'es',
                external: true,

                // Información del cliente
                name_billing: formData.customerName,
                address_billing: formData.shippingAddress,
                type_doc_billing: 'cc',
                mobilephone_billing: formData.customerPhone,
                number_doc_billing: '0000000000',
                email_billing: formData.customerEmail,
                
                // Atributos adicionales - el ID de la orden es crucial para el webhook
                extra1: orderId,
                extra2: 'QR_CODES',
                extra3: formData.quantity.toString(),
                
                // URLs de respuesta - Usar las configuradas en el panel de ePayco
                confirmation: `${backendUrl}/api/payments/confirmation`,
                confirmation_url: `${backendUrl}/api/payments/confirmation`,
                
                // ID de la orden en tu sistema (referencia interna)
                reference: orderId,
                
                // Personalización visual usando onePageCheckout
                style_checkout: 'onePageCheckout',
                styleOnePageCheckout: {
                    colorPrimary: '#5046E5',           // Color principal
                    logoHeader: 'https://i.imgur.com/HoQVGlz.png', // Logo de PetConnect
                    bankLogos: 'on',                   // Mostrar logos de bancos
                    colorHeader: '#4338CA',            // Color del encabezado
                    colorBtn: '#10B981',               // Color del botón principal (verde)
                    colorBackground: '#F9FAFB',        // Fondo muy claro
                    colorFontBtn: '#FFFFFF',           // Texto de botón blanco
                    colorFooter: '#F3F4F6',            // Footer claro
                    colorFontBtnHover: '#FFFFFF',      // Texto de botón hover
                    heightLogo: '50px',                // Altura del logo
                    colorBtnHover: '#059669',          // Color botón hover
                    textBtn: 'Pagar ahora',            // Texto botón personalizado
                    minimumCellWidth: 'false',         // Para dispositivos pequeños
                    haveHeader: 'true',                // Mantener el encabezado
                    fontFamily: 'Inter, system-ui, sans-serif', // Fuente moderna
                },
                
                // Optimización para móviles
                responsive: true,
            });
        } catch (error) {
            console.error('Error en handlePayWithEpayco:', error);
            setError(error.message);
            if (error.message === 'Sesión expirada') {
                setSessionExpired(true);
            } else if (error.message === 'No se pudo cargar el script de ePayco') {
                setError('No se pudo conectar con ePayco. Por favor, intenta nuevamente.');
            }
        }
    }, [formData, loadEpaycoScript]);

    const handleStartPayment = useCallback(() => {
        setOrderCreated(false);
        setShowSpinner(true);
        
        // Esperar 1.5 segundos antes de iniciar el pago
        setTimeout(() => {
            handlePayWithEpayco();
        }, 1500);
    }, []);

    return (
        <div className='w-full flex flex-col items-center justify-center bg-gray-100'>
            <div className='w-full max-w-2xl bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8'>
                <NavButton onClick={() => navigate('/Ecommerce')} />
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
                                                required: "El nombre es obligatorio",
                                                minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" },
                                                pattern: {
                                                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                                    message: "El nombre solo puede contener letras y espacios"
                                                }
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
                                                required: "El correo electrónico es obligatorio",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Por favor ingresa un correo electrónico válido (ejemplo: usuario@dominio.com)"
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
                                                required: "El número de teléfono es obligatorio",
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: "El teléfono debe tener 10 dígitos numéricos, sin espacios ni caracteres especiales"
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
                                                required: "La dirección de envío es obligatoria",
                                                minLength: { 
                                                    value: 5, 
                                                    message: "La dirección debe tener al menos 5 caracteres" 
                                                },
                                                pattern: {
                                                    value: /^[a-zA-Z0-9\s.#-]+$/,
                                                    message: "Por favor ingresa una dirección válida (puede contener letras, números, #, - y .)"
                                                }
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
                                                required: "La ciudad es obligatoria",
                                                minLength: { 
                                                    value: 2, 
                                                    message: "El nombre de la ciudad debe tener al menos 2 caracteres" 
                                                },
                                                pattern: {
                                                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                                    message: "El nombre de la ciudad solo puede contener letras y espacios"
                                                }
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
                                                required: "El departamento es obligatorio",
                                                minLength: { 
                                                    value: 3, 
                                                    message: "El nombre del departamento debe tener al menos 3 caracteres" 
                                                },
                                                pattern: {
                                                    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                                                    message: "El nombre del departamento solo puede contener letras y espacios"
                                                }
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
                                                required: "El código postal es obligatorio",
                                                pattern: {
                                                    value: /^[0-9]{6}$/,
                                                    message: "El código postal debe tener exactamente 6 dígitos numéricos"
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
                    textTitle="Sesión expirada"
                    setModalOpen={setSessionExpired}
                    navigate={navigate}
                    path="/login"
                    textResponse="Tu sesión ha expirada. Por favor, inicia sesión nuevamente."
                    buttonText="Iniciar sesión"
                />
            ) : error ? (
                <ModalResponseEpayco
                    imgProfile={ErrorImg}
                    textTitle="Error al crear la orden"
                    setModalOpen={() => setError(null)}
                    navigate={navigate}
                    path="/payment/shop"
                    textResponse={error}
                    buttonText="Volver a intentarlo"
                />
            ) : orderCreated ? (
                <ModalResponseEpayco
                    imgProfile={SuccessImg}
                    textTitle="Orden creada"
                    setModalOpen={setOrderCreated}
                    navigate={navigate}
                    path="/payment/shop"
                    textResponse="Tu orden ha sido creada y está lista para el pago."
                    onClick={handleStartPayment}
                    buttonText="Pagar con ePayco"
                    buttonText2="Revisar tus datos de envío"
                    onClick2={() => setOrderCreated(false)}
                />
            ) : isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-center">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Creando tu orden...</p>
                    </div>
                </div>
            ) : null}
            {showSpinner && <ModalSpinner />}
        </div>
    );
}