import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Issues from "./pages/Issues";
import "./App.css";

function App() {
  return (
    <div>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issues/:id" element={<Issues />} />
        </Routes>
      </Router>
      <Outlet />
    </div>
  );
}

export default App;
