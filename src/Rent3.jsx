import React from "react";
import { useState } from "react";

export function Rent3() {
  const [bikeRented, setBikeRented] = useState([]);
  const [bikeCode, setBikeCode] = useState("");
  const [bikeId, setBikeId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [showResult, setShowResult] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`http://localhost:3333/rentals/${bikeCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bikeCode }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setBikeRented(data);
        setShowResult(true);
      });
  }

  return (
    <>
      <div className="returnBike">
        <h1>Rent Bike</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter bike code here"
            value={bikeCode}
            onChange={(e) => setBikeCode(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        {showResult && bikeRented ? (
          <>
            <p>
              You've checked-out bike # {bikeRented.bike_id} from Location:{" "}
              {bikeRented.location_id}
            </p>
          </>
        ) : null}
      </div>
    </>
  );
}
