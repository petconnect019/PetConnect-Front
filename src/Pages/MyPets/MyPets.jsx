import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePet } from "../../Contexts/PetContext/PetContext";
import defaultDog from "../../assets/images/DogProfilePfp.png";
import defaultCat from "../../assets/images/CatProfilePfp.png";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ModalDeletePet } from "../../Components/ModalBasic/ModalDeletePet";
import { fetchDeletePet } from "../../Utils/Fetch/FetchDeletePet/FetchDeletePet";
import { AiFillHome, AiOutlineEdit } from "react-icons/ai";
import { MdDelete, MdPets } from "react-icons/md";
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
                // Actualizar la lista de mascotas eliminando la mascota borrada
                removePet(deleteModal.petId);
                
                // Cerrar modal
                setDeleteModal({
                    isOpen: false,
                    petId: null,
                    petName: '',
                    isLoading: false
                });
                
                // Opcional: mostrar mensaje de éxito
                console.log('Mascota eliminada exitosamente');
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <NavButton onClick={() => navigate(-1)} />
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-orange-100 rounded-full">
                            <MdPets className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Mis Mascotas
                            </h1>
                            <p className="text-gray-600 text-sm">
                                {petList?.length || 0} mascota{petList?.length !== 1 ? 's' : ''} registrada{petList?.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    <div className="w-10" /> {/* Spacer for balance */}
                </div>

                {/* Content */}
                {petList && petList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {petList.map((pet, index) => (
                            <div
                                key={index + pet.id}
                                onClick={() => navigate(`/pet-details/${pet.id}`)}
                                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-orange-200 overflow-hidden transform hover:-translate-y-1"
                            >
                                {/* Status Badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <div className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        <AiFillHome className="w-3 h-3 mr-1" />
                                        En casa
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="absolute top-3 right-3 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={(e) => handleEditClick(e, pet.id)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200 group/edit"
                                    >
                                        <AiOutlineEdit className="w-4 h-4 text-blue-600 group-hover/edit:scale-110 transition-transform" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, pet)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 hover:shadow-xl transition-all duration-200 group/delete"
                                    >
                                        <MdDelete className="w-4 h-4 text-red-600 group-hover/delete:scale-110 transition-transform" />
                                    </button>
                                </div>

                                {/* Pet Image */}
                                <div className="relative aspect-square p-6 pb-4">
                                    <div className="relative w-full h-full">
                                        <img
                                            src={pet.profile_picture || (pet.species === "dog" ? defaultDog : defaultCat)}
                                            alt={`Foto de ${pet.name}`}
                                            className="w-full h-full object-cover rounded-2xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>

                                {/* Pet Info */}
                                <div className="px-6 pb-6">
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-200">
                                            {pet.name}
                                        </h3>
                                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                                            <span className="capitalize">{pet.species || 'Mascota'}</span>
                                            {pet.breed && (
                                                <>
                                                    <span>•</span>
                                                    <span>{pet.breed}</span>
                                                </>
                                            )}
                                        </div>
                                        {pet.gender && (
                                            <div className="mt-2 flex items-center justify-center">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                    {pet.gender}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <BiHeart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No tienes mascotas registradas
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Agrega tu primera mascota para comenzar a usar todas las funciones de PetConnect
                        </p>
                        <button
                            onClick={() => navigate('/new-pet1')}
                            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            <MdPets className="w-5 h-5 mr-2" />
                            Agregar Primera Mascota
                        </button>
                    </div>
                )}

                {/* Add Pet Button (when pets exist) */}
                {petList && petList.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={() => navigate('/new-pet1')}
                            className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <MdPets className="w-5 h-5 mr-2" />
                            Agregar Nueva Mascota
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