import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import Logout from "./Logout";

export function Navbar() {
  const auth = localStorage.getItem("email");
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <a href="/" className="site-title">
        BIKES
      </a>

      {auth ? (
                <ul>
                <li>
                  <Link to="/reserve">Reserve</Link>
                </li>
                <li>
                    <Link to="/rent3">Rent</Link>
                </li>
                <li>
                    <Link to="/return">Return</Link>
                </li>
                <li>
                  <Link onClick={logout} to="/login">
                    Logout!
                  </Link>
                </li>
              </ul>
      ) : (
         <ul>
                <li>
                  <Link to="/register">Join Now!</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/rent3">Rent</Link>
                </li>
                <li>
                    <Link to="/return">Return</Link>
                </li>
                <li>
                    <Link to="/adminLogin">Admin</Link>
                </li>
                </ul>
      )}
    </nav>
  );
}
