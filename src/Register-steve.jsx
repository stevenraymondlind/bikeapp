import React from "react";
import { useState } from "react";

export function Register() {

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    
    function handleRegisterSubmit(e) {
        e.preventDefault();
    
        setRegisterEmail("");
        setRegisterPassword("");
    
        fetch("http://localhost:3333/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: registerEmail,
            password: registerPassword,
        }),
        credentials: "include", // <--- this sets the cookie
        }) 
         .then((res) => {
            if (res.ok) {
              return res.text();
            } else {
              throw new Error("Registration failed");
            }
          })
          .then((res) => {
            setResponseMessage(res);
          })
          .catch((err) => {
            setResponseMessage(err.message);
          });
    }
    
    return (
        <>
        <div className="register-form">
        <h3>Register</h3>
        <form onSubmit={handleRegisterSubmit}>
            <label htmlFor="email">Email:</label>
            <input
            type="email"
            htmlFor="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <label htmlFor="password">Password:</label>
            <input
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            />
                <input type="submit" value="Submit" />
        </form>
        {responseMessage ? <div>{responseMessage}</div> : null}
        </div>
        </>
    )
}

