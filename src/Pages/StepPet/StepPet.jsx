import { useNavigate } from "react-router-dom";

export const StepPet = () => {
    const navigate = useNavigate();

    const handleConfirm = () => {
        //se hace el fetch para guardar la mascota
        navigate("/step-user");

    };

    const handleSkip = () => {
        navigate("/step-user");
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Nombra a tu mascota</h1>
                <input 
                    type="text" 
                    placeholder="Nombre de la mascota" 
                    className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select 
                    className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Selecciona el tipo de mascota</option>
                    <option value="perro">Perro</option>
                    <option value="gato">Gato</option>
                </select>
                <div className="flex justify-between gap-2">
                    <button onClick={handleConfirm} className="w-1/2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition">Confirmar</button>
                    <button onClick={handleSkip} className="w-1/2 bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition">Saltar</button>
                </div>
            </div>
        </div>
    );
};
