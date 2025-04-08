import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/login/Login";
import Tours from "./pages/tours/Tours";
import Bookings from "./pages/bookings/Bookings";

// Placeholder components (replace with real ones)
// const Tours = () => <h2>Tours Page (Public)</h2>;
const Users = () => <h2>Users Page (Private)</h2>;

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  useEffect(() => {
    const checkToken = () => {
      setLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <Router>
      <header style={{ padding: "1rem", background: "#f4f4f4" }}>
        <nav>
          <Link to="/tours" style={{ marginRight: "1rem" }}>
            Tours
          </Link>
          {loggedIn && (
            <>
              <Link to="/users" style={{ marginRight: "1rem" }}>
                Users
              </Link>
              <Link to="/bookings" style={{ marginRight: "1rem" }}>
                Bookings
              </Link>
            </>
          )}
          {!loggedIn ? (
            <Link to="/login">Login</Link>
          ) : (
            <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
              Logout
            </button>
          )}
        </nav>
      </header>
      <main style={{ padding: "1rem" }}>
        <Routes>
          {/* Default redirect to /tours */}
          <Route path="/" element={<Navigate to="/tours" />} />

          {/* Public Routes */}
          <Route
            path="/login"
            element={<Login onLogin={() => setLoggedIn(true)} />}
          />
          <Route path="/tours" element={<Tours />} />

          {/* Private Routes */}
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <Bookings />
              </PrivateRoute>
            }
          />

          {/* Catch-all: redirect to /tours */}
          <Route path="*" element={<Navigate to="/tours" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
