import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import Learning from "./pages/student/Learning";
import Profile from "./pages/student/Profile";
import IndustryDashboard from "./pages/industry/IndustryDashboard";
import PostOpportunity from "./pages/industry/PostOpportunity";
import MyOpportunities from "./pages/industry/MyOpportunities";
import EditOpportunity from "./pages/industry/EditOpportunity";
import Candidates from "./pages/industry/Candidates";
import CandidateProfile from "./pages/industry/CandidateProfile";
import ShortlistedCandidates from "./pages/industry/ShortlistedCandidates";
import AcademiaLayout from "./layouts/AcademiaLayout";
import AcademiaDashboard from "./pages/academia/Dashboard";
import AcademiaStudents from "./pages/academia/Students";
import SkillAnalytics from "./pages/academia/SkillAnalytics";
import AcademiaSkillGaps from "./pages/academia/SkillGaps";
import IndustryDemand from "./pages/academia/IndustryDemand";
import AcademiaOpportunities from "./pages/academia/Opportunities";
import Collaborations from "./pages/academia/Collaborations";
import PlacementAnalytics from "./pages/academia/PlacementAnalytics";
import Reports from "./pages/academia/Reports";
import AcademiaProfile from "./pages/academia/Profile";

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
        <Route path="/learning" element={<Learning />} />
        <Route path="/profile" element={<Profile />} />
        
        <Route path="/industry/dashboard" element={<IndustryDashboard />} />
        <Route path="/industry/post-opportunity" element={<PostOpportunity />} />
        <Route path="/industry/opportunities" element={<MyOpportunities />} />
        <Route path="/industry/opportunities/:id/edit" element={<EditOpportunity />} />
        <Route path="/industry/candidates/:id" element={<Candidates />} />
        <Route path="/industry/candidates/:opportunityId/:candidateId" element={<CandidateProfile />} />
        <Route path="/industry/shortlisted" element={<ShortlistedCandidates />} />

        {/* Academia Portal */}
<Route path="/academia" element={<AcademiaLayout />}>

  <Route
    index
    element={<Navigate to="dashboard" replace />}
  />

  <Route
    path="dashboard"
    element={<AcademiaDashboard />}
  />

  <Route
    path="students"
    element={<AcademiaStudents />}
  />

  <Route
    path="skill-analytics"
    element={<SkillAnalytics />}
  />

  <Route
    path="skill-gaps"
    element={<AcademiaSkillGaps />}
  />

  <Route
    path="industry-demand"
    element={<IndustryDemand />}
  />

  <Route
    path="opportunities"
    element={<AcademiaOpportunities />}
  />

  <Route
    path="collaborations"
    element={<Collaborations />}
  />

  <Route
    path="placement-analytics"
    element={<PlacementAnalytics />}
  />

  <Route
    path="reports"
    element={<Reports />}
  />

  <Route
    path="profile"
    element={<AcademiaProfile />}
  />

</Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
