export const FetchUpdatePhotoPet = async (petData,file,token) => {
  try{

    if (!file) {
        return { ok: false, message: "No hay archivo para subir" };
    }

    let formData= new FormData();

    if(file){
        formData.append('photo',file);
    }


    let response = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${petData._id}/profile-picture`,{
        method: 'PUT',
        headers:{
            Authorization: `Bearer ${token}`
        },
        credentials: 'include',
        body:formData,
    });

    const result = await response.json();
    console.log("Respuesta del servidor", result);
    
    if(!response.ok){
        return{
            ok:false,
            message: result?.message || "Error desconocido en la actualización de la foto" 
        }
    }
    return result;

  }catch (error) {

    console.log(error);
    return{
        ok:false, message: "Error en la conexion con el servidor"
    }

  }
};
