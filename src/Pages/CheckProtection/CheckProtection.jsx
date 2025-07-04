import { useEffect, useState, useRef } from "react";
import { ImageTagContainer } from "../../Components/ImageTagContainer/ImageTagContainer";
import { AddTagContainer } from "../../Components/AddTagContainer/AddTagContainer";
import { ToggleButton } from "../../Components/ToggleButton/ToggleButton";
import { useNavigate } from "react-router-dom";
import { NavButton } from "../../Components/NavButton/NavButton";
import { ItemHighlighted } from "../../Components/ItemHighlighted/ItemHighlighted";
import SortIcon from "../../assets/images/sort.png";
import { usePet } from "../../Contexts/PetContext/PetContext";
import { useFetchPets } from "../../Hooks/useFetchPets/useFetchPets";
import { useFetchScans } from "../../Hooks/useFetchScans/useFetchScans";
import { useFetchQrsUser } from "../../Hooks/useFetchQrsUser/useFetchQrsUser";
import { ScannedComponent } from "../../Components/ScannedComponent/ScannedComponent";
import defaultDog from "../../assets/images/DogProfilePfp.png";
import defaultCat from "../../assets/images/CatProfilePfp.png";
import { MdPets } from "react-icons/md";
import { useIsFetchedPets } from "../../Contexts/IsFetchedPets/IsFetchedPets";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';
import { ScanCard } from "../../Components/ScanCard/ScanCard";
import { AllScansMap } from "../../Components/AllScansMaps/AllScansMaps";

