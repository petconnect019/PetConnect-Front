import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './Contexts/AuthContext/AuthContext.jsx'
import { ResetPasswordProvider } from './Contexts/ResetPasswordContext/ResetPasswordContext.jsx'
import { HasPetsUserProvider } from './Contexts/HasPetsUser/HasPetsUser.jsx'
import { PetProvider } from './Contexts/PetContext/PetContext.jsx'
import { FetchedPetsProvider } from './Contexts/IsFetchedPets/IsFetchedPets.jsx'
import { PrimeReactProvider } from 'primereact/api';

const updateSW = registerSW({
  onNeedRefresh: function() {
    if (confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
      updateSW(true);
    }

  }
});

createRoot(document.getElementById('root')).render(
  <AuthProvider>
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
  </AuthProvider>
);
