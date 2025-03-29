import { createContext, useContext, useState } from "react";

const isFetchedUsersContext = createContext();

export const FetchedUsersProvider = ({ children }) => {

  const [isFetchedUsers, setIsFetchedUser] = useState(false)
  
  const changeIsFetched = (bool) => {
    setIsFetchedUser(bool)
  }

  return(
    <isFetchedUsersContext.Provider value={{isFetchedUsers ,changeIsFetched}}>
      {children}
    </isFetchedUsersContext.Provider>

  )
}

export const useIsFetchedUsers = () => useContext(isFetchedUsersContext)
