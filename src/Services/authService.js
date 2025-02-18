//Registro Manual
export const registerUser = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        return { success: false, message: result.message || "Error en el registro" };
      }
      return { success: true, message: result.message, userId: result.userId };
    } catch (error) {
      console.error("Error en registerUser:", error);
      return { success: false, message: "Error en el registro" };
    }
  };
  

  // Registro por Google
  export const signInWithGoogle = (navigate, toast) => {
    try {
      const popup = window.open(
        'http://localhost:5000/api/auth/google',
        'Google Login',
        'width=500,height=600,left=300,top=200'
      );
  
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        throw new Error('Popup bloqueado');
      }
  
      const messageListener = (event) => {
        if (event.origin !== 'http://localhost:5000' || !event.data) return;
  
        window.removeEventListener('message', messageListener);
  
        if (event.data.error) {
          toast.warn('Este correo no está registrado. Por favor, regístrate.');
          navigate('/register');
        } else if (event.data.token) {
          localStorage.setItem('auth_token', event.data.token);
          navigate('/welcome');
  
       
          setTimeout(() => {
            if (popup && !popup.closed) {
              popup.close();
            }
          }, 500); 
        }
      };
  
      window.addEventListener('message', messageListener);
    } catch (error) {
      console.error('Error al abrir popup:', error);
      window.location.href = 'http://localhost:5000/api/auth/google';
    }
  };
  