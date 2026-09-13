import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";

import { Target, BriefcaseBusiness, FileText, TrendingUp } from "lucide-react";

import { Link } from "react-router-dom";

import { apiGet } from "../../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [dashboardData, recommendationData] = await Promise.all([
          apiGet("/student/dashboard"),
          apiGet("/student/recommendations"),
        ]);

        setDashboard(dashboardData);
        setRecommendations(recommendationData);
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(err.message || "Unable to load dashboard.");
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
          <p className="text-slate-500">Loading your dashboard...</p>
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
            <p className="text-red-600 font-medium">Unable to load dashboard</p>

            <p className="text-sm text-red-500 mt-1">{error}</p>
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

  const readiness = student.readiness ?? 0;

  const skills = stats.skills ?? 0;

  const skillGaps = stats.skill_gaps ?? 0;

  const matches = stats.matches ?? 0;

  const applications = stats.applications ?? 0;

  return (
    <StudentLayout>
      <div className="p-8">
        {/* Header */}

        <div className="mb-8">
          <p className="text-sm text-slate-500">Student Dashboard</p>

          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            Good morning, {student.name || "Student"}
          </h1>

          <p className="text-slate-500 mt-2">
            Here's an overview of your career readiness.
          </p>
        </div>

        {/* Career Readiness */}

        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-500">Career Goal</p>

              <h2 className="text-xl font-semibold mt-1">
                {student.career_goal || "Set your career goal"}
              </h2>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-500">Skill Readiness</p>

              <p className="text-3xl font-bold text-blue-600">{readiness}%</p>
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
          <StatCard icon={<Target />} label="Skills" value={skills} />

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
              <h2 className="font-semibold text-lg">Skill Development</h2>

              <Link to="/skills" className="text-sm text-blue-600">
                View all
              </Link>
            </div>

            <div className="space-y-5">
              {dashboard?.skills?.length > 0 ? (
                dashboard.skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{skill.name}</span>

                      <span className="text-slate-500">{skill.score}%</span>
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
                <p className="text-sm text-slate-500">No skills added yet.</p>
              )}
            </div>
          </div>

          {/* Recommendations */}

          <div className="bg-white border rounded-2xl p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="font-semibold text-lg">Recommended for You</h2>

                <p className="text-sm text-slate-500 mt-1">
                  Opportunities matched to your current skills.
                </p>
              </div>

              <Link to="/opportunities" className="text-sm text-blue-600">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {recommendations?.opportunity_recommendations?.length > 0 ? (
                recommendations.opportunity_recommendations
                  .slice(0, 3)
                  .map((opportunity) => (
                    <div
                      key={opportunity.opportunity_id}
                      className="border rounded-xl p-4 hover:border-blue-300 transition"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{opportunity.title}</h3>

                          <p className="text-sm text-slate-500 mt-1">
                            {opportunity.type}
                            {opportunity.location
                              ? ` · ${opportunity.location}`
                              : ""}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs text-slate-500">Match</p>

                          <p className="font-bold text-green-600">
                            {opportunity.match_score}%
                          </p>

                          <p className="text-xs text-slate-500 mt-1">
                            {opportunity.match_level}
                          </p>
                        </div>
                      </div>

                      {/* Partial skills */}

                      {opportunity.partial_skills?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-slate-500">
                            Skills to improve
                          </p>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {opportunity.partial_skills
                              .slice(0, 3)
                              .map((skill) => (
                                <span
                                  key={skill.skill_id}
                                  className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs rounded-full"
                                >
                                  {skill.skill}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Missing skills */}

                      {opportunity.missing_skills?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-slate-500">
                            Missing skills
                          </p>

                          <div className="flex flex-wrap gap-2 mt-2">
                            {opportunity.missing_skills
                              .slice(0, 3)
                              .map((skill) => (
                                <span
                                  key={skill.skill_id}
                                  className="px-2.5 py-1 bg-red-50 text-red-600 text-xs rounded-full"
                                >
                                  {skill.skill}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
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

        {/* Skill Recommendations */}

<div className="bg-white border rounded-2xl p-6 mt-6">

  <div className="flex justify-between items-center mb-6">

    <div>

      <h2 className="font-semibold text-lg">
        Skills to Improve
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        Skills prioritized using your gaps and industry demand.
      </p>

    </div>

    <Link
      to="/skill-gaps"
      className="text-sm text-blue-600"
    >
      View skill gaps
    </Link>

  </div>


  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {recommendations?.skill_recommendations?.length > 0 ? (

      recommendations.skill_recommendations
        .slice(0, 3)
        .map((recommendation) => (

          <div
            key={recommendation.skill_id}
            className="border rounded-xl p-4"
          >

            <div className="flex justify-between items-start gap-3">

              <div>

                <h3 className="font-medium text-slate-900">
                  {recommendation.skill}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {recommendation.category}
                </p>

              </div>


              <span
                className={`px-2.5 py-1 text-xs rounded-full ${
                  recommendation.priority === "High"
                    ? "bg-red-50 text-red-600"
                    : recommendation.priority === "Medium"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {recommendation.priority}
              </span>

            </div>


            <div className="mt-4">

              <div className="flex justify-between text-xs text-slate-500">

                <span>
                  Current: {recommendation.current_score}%
                </span>

                <span>
                  Target: {recommendation.required_score}%
                </span>

              </div>


              <div className="h-2 bg-slate-100 rounded-full mt-2">

                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      recommendation.current_score,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>


            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              {recommendation.reason}
            </p>

          </div>

        ))

    ) : (

      <div className="md:col-span-3">

        <p className="text-sm text-slate-500">
          No immediate skill recommendations. Your current
          skills are aligned with available opportunities.
        </p>

      </div>

    )}

  </div>

</div>
      </div>
    </StudentLayout>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">{icon}</div>

        <p className="text-2xl font-bold">{value}</p>
      </div>

      <p className="text-sm text-slate-500 mt-4">{label}</p>
    </div>
  );
}

export default Dashboard;
