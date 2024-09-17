import React from 'react'
import './Navbar.css'
import logo from '../../assets/nba-logo-transparent.png'

const Navbar = () => {
  return (

    <nav className='container'>
     { <img src={logo} alt="" className='logo'/> }
      <ul>
        <li>Home</li>
        <li>Explore</li>
        <li>About</li>
        <li><button className='btn'>Contact Us</button></li>
      </ul>
    </nav>


  )
}

export default Navbar