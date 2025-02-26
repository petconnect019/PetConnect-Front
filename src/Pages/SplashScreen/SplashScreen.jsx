import React from 'react'
import Logo from '../../assets/PetConnect Logo.png'

export const SplashScreen = () => {
  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-orange-500 flex flex-col justify-center items-center text-white z-50 border-solid border-black border-[0.5rem]'>
        <div className='flex flex-col items-center justify-center flex-grow border-solid border-black border-[0.5rem]'>
            <img src={Logo} alt="Logo" className='w-32 sm:w-24 mb-2' />
            <h1 className='text-2xl sm:text-xl font-bold text-center'>PetConnect</h1>
        </div>
        <div className='border-solid border-white border-[0.5rem] w-10 h-10 border-4  border-opacity-30 border-t-orange-500 rounded-full animate-spin mb-8' />
    </div>
  )
}
