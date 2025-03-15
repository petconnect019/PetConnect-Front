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
import { ModalResponse } from '../../Components/ModalBasic/ModalResponse';
import { InputField } from '../../Components/InputField/InputField';
import Paper from '../../assets/Paper.png'
import { Calendar } from 'primereact/calendar';
import QRIcon from '../../assets/QRIcon.png'
import EditImg from '../../assets/EditImage.png'
import CalendarImg from '../../assets/Calendar.png'

export const NewPet2 = ({ name, type , navigate, setRenderPet2}) => {
  const { register, handleSubmit,setValue } = useForm();
  const [profileImage, setProfileImage] = useState(type == 'dog'? defaultDogPfp : defaultCatPfp);
  const [filePfp, setFilePfp] = useState(null);
  const {changeIsFetched} = useIsFetchedPets();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");


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
    "American Staffordshire Terrier", "Cavalier King Charles Spaniel", "Whippet", "Vizsla", "Terranova","Criollo"
  ];
  
  const catBreeds = [
    "Persa", "Siamés", "Maine Coon", "Bengala", "Sphynx",
    "Angora", "Scottish Fold", "Británico de Pelo Corto", "Ragdoll", "Azul Ruso",
    "Noruego del Bosque", "Bobtail Japonés", "Cornish Rex", "Devon Rex", "Manx",
    "Abisinio", "Somalí", "Himalayo", "Ocicat", "Balinés",
    "Burmés", "Oriental de Pelo Corto", "Chartreux", "Selkirk Rex", "Savannah",
    "Exótico de Pelo Corto", "Turco Van", "Munchkin", "Burmilla", "Tonkinés",
    "Singapura", "Chausie", "Serengeti", "Cymric", "Javanés","Criollo"
  ];

  const spanishLocale = {
    firstDayOfWeek: 1,
    dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
    today: "Hoy",
    clear: "Limpiar"
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
    const formDataPet = new FormData();
    formDataPet.append('name', name);
    formDataPet.append('species', type);
    formDataPet.append('breed', dataForm.breed);
    formDataPet.append('birthDate', dataForm.birthDate);
    formDataPet.append('color', dataForm.color);
    formDataPet.append('gender', dataForm.gender);
    formDataPet.append('photo', filePfp);

    console.log("Datos enviados:", Object.fromEntries(formDataPet));
    
    let token = sessionStorage.getItem('accessToken');
    if (isTokenExpired(token)) {
      try {
        await FetchRefreshToken();
        token = sessionStorage.getItem('accessToken');
        
      } catch (error) {
        console.log(error);
        return;
      }
    }

    try {
        const response = await FetchAddPet(formDataPet, token);

         // Convertir la respuesta a JSON

    

      if (response.ok) {
        console.log("📩 Respuesta del backend:", response);
          setModalOpen(true);
      }
    } catch (error) {
      console.error("Error al registrar mascota:", error);
      
    }

    changeIsFetched(false);
    
  };

 

  const handleDateChange = (e) => {
    const selected = e.value || null;  
    setSelectedDate(selected); 
    setValue("birthDate", selected ? convertDateFormat(selected) : ""); 
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-[1.4rem]">
      <div className='bg-white p-8 rounded-2xl w-screen max-w-sm '>
        <NavButton onClick={()=>setRenderPet2(false)} />
          <div className="flex justify-center mb-6">
            <label htmlFor="profile-upload" className="relative cursor-pointer">
              <img
                src={profileImage}
                alt={type}
                className="w-32 h-30 rounded-full object-cover "
              />
              <span className='absolute bottom-1 right-0 '><img className=' rounded-[0.5rem] w-6 h-6' src={EditImg} alt="EditImgIcon" /></span>
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
          className="relative cursor-pointer p-3 bg-gray-100 rounded-lg flex justify-between items-center text-[1.2rem] hover:bg-gray-100"
          onClick={() => console.log("Añadir Código QR")}
        > 
        
          <span className="flex items-center">
            <span className="text-gray-500 mr-2"><img className='w-5 h-5' src={QRIcon} alt="QRIcon" /></span>
            Codigo QR
          </span>
          <span className="text-orange-500 hover:underline">+add</span>
        </div>

        <div className="relative">
            <label className="block mb-1 font-semibold">Fecha de nacimiento</label>
            <span><img className=' absolute top-13 left-2 z-10 w-5 h-5' src={CalendarImg} alt="CalendarIcon" /></span>
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              dateFormat="yy/mm/dd"
              placeholder='Seleccione la fecha'
              className="w-full bg-gray-100 "
            />
            <input  type="hidden" {...register("birthDate")} value={selectedDate || ""} />
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
            className="w-full p-3    bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option key="default" value="Default">Escoge el género</option>
            <option key="macho" value="Macho">Macho</option>
            <option key="hembra" value="Hembra">Hembra</option>
          </select>
        </div>
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