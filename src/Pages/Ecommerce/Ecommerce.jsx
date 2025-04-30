import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavButton } from '../../Components/NavButton/NavButton';
import ImageQR from '../../assets/images/medalla.png';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import CrownImg from '../../assets/images/Crown.png';

export const Ecommerce = () => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate('/home');
    }

    return (
        <div className="flex items-center justify-center h-auto">
            <div className="flex flex-col p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 3xl:p-16 4xl:p-18 w-screen items-center h-screen">
                <div className="bg-white w-full mx-auto p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 3xl:p-16 4xl:p-18">
                    <NavButton onClick={onClick} />
                    <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl font-bold text-center text-gray-800">
                        Etiqueta de codigo QR para tu que tu mascota tenga una mayor proteccion
                    </h1>
                    
                    <div className="flex justify-center mt-4 xs:mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14 2xl:mt-16 3xl:mt-18 4xl:mt-20">
                        <img src={ImageQR} alt="QR PetConnect" className="w-40 xs:w-44 sm:w-48 md:w-52 lg:w-56 xl:w-60 2xl:w-64 3xl:w-68 4xl:w-72" />
                    </div>
                    <div className='flex flex-col items-center gap-4 xs:gap-5 sm:gap-6 md:gap-7 lg:gap-8 xl:gap-9 2xl:gap-10 3xl:gap-11 4xl:gap-12 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 3xl:p-9 4xl:p-10'>
                        <ButtonPrimary 
                            path="/payment/shop" 
                            text="Comprar" 
                            className="w-full max-w-md mx-auto"
                        />
                        <button className='block mx-auto w-full max-w-md bg-orange-50 text-brand py-3 xs:py-3.5 sm:py-4 md:py-4.5 lg:py-5 xl:py-5 2xl:py-5.5 3xl:py-6 4xl:py-6 rounded-full text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl 3xl:text-3xl 4xl:text-4xl font-medium shadow-md flex items-center justify-center gap-2'>
                            <img className='w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-10 3xl:h-10 4xl:w-12 4xl:h-12' src={CrownImg} alt="Crown" />
                            Obtén bono de regalo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};