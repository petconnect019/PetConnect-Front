import { createContext, useContext, useState } from "react";

const HasPetsUserContext = createContext(false);

export const HasPetsUserProvider = ({ children }) => {
    const [hasPetsUser, setHasPetsUser] = useState(false);

    const changeHasPetsUser = (hasPetsUser) => {
        setHasPetsUser(hasPetsUser);
    };

    return (
        <HasPetsUserContext.Provider value={{ hasPetsUser, changeHasPetsUser }}>
            {children}
        </HasPetsUserContext.Provider>
    );
}

export const useHasPetsUser = () => useContext(HasPetsUserContext);