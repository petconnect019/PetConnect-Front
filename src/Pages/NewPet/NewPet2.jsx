import defaultCatPfp from '../../assets/CatProfilePfp.png'
import defaultDogPfp from '../../assets/DogProfilePfp.png'
import { useForm } from "react-hook-form";
import { useState } from "react";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";
import { FetchAddPet } from "../../Utils/Fetch/FetchAddPet/FetchAddPet";
import { convertDateFormat } from "../../Utils/Helpers/ConvertDateFormat/ConvertDateFormat";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";
import { NavButton } from '../../Components/NavButton/NavButton';
import { ButtonPrimary } from '../../Components/Buttons/ButtonPrimary';
import { ModalResponse } from '../../Components/ModalBasic/ModalResponse';
import { InputField } from '../../Components/InputField/InputField';
import Paper from '../../assets/Paper.png'
import Calendar from '../../assets/Calendar.png'

export const NewPet2 = ({ name, type , navigate, setRenderPet2}) => {
  const { register, handleSubmit } = useForm();
  const [profileImage, setProfileImage] = useState(type == 'dog'? defaultDogPfp : defaultCatPfp);
  const [filePfp, setFilePfp] = useState(null);
  const {changeIsFetched} = useIsFetchedPets();
  const [modalOpen, setModalOpen] = useState(false);


  const dogBreeds = [
    "Labrador Retriever", "Bulldog", "Golden Retriever", "Poodle", "Husky",
    "Beagle", "Dachshund", "Boxer", "Chihuahua", "Doberman",
    "Border Collie", "Rottweiler", "Shih Tzu", "Schnauzer", "Maltés",
    "Pastor Alemán", "Akita Inu", "Bichón Frisé", "Cocker Spaniel", "Dálmata",
    "Boston Terrier", "San Bernardo", "Chow Chow", "Gran Danés", "Pug",
    "Samoyedo", "Jack Russell Terrier", "Pinscher", "Pitbull Terrier", "Alaskan Malamute",
    "Yorkshire Terrier", "Shiba Inu", "West Highland White Terrier", "Cane Corso", "Scottish Terrier",
    "Airedale Terrier", "Basset Hound", "Bull Terrier", "Galgo", "Pointer",
    "Weimaraner", "Pomerania", "Pastor Belga", "Fox Terrier", "Cavapoo",
    "American Staffordshire Terrier", "Cavalier King Charles Spaniel", "Whippet", "Vizsla", "Terranova"
  ];
  
  const catBreeds = [
    "Persa", "Siamés", "Maine Coon", "Bengala", "Sphynx",
    "Angora", "Scottish Fold", "Británico de Pelo Corto", "Ragdoll", "Azul Ruso",
    "Noruego del Bosque", "Bobtail Japonés", "Cornish Rex", "Devon Rex", "Manx",
    "Abisinio", "Somalí", "Himalayo", "Ocicat", "Balinés",
    "Burmés", "Oriental de Pelo Corto", "Chartreux", "Selkirk Rex", "Savannah",
    "Exótico de Pelo Corto", "Turco Van", "Munchkin", "Burmilla", "Tonkinés",
    "Singapura", "Chausie", "Serengeti", "Cymric", "Javanés"
  ];
  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setFilePfp(file);
    }
  };

  const onSubmitForm = async (dataForm) => { 
    const formDataPet = new FormData();
    formDataPet.append('name', name);
    formDataPet.append('species', type);
    formDataPet.append('breed', dataForm.breed);
    formDataPet.append('birthDate', convertDateFormat(dataForm.birthDate));
    formDataPet.append('color', dataForm.color);
    formDataPet.append('gender', dataForm.gender);
    formDataPet.append('photo', filePfp);
    
    let token = sessionStorage.getItem('accessToken');
    if (isTokenExpired(token)) {
      try {
        await FetchRefreshToken();
        token = sessionStorage.getItem('accessToken');
        
      } catch (error) {
        console.log(error);
      }
    }

    try {
      await FetchAddPet(formDataPet, token);
      if (!FetchAddPet.ok) {
        setModalOpen(true);
        
      }
    } catch (error) {
      console.log(error);
      
    }

    changeIsFetched(false);
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-[1.4rem]">
      <div className='bg-white p-8 rounded-2xl w-screen max-w-sm '>
        <NavButton onClick={()=>setRenderPet2(false)} />
          <div className="flex justify-center mb-6">
            <label htmlFor="profile-upload" className="cursor-pointer">
              <img
                src={profileImage}
                alt={type}
                className="w-32 h-30 rounded-full object-cover border"
              />
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
        <label className='font-semibold'>Seguridad de la mascota</label>
        <div
          className="relative cursor-pointer p-3 border rounded-lg flex justify-between items-center text-[1.2rem] hover:bg-gray-100"
          onClick={() => console.log("Añadir Código QR")}
        > 
        
          <span className="flex items-center">
            <span className="text-gray-500 mr-2">🔒</span>
            Codigo QR
          </span>
          <span className="text-orange-500 hover:underline">+add</span>
        </div>

        <div className="relative">
          <label className="block mb-1 font-semibold">Fecha de nacimiento</label>
          <span className="absolute left-3 top-14 text-gray-500"><img className='h-5 w-5' src={Calendar} alt="IconCalendar" /></span>
          <input
            type="date"
            {...register("birthDate")}
            className="w-full pl-10 p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Raza</label>
          <select
            {...register("breed")}
            className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {(type === "dog" ? dogBreeds : catBreeds).map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Género</label>
          <select
            {...register("gender")}
            className="w-full p-3  text-[1.2rem]  bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option className='text-[1.2rem]' value="Default">Escoga el genero de tu mascota</option>
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>

        {/* <div>
          <label className="block mb-1">Color</label>
          <input
            type="text"
            placeholder="Color"
            {...register("color")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

           label="Nombre"
                                          icon={Paper}
                                          register={register}
                                          name="name"
                                          placeholder="Nombre"
                                          validation={{ required: "El nombre es obligatorio" }}

        </div> */}
        <InputField 
          label="Color"
          icon={Paper}
          register={register}
          name="color"
          placeholder="Color de tu mascota"
          validation={{required :"El color es obligatorio"}}
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
                path='/home'
                textResponse={'Se ha creado su Mascota con exito'} />
          )}


    </div>
  );
};