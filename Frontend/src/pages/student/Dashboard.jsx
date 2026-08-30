import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";

import {
  Target,
  BriefcaseBusiness,
  FileText,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";

import { apiGet } from "../../services/api";


function Dashboard() {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    async function loadDashboard() {

      try {

        setLoading(true);
        setError("");

        const data = await apiGet(
          "/student/dashboard"
        );

        setDashboard(data);

      } catch (err) {

        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }
    }

    loadDashboard();

  }, []);


  // ----------------------------------------------------------
  // Loading
  // ----------------------------------------------------------

  if (loading) {

    return (
      <StudentLayout>

        <div className="p-8">

          <p className="text-slate-500">
            Loading your dashboard...
          </p>

        </div>

      </StudentLayout>
    );
  }


  // ----------------------------------------------------------
  // Error
  // ----------------------------------------------------------

  if (error) {

    return (
      <StudentLayout>

        <div className="p-8">

          <div className="bg-red-50 border border-red-200 rounded-xl p-5">

            <p className="text-red-600 font-medium">
              Unable to load dashboard
            </p>

            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>

          </div>

        </div>

      </StudentLayout>
    );
  }


  // ----------------------------------------------------------
  // Backend data
  // ----------------------------------------------------------

  const student = dashboard?.student || {};
  const stats = dashboard?.stats || {};

  const readiness =
    student.readiness ?? 0;

  const skills =
    stats.skills ?? 0;

  const skillGaps =
    stats.skill_gaps ?? 0;

  const matches =
    stats.matches ?? 0;

  const applications =
    stats.applications ?? 0;


  return (
    <StudentLayout>

      <div className="p-8">

        {/* Header */}

        <div className="mb-8">

          <p className="text-sm text-slate-500">
            Student Dashboard
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-1">

            Good morning,{" "}
            {student.name || "Student"}

          </h1>

          <p className="text-slate-500 mt-2">
            Here's an overview of your career readiness.
          </p>

        </div>


        {/* Career Readiness */}

        <div className="bg-white rounded-2xl border p-6 mb-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm text-slate-500">
                Career Goal
              </p>

              <h2 className="text-xl font-semibold mt-1">

                {student.career_goal ||
                  "Set your career goal"}

              </h2>

            </div>


            <div className="text-right">

              <p className="text-sm text-slate-500">
                Skill Readiness
              </p>

              <p className="text-3xl font-bold text-blue-600">
                {readiness}%
              </p>

            </div>

          </div>


          <div className="mt-5 h-3 bg-slate-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${readiness}%`,
              }}
            />

          </div>

        </div>


        {/* Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

          <StatCard
            icon={<Target />}
            label="Skills"
            value={skills}
          />

          <StatCard
            icon={<TrendingUp />}
            label="Skill Gaps"
            value={skillGaps}
          />

          <StatCard
            icon={<BriefcaseBusiness />}
            label="Matches"
            value={matches}
          />

          <StatCard
            icon={<FileText />}
            label="Applications"
            value={applications}
          />

        </div>


        {/* Main Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


          {/* Skills */}

          <div className="bg-white border rounded-2xl p-6">

            <div className="flex justify-between mb-6">

              <h2 className="font-semibold text-lg">
                Skill Development
              </h2>

              <Link
                to="/skills"
                className="text-sm text-blue-600"
              >
                View all
              </Link>

            </div>


            <div className="space-y-5">

              {dashboard?.skills?.length > 0 ? (

                dashboard.skills.map((skill) => (

                  <div key={skill.id}>

                    <div className="flex justify-between text-sm mb-2">

                      <span className="font-medium">
                        {skill.name}
                      </span>

                      <span className="text-slate-500">
                        {skill.score}%
                      </span>

                    </div>


                    <div className="h-2 bg-slate-100 rounded-full">

                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${skill.score}%`,
                        }}
                      />

                    </div>

                  </div>

                ))

              ) : (

                <p className="text-sm text-slate-500">
                  No skills added yet.
                </p>

              )}

            </div>

          </div>


          {/* Opportunities */}

          <div className="bg-white border rounded-2xl p-6">

            <div className="flex justify-between mb-6">

              <h2 className="font-semibold text-lg">
                Recommended for You
              </h2>

              <Link
                to="/opportunities"
                className="text-sm text-blue-600"
              >
                View all
              </Link>

            </div>


            <div className="space-y-4">

              {dashboard?.opportunities?.length > 0 ? (

                dashboard.opportunities.map((job) => (

                  <div
                    key={job.id}
                    className="border rounded-xl p-4 hover:border-blue-300 transition"
                  >

                    <div className="flex justify-between">

                      <div>

                        <h3 className="font-medium">
                          {job.title}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {job.company}
                        </p>

                      </div>


                      <div className="text-right">

                        <p className="text-xs text-slate-500">
                          Match
                        </p>

                        <p className="font-bold text-green-600">
                          {job.match}%
                        </p>

                      </div>

                    </div>

                  </div>

                ))

              ) : (

                <p className="text-sm text-slate-500">
                  No recommended opportunities yet.
                </p>

              )}

            </div>

          </div>

        </div>

      </div>

    </StudentLayout>
  );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  icon,
  label,
  value,
}) {

  return (
    <div className="bg-white border rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          {icon}
        </div>

        <p className="text-2xl font-bold">
          {value}
        </p>

      </div>


      <p className="text-sm text-slate-500 mt-4">
        {label}
      </p>

    </div>
  );
}


export default Dashboard;