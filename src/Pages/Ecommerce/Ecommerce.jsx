import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavButton } from '../../Components/NavButton/NavButton';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import ImageQR from '../../assets/images/medalla.png';
import CrownImg from '../../assets/images/Crown.png';
import { FaShieldAlt, FaCheckCircle, FaTruck } from 'react-icons/fa';

export const Ecommerce = () => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate('/home');
    }

    const benefits = [
        {
            icon: <FaShieldAlt className="w-8 h-8 text-brand" />,
            title: "Protección Garantizada",
            description: "Sistema de seguridad avanzado para tu mascota"
        },
        {
            icon: <FaCheckCircle className="w-8 h-8 text-brand" />,
            title: "Calidad Premium",
            description: "Materiales duraderos y resistentes al agua"
        },
        {
            icon: <FaTruck className="w-8 h-8 text-brand" />,
            title: "Envío Rápido",
            description: "Entrega segura en todo el país"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <NavButton onClick={onClick} />
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">¿Necesitas ayuda?</span>
                        <button className="text-brand font-medium">Contactar soporte</button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    {/* Product Image */}
                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
                            <img 
                                src={ImageQR} 
                                alt="QR PetConnect" 
                                className="w-64 h-64 object-contain"
                            />
                        </div>
                        <div className="absolute -top-4 -right-4 bg-brand text-white px-4 py-2 rounded-full text-sm font-medium">
                            Producto destacado
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Etiqueta QR Premium PetConnect
                        </h1>
                        <p className="text-lg text-gray-600">
                            Brinda la máxima protección a tu mascota con nuestra etiqueta QR de alta calidad. Diseñada para durar y mantener a tu compañero seguro.
                        </p>
                        <div className="flex items-center space-x-4">
                            <span className="text-3xl font-bold text-gray-900">$299.00</span>
                            <span className="text-lg text-gray-500 line-through">$399.00</span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                25% OFF
                            </span>
                        </div>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 gap-4 mt-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm">
                                    {benefit.icon}
                                    <div>
                                        <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                                        <p className="text-sm text-gray-500">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
                    <div className="space-y-6">
                        <ButtonPrimary 
                            path="/payment/shop" 
                            text="Comprar Ahora" 
                            className="w-full py-4 text-lg font-medium"
                        />
                        <button className="w-full bg-orange-50 hover:bg-orange-100 transition-colors text-brand py-4 rounded-full text-lg font-medium shadow-sm flex items-center justify-center space-x-3">
                            <img className="w-6 h-6" src={CrownImg} alt="Crown" />
                            <span>Obtén bono de regalo especial</span>
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex justify-center items-center space-x-8">
                            <div className="text-center">
                                <span className="block text-sm font-medium text-gray-900">Pago Seguro</span>
                                <span className="text-xs text-gray-500">SSL Encryption</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-sm font-medium text-gray-900">Garantía</span>
                                <span className="text-xs text-gray-500">30 días</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-sm font-medium text-gray-900">Soporte 24/7</span>
                                <span className="text-xs text-gray-500">Siempre contigo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};