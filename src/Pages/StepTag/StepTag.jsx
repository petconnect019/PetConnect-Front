import { useNavigate, useParams } from "react-router-dom"
import Position from "../../assets/images/posicionamiento-Step-Qr.png"
import ImgQR from "../../assets/images/QR.png"
import { NavButtonStep } from "../../Components/NavButtonStep/NavButtonStep"



export const StepTag = () => {
    const navigate = useNavigate();
    const {pet_id} = useParams();

    const handleBack = () => {
        navigate('/step-user');
    }

   


    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <NavButtonStep  onClick={handleBack} img={Position} text={'3/3'} />
                <div className="mb-4 p-2 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Vincula la etiqueta QR de tu mascota</h2>
                    <img src={ImgQR} alt="" />
                <p className="text-center text-gray-600 mb-4">Escanear la etiqueta de la mascota proporciona acceso a su perfil y a su información de contacto.<br/>Con una exploración, tu compañero regresará a casa.</p>
                </div>
                
                <div className="flex flex-col space-y-4">
                    <button onClick={(()=>navigate(`/scanner/${pet_id}`))} className="w-full bg-orange-400 text-white p-3 rounded-lg hover:bg-blue-600 transition">Activar Etiqueta QR</button>
                    <button onClick={(()=>navigate('/ecommerce'))} className="w-full bg-gray-100 text-orange-400 p-3 rounded-lg hover:bg-gray-400 transition">No cuento con una etiqueta QR</button>
                    <button onClick={(()=>navigate('/home'))} className="w-full  text-orange-400 p-3 rounded-lg hover:bg-gray-400 transition">Activar después</button>
                </div>
            </div>
        </div>
    )
}