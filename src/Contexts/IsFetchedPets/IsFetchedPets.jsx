import { createContext, useContext, useState } from "react";

const isFetchedPetsContext = createContext();

export const FetchedPetsProvider = ({children})=> {
    const [isFetchedPets, setIsfetched] = useState(false);

    const changeIsFetched = (bool)=> {
        setIsfetched(bool);
    }

    return(
        <isFetchedPetsContext.Provider value={{isFetchedPets, changeIsFetched}}>
            {children}
        </isFetchedPetsContext.Provider>
    )
}

export const useIsFetchedPets = () => useContext(isFetchedPetsContext);