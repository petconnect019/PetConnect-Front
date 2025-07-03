import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './Contexts/AuthContext/AuthContext.jsx'
import { ChatProvider } from './Contexts/ChatContext/ChatContextV2.jsx'
import { ResetPasswordProvider } from './Contexts/ResetPasswordContext/ResetPasswordContext.jsx'
import { HasPetsUserProvider } from './Contexts/HasPetsUser/HasPetsUser.jsx'
import { PetProvider } from './Contexts/PetContext/PetContext.jsx'
import { FetchedPetsProvider } from './Contexts/IsFetchedPets/IsFetchedPets.jsx'
import { PrimeReactProvider } from 'primereact/api';

// Log de verificación de variables de entorno
console.log('Verificando variables de entorno en main.jsx:', {
  EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID
});

const updateSW = registerSW({
  onNeedRefresh: function() {
    if (confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
      updateSW(true);
    }

  }
});

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ChatProvider>
      <ResetPasswordProvider>
        <HasPetsUserProvider>
          <PetProvider>
            <FetchedPetsProvider>
              <PrimeReactProvider>
                <App />
              </PrimeReactProvider>
            </FetchedPetsProvider>
          </PetProvider>
        </HasPetsUserProvider>
      </ResetPasswordProvider>
    </ChatProvider>
  </AuthProvider>
);
