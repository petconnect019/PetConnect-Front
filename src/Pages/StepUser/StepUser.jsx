import { useNavigate } from "react-router-dom";
import Position from '../../assets/posicionamiento-Step-user.png'
import BackButton from '../../assets/back-button.png'

export const StepUser = () => {
    const navigate = useNavigate();

    const handleContinue = () => {
        navigate("/step-tag");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 ">
            <div className="bg-white p-6 rounded-2xl  w-full max-w-md border-solid border-black border[0.2rem]">
                <ul>
                    <li>
                        <img src={Position} alt="" />
                    </li>
                </ul>
                <img src={} alt="" />
                <p>2/3</p>

            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md border-solid border-black border[0.2rem]">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">¡Pasos finales!</h1>
                <p className="text-center text-gray-600 mb-4">¡Ya casi llegamos! Completa tus datos personales para crear un perfil y comenzar tu viaje hacia una amistad peluda.</p>
                <input 
                    type="text" 
                    placeholder="Nombre completo" 
                    className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="tel" 
                    placeholder="Número de teléfono" 
                    className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select 
                    className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Selecciona tu género</option>
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="otro">Otro</option>
                </select>
                <button onClick={handleContinue} className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">Finalizar</button>
            </div>
        </div>
    );
};
