import DogButton from '../../assets/images/DogButton.png';
import CatButton from '../../assets/images/CatButton.png';

export const PetTypeSelector = ({ selectedPet, setSelectedPet, textLabel }) => {
    return (
        <div className="flex flex-col">
            <label className="font-semibold text-gray-700 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl">{textLabel}</label>
            <div className="flex justify-around gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 3xl:gap-8 4xl:gap-8">
                <button
                    type="button"
                    className={`flex flex-col items-center pt-1 h-[5rem] xs:h-[6rem] sm:h-[6rem] md:h-[7rem] lg:h-[8rem] xl:h-[9rem] 2xl:h-[10rem] 3xl:h-[10rem] 4xl:h-[9rem] w-[8rem] xs:w-[9rem] sm:w-[10rem] md:w-[11rem] lg:w-[12rem] xl:w-[13rem] 2xl:w-[14rem] 3xl:w-[14rem] 4xl:w-[13rem] rounded-lg border ${
                        selectedPet === "dog" ? "border-orange-400" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedPet("dog")}
                >
                    <img className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 2xl:w-24 2xl:h-24 3xl:w-24 3xl:h-24 4xl:w-22 4xl:h-22" src={DogButton} alt="Dog" />
                    <p className="text-center mt-1 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-xl">Perro</p>
                </button>

                <button
                    type="button"
                    className={`flex flex-col items-center pt-1 h-[5rem] xs:h-[6rem] sm:h-[6rem] md:h-[7rem] lg:h-[8rem] xl:h-[9rem] 2xl:h-[10rem] 3xl:h-[10rem] 4xl:h-[9rem] w-[8rem] xs:w-[9rem] sm:w-[10rem] md:w-[11rem] lg:w-[12rem] xl:w-[13rem] 2xl:w-[14rem] 3xl:w-[14rem] 4xl:w-[13rem] rounded-lg border ${
                        selectedPet === "cat" ? "border-orange-400" : "border-gray-300"
                    }`}
                    onClick={() => setSelectedPet("cat")}
                >
                    <img className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-22 xl:h-22 2xl:w-24 2xl:h-24 3xl:w-24 3xl:h-24 4xl:w-22 4xl:h-22" src={CatButton} alt="Cat" />
                    <p className="text-center mt-1 font-semibold text-xs xs:text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg 2xl:text-xl 3xl:text-xl 4xl:text-xl">Gato</p>
                </button>
            </div>
        </div>
    );
};