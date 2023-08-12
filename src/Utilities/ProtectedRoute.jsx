import { useParams, Navigate } from "react-router-dom";
import { useGlobalContext } from "../Context/Context";
import ProfilePage from "../Pages/ProfilePage";

function ProtectedRoute() {
  const { user, isLoading, isAuthenticated } = useGlobalContext();
  const { userID } = useParams();
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  }

  // Check if the user is authenticated and the UID from the route matches the user's UID
  if (isAuthenticated && user.uid === userID) {
    return <ProfilePage />;
  } else {
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
