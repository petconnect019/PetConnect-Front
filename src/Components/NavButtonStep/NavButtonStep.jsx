import React from 'react'
import ButtonBack from '../../assets/images/BackButton.png'
import Position from '../../assets/images/posicionamiento-Step.png';

export const NavButtonStep = ({onClick,text,img}) => {
  return (
    <nav className="mb-4">
        <li className="list-none flex justify-between items-center">
            <img 
                onClick={onClick} 
                src={ButtonBack} 
                alt="Back" 
                className='w-8 h-8
                    xs:w-9 xs:h-9
                    sm:w-10 sm:h-10
                    md:w-11 md:h-11
                    lg:w-12 lg:h-12
                    xl:w-14 xl:h-14
                    2xl:w-16 2xl:h-16
                    3xl:w-18 3xl:h-18
                    4xl:w-20 4xl:h-20'
            />
            <img 
                src={Position} 
                alt="navegate" 
                className='h-[0.7rem] w-[11.25rem] 
                    xs:h-[0.8rem] xs:w-[12.5rem]
                    sm:h-[0.9rem] sm:w-[14rem]
                    md:h-[1rem] md:w-[16rem]
                    lg:h-[1.1rem] lg:w-[18rem]
                    xl:h-[1.2rem] xl:w-[20rem]
                    2xl:h-[1.3rem] 2xl:w-[22rem]
                    3xl:h-[1.4rem] 3xl:w-[24rem]
                    4xl:h-[1.5rem] 4xl:w-[26rem]'
            />
            <h2 className='text-base font-semibold
                xs:text-lg
                sm:text-xl
                md:text-2xl
                lg:text-3xl
                xl:text-4xl
                2xl:text-5xl
                3xl:text-6xl
                4xl:text-7xl'>{text}</h2>
        </li>
    </nav>
  )
}
