export const FetchLogout = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    const result = await response.json();
    if (response.ok) {
        return { ok: true, message: result.message };
    } else {
        return { ok: false, message: result.message };
    }   
}