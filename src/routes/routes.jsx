import { Introduction1 } from "../Pages/Introduccion1/introduction1";
import { Introduction2 } from "../Pages/Introduccion2/introduction2";
import { Login } from "../Pages/Login/Login";
import { Register } from "../Pages/Register/Register";
import { Welcome } from "../Pages/Welcome/Welcome";
import { Home } from "../Pages/Home/Home";
import { NotificationRequest } from "../Pages/NotificationRequest/NotificationRequest";
import { RecoverEmail } from "../Pages/RecoverEmail/RecoverEmail";
import { ChangePassword } from "../Pages/ChangePassword/ChangePassword";
import { StepPet } from "../Pages/StepPet/StepPet";
import { StepUser } from "../Pages/StepUser/StepUser";
import { StepTag } from "../Pages/StepTag/StepTag";
import { Scanner } from "../Pages/Scanner/Scanner";
import { Notifications } from "../Pages/Notifications/Notifications";
import { ScanRecords } from "../Pages/ScanRecords/ScanRecords";
import { MapView } from "../Pages/MapView/MapView";
import { PetDetails } from "../Pages/PetDetails/PetDetails";
import { PetProfile } from "../Pages/PetProfile/PetProfile";
import { PublicPetProfile } from "../Pages/PublicPetProfile/PublicPetProfile";
import { Ecommerce } from "../Pages/Ecommerce/Ecommerce";
import { Messages } from "../Pages/Messages/Messages";
import { Chat } from "../Pages/Chat/Chat";
import { ResetPassword } from "../Pages/ResetPassword/ResetPassword";
import { createBrowserRouter } from "react-router-dom";
import { ProtectRoute } from "../Components/ProtectRoute/ProtectRoute";

export const routes = createBrowserRouter([
  {
    path: '/',
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
    path: '/home',
    element: 
            <ProtectRoute>
              <Home />
            </ProtectRoute>,
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
    path: '/change-password',
    element: <ChangePassword />,
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
    path: '/step-tag',
    element: <StepTag />,
  },
  {
    path: '/scanner',
    element: <Scanner />,
  },
  {
    path: '/notifications',
    element: <Notifications />,
  },
  {
    path: '/scan-records',
    element: <ScanRecords />,
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
    path: '/pet-profile',
    element: <PetProfile />,
  },
  {
    path: '/public-pet-profile',
    element: <PublicPetProfile />,
  },
  {
    path: '/ecommerce',
    element: <Ecommerce />,
  },
  {
    path: '/messages',
    element: <Messages />,
  },
  {
    path: '/chat/:chat_id',
    element: <Chat />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  }
]);