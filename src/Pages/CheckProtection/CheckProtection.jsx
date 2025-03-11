import { useState } from "react";
import { ToggleButton } from "../../Components/ToggleButton/ToggleButton";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ItemHighlighted } from "../../Components/ItemHighlighted/ItemHighlighted";
import DogButton from "../../assets/DogButton.png";

import { usePet } from "../../Contexts/PetContext/PetContext";

export const CheckProtection = () => {
  const pets = usePet();
  const navigate = useNavigate();

  const { petList } = pets ?? {};

  //States:
  const [protectionRender, setProtectionRender] = useState("tag");
  const [selectedPet, setSelectedPet] = useState(petList?.[0] || null);

  const handleNavButton = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="flex justify-center relative">
        <div className="absolute left-0">
          <NavButton onClick={handleNavButton} />
        </div>
        <div className="text-center font-bold text-2xl">Revisar Protección</div>
      </div>
      <ToggleButton
        textLeft={"Etiquetas QR"}
        textRight={"Registro Escaneo"}
        setProtectionRender={setProtectionRender}
      />

      <div className="flex gap-4">
        {petList.map((pet, index) => (
          <div key={index + pet._id} onClick={() => setSelectedPet(pet)}>
            <ItemHighlighted
              pet={pet}
              active={selectedPet == pet ? true : false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
