import { useNavigate } from "react-router-dom"

export const StepTag = () => {
    const navigate = useNavigate();

    const handleActivateTag = () =>{
        navigate('/scanner');
    }
    const handleNoTag = () => {
        navigate('/ecommerce');
    }
    const handleActiveLater = () => {
        navigate('/home');
    }


    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Vincula la etiqueta QR de tu mascota</h1>
                <p className="text-center text-gray-600 mb-4">Escanear la etiqueta de la mascota proporciona acceso a su perfil y a su información de contacto.<br/>Con una exploración, tu compañero regresará a casa.</p>
                <div className="flex flex-col space-y-4">
                    <button onClick={handleActivateTag} className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">Activar Etiqueta QR</button>
                    <button onClick={handleNoTag} className="w-full bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition">No cuento con una etiqueta QR</button>
                    <button onClick={handleActiveLater} className="w-full bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition">Activar después</button>
                </div>
            </div>
        </div>
    )
}