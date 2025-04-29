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
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 flex-grow text-center">
            Perfil de tu mascota
          </h2>
        </div>

        <div className="flex flex-row justify-between items-center p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 space-x-4 xs:space-x-6 sm:space-x-8 md:space-x-10 lg:space-x-12 xl:space-x-14 2xl:space-x-16">
          <div className="relative w-16 h-16 xs:w-20 xs:h-20 sm:w-25 sm:h-25 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 3xl:w-64 3xl:h-64 4xl:w-56 4xl:h-56 flex justify-center items-center">
            <label htmlFor="profile-upload" className="cursor-pointer flex justify-center items-center">
              <img
                src={profileImage || (pet?.species === "dog" ? defaultDogPfp : defaultCatPfp)}
                alt={pet?.species}
                className="w-16 h-16 xs:w-20 xs:h-20 sm:w-25 sm:h-25 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 2xl:w-56 2xl:h-56 3xl:w-64 3xl:h-64 4xl:w-56 4xl:h-56 rounded-full object-cover border-1 border-orange-100 hover:border-orange-200 transition-all"
              />
              <span className="absolute bottom-12 xs:bottom-14 sm:bottom-18 md:bottom-24 lg:bottom-30 xl:bottom-36 2xl:bottom-42 3xl:bottom-48 4xl:bottom-42 right-0 rounded-md p-1 xs:p-1.5 md:p-2 lg:p-2.5 xl:p-3 2xl:p-3.5">
                <img
                  className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 3xl:w-10 3xl:h-10 4xl:w-9 4xl:h-9 rounded-lg"
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

          <div className="flex-1 w-full text-left space-y-2 xs:space-y-3 md:space-y-4 lg:space-y-5 xl:space-y-6 2xl:space-y-7">
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-2xl text-justify text-gray-600 mb-3 xs:mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 2xl:mb-14">
              Verifica que el perfil público de tu mascota esté actualizado para
              facilitar una reunión rápida y sin contratiempos
            </p>
            <button
              onClick={handlePublicProfile}
              className="w-full max-w-xs h-6 xs:h-7 md:h-9 lg:h-10 xl:h-12 2xl:h-14 3xl:h-16 4xl:h-12 bg-orange-400 text-white rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors"
            >
              <p className="text-xs xs:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-xl">Ver perfil público</p>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-3 xs:my-4 sm:my-6 md:my-8 w-full" />

        {isLoading && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <ImSpinner2 className="text-orange-500 animate-spin w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" />
              <p className="mt-3 xs:mt-4 sm:mt-6 text-orange-600 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl">
                Cargando...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-2 xs:p-3 sm:p-4 md:p-6 bg-red-500 text-white rounded-lg mb-3 xs:mb-4 sm:mb-6">
            <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-6 p-2 xs:p-3 sm:p-4 md:p-6">
          <label className="font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
            Seguridad de la mascota
          </label>
          <div
            className="mt-2 xs:mt-3 sm:mt-4 relative cursor-pointer p-2 xs:p-3 sm:p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
            onClick={() => navigate("/check-protection")}
          >
            <span className="flex items-center text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">
              <img className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 mr-2" src={QRIcon} alt="QRIcon" />
              Codigo QR
            </span>
            <span className="text-orange-500 hover:underline text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl">+add</span>
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
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
              Fecha de nacimiento
            </label>
            <span className={`absolute top-8 xs:top-10 sm:top-12 md:top-14 lg:top-16 left-3 z-10 ${modalOpen ? "hidden" : ""}`}>
              <img className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" src={CalendarImg} alt="CalendarIcon" />
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
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
              Raza
            </label>
            <select
              {...register("breed")}
              className="w-full p-2 xs:p-3 sm:p-4 bg-gray-50 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
            <label className="block mb-2 font-semibold text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">
              Género
            </label>
            <select
              {...register("gender")}
              className="w-full p-2 xs:p-3 sm:p-4 bg-gray-50 rounded-lg text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
            className="w-full bg-orange-500 mt-2 xs:mt-3 sm:mt-4 text-white py-2 xs:py-3 sm:py-4 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl"
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
