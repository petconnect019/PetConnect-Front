import { useForm } from "react-hook-form";
import { useState } from "react";
import { GetPetAge } from "../../Utils/Helpers/GetPetAge/GetPetAge";
import { isTokenExpired } from "../../Utils/Helpers/IsTokenExpired/IsTokenExpired";
import { FetchRefreshToken } from "../../Utils/Fetch/FetchRefreshToken/FetchRefreshToken";

export const NewPet2 = ({ name, type }) => {
  const { register, handleSubmit } = useForm();
  const [profileImage, setProfileImage] = useState("/profile-placeholder.png");

  const dogBreeds = ["Labrador", "Bulldog", "Golden Retriever", "Poodle", "Husky"];
  const catBreeds = ["Persa", "Siames", "Maine Coon", "Bengala", "Sphynx"];

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const onSubmit = (dataForm) => {
    const formDataPet = new FormData();
    formDataPet.append('name', name);
    formDataPet.append('species', type);
    formDataPet.append('breed', dataForm.breed);
    formDataPet.append('age', dataForm.birthdate);
    formDataPet.append('profile_picture', document.getElementById('profile-upload').files[0]);

    let token = sessionStorage.getItem('acessToken');
    if (isTokenExpired(token)) {
      FetchRefreshToken(token);
      token = sessionStorage.getItem('acessToken');
    }
    

  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl relative">
      <button className="absolute top-4 left-4 text-gray-600 hover:text-gray-800">←</button>

      <div className="flex justify-center mb-6">
        <label htmlFor="profile-upload" className="cursor-pointer">
          <img
            src={profileImage}
            alt={type}
            className="w-20 h-20 rounded-full object-cover border"
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div
          className="relative cursor-pointer p-3 border rounded-lg flex justify-between items-center hover:bg-gray-100"
          onClick={() => console.log("Añadir Código QR")}
        >
          <span className="flex items-center">
            <span className="text-gray-500 mr-2">🔒</span>
            Seguridad de la mascota
          </span>
          <span className="text-orange-500 hover:underline">+add</span>
        </div>

        <div className="relative">
          <label className="block mb-1">Fecha de nacimiento</label>
          <span className="absolute left-3 top-10 text-gray-500">📅</span>
          <input
            type="date"
            {...register("birthdate")}
            className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1">Raza</label>
          <select
            {...register("breed")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(type === "dog" ? dogBreeds : catBreeds).map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">Género</label>
          <select
            {...register("gender")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Macho</option>
            <option value="female">Hembra</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Color</label>
          <input
            type="text"
            placeholder="Color"
            {...register("color")}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
};