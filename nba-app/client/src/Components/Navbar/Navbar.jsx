import React, { useState } from 'react';
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
              <a href="#home">Home</a>
              <a href="#explore">Explore</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
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