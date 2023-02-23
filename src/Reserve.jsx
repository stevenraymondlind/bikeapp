import React, { useState, useEffect } from "react";
import { GoogleMap } from "./Map";
import { useLocation } from "react-router-dom";

export function Reserve() {
  const [locations, setLocations] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [selectedHubLocation, setSelectedHubLocation] = useState("");
  const [selectedBike, setSelectedBike] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [reservations, setReservations] = useState(null);
  const [searchedUserId, setSearchedUserId] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  // const location = useLocation();
  // const data = new URLSearchParams(location.search).get("data")

  useEffect(() => {
    const storedData = localStorage.getItem("message:");
    const storedId = localStorage.getItem("ID:");
    if (storedData) {
      setLoginMessage(storedData);
      setSearchedUserId(storedId);
    }
  }, []);

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

  function handleFindLocations(e) {
    setSelectedHubLocation(e.target.value);

    fetch(`http://localhost:3333/bikes2/${e.target.value}`)
      .then((response) => response.json())
      .then((data) => {
        setBikes(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleFindBikes(e) {
    setSelectedBike(e.target.value);
  }

  // function generates a bike_code

  function generateBikeCode() {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  async function handleSaveRental() {
    const result = await fetch(
      `http://localhost:3333/users2/${searchedUserId}`
    ).then((response) => response.json());

    if (result.length === 0) {
      setMessage("User not found. Please try again.");
      return false;
    }

    const bikeCode = generateBikeCode();

    const data = {
      user_id: searchedUserId,
      location_id: selectedHubLocation,
      bike_id: selectedBike,
      bike_code: bikeCode,
    };
    setLoading(true);

    fetch("http://localhost:3333/rentals3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setReservations(data);
        setShowResult(true);
        setLoading(false);
        setMessage("Bike reserved!!!!");
        setTimeout(() => {
          setMessage("");
        }, 20000); // 20 seconds
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        setMessage("Error saving reservation.");
      });
  }

  return (
    <>
      <div>
        <h3>{loginMessage}</h3>
        {/* <input
          type="text"
          placeholder="Enter User Id"
          value={searchedUserId}
          onChange={(e) => setSearchedUserId(e.target.value)}
        /> */}
      </div>
      <div>
        <select onChange={handleFindLocations} value={selectedHubLocation}>
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
      <div>
        <h3>Choose your Bike</h3>
        <select onChange={handleFindBikes}>
          <option key="-1" value="-1" />
          {bikes.map((bike, index) => (
            <option key={index} value={bike.id}>
              {bike.name}
            </option>
          ))}
        </select>
      </div>

      {/* changed button to Reserve */}

      <button className="buttonSave" onClick={handleSaveRental}>
        Reserve this Bike
      </button>
      <div>
        {showResult && reservations ? (
          <div className="reserve-message">
            Thank you for reserving Bike {reservations.bike_id}. Please pick it
            up at Location {reservations.location_id}. You have 3 hours from{" "}
            {new Date(reservations.start_time).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}{" "}
            to pick up your rental or else it will be cancelled.
            <br />
            <br /> Your rental code is:{" "}
            <strong>{reservations.bike_code}</strong>
            <br />
            <br />
            <button onClick={() => {window.location.href = "/rent3"}}>Go to rent bike</button>
          </div>
        ) : null}
      </div>

      {/* <div className="message-rented">
          {loading && <h4>Loading...</h4>}
          {message && <h4>{message}</h4>}
      </div> */}
      <div>
        <GoogleMap />
      </div>
    </>
  );
}
