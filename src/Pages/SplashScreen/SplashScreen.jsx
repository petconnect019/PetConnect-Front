import React, {  useEffect, useState } from 'react'
import Logo from '../../assets/images/PetConnect Logo.png'
import DogGift from '../../assets/images/DogSpinner.gif'
import { useNavigate } from 'react-router-dom'

export const SplashScreen = () => {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate('/introduction1'); 
    }, 800);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-orange-400 flex flex-col justify-center items-center text-white z-50'>
        <div className='flex flex-col items-center justify-center h-80'>
            <img src={Logo} alt="Logo" className='w-32 sm:w-40 sm:h-40 mb-2' />
            <h1 className='text-2xl sm:text-xl font-bold text-center'>PetConnect</h1>
        </div>
        <img src={DogGift} alt="Cargando..." className='w-32 h-32 sm:w-38 sm:h-38 mt-[2rem]' />
    </div>
  )
}
