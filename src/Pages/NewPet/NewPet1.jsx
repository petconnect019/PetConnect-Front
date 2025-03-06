import { NewPet2 } from "./NewPet2";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ButtonBack from '../../assets/BackButton.png';
import ImgFrontal from '../../assets/ImgStepPet.png';
import DogButton from '../../assets/DogButton.png';
import CatButton from '../../assets/CatButton.png';
import Paper from '../../assets/Paper.png';

export const NewPet1 = () => {
    const [renderPet2, setRenderPet2] = useState(false);
    const [data, setData] = useState({ name: '', type: '' });
    const { register, handleSubmit } = useForm();
    const [selectedPet, setSelectedPet] = useState(null);

    const handleRender = (formData) => {
        if (!selectedPet) return; 
        setData({ name: formData.name, type: selectedPet });
        setRenderPet2(true);
    };

    return !renderPet2 ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-4 rounded-2xl w-full max-w-md h-auto">
                <nav className="flex justify-between items-center mb-4">
                    <li className="list-none">
                        <img src={ButtonBack} alt="Back" />
                    </li>
                </nav>
                <h2 className="text-2xl font-bold mb-2 text-center">Nombra tu mascota 🐾</h2>
                <img className="mx-auto w-auto h-36" src={ImgFrontal} alt="Pet step" />

                <form onSubmit={handleSubmit(handleRender)}>
                    <div className="flex flex-col gap-2">
                        <label>Nombre</label>
                        <div className="relative w-full">
                            <img
                                src={Paper}
                                alt="Icono de papel"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                            />
                            <input
                                {...register("name", { required: "El nombre es obligatorio" })}
                                type="text"
                                placeholder="Nombre"
                                className="border border-gray-300 rounded-md p-2 pl-10 w-full"
                            />
                        </div>

                        <label>¿Cuál es tu tipo de Mascota?</label>
                        <div className="flex justify-around gap-2">
                            <button
                                type="button"
                                className={`flex flex-col items-center p-2 h-[6.5rem] rounded-lg border ${
                                    selectedPet === "dog" ? "border-orange-400" : "border-gray-300"
                                }`}
                                onClick={() => setSelectedPet("dog")}
                            >
                                <img className="w-23 h-[5rem]" src={DogButton} alt="Dog" />
                                <p className="text-center mt-1 font-semibold">Perro</p>
                            </button>

                            <button
                                type="button"
                                className={`flex flex-col items-center p-2 h-[6.5rem] rounded-lg border ${
                                    selectedPet === "cat" ? "border-orange-400" : "border-gray-300"
                                }`}
                                onClick={() => setSelectedPet("cat")}
                            >
                                <img className="w-23 h-[5rem]" src={CatButton} alt="Cat" />
                                <p className="text-center mt-1 font-semibold">Gato</p>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                        <button type="submit" className="w-full bg-orange-400 text-white p-3 rounded-3xl">
                            Continuar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <NewPet2 name={data.name} type={data.type} />
    );
};
