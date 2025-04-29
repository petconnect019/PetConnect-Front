import DogButton from '../../assets/images/DogButton.png';
import CatButton from '../../assets/images/CatButton.png';

export const PetTypeSelector = ({ selectedPet, setSelectedPet,textLabel }) => {
    return (
        <div className="flex flex-col">
            <label className="font-semibold mb-3 mt-3">{textLabel}</label>
            <div className="flex justify-around gap-2">
                <button
                    type="button"
                    className={`flex flex-col items-center pt-1  h-[6rem] w-[10rem] rounded-lg border ${
                        selectedPet === "dog" ? "border-orange-400" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedPet("dog")}
                >
                    <img className="w-15 h-15" src={DogButton} alt="Dog" />
                    <p className="text-center mt-1 font-semibold text-[1.2rem]">Perro</p>
                </button>

                <button
                    type="button"
                    className={`flex flex-col items-center pt-1 h-[6rem] w-[10rem] rounded-lg border ${
                        selectedPet === "cat" ? "border-orange-400" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedPet("cat")}
                >
                    <img className="w-15 h-15" src={CatButton} alt="Cat" />
                    <p className="text-center mt-1 font-semibold text-[1.2rem]">Gato</p>
                </button>
            </div>
        </div>
    );
};