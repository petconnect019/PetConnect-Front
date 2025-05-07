import { createContext, useContext, useState, useEffect } from "react";

const UserIdContext = createContext();

export const UserIdProvider = ({ children }) => {
    const [userId, setUserId] = useState(() => {
        return sessionStorage.getItem("userId") || null;
    });

    useEffect(() => {
        // Actualizar el estado cuando cambie el userId en sessionStorage
        const storedUserId = sessionStorage.getItem("userId");
        if (storedUserId !== userId) {
            setUserId(storedUserId);
        }
    }, []);

    const setUserIdValue = (id) => {
        if (id) {
            sessionStorage.setItem("userId", id);
            setUserId(id);
        }
    };

    const clearUserId = () => {
        sessionStorage.removeItem("userId");
        setUserId(null);
    };

    return (
        <UserIdContext.Provider value={{ userId, setUserIdValue, clearUserId }}>
            {children}
        </UserIdContext.Provider>
    );
};

export const useUserId = () => {
    const context = useContext(UserIdContext);
    if (!context) {
        throw new Error("useUserId debe ser usado dentro de un UserIdProvider");
    }
    return context;
}; 