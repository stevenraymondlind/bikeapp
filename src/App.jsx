import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { Home } from "./Home";
import { Reserve } from "./Reserve";
import { Rent3 } from "./Rent3";
import { Login } from "./Login";
import { Register } from "./Register";
import { Admin } from "./Admin";
import { AdminLogin } from "./AdminLogin";
import { Return } from "./Return";
import { Logout } from "./Logout";
import { Navbar } from "./Navbar";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reserve" element={<Reserve />} />
            <Route path="/rent3" element={<Rent3 />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/return" element={<Return />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
