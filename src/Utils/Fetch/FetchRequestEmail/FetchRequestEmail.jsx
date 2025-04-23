export const FetchRequestEmail = async (userEmail)=> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/request-password-reset`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail }),
        credentials: 'include'
    })
    const result = await response.json();
    if (response.ok) {
        return { ok: true, message: result.message };
    } else {
        return { ok: false, message: result.message };
    }
}