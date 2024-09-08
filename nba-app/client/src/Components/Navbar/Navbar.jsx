import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <div className="nav-logo">NBA Analysis</div>
              <Link to="/" onClick={toggleMenu}>Home</Link>
              <Link to="/TeamSelection" onClick={toggleMenu}>Team Selection</Link>
              <Link to="/Injury" onClick={toggleMenu}>Injury</Link>
              
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </nav>

  )
}

export default Navbar