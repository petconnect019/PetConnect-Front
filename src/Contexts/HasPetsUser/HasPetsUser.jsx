import { createContext, useContext, useEffect, useState } from "react";

const HasPetsUserContext = createContext(false);

export const HasPetsUserProvider = ({ children }) => {
    const [hasPetsUser, setHasPetsUser] = useState(false);

    useEffect(() => {
        const hasPets = sessionStorage.getItem("hasPets");
        if (hasPets) {
            setHasPetsUser(true);
        }
    }, []);

    const changeHasPetsUser = (bool) => {
        setHasPetsUser(bool);
        sessionStorage.setItem("hasPets", bool);
    };

    return (
        <HasPetsUserContext.Provider value={{ hasPetsUser, changeHasPetsUser }}>
            {children}
        </HasPetsUserContext.Provider>
    );
}

export const useHasPetsUser = () => useContext(HasPetsUserContext);