import { Link } from "react-router-dom";
import logo from "../assets/file.png"; // Adjust the path to your logo as needed

const Navbar = () => {
  return (
    <div className="bg-gray-200 shadow-lg rounded-lg mt-4 mx-auto" style={{ maxWidth: '90%', padding: '0 1.5rem' }}>
      <div className="navbar">
        <div className="flex-1">
          {/* Link for the logo and app name */}
          <Link to="/" className="flex items-center text-xl font-bold">
            <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
            YourAppName
          </Link>
        </div>
        <div className="flex-none">
          {/* Navigation menu */}
          <ul className="menu menu-horizontal space-x-4">
            <li>
              <Link to="/" className="btn btn-ghost">
                Team Selection
              </Link>
            </li>
            <li>
              <Link to="/injury" className="btn btn-ghost">
                Injury
              </Link>
            </li>
            <li>
              <Link to="/match-up" className="btn btn-ghost">
                Match-Up
              </Link>
            </li>
            <li>
              <Link to="/prediction" className="btn btn-ghost">
                Prediction
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
