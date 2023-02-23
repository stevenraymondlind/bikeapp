import React from "react";
import { useState } from "react";
import { ReportDamage } from "./ReportDamage";

export function Return() {
  const [rentalReturn, setRentalReturn] = useState([]);
  const [bikeCode, setBikeCode] = useState("");
  const [locationId, setLocationId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  function handleReturn(e) {
    e.preventDefault();
    fetch(`http://localhost:3333/rentals/${bikeCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => res.json())
      .then((data) => {
        setRentalReturn(data);
        setShowResult(true);
        console.log(rentalReturn);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`http://localhost:3333/taco/${bikeCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ location_id: locationId }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setRentalReturn(data);
        setShowResult(true);
        setShowMessage(true);
      });
  }

  return (
    <>
      <div className="returnBike">
        <h1>Return Bike</h1>
        <form onSubmit={handleReturn} className="return-form">
          <input
            type="text"
            placeholder="Enter bike code"
            value={bikeCode}
            onChange={(e) => setBikeCode(e.target.value)}
          />
          <button type="submit">Submit Bike Code</button>
        </form>
        {showResult && rentalReturn ? (
          <>
            <form onSubmit={handleSubmit}>
              <label htmlFor="locationId">
                Choose Location where you are returning bike:
              </label>
              <select
                id="locationId"
                name="locationId"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              >
                <option value="">Select location</option>
                <option value="1">Hub 1 - Parc du Mount Royal</option>
                <option value="2">Hub 2 - Vieux-Port</option>
                <option value="3">Hub 3 - Parc La Fontaine</option>
                <option value="4">Hub 4 - Berri-UQAM</option>
              </select>
              <button type="submit">Return Bike</button>
            </form>
{showMessage ? (
            <div className="return-message">

            <p>
              Thank you for returning Bike {rentalReturn.bike_id} at Location{" "}
              {rentalReturn.location_id}. 
              {/* You're rental time was {rentalReturn.rental_time} */}
        
            </p>
            <button onClick={() => {window.location.href = "/logout"}}>Logout</button>

            </div>
          ) : null}

          </>
        ) : null}
      </div>
      <div>
        <ReportDamage />
      </div>
    </>
  );
}