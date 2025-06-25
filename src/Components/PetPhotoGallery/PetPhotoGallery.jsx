import { useState, useRef, useEffect } from "react";
import { useFetchPetPhotos } from "../../Hooks/useFetchPetPhotos/useFetchPetPhotos";
import { ImSpinner2 } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import addPetPhoto from '../../assets/images/addPetPhoto.png';

export const PetPhotoGallery = ({ petId, isOwner = false }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  const {
    photos,
    isLoading,
    error,
    isSuccess,
    uploadProgress,
    getPetPhotos,
    uploadPetPhotos,
    deletePetPhoto,
    clearPhotosState
  } = useFetchPetPhotos();

  // Cargar fotos al montar el componente
  useEffect(() => {
    if (petId) {
      getPetPhotos(petId);
    }
    
    return () => {
      clearPhotosState();
    };
  }, [petId, getPetPhotos, clearPhotosState]);

  // Generar URLs de preview para los archivos seleccionados
  useEffect(() => {
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    // Validar que no se exceda el límite de 5 fotos
    if (photos.length + files.length > 5) {
      alert("No puedes subir más de 5 fotos en total");
      return;
    }

    // Validar tipos de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert("Solo se permiten archivos JPG, PNG y WebP");
      return;
    }

    // Validar tamaño (máximo 5MB por archivo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      alert("Los archivos no pueden ser mayores a 5MB");
      return;
    }

    setSelectedFiles(files);
    setShowUploadModal(true);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    const result = await uploadPetPhotos(petId, selectedFiles);
    
    if (result.success) {
      setShowUploadModal(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta foto?")) {
      await deletePetPhoto(petId, photoId);
    }
  };

  const handleCancelUpload = () => {
    setShowUploadModal(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderPhotoGrid = () => {
    const photoSlots = [];
    const maxPhotos = 5;

    // Agregar fotos existentes
    photos.forEach((photo, index) => {
      photoSlots.push(
        <div 
          key={photo._id || index} 
          className="relative flex items-center justify-center bg-[#F8FAFC] rounded-lg aspect-square overflow-hidden group"
        >
          <img 
            src={photo.url || photo} 
            alt={`Pet photo ${index + 1}`} 
            className="max-w-full max-h-full object-cover w-full h-full"
          />
          {isOwner && (
            <button
              onClick={() => handleDeletePhoto(photo._id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Eliminar foto"
            >
              <IoClose size={16} />
            </button>
          )}
        </div>
      );
    });

    // Agregar botón de subir si hay espacio y es el propietario
    if (photos.length < maxPhotos && isOwner) {
      photoSlots.push(
        <div 
          key="upload-button"
          className="flex items-center justify-center bg-[#F8FAFC] rounded-lg aspect-square cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-300"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center">
            <IoMdAdd size={32} className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 text-center">Agregar foto</span>
          </div>
        </div>
      );
    }

    // Agregar slots vacíos para mantener la cuadrícula
    while (photoSlots.length < 4) {
      photoSlots.push(
        <div 
          key={`empty-${photoSlots.length}`}
          className="flex items-center justify-center bg-[#F8FAFC] rounded-lg aspect-square"
        >
          <img 
            src={addPetPhoto} 
            alt="Empty slot" 
            className="max-w-full max-h-full object-contain opacity-30"
          />
        </div>
      );
    }

    return photoSlots;
  };

  return (
    <div className="p-4 sm:p-6 xs:p-5 3xl:p-8 4xl:p-10">
      <div className="flex justify-between items-center mb-3 sm:mb-4 xs:mb-5 3xl:mb-6 4xl:mb-8">
        <h1 className="text-xl sm:text-2xl xs:text-xl md:text-3xl 3xl:text-4xl 4xl:text-5xl font-bold">
          Galería de Imágenes
        </h1>
        {isOwner && photos.length < 5 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#EC9126] text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            Agregar Fotos
          </button>
        )}
      </div>

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Mensaje de error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Grid de fotos */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 xs:gap-4 md:gap-5 3xl:gap-8 4xl:gap-10">
        {isLoading ? (
          <div className="col-span-2 flex justify-center items-center py-8">
            <ImSpinner2 className="animate-spin text-[#EC9126] text-2xl" />
          </div>
        ) : (
          renderPhotoGrid()
        )}
      </div>

      {/* Modal de preview y confirmación de subida */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar subida de fotos</h3>
            
            {/* Preview de las fotos seleccionadas */}
            <div className="grid grid-cols-2 gap-2 mb-4 max-h-48 overflow-y-auto">
              {previewUrls.map((url, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Barra de progreso */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#EC9126] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{uploadProgress}% completado</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelUpload}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="px-4 py-2 bg-[#EC9126] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <ImSpinner2 className="animate-spin text-white" />
                ) : (
                  "Subir Fotos"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 