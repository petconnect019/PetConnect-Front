import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePet } from "../../Contexts/PetContext/PetContext";
import defaultDog from "../../assets/images/DogProfilePfp.png";
import defaultCat from "../../assets/images/CatProfilePfp.png";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ModalDeletePet } from "../../Components/ModalBasic/ModalDeletePet";
import { fetchDeletePet } from "../../Utils/Fetch/FetchDeletePet/FetchDeletePet";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDelete, MdAdd } from "react-icons/md";
import { BiHeart } from "react-icons/bi";

export const MyPets = () => {
    const navigate = useNavigate();
    const pets = usePet();
    const { petList, removePet } = pets ?? {};
    
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        petId: null,
        petName: '',
        isLoading: false
    });

    const handleDeleteClick = (e, pet) => {
        e.stopPropagation();
        setDeleteModal({
            isOpen: true,
            petId: pet.id,
            petName: pet.name,
            isLoading: false
        });
    };

    const handleDeleteConfirm = async () => {
        setDeleteModal(prev => ({ ...prev, isLoading: true }));
        
        try {
            const result = await fetchDeletePet(deleteModal.petId);
            
            if (result.success) {
                removePet(deleteModal.petId);
                setDeleteModal({
                    isOpen: false,
                    petId: null,
                    petName: '',
                    isLoading: false
                });
            } else {
                console.error('Error al eliminar mascota:', result.message);
                setDeleteModal(prev => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error('Error al eliminar mascota:', error);
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({
            isOpen: false,
            petId: null,
            petName: '',
            isLoading: false
        });
    };

    const handleEditClick = (e, petId) => {
        e.stopPropagation();
        navigate(`/pet-profile/${petId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <NavButton onClick={() => navigate(-1)} />
                    <div className="text-center">
                        <h1 className="text-2xl font-light text-gray-900 mb-1">
                            Mis Mascotas
                        </h1>
                        <p className="text-sm text-gray-500">
                            {petList?.length || 0} mascota{petList?.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="w-10" />
                </div>

                {/* Content */}
                {petList && petList.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {petList.map((pet, index) => (
                                <div
                                    key={index + pet.id}
                                    onClick={() => navigate(`/pet-details/${pet.id}`)}
                                    className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 overflow-hidden"
                                >
                                    {/* Action Buttons */}
                                    <div className="absolute top-3 right-3 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <button
                                            onClick={(e) => handleEditClick(e, pet.id)}
                                            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        >
                                            <AiOutlineEdit className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteClick(e, pet)}
                                            className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                                        >
                                            <MdDelete className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>

                                    {/* Pet Image */}
                                    <div className="aspect-square p-6">
                                        <img
                                            src={pet.profile_picture || (pet.species === "dog" ? defaultDog : defaultCat)}
                                            alt={`Foto de ${pet.name}`}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Pet Info */}
                                    <div className="px-6 pb-6">
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            {pet.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500 space-x-2">
                                            <span className="capitalize">{pet.species || 'Mascota'}</span>
                                            {pet.breed && (
                                                <>
                                                    <span>•</span>
                                                    <span>{pet.breed}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Pet Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/new-pet1')}
                                className="inline-flex items-center px-6 py-3 bg-[#EC9216] text-white rounded-lg font-medium hover:bg-[#d4820f] transition-colors duration-200"
                            >
                                <MdAdd className="w-5 h-5 mr-2" />
                                Agregar Mascota
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <BiHeart className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-light text-gray-900 mb-2">
                            No tienes mascotas
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Agrega tu primera mascota para comenzar
                        </p>
                        <button
                            onClick={() => navigate('/new-pet1')}
                            className="inline-flex items-center px-6 py-3 bg-[#EC9216] text-white rounded-lg font-medium hover:bg-[#d4820f] transition-colors duration-200"
                        >
                            <MdAdd className="w-5 h-5 mr-2" />
                            Agregar Primera Mascota
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ModalDeletePet
                isOpen={deleteModal.isOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                petName={deleteModal.petName}
                isLoading={deleteModal.isLoading}
            />
        </div>
    );
};