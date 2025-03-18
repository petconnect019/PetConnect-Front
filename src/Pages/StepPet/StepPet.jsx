import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Position from '../../assets/posicionamiento-Step-user.png';
import ImgFrontal from '../../assets/ImgStepPet.png';
import Paper from '../../assets/Paper.png';
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import { InputField } from "../../Components/InputField/InputField";
import { useForm } from "react-hook-form";
import { NavButtonStep } from "../../Components/NavButtonStep/NavButtonStep";
import { PetTypeSelector } from "../../Components/PetSelector/PetTypeSelector";
import { FetchAddPet } from "../../Utils/Fetch/FetchAddPet/FetchAddPet";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { ButtonSecondary } from "../../Components/Buttons/ButtonSecondary";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";

export const StepPet = () => {
    const navigate = useNavigate();
     const { register, handleSubmit } = useForm();
    const [selectedPet, setSelectedPet] = useState(null);

    const {pet_id} = useParams();
    

   const handleBack = () =>{
    navigate('/login')
   }


   const onSubmitForm = async (dataForm) => {
       const formDataPet = new FormData();
       formDataPet.append("name", dataForm.name);
       formDataPet.append("species", selectedPet);
    
       console.log("Datos que se envían al backend:", Object.fromEntries(formDataPet));

       let token = sessionStorage.getItem("accessToken");


       if (!token) {
        console.error("❌ No hay token disponible. No se puede hacer la petición.");
        return;
        }

        console.log("✅ Token antes de enviar petición:", token);

       if (isTokenExpired(token)) {
         try {
           await FetchRefreshToken();
           token = sessionStorage.getItem("accessToken");
         } catch (error) {
           console.log(error);
           return;
         }
       }
   
       try {
         const response = await FetchAddPet(formDataPet, token);
         if (response.ok) {
           console.log(response);
           const responseData = await response.json(); 
           const pet_id = responseData.id;
           navigate(`/step-tag/${pet_id}`);
         }
       } catch (error) {
         console.error("Error al registrar mascota:", error);
       }
     };
   

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 min-h-screen">
                    <div className="bg-white p-6 rounded-2xl  max-w-sm ">
                        <NavButtonStep  onClick={handleBack} img={Position} text={'2/3'} />
                        <h2 className="text-2xl font-bold mb-2 text-center">Nombra tu mascota 🐾</h2>
                        <img className="mx-auto w-auto h-60" src={ImgFrontal} alt="Pet step" />
        
                        <form onSubmit={handleSubmit(onSubmitForm)} >
                            <div className="flex flex-col gap-2">
        
                                    <InputField
                                        label="Nombre"
                                        icon={Paper}
                                        register={register}
                                        name="name"
                                        placeholder="Nombre"
                                        validation={{ required: "El nombre es obligatorio" }}
                                        />
        
                                    <PetTypeSelector selectedPet={selectedPet} setSelectedPet={setSelectedPet} />           
                            </div>
                            <ButtonPrimary  text='Continuar' />
                            <ButtonSecondary path='/home' text='Saltar' />
                        </form>
                    </div>
                </div>
    );
};
