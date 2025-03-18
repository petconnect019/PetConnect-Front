import DogButton from '../../assets/DogButton.png';
import CatButton from '../../assets/CatButton.png';

export const PetTypeSelector = ({ selectedPet, setSelectedPet }) => {
    return (
        <div className="flex flex-col">
            <label className="text-[1.4rem] mb-4">¿Cuál es tu tipo de Mascota?</label>
            <div className="flex justify-around gap-2">
                <button
                    type="button"
                    className={`flex flex-col items-center p-2 h-[10rem] w-[10rem] rounded-lg border ${
                        selectedPet === "dog" ? "border-orange-400" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedPet("dog")}
                >
                    <img className="w-27 h-[7rem]" src={DogButton} alt="Dog" />
                    <p className="text-center mt-1 font-semibold text-[1.4rem]">Perro</p>
                </button>

                <button
                    type="button"
                    className={`flex flex-col items-center p-2 h-[10rem] w-[10rem] rounded-lg border ${
                        selectedPet === "cat" ? "border-orange-400" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedPet("cat")}
                >
                    <img className="w-27 h-[7rem]" src={CatButton} alt="Cat" />
                    <p className="text-center mt-1 font-semibold text-[1.4rem]">Gato</p>
                </button>
            </div>
        </div>
    );
};
