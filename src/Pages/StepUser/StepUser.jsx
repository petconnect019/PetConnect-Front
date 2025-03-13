import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Position from '../../assets/posicionamiento-Step-user.png';
import DefaultProfile from '../../assets/DefaultProfile.png';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { NavButton } from "../../Components/NavButton/NavButton";
import Paper from '../../assets/Paper.png';
import { InputField } from "../../Components/InputField/InputField";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import EditImg from '../../assets/EditImg3.png'
import { FetchUpdatePhotoU } from "../../Utils/Fetch/FetchUpdatePhotoU/FetchUpdatePhotoU";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { FetchUpdateUser } from "../../Utils/Fetch/FetchUpdateUser/FetchUpdateUser";



export const StepUser = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [profileImage, setProfileImage] = useState(DefaultProfile);
    const [filePfp, setFilePfp] = useState(null);
    const [phone, setPhone] = useState(""); 


    const handleBack = () => {
        navigate('/step-pet')
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setProfileImage(imageUrl);
          setFilePfp(file);
        }
      };


      const onSubmitForm = async (dataForm) => { 
          const formDataUser = new FormData();
          formDataUser.append('name', dataForm.name);
          formDataUser.append('phone', phone);
          formDataUser.append('gender', dataForm.gender);
          formDataUser.append('profile_picture', filePfp);
      
          console.log("Datos enviados:", Object.fromEntries(formDataUser));
          
          let token = sessionStorage.getItem('accessToken');

        if (!token || isTokenExpired(token)) {
            try {
                await FetchRefreshToken();
                token = sessionStorage.getItem('accessToken');
            } catch (error) {
                console.log("Error al refrescar el token:", error);
                return;
            }
        }

      
          try {
              const response = await FetchUpdatePhotoU(formDataUser, token); 

              if(response.ok){
                try {
                    const response = await FetchUpdateUser(formDataUser, token); 
                    if(response.ok){
                        console.log("Registro exitoso del Usuario" , response);
                        
                    }
                  
                } catch (error) {
                  console.error("Error al registrar Usuario:", error);
                  
                }
              }
            
          } catch (error) {
            console.error("Error al Registrar la Foto del Usuario:", error);
            
          }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 p-6 min-h-screen">
            <div className="bg-white p-6 rounded-2xl  max-w-sm ">
                <NavButton  onClick={handleBack} img={Position} text={'2/3'} />
                <div className="mb-4 p-2">
                        <h2 className="text-2xl font-bold mb-2 ">¡Pasos finales!</h2>
                        <p className=" text-gray-600 mb-4">¡Ya casi llegamos! Completa tus datos personales para crear un perfil y comenzar tu viaje hacia una amistad peluda.</p>
                    </div>

                <div className="flex justify-center mb-6">
                            <label htmlFor="profile-upload" className="relative cursor-pointer">
                              <img
                                src={profileImage}
                                alt='userImgDefault'
                                className="w-32 h-30 rounded-full object-cover "
                              />
                              <span className='absolute bottom-1 right-0 '><img className=' rounded-[0.5rem] w-6 h-6' src={EditImg} alt="EditImgIcon" /></span>
                            </label>
                            <input
                              id="profile-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </div>
                <form onSubmit={handleSubmit(onSubmitForm)} >
                    
                    <div className="flex flex-col gap-2 mt-4">
                        <label className="font-semibold" >Nombre Completo</label>
                        <InputField
                            
                            icon={Paper}
                            register={register}
                            name="name"
                            placeholder="Nombre Completo"
                            validation={{ required: "El nombre es obligatorio" }}
                        />

                        <label>Número de Teléfono</label>
                        <PhoneInput
                            country={"co"} 
                            value={phone}
                            onChange={setPhone}
                            onlyCountries={["co"]}
                            inputClass="w-full !w-[100%] p-3 border-none  rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-brand"
                            containerClass="h-[2.7rem] w-full mb-3 bg-gray-100 "
                        />

                        <label>Género</label>
                        <select {...register("gender")} className="w-full p-3 mb-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand">
                            <option value="">Selecciona tu género</option>
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <ButtonPrimary path='/step-tag' text='Continuar' />
                </form>
            </div>
        </div>
    );
};
