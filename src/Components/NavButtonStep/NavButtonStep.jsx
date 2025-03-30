import React from 'react'
import ButtonBack from '../../assets/images/BackButton.png'

export const NavButtonStep = ({onClick,text,img}) => {
  return (
    <nav className=" mb-4 p-4">
        <li className="list-none flex justify-between items-center gap-5">
            <img  onClick={onClick} src={ButtonBack} alt="Back"  className='w-10'/>
            <img className='h-[0.7rem]' src={img} alt="navegate" />
            <h2>{text}</h2>
        </li>
    </nav>
  )
}
