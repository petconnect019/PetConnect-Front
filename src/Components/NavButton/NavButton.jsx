import React from 'react';
import ButtonBack from '../../assets/images/BackButton.png';

export const NavButton = ({ onClick, text }) => {
  return (
    <nav className="w-full">
      <li className="list-none flex justify-between items-center">
        <img 
          onClick={onClick} 
          src={ButtonBack} 
          alt="Back" 
          className="w-8 h-8 cursor-pointer sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-12 2xl:h-12 4xl:w-14 4xl:h-14"
        />   
        <h2 className="text-lg font-medium sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">{text}</h2>
      </li>
    </nav>
  );
};
