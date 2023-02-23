import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const [isNavigate, setIsNavigate] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      setShowModal(true);

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
        setLoginEmail(""); // clear the email and password fields
        setLoginPassword("");
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        const responseMessage = data.message;
        console.log(responseMessage, "response");
        localStorage.setItem("ID:", data.id);
        localStorage.setItem("message:", data.message);
        const url = `http://127.0.0.1:5173/reserve?data=${responseMessage}`;
        window.location.href = url;
        setIsNavigate(true);
      })
      .catch((err) => {
        setResponseMessage(err.message);
      });
  } //     }) //     .then((res) => { //       setResponseMessage("Loged in"); //     }) //     .catch((err) => { //       setResponseMessage(err.message); //     }); // }
  return (
    <>
      <div className="auth-form">
        <h1>Login</h1>

        <form onSubmit={handleLoginSubmit} className="user-form">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            htmlFor="email"
            name="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <button type="submit" value="Submit">
            SUBMIT
          </button>
        </form>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>All fields are required!</p>

              <button onClick={() => setShowModal(false)} className="modal-btn">
                Ok
              </button>
            </div>
          </div>
        )}
        {responseMessage ? <div>{responseMessage}</div> : null}
        <Link to="/register" className="link-btn">
          DON'T HAVE AN ACCOUNT REGISTER HERE!
        </Link>
      </div>
    </>
  );
}
