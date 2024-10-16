import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const location = useLocation();

  useEffect(() => {
    // Set active link based on the current path
    const path = location.pathname;
    if (path === "/") {
      setActiveLink("home");
    } else if (path === "/team-selection") {
      setActiveLink("team");
    } else if (path === "/injury") {
      setActiveLink("injury");
    } else if (path === "/match-up") {
      setActiveLink("match-up");
    } else if (path === "/prediction") {
      setActiveLink("prediction");
    }
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
    setIsOpen(false); // Close the menu after clicking a link
  };

  return (
    <header className="p-4 dark:bg-gray-100 dark:text-gray-800">
      <div className="container flex justify-between h-16 mx-auto">
        <a
          rel="noopener noreferrer"
          href="#"
          aria-label="Back to homepage"
          className="flex items-center p-2"
        >
          <img src={logo} alt="Logo" className="w-8 h-8 dark:text-violet-600" />
        </a>
        <ul
          className={`items-stretch hidden space-x-3 md:flex ${
            isOpen ? "active" : ""
          }`}
        >
          <li className="flex">
            <Link
              to="/"
              className={`flex items-center px-4 -mb-1 border-b-2 dark:border- ${
                activeLink === "home"
                  ? "dark:text-violet-600 dark:border-violet-600"
                  : ""
              }`}
              onClick={() => handleLinkClick("home")}
            >
              Home
            </Link>
          </li>
          <li className="flex">
            <Link
              to="/team-selection"
              className={`flex items-center px-4 -mb-1 border-b-2 dark:border- ${
                activeLink === "team"
                  ? "dark:text-violet-600 dark:border-violet-600"
                  : ""
              }`}
              onClick={() => handleLinkClick("team")}
            >
              Team Selection
            </Link>
          </li>
          <li className="flex">
            <Link
              to="/injury"
              className={`flex items-center px-4 -mb-1 border-b-2 dark:border- ${
                activeLink === "injury"
                  ? "dark:text-violet-600 dark:border-violet-600"
                  : ""
              }`}
              onClick={() => handleLinkClick("injury")}
            >
              Injury
            </Link>
          </li>
          <li className="flex">
            <Link
              to="/match-up"
              className={`flex items-center px-4 -mb-1 border-b-2 dark:border- ${
                activeLink === "match-up"
                  ? "dark:text-violet-600 dark:border-violet-600"
                  : ""
              }`}
              onClick={() => handleLinkClick("match-up")}
            >
              Match-Up
            </Link>
          </li>
          <li className="flex">
            <Link
              to="/prediction"
              className={`flex items-center px-4 -mb-1 border-b-2 dark:border- ${
                activeLink === "prediction"
                  ? "dark:text-violet-600 dark:border-violet-600"
                  : ""
              }`}
              onClick={() => handleLinkClick("prediction")}
            >
              Prediction
            </Link>
          </li>
        </ul>
        <button className="flex justify-end p-4 md:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
