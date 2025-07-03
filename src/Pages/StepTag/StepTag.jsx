import { useNavigate, useParams } from "react-router-dom"
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary"
import AddTag from '../../assets/images/addTag.png'
import { NavButtonStep } from "../../Components/NavButtonStep/NavButtonStep"

export const StepTag = () => {
    const { pet_id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-between min-h-screen bg-gray-50 p-6">
            <NavButtonStep onClick={() => navigate('/step-pet')} text={'3/3'} />

            <main className="flex flex-col items-center text-center">
                <img src={AddTag} alt="Añadir Tag" className="w-48 h-48 mb-8" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Ya casi terminas!</h2>
                <p className="text-gray-600 mb-8 max-w-sm">
                    Ahora, escanea el código QR de la placa PetConnect para vincularla a tu mascota.
                </p>
            </main>
            
            <div className="w-full">
                <ButtonPrimary 
                    text='Escanear QR' 
                    onClick={() => navigate(`/scanner/${pet_id}`)}
                />
            </div>
        </div>
    );
}