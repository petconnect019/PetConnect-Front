// React & Hooks
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// Context & Custom Hooks
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";
import { useFetchPetById } from "../../Hooks/useFetchPetById/useFetchPetById";

// Utils & Helpers
import { convertDateFormat } from "../../Utils/Helpers/ConvertDateFormat/ConvertDateFormat";
import { dogBreeds, catBreeds } from "../../Utils/PetBreeds/PetBreeds";

// Components
import { NavButton } from "../../Components/NavButton/NavButton";
import { ModalResponse } from "../../Components/ModalBasic/ModalResponse";
import { InputField } from "../../Components/InputField/InputField";
import { Calendar } from "primereact/calendar";
import { PetTypeSelector } from "../../Components/PetSelector/PetTypeSelector";

// Assets
import defaultCatPfp from "../../assets/CatProfilePfp.png";
import defaultDogPfp from "../../assets/DogProfilePfp.png";
import Paper from "../../assets/Paper.png";
import CalendarImg from "../../assets/Calendar.png";
import QRIcon from "../../assets/QRIcon.png";
import EditImg from "../../assets/EditImage.png";

export const PetProfile = () => {
  const { pet_id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [pet, setPet] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [filePfp, setFilePfp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const {getPetById, petResult} = useFetchPetById();

  const petsUser = usePet();
  const fetchedPets = useIsFetchedPets();
  const { findPet } = petsUser ?? {};
  const { isFetchedPets } = fetchedPets ?? {};

  useEffect(()=> {
    if (!isFetchedPets) {
      trigguerGetId();
      
    }
  }, [])

  useEffect(() => {
    const foundPet = findPet(pet_id);
    
    if (foundPet) {
      setPet(foundPet);
      setProfileImage(foundPet.profile_picture);
      setSelectedPet(foundPet.species);
      setValue("birthDate", foundPet.birthDate || "");
      setValue("name", foundPet.name == 'No especificado'? 'No especificada': foundPet.name);
      setValue("breed", foundPet.breed == 'No especificado'? 'No especificada': foundPet.breed);
      setValue("gender", foundPet.gender == 'No especificado'? 'No especificado': foundPet.gender);
      foundPet.color!== 'No especificado' && setValue("color", foundPet.color);
    }
  }, [petResult, isFetchedPets, pet_id, findPet, setValue]);

  useEffect(() => {
    const subscription = watch((values) => {
      setIsModified(
        values.birthDate !== pet?.birthDate ||
        values.breed !== pet?.breed ||
        values.gender !== pet?.gender ||
        values.color !== pet?.color ||
        filePfp !== null ||
        values.name !== pet?.name ||
        selectedPet !== pet?.species
      );
    });
    return () => subscription.unsubscribe();
  }, [watch, pet, filePfp, selectedPet]);

  const onSubmitForm = async (dataForm) => {
    console.log(dataForm);
  };

  const trigguerGetId = ()=> {
    getPetById(pet_id);
  }

  const handleDateChange = (e) => {
    const selected = e.value || null;
    setSelectedDate(selected);
    setValue("birthDate", selected ? convertDateFormat(selected) : "");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setFilePfp(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-[1.4rem]">
      <div className="bg-white p-8 rounded-2xl w-screen max-w-sm ">
        <NavButton onClick={() => navigate(-1)} />
        <div className="flex justify-center mb-6">
          <label htmlFor="profile-upload" className="relative cursor-pointer">
            <img
              src={profileImage || (pet?.species === 'dog' ? defaultDogPfp : defaultCatPfp)}
              alt={pet?.species}
              className="w-32 h-30 rounded-full object-cover "
            />
            <span className="absolute bottom-1 right-0 ">
              <img className="rounded-[0.5rem] w-6 h-6" src={EditImg} alt="EditImgIcon" />
            </span>
          </label>
          <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <label className="font-semibold">Seguridad de la mascota</label>
          <div className="relative cursor-pointer p-3 bg-gray-100 rounded-lg flex justify-between items-center text-[1.2rem] hover:bg-gray-100" onClick={() => navigate("/check_protection")}>
            <span className="flex items-center text-gray-500">
              <img className="w-5 h-5" src={QRIcon} alt="QRIcon" /> Codigo QR
            </span>
            <span className="text-orange-500 hover:underline">+add</span>
          </div>

          <InputField label="Nombre" icon={Paper} register={register} name="name" placeholder="Nombre de tu mascota" validation={{ required: "El nombre es obligatorio" }} />

          <div className="relative">
            <label className="block mb-1 font-semibold">
              Fecha de nacimiento
            </label>
            <span
              className={`absolute top-13 left-3  z-4 ${
                modalOpen ? "hidden" : ""
              }`}
            >
              <img className="  w-5 h-5" src={CalendarImg} alt="CalendarIcon" />
            </span>
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/mm/yy"
              placeholder="Seleccione la fecha"
              className="w-full bg-gray-100 "
              pt={{
                panel: { style: { width: "400px",} }
              }}
            />
            <input
              type="hidden"
              {...register("birthDate")}
              value={selectedDate || ""}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Raza</label>
            <select {...register("breed")} className="w-full p-3 bg-gray-100 rounded-lg text-gray-500">
              <option value="No especificada">No especificada</option>
              {(pet?.species === "dog" ? dogBreeds : catBreeds).map((breed) => (
                <option key={breed} value={breed}>{breed}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Género</label>
            <select {...register("gender")} className="w-full p-3 bg-gray-100 rounded-lg text-gray-500">
            <option value="No especificado">No especificado</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          <InputField label="Color" icon={Paper} register={register} placeholder='Color de tu mascota' name="color" validation={{ required: "El color es obligatorio" }} />

          <PetTypeSelector selectedPet={selectedPet} setSelectedPet={setSelectedPet} />
          

          <button type="submit" disabled={!isModified} className="w-full bg-orange-400 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-all disabled:bg-gray-300">
            Confirmar
          </button>
        </form>
      </div>
    </div>
  );
};
