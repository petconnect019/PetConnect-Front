import { useEffect, useState } from "react";
import { ImageTagContainer } from "../../Components/ImageTagContainer/ImageTagContainer";
import { AddTagContainer } from "../../Components/AddTagContainer/AddTagContainer";
import { ToggleButton } from "../../Components/ToggleButton/ToggleButton";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ItemHighlighted } from "../../Components/ItemHighlighted/ItemHighlighted";
import SortIcon from "../../assets/images/sort.png";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useFetchPets } from "../../Hooks/useFetchPets/useFetchPets";
import { useFetchScans } from "../../Hooks/useFetchScans/useFetchScans";
import { useFetchQrsUser } from "../../Hooks/useFetchQrsUser/useFetchQrsUser";
import defaultDog from "../../assets/images/DogProfilePfp.png";
import defaultCat from "../../assets/images/CatProfilePfp.png";

export const CheckProtection = () => {
  const pets = usePet();
  const navigate = useNavigate();

  const { petList } = pets ?? {};
  const { getQrsById, isLoading, error, qrsResult } = useFetchQrsUser();

  //estados del componente
  const [protectionRender, setProtectionRender] = useState("tag");
  const [selectedPet, setSelectedPet] = useState(petList?.[0] || null);
  const [refreshQRs, setRefreshQRs] = useState(false);

  //se hace el fetch con los datos de la mascota seleccionada
  useEffect(() => {
    if (protectionRender === "tag" && selectedPet) {
      getQrsById();
    } else if (protectionRender === "scans" && selectedPet) {
      useFetchScans(selectedPet._id);
    }
  }, [protectionRender, selectedPet, refreshQRs]);

  //se selecciona la primera mascota al inicializar el componente
  useEffect(() => {
    if (petList?.length > 0) {
      setSelectedPet(petList[0]);
    }
  }, [petList]);

  // Callback para refrescar los QRs después de agregar uno nuevo
  const handleQRAdded = () => {
    setRefreshQRs(prev => !prev);
  };

  //arreglo para medir la cantidad de imagenes de añadir tag renderizar
  const addTagContainer = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  useEffect(() => {
    if (qrsResult) {
      console.log(qrsResult);
    }
  }, [qrsResult]);

  const count = qrsResult?.length || 0;
  const hasQrs = count > 0;
  const isSelectedPet = qrsResult?.[0]?.petId?._id === selectedPet?._id;

  // Filtrar QRs para la mascota seleccionada
  const selectedPetQRs = qrsResult?.filter(qr => qr.petId && qr.petId._id === selectedPet?._id) || [];

  return (
    <div className="max-w-full sm:max-w-3xl md:max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header with navigation and title */}
      <div className="flex items-center justify-between mb-6">
        <NavButton onClick={() => navigate(-1)} className="flex-shrink-0" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center flex-grow px-2">
          Revisar Protección
        </h1>
        <div className="w-8 sm:w-10 flex-shrink-0"></div>
      </div>

      {/* Toggle buttons for QR Tags and Scan Registry */}
      <div className="flex justify-center mb-6">
        <ToggleButton
          textLeft={"Etiquetas QR"}
          textRight={"Registro Escaneo"}
          setProtectionRender={setProtectionRender}
        />
      </div>

      {/* Pet selection carousel */}
      <div className="relative mb-6 overflow-x-auto py-2 px-1">
        <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start px-2 sm:px-4 pb-2 overflow-x-auto scrollbar-hide">
          {petList?.map((pet) => (
            <div
              key={pet._id}
              onClick={() => setSelectedPet(pet)}
              className="cursor-pointer flex-shrink-0 transition-transform"
            >
              <div
                className={`flex flex-col items-center border-2 rounded-lg p-2 sm:p-3 transition-all ${
                  selectedPet?._id === pet._id
                    ? "border-[#EC9126] bg-[#EC9126]/10 shadow-md"
                    : "border-gray-200 hover:border-[#EC9126]/50"
                }`}
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                  <img
                    src={
                      pet.profile_picture ||
                      (pet.species === "dog" ? defaultDog : defaultCat)
                    }
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className={`text-xs sm:text-sm truncate mt-2 font-medium max-w-16 sm:max-w-20 ${
                    selectedPet?._id === pet._id ? "text-[#EC9126]" : "text-gray-700"
                  }`}
                >
                  {pet.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan history section */}
      {protectionRender === "scan" && (
        <div className="flex justify-between items-center px-2 sm:px-4 mt-4 mb-4 bg-gray-50 rounded-lg p-3">
          <div className="text-sm sm:text-base font-medium text-gray-700">
            Últimos escaneos
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 p-1 sm:p-2 bg-white rounded-full shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
            <img
              className="w-full h-full object-contain"
              src={SortIcon}
              alt="filter"
            />
          </div>
        </div>
      )}

      {/* QR tags section */}
      {protectionRender === "tag" && (
        <div className="w-full max-w-lg mx-auto p-2 sm:p-4 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {addTagContainer.map((element, index) => {
              // Si hay QRs para esta mascota y el índice es menor que la cantidad de QRs
              if (selectedPetQRs.length > 0 && index < selectedPetQRs.length) {
                return (
                  <div className="transform transition-transform hover:scale-102 shadow-sm" key={`image-${selectedPetQRs[index]._id}`}>
                    <ImageTagContainer
                      qrData={selectedPetQRs[index]}
                      onDelete={handleQRAdded}
                    />
                  </div>
                );
              }
              
              // Para espacios vacíos, mostrar AddTagContainer
              return (
                <div className="transform transition-transform hover:scale-102" key={`add-${index}`}>
                  <AddTagContainer 
                    petId={selectedPet?._id} 
                    onQRAdded={handleQRAdded}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="w-full flex justify-center items-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg mt-4">
          <p>Ocurrió un error al cargar los datos.</p>
        </div>
      )}
    </div>
  );
};