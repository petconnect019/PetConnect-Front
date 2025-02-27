import { createContext, useContext, useState } from "react";

const ResetPasswordContext = createContext();

export const ResetPasswordProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    
    const setTokenValue = (value) => {
        setToken(value);
    };
    
    return (
        <ResetPasswordContext.Provider value={{ token, setTokenValue }}>
        {children}
        </ResetPasswordContext.Provider>
    );
}

export const useResetPassword = () => useContext(ResetPasswordContext);