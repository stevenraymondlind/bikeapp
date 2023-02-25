import React, { useState, useEffect } from "react";
import "./Admin.css";

export function Admin() {
  const [locations, setLocations] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedHubLocation, setSelectedHubLocation] = useState("");

  // State variables to control the visibility of each table
  const [showBikesTable, setShowBikesTable] = useState(false);
  const [showUsersTable, setShowUsersTable] = useState(false);
  const [showRentalsTable, setShowRentalsTable] = useState(false);
  const [showLocationsTable, setShowLocationsTable] = useState(false);

  // Other state variables for search and filtering data
  const [search, setSearch] = useState("");
  const filteredBikes = bikes.filter((bike) =>
    bike.id.toString().includes(search)
  );
  const [searchUsers, setSearchUsers] = useState("");
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchUsers.toLowerCase())
  );
  const [searchTerm, setSearchTerm] = useState("");
  const filteredRentals = rentals.filter((rental) => {
    if (rental.user_id) {
      return rental.user_id.toString().includes(searchTerm);
    }
    return false;
  });
  const [searchLocations, setSearchLocations] = useState("");
  const filteredLocations = locations.filter((location) =>
    location.hub_location.toLowerCase().includes(searchLocations.toLowerCase())
  );

  const handleAddLocation = async (e) => {
    e.preventDefault();
    const hub_location = document.getElementById("addLocationInput").value;

    if (!hub_location) {
      alert("Input cannot be empty");
      return;
    }

    const data = {
      hub_location: hub_location,
    };

    try {
      const response = await fetch("http://localhost:3333/locationsHub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseJson = await response.json();
      console.log(responseJson);
      adminLocations();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddBike = async (e) => {
    e.preventDefault();

    const bike_name = document.getElementById("addBikeInput").value;

    if (!bike_name) {
      alert("Input cannot be empty");
      return;
    }

    const data = {
      name: bike_name,
    };
    try {
      const response = await fetch("http://localhost:3333/bikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      adminBikes();
      const responseText = await response.text();
      console.log(responseText);
    } catch (error) {
      console.error(error);
    }
  };

  function chooseeBikeLocation(e) {
    setSelectedHubLocation(e.target.value);
  }

  //update button
  function submitBikeLocation(e) {
    e.preventDefault();
    const bikeId = e.currentTarget.getAttribute("data-bike-id");
    console.log(
      `updating bike location to ${selectedHubLocation} for bike id: `,
      bikeId,
      e.target
    );
    const data = {
      location_id: selectedHubLocation,
    };

    fetch(`http://localhost:3333/bikes/${bikeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        adminBikes();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const adminBikes = async () => {
    const bikes = await fetch("http://localhost:3333/bikes");
    const bikesJson = await bikes.json();
    setBikes(bikesJson);
  };

  const adminLocations = async () => {
    const locations = await fetch("http://localhost:3333/locations");
    const locationsJson = await locations.json();
    setLocations(locationsJson);
  };

  const adminRentals = async () => {
    const rentals = await fetch("http://localhost:3333/rentals");
    const rentalsJson = await rentals.json();
    setRentals(rentalsJson);
  };

  const adminUsers = async () => {
    const users = await fetch("http://localhost:3333/users");
    const usersJson = await users.json();
    setUsers(usersJson);
  };
  useEffect(() => {
    adminBikes();
    adminLocations();
    adminRentals();
    adminUsers();
  }, []);

  const handleSubmit1 = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3333/bikes/button1/${id}`,
        {
          method: "PUT",
        }
      );
      adminBikes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit2 = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3333/bikes/button2/${id}`,
        {
          method: "PUT",
        }
      );
      adminBikes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>
        <strong>Admin Page</strong>
      </h1>
      <h5>Manage bike inventory, update hub locations and view rental transactions and users tables</h5>
      <h2>Bikes</h2>
      <input
        type="text"
        placeholder="Search by Bike Id"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="show-button"
        onClick={() => setShowBikesTable(!showBikesTable)}
      >
        {showBikesTable ? "Hide" : "Show"} Bikes Table
      </button>
      {showBikesTable && (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Damage</th>
              <th>Location</th>
              <th>Available</th>
              <th>Change Availability</th>
              <th>Change Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredBikes
              .sort((a, b) => a.id - b.id)
              .map((bike) => {
                return (
                  <tr key={bike.id}>
                    <td>{bike.id}</td>
                    <td>{bike.name}</td>
                    <td>
                      {bike.damage !== undefined
                        ? bike.damage
                          ? "True"
                          : "False"
                        : "N/A"}
                    </td>
                    <td>{bike.location_id}</td>
                    <td>
                      {bike.available !== undefined && bike.available !== null
                        ? bike.available
                          ? "Yes"
                          : "No"
                        : "N/A"}
                    </td>
                    <td className="buttons">
                      <button
                        className="update-unavailable-button"
                        onClick={() => handleSubmit1(bike.id)}
                      >
                        Unavailable
                      </button>
                      <button
                        className="update-available-button"
                        onClick={() => handleSubmit2(bike.id)}
                      >
                        Available
                      </button>
                    </td>
                    <td>
                      <div className="update-bike-location">
                        <select onChange={chooseeBikeLocation}>
                          <option key="-1" value="-1" />
                          {locations.map((location, index) => (
                            <option key={index} value={location.id}>
                              {location.id}
                            </option>
                          ))}
                        </select>
                        <button
                          className="update-bike-location-button"
                          data-bike-id={bike.id}
                          onClick={submitBikeLocation}
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      <form>
        <input type="text" id="addBikeInput" placeholder="Bike Name" />
        <button className="add-button" onClick={handleAddBike}>
          Add Bike
        </button>
      </form>

      <h2>Locations</h2>
      <input
        type="text"
        placeholder="Search by Location"
        value={searchLocations}
        onChange={(e) => setSearchLocations(e.target.value)}
      />
      <button
        className="show-button"
        onClick={() => setShowLocationsTable(!showLocationsTable)}
      >
        {showLocationsTable ? "Hide" : "Show"} Locations Table
      </button>
      {showLocationsTable && (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocations
              .sort((a, b) => a.id - b.id)
              .map((location) => {
                return (
                  <tr key={location.id}>
                    <td>{location.id}</td>
                    <td>{location.hub_location}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      <form>
        <input
          type="text"
          placeholder="Add Location"
          id="addLocationInput"
          name="hub_location"
        />
        <button
          className="add-button"
          type="submit"
          onClick={(e) => handleAddLocation(e)}
        >
          Add Location
        </button>
      </form>

      <h2>Rentals</h2>
      <input
        type="text"
        placeholder="Search by User ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="show-button"
        onClick={() => setShowRentalsTable(!showRentalsTable)}
      >
        {showRentalsTable ? "Hide" : "Show"} Rentals Table
      </button>
      {showRentalsTable && (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>User ID</th>
              <th>Location</th>
              <th>Bike</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Rental Time (in seconds)</th>
            </tr>
          </thead>
          <tbody>
            {filteredRentals
              .sort((a, b) => a.id - b.id)
              .map((rental) => {
                return (
                  <tr key={rental.id}>
                    <td>{rental.id}</td>
                    <td>{rental.user_id}</td>
                    <td>{rental.location_id}</td>
                    <td>{rental.bike_id}</td>
                    <td>{rental.start_time}</td>
                    <td>{rental.end_time}</td>
                    <td>{rental.rental_time}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      <h2>Users</h2>
      <input
        type="text"
        placeholder="Search by Email"
        value={searchUsers}
        onChange={(e) => setSearchUsers(e.target.value)}
      />
      <button
        className="show-button"
        onClick={() => setShowUsersTable(!showUsersTable)}
      >
        {showUsersTable ? "Hide" : "Show"} Users Table
      </button>
      {showUsersTable && (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers
              .sort((a, b) => a.id - b.id)
              .map((user) => {
                return (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </>
  );
}
