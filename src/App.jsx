import './App.css';
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css'; 
import { NotificationProvider } from './Contexts/NotificationContext/NotificationContext';
import { NotificationToastProvider } from './Contexts/NotificationContext/NotificationToastContext';
import { AuthProvider } from './Contexts/AuthContext/AuthContext';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <NotificationToastProvider>
        <NotificationProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <RouterProvider router={routes} />
        </NotificationProvider>
      </NotificationToastProvider>
    </AuthProvider>
  );
}

export default App;