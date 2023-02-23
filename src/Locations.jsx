import react from 'react';
import { useState } from 'react';

export function Locations() {
  const [locations, setLocations] = useState([]);

  function handleLocations() {
    fetch("http://localhost:3333/locations", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // <--- this sets the cookie
        }  )          
      .then((res) => res.json())
      .then((data) => setLocations(data));
  }

  return (
    <>
      <div className="locations">
        <button onClick={handleLocations}>Locations</button>
        <ul>
          {locations.map((location) => (
            <li key={location.id}>{location.hub}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

