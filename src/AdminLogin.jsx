import React, {useState} from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";


export function AdminLogin() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;

    if (password === "bixi") {
      navigate("/admin");
      console.log("Logged in as admin");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <>
    <div className="admin-login">
        <p>Login to access the admin page.</p>
      <form onSubmit={handleLoginSubmit} className="login-form">
        <label>
          Admin Password:
          <input type="password" name="password" />
        </label>
        <button type="submit">Log in</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
    </>
  );
}