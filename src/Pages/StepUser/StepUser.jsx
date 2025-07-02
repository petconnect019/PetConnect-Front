import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DefaultProfile from '../../assets/images/DefaultProfile.png';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Paper from '../../assets/images/Paper.png';
import { InputField } from "../../Components/InputField/InputField";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import EditImg from '../../assets/images/EditImg3.png'
import { NavButtonStep } from "../../Components/NavButtonStep/NavButtonStep";
import {City as ciudadesPorDepartamento} from '../../Utils/Data-Schema/City'
import {Department as departamentos} from '../../Utils/Data-Schema/Department'
import { useFetchUpdateUser } from "../../Hooks/useFetchUpdateUser/useFetchUpdateUser";
import { ModalSpinner } from "../../Components/ModalBasic/ModalRegister";

export const StepUser = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch } = useForm();
    const [profileImage, setProfileImage] = useState(DefaultProfile);
    const [filePfp, setFilePfp] = useState(null);
    const [phone, setPhone] = useState(""); 
    const [city, setCity] = useState("");
    const [department, setDepartment] = useState("");
    const { updateUser, isLoading, error } = useFetchUpdateUser();
    const [showSpinner, setShowSpinner] = useState(false);

    // Obtener datos iniciales del usuario
    useEffect(() => {
        const loadUserData = () => {
            const storedUserData = localStorage.getItem("userData");
            if (storedUserData) {
                try {
                    const userData = JSON.parse(storedUserData);
                    if (userData) {
                        // Establecer valores en el formulario
                        setValue('name', userData.name || '');
                        setValue('gender', userData.gender || '');
                        setValue('country', userData.country || 'Colombia');
                        setValue('address', userData.address || '');
                        setValue('city', userData.city || '');
                        
                        // Establecer valores en los estados
                        setPhone(userData.phone || "");
                        setDepartment(userData.state || "");
                        setCity(userData.city || "");
                        
                        // Establecer imagen de perfil si existe y es válida
                        if (userData.profile_picture && userData.profile_picture !== 'undefined') {
                            setProfileImage(userData.profile_picture);
                            console.log("Cargando imagen de perfil:", userData.profile_picture);
                        } else {
                            setProfileImage(DefaultProfile);
                            console.log("Usando imagen por defecto");
                        }
                    }
                } catch (error) {
                    console.error("Error al parsear datos del usuario:", error);
                }
            }
        };

        // Cargar datos al montar el componente
        loadUserData();

        // Agregar listener para cambios en localStorage
        const handleStorageChange = (e) => {
            if (e.key === "userData") {
                loadUserData();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // Limpiar listener al desmontar
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [setValue]);

    const handleDepartamentoChange = (event) => {
        const deptoSelection = event.target.value;
        setDepartment(deptoSelection);
        setCity("");
        setValue('city', '');
    };

    const handleCityChange = (event) => {
        const selectedCity = event.target.value;
        setCity(selectedCity);
        setValue('city', selectedCity);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            setFilePfp(file);
        }
        console.log(File);
        
    };

    const onSubmitForm = async (dataForm) => { 
        setShowSpinner(true);
        
        try {
            const formDataUser = new FormData();
            formDataUser.append('name', dataForm.name);
            formDataUser.append('phone', phone);
            formDataUser.append('gender', dataForm.gender);
            formDataUser.append('country', dataForm.country);
            formDataUser.append('state', department);
            formDataUser.append('city', dataForm.city);
            formDataUser.append('address', dataForm.address);
            
            console.log("Datos a enviar:", Object.fromEntries(formDataUser));

            const result = await updateUser(formDataUser, filePfp);
            console.log("Resultado de la actualización:", result);

            if (result.success) {
                navigate("/step-pet");
            } else {
                console.error("Error en la actualización:", result.error);
                // Aquí podrías mostrar un mensaje de error al usuario
            }
        } catch (error) {
            console.error("Error inesperado:", error);
        } finally {
            setShowSpinner(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center ">
            {showSpinner && <ModalSpinner />}
            <div className="w-screen p-2 3xl:p-4 4xl:p-6">
                <NavButtonStep onClick={()=>navigate('/register')} text={'1/3'} />
                <div className="mb-4 p-2 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-8xl font-bold mb-2">¡Creando tu Perfil!</h2>
                </div>

                <div className="flex justify-center mb-6">
                    <label htmlFor="profile-upload" className="relative cursor-pointer">
                        <img
                            src={profileImage}
                            alt='userImgDefault'
                            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 2xl:w-44 2xl:h-44 3xl:w-48 3xl:h-48 4xl:w-52 4xl:h-52 rounded-full object-cover"
                            onError={(e) => {
                                console.log("Error al cargar imagen, cambiando a imagen por defecto");
                                e.target.src = DefaultProfile;
                            }}
                        />
                        <span className='absolute bottom-1 right-0'>
                            <img className='rounded-[0.5rem] w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 3xl:w-11 3xl:h-11 4xl:w-12 4xl:h-12' src={EditImg} alt="EditImgIcon" />
                        </span>
                    </label>
                    <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className="w-full">
                    <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-9 mt-4">
                        <label className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">Nombre Completo</label>
                        <InputField
                            icon={Paper}
                            register={register}
                            name="name"
                            placeholder="Nombre Completo"
                            validation={{ required: "El nombre es obligatorio" }}
                        />

                        <label className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">Número de Teléfono</label>
                        <PhoneInput
                            country={"co"} 
                            value={phone}
                            onChange={setPhone}
                            onlyCountries={["co"]}
                            inputClass="w-full !w-[100%] p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 border-none rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22"
                            containerClass="w-full mb-3 bg-gray-100 h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22"
                        />

                        <label className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">Género</label>
                        <select {...register("gender")} className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 3xl:p-7 4xl:p-6 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22">
                            <option value="" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-2xl 4xl:text-3xl">Selecciona tu género</option>
                            <option value="Masculino" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-2xl 4xl:text-3xl">Masculino</option>
                            <option value="Femenino" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-2xl 4xl:text-3xl">Femenino</option>
                            <option value="Otro" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-2xl 4xl:text-3xl">Otro</option>
                        </select>

                        {/* Rest of form fields remain the same */}
                        <label className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">País</label>
                        <select {...register("country")} className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 3xl:p-7 4xl:p-6 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22">
                            <option value="" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">Seleccione su país</option>
                            <option value="Colombia" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">Colombia</option>
                        </select>

                        <label className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">Departamento</label>
                        <select 
                            {...register("state")}
                            className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 3xl:p-7 4xl:p-6 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22"
                            value={department}
                            onChange={handleDepartamentoChange}
                        >
                            <option value="" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">Seleccione un departamento</option>
                            {departamentos.map((depto) => (
                                <option key={depto} value={depto} className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">
                                    {depto}
                                </option>
                            ))}
                        </select>

                        <label className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">Ciudad</label>
                        <select 
                            {...register("city")}
                            className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 3xl:p-7 4xl:p-6 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22" 
                            disabled={!department}
                            value={city}
                            onChange={handleCityChange}
                        >
                            <option value="" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">Seleccione una ciudad</option>
                            {ciudadesPorDepartamento[department]?.map((ciudad) => (
                                <option key={ciudad} value={ciudad} className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">
                                    {ciudad}
                                </option>
                            ))}
                        </select>

                        <label className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">Dirección</label>
                        <input 
                            {...register("address")}
                            className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 mb-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-xl h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22" 
                        />
                    </div>
                    <ButtonPrimary text='Continuar' disabled={isLoading} className="w-full mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12 2xl:mt-14 3xl:mt-16 4xl:mt-18" />
                </form>
            </div>
        </div>
    );
};