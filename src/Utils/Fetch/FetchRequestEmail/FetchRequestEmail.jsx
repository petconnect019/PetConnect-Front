export const FetchRequestEmail = async (userEmail)=> {
    const response = await fetch('http://localhost:5000/api/auth/request-password-reset', {
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