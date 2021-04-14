import React from 'react'

function NavBar() {
    return (
        <div>
            NavBar
            <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>
        </div>
    )
}

export default NavBar