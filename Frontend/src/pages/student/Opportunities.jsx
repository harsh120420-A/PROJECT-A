import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { MapPin, Clock, BriefcaseBusiness } from "lucide-react";
import { apiGet, apiPost } from "../../services/api";

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [matchResults, setMatchResults] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);

  // ==========================================================
  // LOAD OPPORTUNITIES + MATCHING RESULTS
  // ==========================================================

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [opportunitiesData, applicationsData] = await Promise.all([
          apiGet("/student/opportunities"),
          apiGet("/student/applications"),
        ]);

        const loadedOpportunities = Array.isArray(opportunitiesData)
          ? opportunitiesData
          : [];

        setOpportunities(loadedOpportunities);

        setAppliedIds(
          Array.isArray(applicationsData)
            ? applicationsData.map(
                (application) => application.opportunity_id
              )
            : []
        );

        // ----------------------------------------------------------
        // Load backend matching results
        // ----------------------------------------------------------

        const matchEntries = await Promise.all(
          loadedOpportunities.map(async (job) => {
            try {
              const result = await apiGet(
                `/student/opportunities/${job.id}/match`
              );

              return [job.id, result];
            } catch (error) {
              console.error(
                `Match calculation failed for opportunity ${job.id}:`,
                error
              );

              return [job.id, null];
            }
          })
        );

        setMatchResults(Object.fromEntries(matchEntries));
      } catch (err) {
        console.error("Opportunities error:", err);

        setError(err.message || "Unable to load opportunities.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ==========================================================
  // APPLY
  // ==========================================================

  async function handleApply(job) {
    if (!job.id) {
      alert("Invalid opportunity.");
      return;
    }

    try {
      setApplyingId(job.id);

      await apiPost(`/student/opportunities/${job.id}/apply`);

      setAppliedIds((previous) => [...previous, job.id]);

      alert("Application submitted successfully!");
    } catch (err) {
      console.error("Application error:", err);

      alert(err.message || "Unable to submit application.");
    } finally {
      setApplyingId(null);
    }
  }

  // ==========================================================
  // LOADING STATE
  // ==========================================================

  if (loading) {
    return (
      <StudentLayout>
        <div className="p-8">
          <p className="text-sm text-blue-600 font-medium">
            OPPORTUNITIES
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Opportunities
          </h1>

          <p className="text-slate-500 mt-2">
            Opportunities matched to your current skills.
          </p>

          <div className="mt-8">
            <p className="text-slate-500">
              Loading opportunities...
            </p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // ==========================================================
  // ERROR STATE
  // ==========================================================

  if (error) {
    return (
      <StudentLayout>
        <div className="p-8">
          <p className="text-sm text-blue-600 font-medium">
            OPPORTUNITIES
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Opportunities
          </h1>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5">
            <p className="font-medium text-red-600">
              Unable to load opportunities
            </p>

            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-8">
        <p className="text-sm text-blue-600 font-medium">
          OPPORTUNITIES
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-2">
          Opportunities
        </h1>

        <p className="text-slate-500 mt-2">
          Opportunities matched to your current skills.
        </p>

        {/* ==================================================
            NO OPPORTUNITIES
        ================================================== */}

        {opportunities.length === 0 && (
          <div className="mt-8 bg-white border rounded-2xl p-6">
            <p className="font-medium text-slate-800">
              No opportunities available.
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Check back later for new opportunities.
            </p>
          </div>
        )}

        {/* ==================================================
            OPPORTUNITIES
        ================================================== */}

        <div className="mt-8 space-y-5">
          {opportunities.map((job) => {
            const matchResult = matchResults[job.id];

            const match = matchResult?.match_score;
            const matchLevel =
              matchResult?.match_level ?? "Low";

            const matchedSkills =
              matchResult?.matched_skills ?? [];

            const partialMatches =
              matchResult?.partial_matches ?? [];

            const missingSkills =
              matchResult?.missing_skills ?? [];

            const isApplied = appliedIds.includes(job.id);

            const isApplying = applyingId === job.id;

            return (
              <div
                key={job.id}
                className="bg-white border rounded-2xl p-6 hover:border-blue-300 transition"
              >
                {/* ==================================================
                    OPPORTUNITY HEADER
                ================================================== */}

                <div className="flex flex-col md:flex-row md:justify-between gap-5">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {job.title || "Untitled Opportunity"}
                    </h2>

                    <p className="text-slate-500 mt-1">
                      {job.company || "Company"}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location || "Not specified"}
                      </span>

                      <span className="flex items-center gap-1">
                        <BriefcaseBusiness size={16} />
                        {job.mode || "Not specified"}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {job.duration || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* ==================================================
                      SKILL MATCH
                  ================================================== */}

                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-500">
                      Skill Match
                    </p>

                    {match !== undefined && match !== null ? (
                      <>
                        <p
                          className={`text-3xl font-bold ${
                            match >= 85
                              ? "text-green-600"
                              : match >= 70
                                ? "text-blue-600"
                                : match >= 50
                                  ? "text-yellow-600"
                                  : "text-red-500"
                          }`}
                        >
                          {match}%
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {matchLevel}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-400 mt-2">
                        Match unavailable
                      </p>
                    )}
                  </div>
                </div>

                {/* ==================================================
                    REQUIRED SKILLS
                ================================================== */}

                <div className="mt-6">
                  <p className="text-sm font-medium">
                    Required Skills
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {(
                      Array.isArray(job.skills)
                        ? job.skills
                        : []
                    ).map((skill, index) => (
                      <span
                        key={`${job.id}-required-${skill}-${index}`}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ==================================================
                    WHY THIS MATCHES YOU
                ================================================== */}

                <div className="mt-6">
                  <p className="text-sm font-medium">
                    Why this matches you
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {/* Fully Matched Skills */}

                    {matchedSkills.map((skill) => (
                      <span
                        key={`${job.id}-matched-${skill.id}`}
                        className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full"
                      >
                        ✓ {skill.name}
                      </span>
                    ))}

                    {/* Partial Matches */}

                    {partialMatches.map((skill) => (
                      <span
                        key={`${job.id}-partial-${skill.id}`}
                        className="px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full"
                      >
                        ◐ {skill.name} ·{" "}
                        {skill.student_score}/
                        {skill.required_score}
                      </span>
                    ))}

                    {/* Missing Skills */}

                    {missingSkills.map((skill) => (
                      <span
                        key={`${job.id}-missing-${skill.id}`}
                        className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full"
                      >
                        ! {skill.name}
                      </span>
                    ))}

                    {/* No matching information */}

                    {matchResult &&
                      matchedSkills.length === 0 &&
                      partialMatches.length === 0 &&
                      missingSkills.length === 0 && (
                        <span className="text-sm text-slate-400">
                          No skill matching information available.
                        </span>
                      )}
                  </div>

                  {/* Backend Explanation */}

                  {matchResult?.explanation && (
                    <p className="text-xs text-slate-500 mt-3">
                      {matchResult.explanation}
                    </p>
                  )}
                </div>

                {/* ==================================================
                    APPLY BUTTON
                ================================================== */}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleApply(job)}
                    disabled={isApplying || isApplied}
                    className={`px-5 py-2.5 rounded-lg font-medium ${
                      isApplied
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isApplying
                      ? "Applying..."
                      : isApplied
                        ? "Applied"
                        : "Apply Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </StudentLayout>
  );
}

export default Opportunities;