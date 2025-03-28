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

export const CheckProtection = () => {
  const pets = usePet();
  const navigate = useNavigate();

  const { petList } = pets ?? {};
  const {getQrsById, isLoading, error, qrsResult} = useFetchQrsUser();

  //estados del componente
  const [protectionRender, setProtectionRender] = useState("tag");
  const [selectedPet, setSelectedPet] = useState(petList?.[0] || null);

  //se hace el fetch con los datos de la mascota seleccionada
  useEffect(() => {
    if (protectionRender==='tag' && selectedPet) {
      getQrsById();

    } else if (protectionRender==='scans' && selectedPet) {
      useFetchScans(selectedPet._id);
      
    }
  }, [protectionRender, selectedPet]);

  //se selecciona la primera mascota al inicializar el componente
  useEffect(() => {
    if (petList?.length > 0) {
      setSelectedPet(petList[0]);
    }
  }, [petList]);

  //arreglo para medir la cantidad de imagenes de añadir tag renderizar
  const addTagContainer = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  useEffect(()=> {
    if (qrsResult) {
      console.log(qrsResult)
    }
  }, [qrsResult])

  const count = qrsResult?.length || 0;
  const hasQrs = count > 0;
  const isSelectedPet = qrsResult?.[0]?.petId?._id === selectedPet?._id;

  return (
    <div className="max-w-full sm:max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-lg">
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <NavButton onClick={() => navigate(-1)} />
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">Revisar Protección</h1>
      <div className="w-8 sm:w-10"></div>
    </div>

    <div className="flex justify-center mb-4 sm:mb-6">
      <ToggleButton
        textLeft={"Etiquetas QR"}
        textRight={"Registro Escaneo"}
        setProtectionRender={setProtectionRender}
      />
    </div>

    <div className="flex justify-center"> 
      <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6 overflow-x-auto pb-2 px-2 sm:px-0 max-w-full">
        {petList?.map((pet, index) => (
          <div
            key={index + pet._id}
            onClick={() => setSelectedPet(pet)}
            className="cursor-pointer flex-shrink-0 w-28 sm:w-36"
          >
            <div className={`flex flex-col items-center border rounded-lg p-2 sm:p-3 shadow-sm transition-all duration-300 
              ${selectedPet === pet 
                ? 'border-[#EC9126] border-2 bg-[#EC9126]/10 shadow-md' 
                : 'border-gray-200 hover:border-[#EC9126]/50 hover:shadow-md'}`}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-full overflow-hidden">
                <img 
                  src={pet.profile_picture || (pet.species === 'dog' ? defaultDog : defaultCat)} 
                  alt={pet.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className={`text-xs sm:text-sm text-center truncate max-w-full font-medium
                ${selectedPet === pet ? 'text-[#EC9126]' : 'text-gray-800'}`}>
                {pet.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Resto del código sigue igual */}
    {protectionRender === "scan" && (
      <div className="flex justify-between items-center px-2 sm:px-0 mt-4 sm:mt-6">
        <div className="text-sm sm:text-base text-gray-600">Últimos escaneos</div>
        <div className="w-8 h-8 sm:w-10 sm:h-10">
          <img className="w-full h-full object-contain" src={SortIcon} alt="filter" />
        </div>
      </div>
    )}

    {protectionRender === "tag" && (
      <div className="w-full max-w-lg mx-auto p-2 sm:p-4 mt-4 sm:mt-6">
        <div className="grid grid-cols-2 grid-rows-6 gap-4 sm:gap-6">
          {
            addTagContainer.map((element, index) => {
              if (hasQrs && isSelectedPet) {
                return index < count ? (
                  <ImageTagContainer key={`image-${index}`} />
                ) : (
                  <AddTagContainer key={`add-${index}`} petId={selectedPet?._id} />
                );
              }
            
              return <AddTagContainer key={`add-${index}`} petId={selectedPet?._id} />;
            })
          }
        </div>
      </div>
    )}
  </div>
  );
};