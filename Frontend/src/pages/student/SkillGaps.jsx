import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { apiGet } from "../../services/api";

function SkillGaps() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSkillGaps() {
    try {
      setLoading(true);
      setError("");

      const data = await apiGet("/student/skill-gaps");

      setAnalysis(data);
    } catch (err) {
      console.error("Skill gap analysis error:", err);
      setError(
        err.message || "Unable to load your skill gap analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkillGaps();
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <div className="p-8">
          <p className="text-sm text-blue-600 font-medium">
            SKILL INTELLIGENCE
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Skill Gap Analysis
          </h1>

          <p className="text-slate-500 mt-2">
            Loading your skill intelligence...
          </p>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="p-8">
          <p className="text-sm text-blue-600 font-medium">
            SKILL INTELLIGENCE
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Skill Gap Analysis
          </h1>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="text-red-600 font-medium">
              Unable to load skill analysis
            </p>

            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>

            <button
              onClick={loadSkillGaps}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  const summary = analysis?.summary || {};
  const strengths = analysis?.strengths || [];
  const developing = analysis?.developing || [];
  const gaps = analysis?.gaps || [];

  return (
    <StudentLayout>
      <div className="p-8">

        {/* -------------------------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------------------------- */}

        <p className="text-sm text-blue-600 font-medium">
          SKILL INTELLIGENCE
        </p>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">
              Skill Gap Analysis
            </h1>

            <p className="text-slate-500 mt-2">
              Understand your strengths, development areas, and
              industry-relevant skill gaps.
            </p>
          </div>

          <button
            onClick={loadSkillGaps}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm hover:bg-slate-800"
          >
            Refresh Analysis
          </button>
        </div>

        {/* -------------------------------------------------- */}
        {/* READINESS */}
        {/* -------------------------------------------------- */}

        <div className="mt-8 bg-white border rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-slate-500">
                Overall Readiness
              </p>

              <p className="text-4xl font-bold text-slate-900 mt-2">
                {analysis?.student?.readiness ?? 0}%
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Based on your current skill assessment
              </p>
            </div>

            <div className="w-full md:w-1/2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">
                  Skill readiness
                </span>

                <span className="font-medium">
                  {analysis?.student?.readiness ?? 0}%
                </span>
              </div>

              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${analysis?.student?.readiness ?? 0}%`,
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* SUMMARY CARDS */}
        {/* -------------------------------------------------- */}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Strong Skills
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {summary.strong ?? 0}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Skills above 70%
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Developing
            </p>

            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {summary.developing ?? 0}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Skills between 50–69%
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Skill Gaps
            </p>

            <p className="text-3xl font-bold text-red-500 mt-2">
              {summary.gaps ?? 0}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Skills below 50%
            </p>
          </div>

        </div>

        {/* -------------------------------------------------- */}
        {/* STRENGTHS */}
        {/* -------------------------------------------------- */}

        <section className="mt-10">

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Your Strengths
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Skills where you currently demonstrate strong
              proficiency.
            </p>
          </div>

          {strengths.length === 0 ? (
            <div className="mt-4 bg-white border rounded-xl p-6">
              <p className="text-slate-500">
                No strong skills identified yet.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              {strengths.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-white border rounded-xl p-5"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <span className="font-medium text-slate-900">
                        {skill.name}
                      </span>

                      <p className="text-sm text-slate-500 mt-1">
                        {skill.category}
                      </p>
                    </div>

                    <span className="font-semibold text-green-600">
                      {skill.score}%
                    </span>

                  </div>

                  <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${skill.score}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-3 text-xs text-slate-500">
                    <span>
                      Industry demand: {skill.industry_demand}
                    </span>

                    <span className="text-green-600 font-medium">
                      Strong
                    </span>
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* -------------------------------------------------- */}
        {/* DEVELOPING */}
        {/* -------------------------------------------------- */}

        <section className="mt-10">

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Skills to Develop
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              These skills have room for improvement and can
              increase your readiness.
            </p>
          </div>

          {developing.length === 0 ? (
            <div className="mt-4 bg-white border rounded-xl p-6">
              <p className="text-slate-500">
                No developing skills identified.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              {developing.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-white border rounded-xl p-5"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <span className="font-medium text-slate-900">
                        {skill.name}
                      </span>

                      <p className="text-sm text-slate-500 mt-1">
                        {skill.category}
                      </p>
                    </div>

                    <span className="font-semibold text-yellow-500">
                      {skill.score}%
                    </span>

                  </div>

                  <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: `${skill.score}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between mt-3 text-xs text-slate-500">
                    <span>
                      Industry demand: {skill.industry_demand}
                    </span>

                    <span className="text-yellow-600 font-medium">
                      Developing
                    </span>
                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* -------------------------------------------------- */}
        {/* PRIORITY GAPS */}
        {/* -------------------------------------------------- */}

        <section className="mt-10">

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Priority Skill Gaps
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Skills that currently need improvement. Industry
              demand is shown to help you prioritize.
            </p>
          </div>

          {gaps.length === 0 ? (
            <div className="mt-4 bg-white border rounded-xl p-6">
              <p className="text-green-600 font-medium">
                Excellent!
              </p>

              <p className="text-slate-500 mt-1">
                You currently don't have any critical skill gaps.
              </p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              {gaps.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-white border border-red-100 rounded-xl p-5"
                >

                  <div className="flex justify-between items-start">

                    <div>
                      <span className="font-medium text-slate-900">
                        {skill.name}
                      </span>

                      <p className="text-sm text-slate-500 mt-1">
                        {skill.category}
                      </p>
                    </div>

                    <span className="font-semibold text-red-500">
                      {skill.score}%
                    </span>

                  </div>

                  <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{
                        width: `${skill.score}%`,
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between">

                    <div>
                      <p className="text-xs text-slate-500">
                        Industry demand
                      </p>

                      <p className="font-semibold text-slate-800">
                        {skill.industry_demand} active{" "}
                        {skill.industry_demand === 1
                          ? "opportunity"
                          : "opportunities"}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                      Needs Improvement
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </StudentLayout>
  );
}

export default SkillGaps;