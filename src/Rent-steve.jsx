import React from "react";
import { useState } from "react";


export function Rent() {
  const [user_id, setUser_id] = useState("");
  const [location_id, setLocation_id] = useState("");
  const [bike_id, setBike_id] = useState("");

  function handleRentSubmit(e) {
    e.preventDefault();

    setUser_id("");
    setLocation_id("");
    setBike_id("");

    fetch("http://localhost:3333/rentals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        location_id: location_id,
        bike_id: bike_id,
      }),
      credentials: "include", // <--- this sets the cookie
    });
  }

 


  return (
    <>
      <div className="rent">
        <h3>Rent</h3>
        <form onSubmit={handleRentSubmit}>
          <label htmlFor="user_id">User ID:</label>
          <input
            type="user_id"
            htmlFor="user_id"
            value={user_id}
            onChange={(e) => setUser_id(e.target.value)}
          />
          <label htmlFor="location_id">Location ID:</label>
          <input
            type="location_id"
            value={location_id}
            onChange={(e) => setLocation_id(e.target.value)}
          />
          <label htmlFor="bike_id">Bike ID:</label>
          <input
            type="bike_id"
            value={bike_id}
            onChange={(e) => setBike_id(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
}
