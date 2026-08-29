import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/student/Dashboard";
import Assessment from "./pages/student/Assessment";
import Skills from "./pages/student/Skills";
import SkillGaps from "./pages/student/SkillGaps";
import Opportunities from "./pages/student/Opportunities";
import Applications from "./pages/student/Applications";
import Portfolio from "./pages/student/Portfolio";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/skill-gaps" element={<SkillGaps />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/portfolio" element={<Portfolio />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
