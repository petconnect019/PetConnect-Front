import React from 'react';
import ButtonBack from '../../assets/images/BackButton.png';

export const NavButton = ({ onClick, text }) => {
  return (
    <nav className="p-4">
      <li className="list-none flex justify-between items-center">
        <img 
          onClick={onClick} 
          src={ButtonBack} 
          alt="Back" 
          className="w-8 h-8 cursor-pointer" // Ajustando el tamaño moderado
        />   
        <h2 className="text-lg font-medium">{text}</h2> {/* Ajustando el tamaño del texto */}
      </li>
    </nav>
  );
};
