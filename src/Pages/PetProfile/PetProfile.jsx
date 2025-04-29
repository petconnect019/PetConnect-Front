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
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
      <div className="bg-white w-full max-w-md md:max-w-2xl lg:max-w-4xl space-y-3 xs:space-y-4 sm:space-y-6 md:space-y-8">
        <div className="flex items-center mb-3 xs:mb-4 sm:mb-6 md:mb-8 text-center w-full p-1">
          <NavButton onClick={() => navigate(-1)} />
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-6xl 4xl:text-5xl font-bold text-gray-800 flex-grow text-center">
            Perfil de tu mascota
          </h2>
        </div>

        <div className="flex flex-row justify-between items-center p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 space-x-4 xs:space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12 xl:space-x-14 2xl:space-x-16">
          <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 3xl:w-64 3xl:h-64 4xl:w-72 4xl:h-72 flex justify-center items-center">
            <label htmlFor="profile-upload" className="cursor-pointer flex justify-center items-center">
              <img
                src={profileImage || (pet?.species === "dog" ? defaultDogPfp : defaultCatPfp)}
                alt={pet?.species}
                className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 3xl:w-64 3xl:h-64 4xl:w-72 4xl:h-72 rounded-full object-cover border-1 border-orange-100 hover:border-orange-200 transition-all"
              />
              <span className="absolute bottom-12 xs:bottom-14 sm:bottom-18 md:bottom-24 lg:bottom-30 xl:bottom-36 2xl:bottom-42 3xl:bottom-48 4xl:bottom-42 right-0 rounded-md p-1 xs:p-1.5 md:p-2 lg:p-2.5 xl:p-3 2xl:p-3.5">
                <img
                  className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 3xl:w-10 3xl:h-10 4xl:w-11 4xl:h-11 rounded-lg"
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
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-3xl 4xl:text-2xl text-justify text-gray-600">
              Verifica que el perfil público de tu mascota esté actualizado para
              facilitar una reunión rápida y sin contratiempos
            </p>
            <button
              onClick={handlePublicProfile}
              className="w-full max-w-xs h-8 xs:h-9 sm:h-10 md:h-11 lg:h-12 xl:h-14 2xl:h-16 3xl:h-16 4xl:h-14 bg-orange-400 text-white rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors"
            >
              <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-3xl 4xl:text-2xl">Ver perfil público</p>
            </button>
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
          <label className="font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
            Seguridad de la mascota
          </label>
          <div
            className="mt-2 xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 relative cursor-pointer p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-gray-100 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
            onClick={() => navigate("/check-protection")}
          >
            <span className="flex items-center text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
              <img className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 mr-2" src={QRIcon} alt="QRIcon" />
              Codigo QR
            </span>
            <span className="text-orange-500 hover:underline text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">+add</span>
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
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
              Fecha de nacimiento
            </label>
            <span className={`absolute top-10 xs:top-11.5 sm:top-14 md:top-13 lg:top-15 xl:top-18 2xl:top-20 3xl:top-22 4xl:top-20 left-3 z-10 ${modalOpen ? "hidden" : ""}`}>
              <img className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10" src={CalendarImg} alt="CalendarIcon" />
            </span>
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/mm/yy"
              placeholder="Seleccione la fecha"
              className="w-full bg-gray-50 rounded-10"
              
            />
            <input
              type="hidden"
              {...register("birthDate")}
              value={selectedDate || ""}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
              Raza
            </label>
            <select
              {...register("breed")}
              className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-gray-700">
              Género
            </label>
            <select
              {...register("gender")}
              className="w-full p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 bg-gray-100 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
            className="w-full bg-orange-500 mt-2 xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8 text-white py-2 xs:py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 2xl:py-8 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl"
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
