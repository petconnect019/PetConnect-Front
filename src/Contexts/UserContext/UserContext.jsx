import { createContext, useContext, useEffect, useState } from "react";

const userContext = createContext();

export const userProvider = ({ children }) => {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {

  }, [])
}