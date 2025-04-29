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
        <div className="flex flex-col items-center justify-center  ">
            <div className=" p-6 w-screen  items-center">
                <NavButtonStep  onClick={handleBack} img={Position} text={'3/3'} />
                <div className="mb-2 p-2 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-center text-gray-800 ">Vincula la etiqueta QR de tu mascota</h2>
                    <img src={ImgQR} alt="" />
                <p className="text-center text-gray-600 ">Escanear la etiqueta de la mascota proporciona acceso a su perfil y a su información de contacto.<br/>Con una exploración, tu compañero regresará a casa.</p>
                </div>
                
                <div className="flex flex-col space-y-3 p-2">
                    <button onClick={(()=>navigate(`/scanner/${pet_id}`))} className="w-full bg-orange-400 text-white p-3 rounded-full hover:bg-blue-600 transition">Activar Etiqueta QR</button>
                    <button onClick={(()=>navigate('/ecommerce'))} className="w-full bg-gray-100 text-orange-400 p-3 rounded-full hover:bg-gray-400 transition">No cuento con una etiqueta QR</button>
                    <button onClick={(()=>navigate('/home'))} className="w-full  text-orange-400 p-3 rounded-full border border-gray-200 hover:bg-gray-400 transition">Activar después</button>
                </div>
            </div>
        </div>
    )
}