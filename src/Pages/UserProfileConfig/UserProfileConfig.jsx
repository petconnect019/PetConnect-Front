// React & Hooks
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

// Context & Custom Hooks
import { useAuth } from "../../Contexts/AuthContext/AuthContext";
import { useFetchUpdateUser } from "../../Hooks/useFetchUpdateUser/useFetchUpdateUser";

// Components
import { NavButton } from "../../Components/NavButton/NavButton";
import { ModalResponse } from "../../Components/ModalBasic/ModalResponse";
import { InputField } from "../../Components/InputField/InputField";
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
  const [city, setCity] = useState([]);
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  const { updateUser, isLoading, error, isSuccess } = useFetchUpdateUser();

  useEffect(() => {
    // Verificar que el ID del usuario en la URL coincida con el usuario actual
    const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
    if (storedUserData && storedUserData._id !== user_id) {
      console.error("ID de usuario no coincide");
      navigate('/home');
      return;
    }

    if (storedUserData) {
      setProfileImage(storedUserData.profile_picture || DefaultProfile);
      setPhone(storedUserData.phone || "");
      setDepartment(storedUserData.department || "");
      setCity(storedUserData.city || []);
      setGender(storedUserData.gender || "");
      setCountry(storedUserData.country || "Colombia");
      setAddress(storedUserData.address || "");
      setValue("name", storedUserData.name || "");
      setValue("email", storedUserData.email || "");
    }
  }, [setValue, user_id, navigate]);

  useEffect(() => {
    const subscription = watch((values) => {
      const storedUserData = JSON.parse(sessionStorage.getItem("userData"));
      if (!storedUserData) return;

      const hasFormChanges = 
        values.name !== storedUserData.name ||
        values.email !== storedUserData.email ||
        phone !== storedUserData.phone ||
        department !== storedUserData.department ||
        city !== storedUserData.city ||
        gender !== storedUserData.gender ||
        country !== storedUserData.country ||
        address !== storedUserData.address;

      console.log("Cambios detectados:", {
        name: values.name !== storedUserData.name,
        email: values.email !== storedUserData.email,
        phone: phone !== storedUserData.phone,
        department: department !== storedUserData.department,
        city: city !== storedUserData.city,
        gender: gender !== storedUserData.gender,
        country: country !== storedUserData.country,
        address: address !== storedUserData.address,
        filePfp: filePfp !== null
      });

      setIsModified(hasFormChanges || filePfp !== null);
    });
    return () => subscription.unsubscribe();
  }, [watch, filePfp, phone, department, city, gender, country, address]);

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

    await updateUser(formDataUser, filePfp);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setFilePfp(file);
      setIsModified(true);
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
    <div className="flex flex-col items-center justify-center w-full bg-gray-50">
      <div className="bg-white w-full max-w-md md:max-w-2xl lg:max-w-4xl space-y-3 xs:space-y-4 sm:space-y-6 md:space-y-8">
        <div className="flex items-center mt-2 mb-3 xs:mb-4 sm:mb-6 md:mb-8 w-full relative">
          <div className="absolute left-0 pl-2">
            <NavButton onClick={() => navigate(-1)} />
          </div>
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-5xl font-bold text-gray-800 w-full text-center">
            Perfil de Usuario
          </h2>
        </div>

        <div className=" flex flex-row justify-between items-center p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 space-x-4 xs:space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12 xl:space-x-14 2xl:space-x-16">
          <div className=" relative w-auto h-30 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 2xl:w-64 2xl:h-64 3xl:w-72 3xl:h-72 4xl:w-80 4xl:h-80 flex justify-center items-center">
            <label htmlFor="profile-upload" className="cursor-pointer flex justify-center items-center">
              <img
                src={profileImage}
                alt="Profile"
                className="w-26 h-26 rounded-full object-cover border-1 border-orange-100 hover:border-orange-200 transition-all"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <span className="absolute bottom-21 xs:bottom-28 sm:bottom-32 md:bottom-40 lg:bottom-48 xl:bottom-56 2xl:bottom-64 3xl:bottom-72 4xl:bottom-80 right-0 rounded-md p-1 xs:p-1.5 md:p-2 lg:p-2.5 xl:p-3 2xl:p-3.5">
                <img
                  className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 3xl:w-12 3xl:h-12 4xl:w-13 4xl:h-13 rounded-lg"
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
              <div className="w-full bg-gray-200 rounded-full h-2 xs:h-3 sm:h-4 md:h-5 lg:h-6 xl:h-7 2xl:h-8">
                <div 
                  className="bg-brand h-full rounded-full transition-all duration-300"
                  style={{ width: `${calculateCompletionPercentage()}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-3xl 4xl:text-2xl text-justify text-gray-600">
              <FaInfoCircle className="inline align-text-bottom text-brand mr-1" />
              Completa tu perfil para una comunicación más efectiva en una eventual pérdida de tu mascota
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 my-3 xs:my-4 sm:my-5 md:my-6 lg:my-7 xl:my-8 2xl:my-9 w-full" />

        {isLoading && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <ImSpinner2 className="text-orange-500 animate-spin w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18" />
              <p className="mt-3 xs:mt-4 sm:mt-5 md:mt-6 lg:mt-7 xl:mt-8 2xl:mt-9 text-orange-600 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                Cargando...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-red-500 text-white rounded-lg mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9">
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">{error}</p>
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
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
              Género
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
            >
              <option value="">Seleccione un género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
              País
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
            >
              <option value="Colombia">Colombia</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
              Dirección
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
              Teléfono
            </label>
            <PhoneInput
              country={'co'}
              value={phone}
              onChange={setPhone}
              inputClass="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
              containerClass="w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
              Departamento
            </label>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCity([]);
              }}
              className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
              Ciudad
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
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

          <button
            type="submit"
            disabled={isModified}
            className="w-full bg-orange-500 mt-2 xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 text-white py-2 xs:py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 2xl:py-8 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl"
          >
            Guardar cambios
          </button>
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
