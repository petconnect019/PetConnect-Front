import { createBrowserRouter } from "react-router-dom";
import { ProtectRoute } from "../Components/ProtectRoute/ProtectRoute";

import { Introduction1 } from "../Pages/Introduccion1/Introduction1";
import { Introduction2 } from "../Pages/Introduccion2/Introduction2";
import { Welcome } from "../Pages/Welcome/Welcome";
import { Login } from "../Pages/Login/Login";
import { Register } from "../Pages/Register/Register";
import { NotificationRequest } from "../Pages/NotificationRequest/NotificationRequest";
import { RecoverEmail } from "../Pages/RecoverEmail/RecoverEmail";
import { RestorePassword } from "../Pages/RestorePassword/RestorePassword";
import { ResetPassword } from "../Pages/ResetPassword/ResetPassword";

import { Home } from "../Pages/Home/Home";
import { StepPet } from "../Pages/StepPet/StepPet";
import { StepUser } from "../Pages/StepUser/StepUser";
import { StepTag } from "../Pages/StepTag/StepTag";
import { Scanner } from "../Pages/Scanner/Scanner";
import { Notifications } from "../Pages/Notifications/Notifications";
import { MapView } from "../Pages/MapView/MapView";
import { PetDetails } from "../Pages/PetDetails/PetDetails";
import { PetProfile } from "../Pages/PetProfile/PetProfile";
import { PublicPetProfile } from "../Pages/PublicPetProfile/PublicPetProfile";
import { PublicUserProfile } from "../Pages/PublicUserProfile/PublicUserProfile";
import { QRScanLanding } from "../Pages/QRScanLanding/QRScanLanding";
import { Ecommerce } from "../Pages/Ecommerce/Ecommerce";
import { Messages } from "../Pages/Messages/Messages";
import { Chat } from "../Pages/Chat/Chat";
import { Settings } from "../Pages/Settings/Settings";
import { UserProfileConfig } from "../Pages/UserProfileConfig/UserProfileConfig";
import { MyPets } from "../Pages/MyPets/MyPets";
import { SplashScreen } from "../Pages/SplashScreen/SplashScreen";
import { NewPet1 } from "../Pages/NewPet1/NewPet1";
import { CheckProtection } from "../Pages/CheckProtection/CheckProtection";
import { PaymentShop } from "../Pages/Ecommerce/PaymentShop";
import { ChangePassword } from "../Pages/ChangePassword/ChangePassword";
import {ScanQR} from '../Pages/ScanQR/ScanQR'

export const routes = createBrowserRouter([
  // 🔓 Rutas públicas (No requieren autenticación)
  {
    path: '/',
    element: <SplashScreen />,
  },
  {
    path: '/introduction1',
    element: <Introduction1 />,
  },
  {
    path: '/introduction2',
    element: <Introduction2 />,
  },
  {
    path: '/welcome',
    element: <Welcome />, 
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/notification-request',
    element: <NotificationRequest />,
  },
  {
    path: '/recover-email',
    element: <RecoverEmail />,
  },
  {
    path: '/restore-password',
    element: <RestorePassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/public-pet-profile/:pet_id',
    element: <PublicPetProfile />,
  },
  {
    path: '/qr-landing/:qrId',
    element: <QRScanLanding />,
  },
  {
    path: '/user-profile/:user_id',
    element: <PublicUserProfile />,
  },
]);