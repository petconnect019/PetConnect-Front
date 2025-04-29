// React & Hooks
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// Context & Custom Hooks
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";
import { useFetchPetById } from "../../Hooks/useFetchPetById/useFetchPetById";
import { useFetchUpdatePet } from "../../Hooks/useFetchUpdatePet/useFetchUpdatePet";

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
import defaultCatPfp from "../../assets/images/CatProfilePfp.png";
import defaultDogPfp from "../../assets/images/DogProfilePfp.png";
import Paper from "../../assets/images/Paper.png";
import CalendarImg from "../../assets/images/Calendar.png";
import QRIcon from "../../assets/images/QRIcon.png";
import EditImg from "../../assets/images/EditImage.png";
import { ImSpinner2 } from "react-icons/im";

export const PetProfile = () => {
  const { pet_id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [pet, setPet] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [filePfp, setFilePfp] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    fetchUpdatePet,
    isLoading,
    error,
    petFetched,
    isSuccess,
    petPicture,
  } = useFetchUpdatePet();
  const { getPetById, petResult } = useFetchPetById();

  const petsUser = usePet();
  const fetchedPets = useIsFetchedPets();
  const { findPet } = petsUser ?? {};
  const { isFetchedPets, changeIsFetched } = fetchedPets ?? {};

  useEffect(() => {
    if (!isFetchedPets) {
      trigguerGetId();
    }
  }, []);

  useEffect(() => {
    const foundPet = findPet(pet_id);

    if (foundPet) {
      setPet(foundPet);
      setProfileImage(
        foundPet.profile_picture || 
        (foundPet.species === "dog" ? defaultDogPfp : defaultCatPfp)
      );
      setSelectedPet(foundPet.species);
      setValue("birthDate", foundPet.birthDate || "");
      setSelectedDate(foundPet.birthDate ? new Date(foundPet.birthDate) : "");
      setValue(
        "name",
        foundPet.name == "No especificado" ? "No especificada" : foundPet.name
      );
      setValue(
        "breed",
        foundPet.breed == "No especificado" ? "No especificada" : foundPet.breed
      );
      setValue(
        "gender",
        foundPet.gender == "No especificado"
          ? "No especificado"
          : foundPet.gender
      );
      foundPet.color !== "No especificado" && setValue("color", foundPet.color);
    }
  }, [petResult, isFetchedPets, pet_id, findPet, setValue]);

  useEffect(() => {
    const subscription = watch((values) => {
      const hasFormChanges = 
        values.birthDate !== pet?.birthDate ||
        values.breed !== pet?.breed ||
        values.gender !== pet?.gender ||
        values.color !== pet?.color ||
        values.name !== pet?.name ||
        selectedPet !== pet?.species;

      setIsModified(hasFormChanges || filePfp !== null);
    });
    return () => subscription.unsubscribe();
  }, [watch, pet, filePfp, selectedPet]);

  const onSubmitForm = async (dataForm) => {
    if (!selectedPet) return;

    const petData = {
      name: dataForm.name,
      birthDate: selectedDate,
      breed: dataForm.breed || "No especificada",
      gender: dataForm.gender,
      species: selectedPet,
      color: dataForm.color || "No especificado",
      _id: pet_id,
    };

    fetchUpdatePet(petData, filePfp);
  };

  const trigguerGetId = () => {
    getPetById(pet_id);
  };

  useEffect(() => {
    if (isSuccess) {
      if (petPicture) {
        setProfileImage(petPicture);
      }
      setModalOpen(true);
    }
  }, [isSuccess]);

  const handleDateChange = (e) => {
    const selected = e.value || null;
    setSelectedDate(selected);

    const formattedDate = selected ? convertDateFormat(selected) : "";
    setValue("birthDate", formattedDate);
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

  const handlePublicProfile = () => {
    navigate(`/public-pet-profile/${pet_id}`);
  };

  //forzamos el scroll al inicio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center  ">
      <div className="bg-white shadow-xl p-6   max-w-md space-y-6 border">
        <div className="flex items-center  mb-6 text-center  w-screen p-1 ">
          <NavButton onClick={() => navigate(-1)} />
          <h2 className="text-2xl pr-10 sm:text-2xl font-bold text-gray-800 flex-grow text-center">
            Perfil de tu mascota
          </h2>
        </div>

        
        <div className="flex justify-between items-cente p-4  md:flex-row md:space-y-0 md:space-x-6">
          <div className="relative w-25 h-25  flex justify-center items-center">
            <label htmlFor="profile-upload" className="cursor-pointer flex justify-center items-center ">
              <img
                src={
                  profileImage ||
                  (pet?.species === "dog" ? defaultDogPfp : defaultCatPfp)
                }
                alt={pet?.species}
                className="w-25 h-25 rounded-full object-cover border-1 border-orange-100 hover:border-orange-200 transition-all"
              />
              <span className="absolute bottom-18 right-0 rounded-full p-1.5">
                <img
                  className="w-5 h-5 rounded-sm"
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

          <div className="flex-1 w-full text-center md:text-left space-y-3 ">
            <p className="text-xs text-justify text-gray-600 px-2 mb-6">
              Verifica que el perfil público de tu mascota esté actualizado para
              facilitar una reunión rápida y sin contratiempos
            </p>
            <button
              onClick={handlePublicProfile}
              className="w-full max-w-xs h-7 bg-orange-400 text-white rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors"
            >
              <p className="text-sm">Ver perfil público</p>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4 -mx-6 w-screen" />

        {isLoading && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <ImSpinner2 className="text-orange-500 animate-spin" size={50} />
              <p className="mt-4 text-orange-600 font-semibold text-lg">
                Cargando...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500 text-white rounded-lg mb-4 shadow-md">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 p-4">
          <label className="font-semibold text-lg text-gray-700">
            Seguridad de la mascota
          </label>
          <div
            className="mt-3 relative cursor-pointer p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
            onClick={() => navigate("/check-protection")}
          >
            <span className="flex items-center text-gray-600">
              <img className="w-5 h-5 mr-2" src={QRIcon} alt="QRIcon" />
              Codigo QR
            </span>
            <span className="text-orange-500 hover:underline">+add</span>
          </div>

          <InputField
            label="Nombre"
            icon={Paper}
            register={register}
            name="name"
            placeholder="Nombre de tu mascota"
            validation={{ required: "El nombre es obligatorio" }}
          />

          <div className="relative">
            <label className="block mb-2 font-semibold text-lg text-gray-700">
              Fecha de nacimiento
            </label>
            <span
              className={`absolute top-12 left-3 z-10 ${
                modalOpen ? "hidden" : ""
              }`}
            >
              <img className="w-5 h-5" src={CalendarImg} alt="CalendarIcon" />
            </span>
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/mm/yy"
              placeholder="Seleccione la fecha"
              className="w-full bg-gray-50 rounded-10"
              pt={{
                panel: { style: { width: "2rem" } },
              }}
            />
            <input
              type="hidden"
              {...register("birthDate")}
              value={selectedDate || ""}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-lg text-gray-700">
              Raza
            </label>
            <select
              {...register("breed")}
              className="w-full p-3 bg-gray-50 rounded-lg text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
            >
              <option value="No especificada">No especificada</option>
              {(pet?.species === "dog" ? dogBreeds : catBreeds).map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-lg text-gray-700">
              Género
            </label>
            <select
              {...register("gender")}
              className="w-full p-3 bg-gray-50 rounded-lg text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
            >
              <option value="No especificado">No especificado</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          <InputField
            label="Color"
            icon={Paper}
            register={register}
            placeholder="Color de tu mascota"
            name="color"
            validation={{ required: "El color es obligatorio" }}
          />

          <PetTypeSelector
            selectedPet={selectedPet}
            setSelectedPet={setSelectedPet}
            textLabel="Tipo de mascota"
          />

          <button
            type="submit"
            disabled={!isModified}
            className="w-full bg-orange-500 mt-3 text-white py-3 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Guardar cambios
          </button>
        </form>

        {modalOpen && (
          <ModalResponse
            imgProfile={profileImage || (selectedPet === "dog" ? defaultDogPfp : defaultCatPfp)}
            setModalOpen={setModalOpen}
            navigate={navigate}
            path="/home"
            textResponse={"Se ha actualizado su Mascota con éxito"}
          />
        )}
      </div>
    </div>
  );
};
