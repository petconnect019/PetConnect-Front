// React & Hooks
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

// Context & Custom Hooks
import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useFetchUpdateUser } from "../../Hooks/useFetchUpdateUser/useFetchUpdateUser";
import { useFetchUserProfile } from "../../Hooks/useFetchUserProfile/useFetchUserProfile";

// Components
import { NavButton } from "../../Components/NavButton/NavButton";
import { ModalResponse } from "../../Components/ModalBasic/ModalResponse";
import { InputField } from "../../Components/InputField/InputField";
import { ButtonPrimary } from "../../Components/Buttons/ButtonPrimary";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// Assets
import DefaultProfile from "../../assets/images/DefaultProfile.png";
import Paper from "../../assets/images/Paper.png";
import EditImg from "../../assets/images/EditImage.png";
import { ImSpinner2 } from "react-icons/im";
import { City as ciudadesPorDepartamento } from '../../Utils/Data-Schema/City';
import { Department as departamentos } from '../../Utils/Data-Schema/Department';
import { FaInfoCircle } from "react-icons/fa";

export const UserProfileConfig = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [profileImage, setProfileImage] = useState(DefaultProfile);
  const [filePfp, setFilePfp] = useState(null);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const { user } = useAuth();
  const { fetchUserProfile, userData, isLoading: isLoadingProfile, error: profileError } = useFetchUserProfile();
  const hasLoadedProfile = useRef(false);

  const { updateUser, isLoading, error, isSuccess } = useFetchUpdateUser();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (hasLoadedProfile.current) return;
      
      const result = await fetchUserProfile();
      if (result.success) {
        const userData = result.userData;
        console.log("Datos del usuario cargados:", userData);
        setProfileImage(userData.profile_picture || DefaultProfile);
        setPhone(userData.phone || "");
        setDepartment(userData.state || "");
        setCity(userData.city || "");
        setGender(userData.gender || "");
        setCountry(userData.country || "Colombia");
        setAddress(userData.address || "");
        setValue("name", userData.name || "");
        setValue("email", userData.email || "");
        hasLoadedProfile.current = true;
      } else {
        console.error("Error al cargar el perfil:", result.error);
        navigate('/home');
      }
    };

    loadUserProfile();
  }, [setValue, navigate, fetchUserProfile]);

  useEffect(() => {
    if (!userData) return;

    const subscription = watch((values) => {
      const hasFormChanges = 
        values.name !== userData.name ||
        values.email !== userData.email ||
        phone !== userData.phone ||
        department !== userData.state ||
        city !== userData.city ||
        gender !== userData.gender ||
        country !== userData.country ||
        address !== userData.address;

      console.log("Cambios detectados:", {
        name: values.name !== userData.name,
        email: values.email !== userData.email,
        phone: phone !== userData.phone,
        department: department !== userData.state,
        city: city !== userData.city,
        gender: gender !== userData.gender,
        country: country !== userData.country,
        address: address !== userData.address,
        filePfp: filePfp !== null
      });

      setIsModified(hasFormChanges || filePfp !== null);
    });

    return () => subscription.unsubscribe();
  }, [watch, filePfp, phone, department, city, gender, country, address, userData]);

  const onSubmitForm = async (dataForm) => {
    const formDataUser = new FormData();
    formDataUser.append('name', dataForm.name);
    formDataUser.append('email', dataForm.email);
    formDataUser.append('phone', phone);
    formDataUser.append('gender', gender);
    formDataUser.append('country', country);
    formDataUser.append('state', department);
    formDataUser.append('city', city);
    formDataUser.append('address', address);
    
    console.log("Datos enviados:", Object.fromEntries(formDataUser));

    const response = await updateUser(formDataUser, filePfp);
    console.log("Respuesta del backend:", response);

    if (response.success) {
      // Actualizamos los datos en localStorage
      const updatedUserData = {
        ...userData,
        name: dataForm.name,
        email: dataForm.email,
        phone: phone,
        gender: gender,
        country: country,
        state: department,
        city: city,
        address: address,
        profile_picture: response.data?.profile_picture || userData.profile_picture
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      setModalOpen(true);
    } else {
      console.error("Error en la actualización:", response.error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setFilePfp(file);
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setModalOpen(true);
    }
  }, [isSuccess]);

  //forzamos el scroll al inicio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateCompletionPercentage = () => {
    const fields = [
      profileImage !== DefaultProfile,
      watch("name"),
      watch("email"),
      phone,
      gender,
      country,
      address,
      department,
      city
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <div className="w-full space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8">
        <div className="flex items-center mt-2 mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8 w-full relative">
          <div className="absolute left-0 pl-2">
            <NavButton onClick={() => navigate(-1)} />
          </div>
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-800 w-full text-center">
            Perfil de Usuario
          </h2>
        </div>

        <div className="flex flex-row justify-between items-center p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 space-x-2 xs:space-x-3 sm:space-x-4 md:space-x-5 lg:space-x-6 xl:space-x-7 2xl:space-x-8">
          <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 flex justify-center items-center">
            <label htmlFor="profile-upload" className="cursor-pointer flex justify-center items-center">
              <img
                src={profileImage}
                alt="Profile"
                className="w-21 h-21 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 2xl:w-60 2xl:h-60 rounded-full object-cover border-1 border-orange-100 hover:border-orange-200 transition-all"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <span className=" absolute top-1 right-0 rounded-md p-1 xs:p-1.5 xs:right-1 xs:top-1 sm:p-2 md:p-2.5 lg:p-3 xl:p-3.5 2xl:p-4">
                <img
                  className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 rounded-lg"
                  src={EditImg}
                  alt="EditImgIcon"
                />
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
          <div className="flex-1 w-full text-left space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8">
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600">
                  Progreso del perfil
                </span>
                <span className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600">
                  {calculateCompletionPercentage()}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 xs:h-2 sm:h-2.5 md:h-3 lg:h-3.5 xl:h-4 2xl:h-5">
                <div 
                  className="bg-brand h-full rounded-full transition-all duration-300"
                  style={{ width: `${calculateCompletionPercentage()}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-justify text-gray-600">
              <FaInfoCircle className="inline align-text-bottom text-brand mr-1" />
              Completa tu perfil para una comunicación más efectiva en una eventual pérdida de tu mascota
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 my-2 xs:my-3 sm:my-4 md:my-5 lg:my-6 xl:my-7 2xl:my-8 w-full" />

        {(isLoadingProfile || isLoading) && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <ImSpinner2 className="text-orange-500 animate-spin w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11" />
              <p className="mt-2 xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 text-orange-600 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                Cargando...
              </p>
            </div>
          </div>
        )}

        {(profileError || error) && (
          <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-red-500 text-white rounded-lg mb-2 xs:mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8">
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
              {profileError || error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7 2xl:space-y-8 p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8">
          <InputField
            label="Nombre Completo"
            icon={Paper}
            register={register}
            name="name"
            placeholder="Tu nombre"
            validation={{ required: "El nombre es obligatorio" }}
          />

          <div>
            <label className="block mb-1 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-700">
              Género
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8"
            >
              <option value="">Seleccione un género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-700">
              País
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8"
            >
              <option value="Colombia">Colombia</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8"
              placeholder="Tu dirección"
            />
          </div>

          <InputField
            label="Correo electrónico"
            icon={Paper}
            register={register}
            name="email"
            placeholder="Tu correo electrónico"
            validation={{ required: "El correo electrónico es obligatorio" }}
          />

          <div className="relative">
            <label className="block mb-1 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-700">
              Teléfono
            </label>
            <PhoneInput
              country={'co'}
              value={phone}
              onChange={setPhone}
              inputClass="w-full h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8"
              containerClass="w-full"
            />
          </div>

          <div>
            <label className="block mb-1 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-700">
              Departamento
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCity([]);
              }}
              className="w-full h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8"
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-700">
              Ciudad
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full h-10 xs:h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 2xl:px-8"
              disabled={!department}
            >
              <option value="">Seleccione una ciudad</option>
              {ciudadesPorDepartamento[department]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <ButtonPrimary 
            text="Guardar cambios" 
            disabled={isLoading}
            className="w-full mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12 2xl:mt-14"
          />
        </form>

        {modalOpen && (
          <ModalResponse
            imgProfile={profileImage}
            setModalOpen={setModalOpen}
            navigate={navigate}
            path="/home"
            textResponse={"Se ha actualizado tu perfil con éxito"}
          />
        )}
      </div>
    </div>
  );
};