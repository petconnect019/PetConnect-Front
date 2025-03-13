export const FetchUpdateUser = async (formDataUser, token)=> {
    try {
        let response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formDataUser
        });
        const result = await response.json();
        

        if (!response.ok) {
            return {
                ok: false,
                message: result.message
            }
        }
        return result;
        

    } catch (error) {
        console.log(error);
        return { ok: false, message: "Error en la conexión con el servidor" };
    }
}
