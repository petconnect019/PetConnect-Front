import React from 'react'
import Logo from '../../assets/PetConnect Logo.png'

import DogGift from '../../assets/DogSpinner.gif'

export const SplashScreen = () => {
  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-orange-400 flex flex-col justify-center items-center text-white z-50'>
        <div className='flex flex-col items-center justify-center h-80'>
            <img src={Logo} alt="Logo" className='w-32 sm:w-24 mb-2' />
            <h1 className='text-2xl sm:text-xl font-bold text-center'>PetConnect</h1>
        </div>
        <img src={DogGift} alt="Cargando..." className='w-20 h-20 mt-[2rem]' />
    </div>
  )
}
