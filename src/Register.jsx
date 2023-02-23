import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Register() {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(input);

    if (
      !input.firstname ||
      !input.lastname ||
      !input.email ||
      !input.password ||
      !input.confirmPassword
    ) {
      setShowModal1(true);

      return;
    }

    if (input.password !== input.confirmPassword) {
      setShowModal2(true);

      return;
    }

    try {
      const response = await fetch("http://localhost:3333/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error("request failed");
    }

    setShowModal(true);
  };

  return (
    <div className="auth-form">
            <h1>CREATE AN ACCOUNT!</h1>
            
      <form onSubmit={handleSubmit} className="user-form">
                <label htmlFor="firstname">First Name:</label>
                
        <input
          value={input.firstname}
          onChange={handleChange}
          type="text"
          name="firstname"
          id="firstname"
          placeholder="First Name"
        />
                <label htmlFor="lastname">Last Name:</label>
                
        <input
          value={input.lastname}
          onChange={handleChange}
          type="text"
          name="lastname"
          id="lastname"
          placeholder="Last Name"
        />
                <label htmlFor="email">Email:</label>
                
        <input
          value={input.email}
          onChange={handleChange}
          type="email"
          name="email"
          id="email"
          placeholder="email@here.com"
        />
                <label htmlFor="password">Password:</label>
                
        <input
          value={input.password}
          onChange={handleChange}
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
                <label htmlFor="confirmpassowrd">Confirm Password</label>
                
        <input
          value={input.confirmPassword}
          onChange={handleChange}
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm Password"
        />
                <button type="submit">SUBMIT</button>
              
      </form>
            
      {showModal && (
        <div className="modal">
                    
          <div className="modal-content">
                        <p>You have been sucessfully registered!</p>
                        
            <Link
              to="/login"
              onClick={() => setShowModal(false)}
              className="modal-btn"
            >
                            Got to Login!             
            </Link>
                      
          </div>
                  
        </div>
      )}
            
      {showModal1 && (
        <div className="modal">
                    
          <div className="modal-content">
                        <p>All fields are required!</p>
                        
            <button onClick={() => setShowModal1(false)} className="modal-btn">
                            Ok             
            </button>
                      
          </div>
                  
        </div>
      )}
            
      {showModal2 && (
        <div className="modal">
                    
          <div className="modal-content">
                        <p>Passwords don't match!</p>
                        
            <button onClick={() => setShowModal2(false)} className="modal-btn">
                            Ok             
            </button>
                      
          </div>
                  
        </div>
      )}
            
      <Link to="/login" className="link-btn">
                ALREADY HAVE AN ACCOUNT? LOGIN HERE       
      </Link>
          
    </div>
  );
}
