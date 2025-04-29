import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Position from '../../assets/images/posicionamiento-Step.png';
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

export const StepUser = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [profileImage, setProfileImage] = useState(DefaultProfile);
    const [filePfp, setFilePfp] = useState(null);
    const [phone, setPhone] = useState(""); 
    const [city,setCity] = useState([])
    const [department , setDepartment] = useState("")
    const { updateUser, isLoading, error } = useFetchUpdateUser();

    // Obtener datos iniciales del usuario
    useEffect(() => {
        const storedUserData = sessionStorage.getItem("userData");
        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                if (userData && userData.name) {
                    setPhone(userData.phone || "");
                    setDepartment(userData.state || "");
                    if (userData.state) {
                        setCity(ciudadesPorDepartamento[userData.state] || []);
                    }
                }
            } catch (error) {
                console.error("Error al parsear datos del usuario:", error);
            }
        }
    }, []);

    const handleDepartamentoChange = (event) => {
        const deptoSelection = event.target.value;
        setDepartment(deptoSelection);
        setCity(ciudadesPorDepartamento[deptoSelection] || []);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            setFilePfp(file);
        }
    };

    const onSubmitForm = async (dataForm) => { 
        if (!dataForm.city) {
            alert("Por favor, seleccione una ciudad");
            return;
        }

        const formDataUser = new FormData();
        formDataUser.append('name', dataForm.name);
        formDataUser.append('phone', phone);
        formDataUser.append('gender', dataForm.gender);
        formDataUser.append('country', dataForm.country);
        formDataUser.append('state', department);
        formDataUser.append('city', dataForm.city);
        formDataUser.append('address', dataForm.address);
        
        console.log("Datos enviados:", Object.fromEntries(formDataUser));

        await updateUser(formDataUser, filePfp);
        navigate("/step-pet");
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="p-6 w-screen">
                <NavButtonStep onClick={()=>navigate('/register')} img={Position} text={'1/3'} />
                <div className="mb-4 p-2 text-center">
                    <h2 className="text-2xl font-bold mb-2">¡Creando tu Perfil!</h2>
                </div>

                <div className="flex justify-center mb-6">
                    <label htmlFor="profile-upload" className="relative cursor-pointer">
                        <img
                            src={profileImage}
                            alt='userImgDefault'
                            className="w-32 h-30 rounded-full object-cover"
                        />
                        <span className='absolute bottom-1 right-0'>
                            <img className='rounded-[0.5rem] w-6 h-6' src={EditImg} alt="EditImgIcon" />
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

                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="flex flex-col gap-2 mt-4">
                        <label className="font-semibold">Nombre Completo</label>
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
                            inputClass="w-full !w-[100%] p-3 border-none rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-brand"
                            containerClass="h-[2.7rem] w-full mb-3 bg-gray-100"
                        />

                        <label>Género</label>
                        <select {...register("gender")} className="w-full p-3 mb-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand">
                            <option value="">Selecciona tu género</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Otro">Otro</option>
                        </select>

                        <label>País</label>
                        <select {...register("country")} className="w-full p-3 mb-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand">
                            <option value="">Seleccione su país</option>
                            <option value="Colombia">Colombia</option>
                        </select>

                        <label>Departamento</label>
                        <select 
                            {...register("state")}
                            className="w-full p-3 mb-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
                            value={department}
                            onChange={handleDepartamentoChange}
                        >
                            <option value="">Seleccione un departamento</option>
                            {departamentos.map((depto) => (
                                <option key={depto} value={depto}>
                                    {depto}
                                </option>
                            ))}
                        </select>

                        <label>Ciudad</label>
                        <select 
                            {...register("city")}
                            className="w-full p-3 mb-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand" 
                            disabled={!city.length}
                        >
                            <option value="">Seleccione una ciudad</option>
                            {city.map((ciudad) => (
                                <option key={ciudad} value={ciudad}>
                                    {ciudad}
                                </option>
                            ))}
                        </select>

                        <label>Dirección</label>
                        <input 
                            {...register("address")}
                            className="w-full p-3 mb-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand" 
                        />
                    </div>
                    <ButtonPrimary text='Continuar' disabled={isLoading} />
                </form>
            </div>
        </div>
    );
};
