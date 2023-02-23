import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";


export function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [userId, setUserId] = useState("");

  const [isNavigate, setIsNavigate] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    if (isNavigate) {
      navigate("/reserve");
      setIsNavigate(false);
    }
  }, [isNavigate, navigate]);

  function handleLoginSubmit(e) {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      return;
    }

    fetch("http://localhost:3333/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
      credentials: "include", // <--- this sets the cookie
    })
      .then((res) => {
        if (res.ok) {

          setUserId(res);
          localStorage.setItem("data", userId);
          console.log(userId, "response");
          setIsNavigate(true);
        } else {
          throw new Error("Login failed");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="login">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <Link to="/register" className="link-btn">
        DON'T HAVE AN ACCOUNT REGISTER HERE!
        </Link>
    </div>
    
  );
}
