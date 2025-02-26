import Intro2 from '../../assets/Introduccion2.png';
import { useNavigate } from 'react-router-dom';

export const Introduction2 = () => {
    const navigate = useNavigate();
    const handleContinue = () => {
        // Redirigir a la siguiente página
        navigate('/welcome');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-end bg-white p-2 relative overflow-hidden">
            {/* Contenedor de fondo con el clip-path */}
            <div 
                className="absolute inset-0 bg-orange-400 flex justify-center items-end h-[33rem] overflow-hidden"
                style={{ clipPath: 'ellipse(100% 270px at center top)' }}
            >
                {/* Imagen de fondo ajustada */}
                <img 
                    src={Intro2} 
                    alt="Introducción" 
                    className="relative top-0 w-full max-w-md max-h-[90vh] h-auto object-contain"
                />
            </div>

            {/* Contenedor blanco con ajustes */}
            <div className="relative w-full max-w-md bg-white shadow-lg flex flex-col items-center z-20 rounded-lg overflow-hidden pt-8 px-4">
                {/* Contenedor con borde negro */}
                <div className="p-6 text-center w-full  flex flex-col items-center rounded-lg">
                    <h2 className="text-xl font-bold">Gestiona la información sobre tu mascota</h2>
                    <p className="text-gray-600">
                        Administra el perfil de tu mascota  y mantén su información siempre disponible.
                    </p>

                    {/* Botón centrado */}
                    <button onClick={handleContinue} className="mt-4 w-full max-w-[20rem] py-3 bg-orange-400 text-white font-semibold rounded-full shadow-md">
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};
