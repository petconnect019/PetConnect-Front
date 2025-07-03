import './App.css';
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { routesConfig } from "./routes/routes";
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import { NotificationProvider } from './Contexts/NotificationContext/NotificationContext';
import { NotificationToastProvider } from './Contexts/NotificationContext/NotificationToastContext';
import { AuthProvider } from './Contexts/AuthContext/AuthContext';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './Components/Common/ScrollToTop';

const AppRoutes = () => {
  const element = useRoutes(routesConfig);
  return element;
};

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
          <Router>
            <ScrollToTop />
            <AppRoutes />
          </Router>
        </NotificationProvider>
      </NotificationToastProvider>
    </AuthProvider>
  );
}

export default App;