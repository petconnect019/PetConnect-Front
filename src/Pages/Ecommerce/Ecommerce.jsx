import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavButton } from '../../Components/NavButton/NavButton';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import ImageQR from '../../assets/images/Tag1.png';
import ImageQR2 from '../../assets/images/Tag2.png';
import CrownImg from '../../assets/images/Crown.png';
import { FaShieldAlt, FaCheckCircle, FaTruck, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

export const Ecommerce = () => {
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    const images = [ImageQR, ImageQR2];

    const onClick = () => {
        navigate('/home');
    }

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const benefits = [
        {
            icon: <FaShieldAlt className="w-5 h-5 md:w-6 md:h-6 text-brand" />,
            title: "Protección Total",
            description: "Tecnología avanzada de rastreo"
        },
        {
            icon: <FaCheckCircle className="w-5 h-5 md:w-6 md:h-6 text-brand" />,
            title: "Calidad Garantizada",
            description: "2 años de garantía incluida"
        },
        {
            icon: <FaTruck className="w-5 h-5 md:w-6 md:h-6 text-brand" />,
            title: "Envío Express",
            description: "Entrega en 24-48 horas"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <NavButton onClick={onClick} />
                    <div className="hidden sm:flex items-center space-x-6">
                        <div className="flex items-center space-x-1 text-yellow-400">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <span className="ml-2 text-sm text-gray-600">4.9/5 (2,831 reseñas)</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
                    {/* Product Image Carousel */}
                    <div className="relative order-2 md:order-1">
                        <div className="bg-gray-50 rounded-3xl p-6 md:p-8">
                            <div className="relative aspect-square">
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`QR PetConnect ${index + 1}`}
                                        className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                                            currentImage === index ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    />
                                ))}
                                
                                {/* Navigation Arrows */}
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-all"
                                >
                                    <FaChevronLeft className="w-4 h-4 text-gray-800" />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-all"
                                >
                                    <FaChevronRight className="w-4 h-4 text-gray-800" />
                                </button>

                                {/* Dots Indicator */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
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
                    <div className="space-y-8 order-1 md:order-2">
                        <div>
                            <div className="flex items-center space-x-3 mb-3">
                                <span className="px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-medium">
                                    Nuevo
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    En Stock
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Etiqueta QR Premium PetConnect
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Sistema de identificación inteligente que mantiene a tu mascota segura las 24 horas. Diseño elegante y resistente al agua.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-baseline space-x-3">
                                <span className="text-3xl font-bold text-gray-900">$299.00</span>
                                <span className="text-lg text-gray-500 line-through">$399.00</span>
                                <span className="text-green-600 font-medium">Ahorras $100</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Incluye envío express y activación inmediata
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 bg-brand/5 p-2 rounded-full">
                                        {benefit.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{benefit.title}</h3>
                                        <p className="text-sm text-gray-500">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Call to Action */}
                        <div className="space-y-4 pt-6">
                            <ButtonPrimary 
                                path="/payment/shop" 
                                text="Comprar Ahora" 
                                className="w-full py-4 text-base font-medium rounded-xl"
                            />
                            <button className="w-full bg-brand/5 hover:bg-brand/10 transition-colors text-brand py-4 rounded-xl text-base font-medium flex items-center justify-center space-x-3">
                                <img className="w-5 h-5" src={CrownImg} alt="Crown" />
                                <span>Incluye bono de regalo especial</span>
                            </button>
                        </div>

                        {/* Trust Elements */}
                        <div className="pt-6 border-t border-gray-100">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="text-center">
                                    <span className="block text-sm font-medium text-gray-900">Pago 100% Seguro</span>
                                    <span className="text-xs text-gray-500">Certificado SSL</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-sm font-medium text-gray-900">Garantía de 2 Años</span>
                                    <span className="text-xs text-gray-500">Devolución gratis</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-sm font-medium text-gray-900">Soporte Premium</span>
                                    <span className="text-xs text-gray-500">24/7 Disponible</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};