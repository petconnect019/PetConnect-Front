import { Link } from "react-router-dom";
import { ProfilePetSection } from "../ProfilePetSection/ProfilePetSection";

export const PetsSection = ({ petList, navigate }) => {
    return (
        <section>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold">Mis Mascotas</h2>
                <Link to={'/my-pets'} className="text-brand font-medium hover:underline">Ver todas</Link>
            </div>
            <div className="flex space-x-4">
                {petList.length > 0 ? (
                    petList.map((pet, index) => (
                        <ProfilePetSection key={index + pet._id} pet={pet} navigate={navigate}/>
                    ))
                ) : (
                    <p className="text-gray-500">No tienes mascotas registradas.</p>
                )}
                <button onClick={()=> navigate('/new_pet_1')} className="w-18 h-18 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 text-2xl font-bold">+</button>
            </div>
        </section>
    );
};
