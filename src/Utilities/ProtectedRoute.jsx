import { useParams, Navigate } from "react-router-dom";
import { useGlobalContext } from "../Context/Context";
import ProfilePage from "../Pages/ProfilePage";
import Spinner from "../Components/Spinner/Spinner";

function ProtectedRoute() {
  const { user, isLoading, isAuthenticated } = useGlobalContext();
  // const { userID } = useParams();
  const { userID, tab } = useParams();

  if (isLoading) {
    return <Spinner />;
  }

  // Check if the user is authenticated and the UID from the route matches the user's UID
  if (isAuthenticated && user.emailVerified && user.uid === userID) {
    // return <ProfilePage  />;
    return <ProfilePage activeTab={tab} />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
