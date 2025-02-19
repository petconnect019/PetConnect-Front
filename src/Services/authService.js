const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const result = await response.json();

    return response.ok
      ? { success: true, ...result }
      : { success: false, message: result.message || "Error en la operación" };
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return { success: false, message: "Error en la conexión" };
  }
};

// Registro Manual
export const registerUser = (data) =>
  fetchData("http://localhost:5000/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Registro por Google
export const signInWithGoogle = (navigate, toast) => {
  try {
    const popup = window.open(
      "http://localhost:5000/api/auth/google",
      "Google Login",
      "width=500,height=600,left=300,top=200"
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      throw new Error("Popup bloqueado");
    }

    const messageListener = (event) => {
      if (event.origin !== "http://localhost:5000" || !event.data) return;

      window.removeEventListener("message", messageListener);
      const { error, token } = event.data;

      if (error) {
        toast.warn("Este correo no está registrado. Por favor, regístrate.");
        navigate("/register");
      } else if (token) {
        localStorage.setItem("auth_token", token);
        navigate("/welcome");
        setTimeout(() => popup?.close(), 500);
      }
    };

    window.addEventListener("message", messageListener);
  } catch (error) {
    console.error("Error al abrir popup:", error);
    window.location.href = "http://localhost:5000/api/auth/google";
  }
};
