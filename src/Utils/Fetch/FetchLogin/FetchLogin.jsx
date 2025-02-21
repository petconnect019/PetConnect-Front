export const fetchLogin = async (userData)=>{
    console.log(userData);
    
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
          credentials: 'include',
        });
  
        const result = await response.json();
  
        if (response.ok) {
          return {ok: true, token: result.token};
          
        } else {
          return {ok: false, message: result.message};
        }
      } catch (error) {
        return {ok: false, message: 'Error en la conexión con el servidor'};
      }
}