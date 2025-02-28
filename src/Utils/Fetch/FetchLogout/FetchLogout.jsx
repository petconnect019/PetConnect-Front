export const FetchLogout = async () => {
    const response = await fetch("http://localhost:5000/api/auth/logout", {
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