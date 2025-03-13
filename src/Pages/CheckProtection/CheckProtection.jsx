import { useEffect, useState } from "react";
import { ToggleButton } from "../../Components/ToggleButton/ToggleButton";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ItemHighlighted } from "../../Components/ItemHighlighted/ItemHighlighted";
import SortIcon from "../../assets/sort.png";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useFetchPets } from "../../Hooks/useFetchPets/useFetchPets";
import { useFetchScans } from "../../Hooks/useFetchScans/useFetchScans";

export const CheckProtection = () => {
  const pets = usePet();
  const navigate = useNavigate();
  const isFetched = useIsFetchedPets();

  const { petList } = pets ?? {};
  const { isFetchedPets } = isFetched ?? {};

  //estados del componente
  const [protectionRender, setProtectionRender] = useState("tag");
  const [selectedPet, setSelectedPet] = useState(petList?.[0] || null);

  //revisamos si las mascotas ya estan traidas o no
  isFetchedPets ? useFetchPets(false) : useFetchPets(true);
  
  //manejo del boton back
  const handleNavButton = () => {
    navigate(-1);
  };

  //se hace el fetch con los datos de la mascota seleccionada
  useEffect(()=> {
    if (protectionRender && selectedPet) {
        console.log("se hace el fetch con los datos: " + protectionRender + selectedPet.name + !!sessionStorage.getItem('accessToken'));
        useFetchScans(selectedPet._id);
    }

  }, [protectionRender, selectedPet])

  //se selecciona la primera mascota al inicializar el componente
  useEffect(() => {
    if (petList?.length > 0) {
        setSelectedPet(petList[0]);
    }
}, [petList]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <NavButton onClick={handleNavButton} />
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

      <div className="flex justify-between">
        <div className="text-gray-600 mt-1">Últimos escaneos</div>
        <div className="w-10 h-10">
            <img className="" src={SortIcon} alt="filter" />
        </div>
      </div>

    </div>
  );
};
