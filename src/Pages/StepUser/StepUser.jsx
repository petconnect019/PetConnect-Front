import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Position from '../../assets/posicionamiento-Step-user.png';
import BackButton from '../../assets/BackButton.png';
import DefaultProfile from '../../assets/DefaultProfile.png';
import { useState } from "react";

export const StepUser = () => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState(""); 

    const handleContinue = () => {
        console.log("Número de teléfono:", phone);
        navigate("/step-tag");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-4 rounded-2xl w-full max-w-md">
                <nav className="flex justify-between items-center mb-[1rem]">
                    <li className="list-none"><img src={BackButton} alt="" /></li>
                    <img src={Position} alt="" />
                    <p>2/3</p>
                </nav>
                <div className="mb-4 p-2">
                    <h2 className="text-2xl font-bold mb-2 ">¡Pasos finales!</h2>
                    <p className=" text-gray-600 mb-4">¡Ya casi llegamos! Completa tus datos personales para crear un perfil y comenzar tu viaje hacia una amistad peluda.</p>
                </div>
                <div className="flex flex-col gap-2 justify-center items-center">
                    <img className="w-1/4 h-auto" src={DefaultProfile} alt="" />
                </div>
                <div className="flex flex-col gap-2">
                    <label>Nombre Completo</label>
                    <input 
                        type="text" 
                        placeholder="Nombre completo" 
                        className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />

                    <label>Número de Teléfono</label>
                    <PhoneInput
                        country={"co"} 
                        value={phone}
                        onChange={setPhone}
                        inputClass="w-full !w-[100%] p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        containerClass="h-[2.7rem] w-full mb-3 bg-orage-400"
                    />

                    <label>Género</label>
                    <select className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400">
                        <option value="">Selecciona tu género</option>
                        <option value="hombre">Hombre</option>
                        <option value="mujer">Mujer</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                <button onClick={handleContinue} className="w-full bg-orange-400 text-white p-3 rounded-lg hover:bg-blue-600 transition">Confirmar</button>
            </div>
        </div>
    );
};
