import GoogleMaps from "simple-react-google-maps";

export function GoogleMap() {
  console.log("rendering map");

  return (
    <div>
    <h1>Location Hubs</h1>
      <GoogleMaps
        apiKey={"AIzaSyCk1nD1umCfyYyg-sn1ENmaGPysdv_T7yU"}
        style={{ height: "400px", width: "100%" }}
        zoom={12}
        center={{ lat: 45.5019, lng: -73.599997 }}
        markers={[
          { lat: 45.5273, lng: -73.5704 },
          { lat: 45.5077, lng: -73.5509 },
          { lat: 45.5149, lng: -73.5597 },
          { lat: 45.5016, lng: -73.5932 },
          { lat: 45.5355, lng: -73.6286 },
          { lat: 45.5240, lng: -73.6005, Number: 5 },

        ]} //optional
        onLoaded={(map, maps) => handleApiLoaded(map, maps)}
      />
    </div>
  );
}
