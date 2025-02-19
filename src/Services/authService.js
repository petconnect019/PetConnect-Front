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
