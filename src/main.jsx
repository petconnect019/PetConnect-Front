import { registerSW } from 'virtual:pwa-register'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './Contexts/AuthContext/AuthContext.jsx'
import { ResetPasswordProvider } from './Contexts/ResetPasswordContext/ResetPasswordContext.jsx'

const updateSW = registerSW({
  onNeedRefresh: function() {
    if (confirm('Hay una nueva versión disponible. ¿Deseas actualizar?')) {
      updateSW(true);
    }

  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ResetPasswordProvider>
        <App />
      </ResetPasswordProvider>
    </AuthProvider>
  </StrictMode>
);
