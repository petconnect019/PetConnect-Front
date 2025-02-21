export const fetchRegister = async (userData)=>{
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
          credentials: 'include',
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert('Registro exitoso');
          navigate('/welcome');
        } else {
          alert(`Error: ${result.message || 'No se pudo registrar'}`);
        }
      } catch (error) {
        alert('Error en la conexión con el servidor');
      }
}