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
import { Ecommerce } from "../Pages/Ecommerce/Ecommerce";
import { Messages } from "../Pages/Messages/Messages";
import { Settings } from "../Pages/Settings/Settings";
import { UserProfileConfig } from "../Pages/UserProfileConfig/UserProfileConfig";
import { MyPets } from "../Pages/MyPets/MyPets";
import { SplashScreen } from "../Pages/SplashScreen/SplashScreen";
import { NewPet1 } from "../Pages/NewPet1/NewPet1";
import { CheckProtection } from "../Pages/CheckProtection/CheckProtection";
import { PaymentShop } from "../Pages/Ecommerce/PaymentShop";
import { ChangePassword } from "../Pages/ChangePassword/ChangePassword";
import { ScanQR } from "../Pages/ScanQR/ScanQR";

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

  // 🔒 Rutas protegidas (Requieren autenticación)
  {
    path: '/home',
    element: <ProtectRoute><Home /></ProtectRoute>,
  },
  {
    path: '/step-pet',
    element: <ProtectRoute><StepPet /></ProtectRoute>,
  },
  {
    path: '/step-user',
    element: <ProtectRoute><StepUser /></ProtectRoute>,
  },
  {
    path: '/step-tag/:pet_id',
    element: <ProtectRoute><StepTag /></ProtectRoute>,
  },
  {
    path: '/scanner/:pet_id',
    element: <ProtectRoute><Scanner /></ProtectRoute>,
  },
  {
    path: '/notifications',
    element: <ProtectRoute><Notifications /></ProtectRoute>,
  },
  {
    path: '/map-view',
    element: <ProtectRoute><MapView /></ProtectRoute>,
  },
  {
    path: '/pet-details/:pet_id',
    element: <ProtectRoute><PetDetails /></ProtectRoute>,
  },
  {
    path: '/pet-profile/:pet_id',
    element: <ProtectRoute><PetProfile /></ProtectRoute>,
  },
  {
    path: '/my-pets',
    element: <ProtectRoute><MyPets /></ProtectRoute>,
  },
  {
    path: '/new_pet_1',
    element: <ProtectRoute><NewPet1 /></ProtectRoute>,
  },
  {
    path: '/user-profile-config/:user_id',
    element: <ProtectRoute><UserProfileConfig /></ProtectRoute>,
  },
  {
    path: '/ecommerce',
    element: <ProtectRoute><Ecommerce /></ProtectRoute>,
  },
  {
    path: '/check-protection',
    element: <ProtectRoute><CheckProtection /></ProtectRoute>,
  },
  {
    path: '/messages',
    element: <ProtectRoute><MessagesPreview /></ProtectRoute>,
  },
  {
    path: '/messages/:chat_id',
    element: <ProtectRoute><Messages /></ProtectRoute>,
  },
  {
    path: '/settings',
    element: <ProtectRoute><Settings /></ProtectRoute>,
  },
  {
    path: "/payment/shop",
    element: <ProtectRoute><PaymentShop /></ProtectRoute>
  },
  {
    path: '/change-password',
    element: <ProtectRoute><ChangePassword /></ProtectRoute>,
  },
  {
    path: '/scan-qr',
    element: <ProtectRoute><ScanQR /></ProtectRoute>,
  },
]);
