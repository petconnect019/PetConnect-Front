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
        <div className="flex flex-col items-center justify-center  ">
            <div className="bg-white ">
             
                <div className="bg-white  shadow-md p-7 h-screen w-full mx-auto md:p-10 lg:p-12  ">
                    <NavButton onClick={onClick} />
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                        Etiqueta de codigo QR para tu que tu mascota tenga una mayor proteccion
                    </h1>
                    
                    <div className="flex justify-center my-8">
                        <img src={ImageQR} alt="QR PetConnect" className="w-85" />
                    </div>
                    <div className='flex flex-col items-center'>
                        <ButtonPrimary path="/payment/shop" text="Comprar" />
                        <button className='flex justify-center w-full max-w-md bg-orange-50 text-brand text-lg py-3 rounded-full mt-8 font-medium items-center gap-2'>
                            <img className='w-6' src={CrownImg} alt="Crown" />
                            Obtén bono de regalo
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};