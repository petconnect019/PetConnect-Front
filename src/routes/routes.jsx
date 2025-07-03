import { createBrowserRouter } from "react-router-dom";
import { ProtectRoute } from "../Components/ProtectRoute/ProtectRoute";
import { MainLayout } from "../Components/MainLayout/MainLayout";

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
import { QRScanLanding } from "../Pages/QRScanLanding/QRScanLanding";
import { Ecommerce } from "../Pages/Ecommerce/Ecommerce";
import { Messages } from "../Pages/Messages/Messages";
import { ChatV2 as Chat } from "../Pages/Chat/ChatV2";
import { Settings } from "../Pages/Settings/Settings";
import { UserProfileConfig } from "../Pages/UserProfileConfig/UserProfileConfig";
import { MyPets } from "../Pages/MyPets/MyPets";
import { SplashScreen } from "../Pages/SplashScreen/SplashScreen";
import { NewPet1 } from "../Pages/NewPet1/NewPet1";
import { CheckProtection } from "../Pages/CheckProtection/CheckProtection";
import { PaymentShop } from "../Pages/Ecommerce/PaymentShop";
import { ChangePassword } from "../Pages/ChangePassword/ChangePassword";
import {ScanQR} from '../Pages/ScanQR/ScanQR'
import { PublicUserProfile } from "../Pages/PublicUserProfile/PublicUserProfile";
import { HealthManagement } from '../Pages/HealthManagement/HealthManagement';
import { TermsAndConditions } from "../Pages/TermsAndConditions/TermsAndConditions";
import { Support } from "../Pages/Support/Support";
import { VerifyEmail } from '../Pages/VerifyEmail/VerifyEmail';
import { PendingVerification } from '../Pages/PendingVerification/PendingVerification';
import NearbyServices from '../Pages/NearbyServices/NearbyServices';

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

  // --- Rutas Protegidas que SÍ usan el MainLayout ---
  {
    element: (
      <ProtectRoute>
        <MainLayout />
      </ProtectRoute>
    ),
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/step-pet',
        element: <StepPet />,
      },
      {
        path: '/step-user',
        element: <StepUser />,
      },
      {
        path: '/step-tag/:pet_id',
        element: <StepTag />,
      },
      {
        path: '/scanner/:pet_id',
        element: <Scanner />,
      },
      {
        path: '/notifications',
        element: <Notifications />,
      },
      {
        path: '/map-view',
        element: <MapView />,
      },
      {
        path: '/pet-details/:pet_id',
        element: <PetDetails />,
      },
      {
        path: '/pet-profile/:pet_id',
        element: <PetProfile />,
      },
      {
        path: '/my-pets',
        element: <MyPets />,
      },
      {
        path: '/new_pet_1',
        element: <NewPet1 />,
      },
      {
        path: '/user-profile-config/:user_id',
        element: <UserProfileConfig />,
      },
      {
        path: '/ecommerce',
        element: <Ecommerce />,
      },
      {
        path: '/check-protection',
        element: <CheckProtection />,
      },
      {
        path: '/messages',
        element: <Messages />,
      },
      {
        path: '/chat',
        element: <Chat />,
      },
      {
        path: '/chat/:chat_id',
        element: <Chat />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
      {
        path: "/payment/shop",
        element: <PaymentShop />,
      },
      {
        path: '/change-password',
        element: <ChangePassword />,
      },
      {
        path: '/scan-qr',
        element: <ScanQR />,
      },
      {
        path: "/health-management",
        element: <HealthManagement />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "/support",
        element: <Support />,
      },
      {
        path: "/verify-email/:token",
        element: <VerifyEmail />,
      },
      {
        path: "/pending-verification",
        element: <PendingVerification />,
      },
      {
        path: '/nearby-services',
        element: <NearbyServices />,
      },
    ]
  }
]);
