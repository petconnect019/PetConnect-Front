import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavButton } from '../../Components/NavButton/NavButton';
import { useAuth } from '../../Contexts/AuthContext/AuthContext';
import ImageQR from '../../assets/images/Tag1.jpg';
import ImageQR2 from '../../assets/images/Tag2.jpg';
import { FaShieldAlt, FaCheckCircle, FaTruck, FaChevronLeft, FaChevronRight, FaStar, FaHeadset, FaCreditCard, FaTimes } from 'react-icons/fa';

export const Ecommerce = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [currentImage, setCurrentImage] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const images = [ImageQR, ImageQR2];

    const onClick = () => {
        navigate('/home');
    }

    const handleSupportClick = () => {
        navigate('/support');
    }

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const benefits = [
        {
            icon: <FaShieldAlt className="w-5 h-5 text-brand" />,
            title: "Protección Total",
            description: "Tecnología avanzada de rastreo"
        },
        {
            icon: <FaCheckCircle className="w-5 h-5 text-brand" />,
            title: "Calidad Garantizada",
            description: "2 años de garantía incluida"
        },
        {
            icon: <FaTruck className="w-5 h-5 text-brand" />,
            title: "Envío Express",
            description: "Entrega en 24-48 horas"
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <NavButton onClick={onClick} />
                        <div className="hidden sm:flex items-center space-x-4">
                            <div className="flex items-center space-x-1 text-yellow-400">
                                <FaStar className="w-4 h-4" />
                                <FaStar className="w-4 h-4" />
                                <FaStar className="w-4 h-4" />
                                <FaStar className="w-4 h-4" />
                                <FaStar className="w-4 h-4" />
                                <span className="ml-2 text-sm text-gray-600">4.9/5 (2,831)</span>
                            </div>
                            <button 
                                onClick={handleSupportClick}
                                className="flex items-center space-x-2 text-brand hover:text-brand/80 transition-colors text-sm"
                            >
                                <FaHeadset className="w-4 h-4" />
                                <span>Soporte</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-3xl mx-auto">
                        {/* Product Title and Badges */}
                        <div className="text-center mb-8">
                            <div className="flex justify-center flex-wrap gap-2 mb-3">
                                <span className="px-2 py-1 bg-brand/10 text-brand rounded-full text-xs font-medium">
                                    Nuevo
                                </span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    En Stock
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                Etiqueta QR Premium PetConnect
                            </h1>
                            <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                                Sistema de identificación inteligente que mantiene a tu mascota segura las 24 horas. Diseño elegante y resistente al agua.
                            </p>
                        </div>

                        {/* Product Image Carousel */}
                        <div className="relative mb-8">
                            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 max-w-lg mx-auto">
                                <div className="relative aspect-square">
                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`QR PetConnect ${index + 1}`}
                                            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                                                currentImage === index ? 'opacity-100' : 'opacity-0'
                                            }`}
                                            onClick={togglePopup}
                                        />
                                    ))}
                                    
                                    {/* Navigation Arrows */}
                                    <button 
                                        onClick={prevImage}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-all"
                                    >
                                        <FaChevronLeft className="w-3 h-3 text-gray-800" />
                                    </button>
                                    <button 
                                        onClick={nextImage}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-sm transition-all"
                                    >
                                        <FaChevronRight className="w-3 h-3 text-gray-800" />
                                    </button>

                                    {/* Dots Indicator */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5">
                                        {images.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImage(index)}
                                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                                    currentImage === index ? 'bg-brand w-3' : 'bg-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex items-baseline justify-center gap-3">
                                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">$29.900</span>
                                    <span className="text-base text-gray-500 line-through">$38.000</span>
                                    <span className="text-sm text-green-600 font-medium">Ahorras $8.100</span>
                                </div>
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                    <FaCreditCard className="w-4 h-4 text-brand" />
                                    <span>Pago seguro por ePayco</span>
                                </div>
                                <p className="text-sm text-gray-500 text-center">
                                    Incluye envío express y activación inmediata
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="grid sm:grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 bg-white p-2 rounded-full">
                                            {benefit.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">{benefit.title}</h3>
                                            <p className="text-xs text-gray-500">{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Call to Action */}
                            <div className="space-y-3 pt-4">
                                <button
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            localStorage.setItem('redirectAfterLogin', '/payment/shop');
                                            navigate('/login');
                                        } else {
                                            navigate('/payment/shop');
                                        }
                                    }}
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 rounded-xl text-base font-medium hover:opacity-90 transition-all"
                                >
                                    Comprar Ahora
                                </button>
                            </div>

                            {/* Trust Elements */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <span className="block text-xs font-medium text-gray-900">Pago 100% Seguro</span>
                                        <span className="text-[10px] text-gray-500">Procesado por ePayco</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-xs font-medium text-gray-900">Garantía de 2 Años</span>
                                        <span className="text-[10px] text-gray-500">Devolución gratis</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-xs font-medium text-gray-900">Soporte Premium</span>
                                        <span className="text-[10px] text-gray-500">24/7 Disponible</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={togglePopup}>
                    <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={togglePopup}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                        <div className="relative aspect-square md:aspect-[4/3] w-full">
                            <img
                                src={images[currentImage]}
                                alt={`QR PetConnect ${currentImage + 1}`}
                                className="absolute inset-0 w-full h-full object-contain"
                            />
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                            >
                                <FaChevronLeft className="w-5 h-5 text-gray-800" />
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                            >
                                <FaChevronRight className="w-5 h-5 text-gray-800" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};