import React from 'react'
import ButtonBack from '../../assets/BackButton.png'

export const NavButton = ({onClick,text}) => {
  return (
    <nav className="flex justify-between items-center mb-4">
        <li className="list-none">
            <img  onClick={onClick} src={ButtonBack} alt="Back" />
            <h2>{text}</h2>
        </li>
    </nav>
  )
}
