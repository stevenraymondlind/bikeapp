import React from "react";
import { useState, useEffect } from "react";
import { ReportDamage } from "./ReportDamage";

export function Return() {
  const [rentalReturn, setRentalReturn] = useState([]);
  const [bikeCode, setBikeCode] = useState("");
  const [locationId, setLocationId] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [locations, setLocations] = useState([]);
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    handleSearchLocations();
  }, []);

  function handleSearchLocations() {
    fetch("http://localhost:3333/locations")
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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
    fetch(`http://localhost:3333/return/${bikeCode}`, {
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

  function handleFindLocations(e) {
    setLocationId(e.target.value);

    fetch(`http://localhost:3333/bikes2/${e.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        setBikes(data);
      })
      .catch((error) => {
        console.error(error);
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
            required
          />
          <button type="submit">Submit Bike Code</button>
        </form>
        {showResult && rentalReturn ? (
          <>
            <form onSubmit={handleSubmit}>
              <label htmlFor="locationId">
                Choose Location where you are returning bike:
              </label>
              <div>
              <select
                id="locationId"
                name="locationId"
                value={locationId}
                onChange={handleFindLocations}
                required >
          
          <option value="" disabled selected hidden>
            Select a location hub
          </option>
          <option key="-1" value="-1" />
          {locations.map((location, index) => (
            <option key={index} value={location.id}>
              {location.hub_location}
            </option>
          ))}
        </select>
          </div>
              {/* <select
                id="locationId"
                name="locationId"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
              >
                <option value="">Select location</option>
                <option value="1">Hub 1 - Parc du Mount Royal</option>
                <option value="2">Hub 2 - Vieux-Port</option>
                <option value="3">Hub 3 - Parc La Fontaine</option>
                <option value="4">Hub 4 - Berri-UQAM</option>
              </select> */}
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