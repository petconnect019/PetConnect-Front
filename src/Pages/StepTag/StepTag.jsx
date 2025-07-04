import { useNavigate, useParams } from "react-router-dom"
import Position from "../../assets/images/posicionamiento-Step-Qr.png"
import ImgQR from "../../assets/images/QR.png"
import { NavButtonStep } from "../../Components/NavButtonStep/NavButtonStep"

export const StepTag = () => {
    const navigate = useNavigate();
    const {pet_id} = useParams();

    const handleBack = () => {
        navigate('/step-pet');
    }

    return(
        <div className="flex flex-col items-center justify-center">
            <div className="p-6 w-screen items-center">
                <NavButtonStep onClick={handleBack} img={Position} text={'3/3'} />
                <div className="mb-2 p-2 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-center text-gray-800 
                        sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">Vincula la etiqueta QR de tu mascota</h2>
                    <img src={ImgQR} alt="" className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96" />
                    <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                        Escanear la etiqueta de la mascota proporciona acceso a su perfil y a su información de contacto.<br/>
                        Con una exploración, tu compañero regresará a casa.
                    </p>
                </div>
                
                <div className="flex flex-col space-y-3 p-2 max-w-md mx-auto sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl">
                    <button onClick={(()=>navigate(`/scanner/${pet_id}`))} 
                        className="w-full bg-orange-400 text-white p-3 rounded-full hover:bg-blue-600 transition
                        text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                        Activar Etiqueta QR
                    </button>
                    <button onClick={(()=>navigate('/ecommerce'))} 
                        className="w-full bg-gray-100 text-orange-400 p-3 rounded-full hover:bg-gray-400 transition
                        text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                        No cuento con una etiqueta QR
                    </button>
                    <button onClick={(()=>navigate('/home'))} 
                        className="w-full text-orange-400 p-3 rounded-full border border-gray-200 hover:bg-gray-400 transition
                        text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                        Activar después
                    </button>
                </div>
            </div>
        </div>
    )
}
//h