export const CheckProtection = () => {
  const pets = usePet();
  const navigate = useNavigate();
  const { isFetchedPets } = useIsFetchedPets();

  const { petList } = pets ?? {};
  const { getQrsById, isLoading, error, qrsResult } = useFetchQrsUser();

  // Fetch pets if not already fetched
  useFetchPets(true);

  //estados del componente
  const [protectionRender, setProtectionRender] = useState("tag");
  const [selectedPet, setSelectedPet] = useState(null);
  const [refreshQRs, setRefreshQRs] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [isLoadingScans, setIsLoadingScans] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Fix the default icon issue in react-leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: null,
      iconUrl: markerIcon,
      shadowUrl: markerIconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    
    setMapReady(true);
  }, []);

  // NUEVO: Traer los QRs cada vez que cambie la mascota seleccionada
  useEffect(() => {
    if (selectedPet) {
      getQrsById();
    }
  }, [selectedPet, refreshQRs]);

  // Función para cargar los escaneos
  const fetchScans = async (petId) => {
    if (!petId) return;
    
    setIsLoadingScans(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No hay token de acceso');
        return;
      }
      
      // Obtener historial de escaneos para todos los QRs de la mascota seleccionada
      const selectedPetQRs = qrsResult?.filter(qr => qr.petId && qr.petId._id === petId) || [];
      
      const allScanHistory = [];
      for (const qr of selectedPetQRs) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/qr/${qr._id}/history`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Datos recibidos del backend:', data);
          if (data.success && data.history) {
            // Renombrar `ubicacion` a `location` para consistencia en el frontend
            const transformedHistory = data.history.map(scan => ({
              ...scan,
              location: scan.ubicacion,
              // Eliminar la propiedad original para evitar confusiones
              // delete scan.ubicacion; // Esto no es posible porque scan es un objeto inmutable aquí
            }));
             allScanHistory.push(...transformedHistory.map(s => {
                const { ubicacion, ...rest } = s;
                return rest;
            }));
          }
        }
      }
      
      // Función auxiliar para obtener timestamp robusto
      const getTimestamp = (item) => {
        if (item.scanDate) return new Date(item.scanDate).getTime();
        if (item.createdAt) return new Date(item.createdAt).getTime();
        if (item.fecha && item.hora) {
          return new Date(`${item.fecha} ${item.hora}`).getTime();
        }
        return 0;
      };

      const sortedHistory = allScanHistory.sort((a, b) => {
        const diff = getTimestamp(a) - getTimestamp(b);
        return sortNewest ? -diff : diff;
      });
      
      console.log('Historia ordenada final:', sortedHistory);
      setScanHistory(sortedHistory);
    } catch (error) {
      console.error('Error al obtener el historial de escaneos:', error);
    } finally {
      setIsLoadingScans(false);
    }
  };

  //se hace el fetch con los datos de la mascota seleccionada
  useEffect(() => {
    if (protectionRender === "scan" && selectedPet && qrsResult?.length > 0) {
      fetchScans(selectedPet._id);
    }
  }, [protectionRender, selectedPet, qrsResult, sortNewest]);

  //se selecciona la primera mascota al inicializar el componente o cuando se cargan las mascotas
  useEffect(() => {
    if (petList?.length > 0) {
      setSelectedPet(petList[0]);
    }
  }, [petList]);

  // Callback para refrescar los QRs después de agregar uno nuevo
  const handleQRAdded = () => {
    setRefreshQRs(prev => !prev);
  };

  // Manejar el toggle de ordenamiento
  const handleToggleSort = () => {
    setSortNewest(prev => !prev);
  };

  //arreglo para medir la cantidad de imagenes de añadir tag renderizar
  const addTagContainer = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  const count = qrsResult?.length || 0;
  const hasQrs = count > 0;
  const isSelectedPet = qrsResult?.[0]?.petId?._id === selectedPet?._id;

  // Filtrar QRs para la mascota seleccionada
  const selectedPetQRs = qrsResult?.filter(qr => qr.petId && qr.petId._id === selectedPet?._id) || [];


  return (
    <div className="w-full max-w-[375px] sm:max-w-[576px] md:max-w-[768px] lg:max-w-[992px] xl:max-w-[1200px] 2xl:max-w-[1440px] 3xl:max-w-[1680px] 4xl:max-w-[1920px] mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header with navigation and title */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 relative">
        <div className="w-8 sm:w-10 xl:w-12 2xl:w-14 3xl:w-16 4xl:w-18 flex-shrink-0">
          <NavButton onClick={() => navigate(-1)} />
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-bold text-gray-800 text-center absolute left-1/2 transform -translate-x-1/2">
          Revisar Protección
        </h1>
        <div className="w-8 sm:w-10 xl:w-12 2xl:w-14 3xl:w-16 4xl:w-18 flex-shrink-0"></div>
      </div>

      {/* Toggle buttons for QR Tags and Scan Registry */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <ToggleButton
          textLeft={"Etiquetas QR"}
          textRight={"Registro Escaneo"}
          setProtectionRender={setProtectionRender}
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl"
        />
      </div>

      {/* Pet selection carousel */}
      <div className="relative mb-4 sm:mb-6 overflow-x-auto py-2 px-1">
        <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-9 justify-center sm:justify-start px-2 sm:px-4 pb-2 overflow-x-auto scrollbar-hide">
          {petList?.map((pet) => (
            <div
              key={pet._id}
              onClick={() => setSelectedPet(pet)}
              className="cursor-pointer flex-shrink-0 transition-transform"
            >
              <div
                className={`flex flex-col items-center border-2 rounded-lg p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 3xl:p-8 4xl:p-9 transition-all ${
                  selectedPet?._id === pet._id
                    ? "border-[#EC9126] bg-[#EC9126]/10 shadow-md"
                    : "border-gray-200 hover:border-[#EC9126]/50"
                }`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36 3xl:w-40 3xl:h-40 4xl:w-44 4xl:h-44 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
                  <img
                    src={
                      pet.profile_picture ||
                      (pet.species === "dog" ? defaultDog : defaultCat)
                    }
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className={`text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl truncate mt-2 font-medium max-w-20 sm:max-w-24 md:max-w-28 lg:max-w-32 xl:max-w-36 2xl:max-w-40 3xl:max-w-44 4xl:max-w-48 ${
                    selectedPet?._id === pet._id ? "text-[#EC9126]" : "text-gray-700"
                  }`}
                >
                  {pet.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan history section */}
      {protectionRender === "scan" && (
        <>
          <div className="flex justify-between items-center px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 3xl:px-14 4xl:px-16 mt-4 mb-4 bg-gray-50 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 3xl:p-9 4xl:p-10">
            <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl font-medium text-gray-700">
              Últimos escaneos {sortNewest ? '(Más recientes)' : '(Más antiguos)'}
            </div>
            <button 
              onClick={handleToggleSort}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-18 2xl:h-18 3xl:w-20 3xl:h-20 4xl:w-22 4xl:h-22 p-1 sm:p-2 md:p-3 lg:p-4 xl:p-5 2xl:p-6 3xl:p-7 4xl:p-8 bg-white rounded-full shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
              title={sortNewest ? 'Ordenar por más antiguos' : 'Ordenar por más recientes'}
            >
              <img
                className="w-full h-full object-contain"
                src={SortIcon}
                alt="filter"
              />
            </button>
          </div>

          {/* Grid de escaneos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 mt-6">
            {isLoadingScans ? (
              // Estado de carga
              Array.from({ length: 3 }).map((_, index) => (
                <div key={`loading-${index}`} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              ))
            ) : scanHistory.length > 0 ? (
              // Mostrar historial de escaneos
              scanHistory.map((scan, index) => (
                <ScanCard key={`scan-${index}`} scanData={scan} />
              ))
            ) : (
              // Mensaje de no hay datos
              <div className="col-span-full text-center p-8">
                <div className="bg-orange-50 p-6 rounded-xl inline-block mb-4">
                  <MdPets className="text-4xl text-orange-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay registros de escaneos</h3>
                <p className="text-gray-600">
                  {selectedPetQRs.length > 0 
                    ? 'No se ha registrado ningún escaneo para esta mascota todavía.' 
                    : 'Primero debes agregar etiquetas QR para tu mascota.'}
                </p>
                {selectedPetQRs.length === 0 && (
                  <button 
                    onClick={() => setProtectionRender('tag')}
                    className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Añadir etiquetas QR
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* QR tags section */}
      {protectionRender === "tag" && (
        <div className="w-full max-w-[375px] sm:max-w-[576px] md:max-w-[768px] lg:max-w-[992px] xl:max-w-[1200px] 2xl:max-w-[1440px] 3xl:max-w-[1680px] 4xl:max-w-[1920px] mx-auto p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 3xl:p-14 4xl:p-16 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 3xl:gap-8 4xl:gap-9">
            {addTagContainer.map((element, index) => {
              if (selectedPetQRs.length > 0 && index < selectedPetQRs.length) {
                return (
                  <div className="transform transition-transform hover:scale-102 shadow-sm" key={`image-${selectedPetQRs[index]._id}`}>
                    <ImageTagContainer
                      qrData={selectedPetQRs[index]}
                      onDelete={handleQRAdded}
                    />
                  </div>
                );
              }
              
              return (
                <div className="transform transition-transform hover:scale-102" key={`add-${index}`}>
                  <AddTagContainer 
                    petId={selectedPet?._id} 
                    onQRAdded={handleQRAdded}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="w-full flex justify-center items-center py-8">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16 2xl:h-18 2xl:w-18 3xl:h-20 3xl:w-20 4xl:h-22 4xl:w-22 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-4 w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-40 3xl:w-44 4xl:w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 3xl:p-9 4xl:p-10 text-red-500 bg-red-50 rounded-lg mt-4">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl">Ocurrió un error al cargar los datos.</p>
        </div>
      )}
    </div>
  );
};