import { useEffect, useState } from "react";
import { ImageTagContainer } from "../../Components/ImageTagContainer/ImageTagContainer";
import { AddTagContainer } from "../../Components/AddTagContainer/AddTagContainer";
import { ToggleButton } from "../../Components/ToggleButton/ToggleButton";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ItemHighlighted } from "../../Components/ItemHighlighted/ItemHighlighted";
import SortIcon from "../../assets/sort.png";
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
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <NavButton onClick={() => navigate(-1)} />
        <h1 className="text-2xl font-bold text-gray-800">Revisar Protección</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex justify-center mb-4">
        <ToggleButton
          textLeft={"Etiquetas QR"}
          textRight={"Registro Escaneo"}
          setProtectionRender={setProtectionRender}
        />
      </div>

      <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
        {petList?.map((pet, index) => (
          <div
            key={index + pet._id}
            onClick={() => setSelectedPet(pet)}
            className="cursor-pointer"
          >
            <ItemHighlighted pet={pet} active={selectedPet === pet} />
          </div>
        ))}
      </div>

      {/* Depending on the protectionRender state we render differrent screens */}

      {protectionRender === "scan" && (
        <div className="flex justify-between">
          <div className="text-gray-600 mt-1">Últimos escaneos</div>
          <div className="w-10 h-10">
            <img className="" src={SortIcon} alt="filter" />
          </div>
        </div>
      )}

      {protectionRender === "tag" && (
        <div className="w-full max-w-lg mx-auto p-4">
          <div className="grid grid-cols-2 grid-rows-6 gap-10">

            {qrsResult?.[0].petId._id===selectedPet?._id?
            addTagContainer.map((element, index) => {
              let count = qrsResult?.length; 

              return index < count ? (
                <ImageTagContainer key={`image-${index}`} />
              ) : (
                <AddTagContainer key={`add-${index} `} petId={selectedPet?._id} />
              );
            })
            :
            addTagContainer.map((el, index)=> (
              <AddTagContainer key={`image-${index}`}  petId={selectedPet?._id} />
            ))
          }
          </div>
        </div>
      )}
    </div>
  );
};
