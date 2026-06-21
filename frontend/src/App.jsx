import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profile from "./pages/Profile";
import Directory from "./pages/Directory";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
import AlumniDetails from "./pages/AlumniDetails";


import Settings from "./pages/Settings";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/Layout";
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>}
        />
        <Route
          path="/directory"
          element={<ProtectedRoute><Layout><Directory /></Layout></ProtectedRoute>}
        />
        <Route
          path="/directory/:id"
          element={<ProtectedRoute><Layout><AlumniDetails /></Layout></ProtectedRoute>}
        />
        <Route
          path="/events"
          element={<ProtectedRoute><Layout><Events /></Layout></ProtectedRoute>}
        />
        <Route 
          path="/jobs" 
          element={<ProtectedRoute><Layout><Jobs /></Layout></ProtectedRoute>} 
        />


        <Route 
          path="/settings" 
          element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute adminOnly={true}>
              <Layout><AdminPanel /></Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;