import { Link } from "react-router-dom";

export const PetsSection = ({ petList }) => {
    return (
        <section className="p-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Mis Mascotas</h2>
                <Link to={'/my-pets'} className="text-blue-500 font-medium hover:underline">Ver todas</Link>
            </div>
            <div className="flex space-x-4">
                {petList.length > 0 ? (
                    petList.map((pet, index) => (
                        <img key={index} src={pet.imageUrl || "/default-pet.jpg"} alt={pet.name} className="w-14 h-14 rounded-full border-2 border-gray-300" />
                    ))
                ) : (
                    <p className="text-gray-500">No tienes mascotas registradas.</p>
                )}
                <button className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-2xl font-bold">+</button>
            </div>
        </section>
    );
};
