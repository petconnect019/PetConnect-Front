export const FetchUpdatePet = async (petData, token) => {
    try {
      let formData = new FormData();
      formData.append("name", petData.name);
      formData.append("birthDate", petData.birthDate);
      formData.append("breed", petData.breed);
      formData.append("gender", petData.gender);
      formData.append("species", petData.species);
      formData.append("color", petData.color);
      formData.append("_id", petData._id);
      
  
      let response = await fetch(`${import.meta.env.VITE_API_URL}/api/pets/${petData._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include',
        body: formData, 
      });
  
      const result = await response.json();
      console.log("Respuesta del servidor", result);
      
      if (!response.ok) {
        return {
          ok: false,
          message: result.message
        };
      }
      return result;
  
    } catch (error) {
      console.log(error);
      return { ok: false, message: "Error en la conexión con el servidor" };
    }
  };
  