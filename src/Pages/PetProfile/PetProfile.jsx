import { useParams } from "react-router-dom";
import defaultCatPfp from "../../assets/CatProfilePfp.png";
import defaultDogPfp from "../../assets/DogProfilePfp.png";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { convertDateFormat } from "../../Utils/Helpers/ConvertDateFormat/ConvertDateFormat";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ModalResponse } from "../../Components/ModalBasic/ModalResponse";
import { InputField } from "../../Components/InputField/InputField";
import Paper from "../../assets/Paper.png";
import CalendarImg from "../../assets/Calendar.png";
import QRIcon from "../../assets/QRIcon.png";
import EditImg from "../../assets/EditImage.png";
import { Calendar } from 'primereact/calendar';
import { dogBreeds, catBreeds } from "../../Utils/PetBreeds/PetBreeds";
import { useFetchPetById } from "../../Hooks/useFetchPetById/useFetchPetById";
import { usePet } from "../../Contexts/PetContext/PetContext";

export const PetProfile = () => {
  const {pet_id} = useParams();
  const [pet, setPet] = useState(null);
  const { register, handleSubmit, setValue } = useForm();
  const [profileImage, setProfileImage] = useState(type == 'dog' ? defaultDogPfp : defaultCatPfp);
  const [filePfp, setFilePfp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const { getPetById, isLoading, isSuccess, error } = useFetchPetById();
  const petsUser = usePet();
  const { findPet } = petsUser ?? {};

  const isFoundPet = findPet(pet_id);
  if (isFoundPet) {
    setPet(isFoundPet);
  } else {
    getPetById(pet_id);
  }



//   const onSubmitForm = async (dataForm) => {
//     const formDataPet = new FormData();
//     formDataPet.append("name", name);
//     formDataPet.append("species", type);
//     formDataPet.append("breed", dataForm.breed);
//     formDataPet.append('birthDate', dataForm.birthDate);
//     formDataPet.append("color", dataForm.color);
//     formDataPet.append("gender", dataForm.gender);
//     formDataPet.append("photo", filePfp);

//     const result = await addPet(formDataPet);
//     if (result.success) {
//       setModalOpen(true);
//     }
//   };

//   const handleDateChange = (e) => {
//     const selected = e.value || null;  
//     setSelectedDate(selected); 
//     setValue("birthDate", selected ? convertDateFormat(selected) : ""); 
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfileImage(imageUrl);
//       setFilePfp(file);
//       event.target.value = "";
//     }
//   };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-[1.4rem]">
      <div className="bg-white p-8 rounded-2xl w-screen max-w-sm ">
        <NavButton onClick={() => setRenderPet2(false)} />
        <div className="flex justify-center mb-6">
          <label htmlFor="profile-upload" className="relative cursor-pointer">
            <img
              src={profileImage}
              alt={type}
              className="w-32 h-30 rounded-full object-cover "
            />
            <span className="absolute bottom-1 right-0 ">
              <img
                className=" rounded-[0.5rem] w-6 h-6"
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

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <label className="font-semibold">Seguridad de la mascota</label>
          <div
            className="relative cursor-pointer p-3 bg-gray-100 rounded-lg flex justify-between items-center text-[1.2rem] hover:bg-gray-100"
            onClick={() => navigate('/check_protection')}
          >
            <span className="flex items-center text-gray-500">
              <span className="text-gray-500 mr-2">
                <img className="w-5 h-5" src={QRIcon} alt="QRIcon" />
              </span>
              Codigo QR
            </span>
            <span className="text-orange-500 hover:underline">+add</span>
          </div>

          <div className="relative">
            <label className="block mb-1 font-semibold">Fecha de nacimiento</label>
            <span className={`absolute top-13 left-3  z-4 ${modalOpen ? 'hidden' : ''}`}><img className='  w-5 h-5' src={CalendarImg} alt="CalendarIcon" /></span>
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/mm/yy"
              placeholder='Seleccione la fecha'
              className="w-full bg-gray-100 "
            />
            <input  type="hidden" {...register("birthDate")} value={selectedDate || ""} />
          </div>


          <div>
            <label className="block mb-1 font-semibold">Raza</label>
            <select
              {...register("breed")}
              className="w-full p-3 bg-gray-100 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition duration-200 ease-in-out appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%23888%22 viewBox=%220 0 12 12%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22m2 5 4 4 4-4%22/%3E%3C/svg%3E')] bg-[center_right_1rem] px-4 py-2.5"
            >
              <option value="" disabled selected>
                Ejemplo: Border Collie
              </option>
              {(type === "dog" ? dogBreeds : catBreeds).map((breed) => (
                <option key={breed} value={breed} className="py-2">
                  {breed}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Género</label>
            <select
              {...register("gender")}
              className="w-full p-3 bg-gray-100 rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition duration-200 ease-in-out appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%23888%22 viewBox=%220 0 12 12%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22m2 5 4 4 4-4%22/%3E%3C/svg%3E')] bg-[center_right_1rem] px-4 py-2.5"
            >
              <option key="default" value="Default">
                Escoge el género
              </option>
              <option key="macho" value="Macho">
                Macho
              </option>
              <option key="hembra" value="Hembra">
                Hembra
              </option>
            </select>
          </div>
          <InputField
            label="Color"
            icon={Paper}
            register={register}
            name="color"
            placeholder="Color de tu mascota"
            validation={{ required: "El color es obligatorio" }}
          />

          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-all"
          >
            Confirmar
          </button>
        </form>
      </div>
      {modalOpen && (
        <ModalResponse
          setModalOpen={setModalOpen}
          navigate={navigate}
          path="/home"
          textResponse={"Se ha creado su Mascota con exito"}
        />
      )}
    </div>
  );
};
