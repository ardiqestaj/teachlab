import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/Login";

import "./App.css";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <header style={{ padding: "1rem", background: "#f4f4f4" }}>
        <nav>
          <Link to="/tours" style={{ marginRight: "1rem" }}>
            Tours
          </Link>
          <Link to="/users" style={{ marginRight: "1rem" }}>
            Users
          </Link>
          <Link to="/bookings">Bookings</Link>
        </nav>
      </header>
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/users"
            element={<PrivateRoute>{/* <Users /> */}</PrivateRoute>}
          />
          <Route
            path="/tours"
            element={<PrivateRoute>{/* <Tours /> */}</PrivateRoute>}
          />
          <Route
            path="/bookings"
            element={<PrivateRoute>{/* <Bookings /> */}</PrivateRoute>}
          />
          {/* Default route: if not authenticated, redirect to login */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
