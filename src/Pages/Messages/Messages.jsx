import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Messages = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        // Redirigir a la página de chat
        navigate('/chat');
    }, [navigate]);
    
    return null; // No renderizamos nada mientras se redirige
}