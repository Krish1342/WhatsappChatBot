import { Route, Routes } from "react-router-dom";

import Chat from "../pages/Chat.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Home from "../pages/Home.jsx";
import Knowledge from "../pages/Knowledge.jsx";
import Tickets from "../pages/Tickets.jsx";
import Admin from "../pages/Admin.jsx";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/knowledge" element={<Knowledge />} />
    </Routes>
  );
}
