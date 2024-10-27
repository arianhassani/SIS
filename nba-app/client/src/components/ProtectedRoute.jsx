import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children, requiredKeys }) => {
  const isAuthorized = requiredKeys.every((key) => sessionStorage.getItem(key));

  return isAuthorized ? children : <Navigate to='/' />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoute;
