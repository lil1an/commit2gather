import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import '../css/nav-bar.css'
import { useState, useEffect } from 'react'

// Icon Imports
import { FiLogIn } from 'react-icons/fi'
import { IoIosNotifications } from 'react-icons/io'
import { IoPersonAdd } from 'react-icons/io5'
import { FaPen } from 'react-icons/fa'
import { IoPeople } from 'react-icons/io5'
import { HiDocument } from 'react-icons/hi2'

function NavBar() {
  // Login Status
  const [isLoggedIn, setIsLoggedIn] = useState(true) // change manually here

  // To Do Later: Write login authenticator logic (manually change for now in the above line)

  // Notification Panel Toggle (Bell Icon)
  const [isNotifsOpen, setIsNotifsOpen] = useState(false)

  // Function for toggling notifications
  const toggleNotifs = () => {
    setIsNotifsOpen((prev) => !prev) // Flipping state
  }

  return (
    <div id="nav">
      {isLoggedIn ? (
        <>
          <Link to="/home">
            <img src={logo} alt="logo" id="logo" />
          </Link>
          <div id="login-options">
            <Link to="/edit" class="user-button">
              <FaPen class="icon2" />
              Create
            </Link>

            <Link to="/meetings" class="user-button">
              <IoPeople class="icon2" />
              Meetings
            </Link>

            <Link to="/documents" class="user-button">
              <HiDocument class="icon2" />
              Documents
            </Link>

            <IoIosNotifications id="bell-icon" onClick={toggleNotifs} />

            <Link to="/" class="nav-button">
              <FiLogIn className="icon1" />
              Logout
            </Link>

            {/* Notification Panel Popup Test with List*/}
            {isNotifsOpen && (
              <div id="notifs-panel">
                <button id="close-notifs" onClick={toggleNotifs}> &times; </button>
                <ul>
                  <li> Professor Vyhibal’s Office Hours: A document was attached. </li>
                  <li> Professor Vyhibal’s Office Hours: Meeting was modified. </li>
                  <li> Professor Vyhibal’s Office Hours: You were invited. </li>
                  <li> Welcome to Commit2Gather! </li>
                </ul>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <img src={logo} alt="logo" id="logo" />
          <div id="logout-options">
            <Link to="/login" class="nav-button">
              <FiLogIn className="icon1" />
              Login
            </Link>

            <Link to="/registration" class="nav-button">
              <IoPersonAdd className="icon1" />
              Register
            </Link>
          </div>
        </>
      )}

    </div>
  )
}

export default NavBar