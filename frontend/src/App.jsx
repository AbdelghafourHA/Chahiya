import React from "react";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import useAuth from "./stores/auth.store.js";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />
      </Routes>
    </>
  );
};

export default App;
