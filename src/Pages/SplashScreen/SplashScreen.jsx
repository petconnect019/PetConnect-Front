import React from 'react'
import Logo from '../../assets/PetConnect Logo.png'
import DogLoader from '../../assets/Perrito.json'
import Lottie from "lottie-react";

export const SplashScreen = () => {
  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-orange-400 flex flex-col justify-center items-center text-white z-50'>
        <div className='flex flex-col items-center justify-center h-80'>
            <img src={Logo} alt="Logo" className='w-32 sm:w-24 mb-2' />
            <h1 className='text-2xl sm:text-xl font-bold text-center'>PetConnect</h1>
        </div>
        {/* <div className='border-solid border-white border-[0.5rem] w-10 h-10 border-4  border-opacity-30 border-t-orange-500 rounded-full animate-spin mb-8'/> */}
        <Lottie animationData={DogLoader} className='w-50 h-50  mt-[2rem]' />
    </div>
  )
}
