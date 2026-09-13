import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  UserRound,
} from "lucide-react";

import { apiGet, apiPatch } from "../../services/api";

function Candidates() {
  const navigate = useNavigate();

  const { id } = useParams();

  // ============================================================
  // STATE
  // ============================================================

  const [opportunity, setOpportunity] = useState(null);

  const [requiredSkills, setRequiredSkills] = useState([]);

  const [rankedCandidates, setRankedCandidates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [updatingApplication, setUpdatingApplication] = useState(null);

  // ============================================================
  // LOAD CANDIDATES
  // ============================================================

  useEffect(() => {
    async function loadCandidates() {
      try {
        setLoading(true);

        setError("");

        const data = await apiGet(`/industry/opportunities/${id}/candidates`);

        // ------------------------------------------------------
        // Opportunity
        // ------------------------------------------------------

        setOpportunity(data.opportunity);

        // ------------------------------------------------------
        // Required skills
        // ------------------------------------------------------

        setRequiredSkills(data.required_skills || []);

        // ------------------------------------------------------
        // Candidates
        // ------------------------------------------------------

        const candidates = data.candidates || [];

        const ranked = candidates
          .map((candidate) => ({
            ...candidate,

            match: candidate.match_score ?? 0,

            matchedSkills: candidate.matched_skills ?? [],

            partialMatches: candidate.partial_matches ?? [],

            missingSkills: candidate.missing_skills ?? [],

            skillGaps: candidate.skillGaps ?? [],

            matchLevel: candidate.match_level ?? "Low",

            matchExplanation: candidate.match_explanation ?? "",
          }))
          .sort((a, b) => b.match_score - a.match_score);

        setRankedCandidates(ranked);
      } catch (error) {
        console.error("Failed to load candidates:", error);

        setError(error.message || "Failed to load candidates.");
      } finally {
        setLoading(false);
      }
    }

    loadCandidates();
  }, [id]);

  // ============================================================
  // UPDATE APPLICATION STATUS
  // ============================================================

  async function updateApplicationStatus(applicationId, status) {
    try {
      setUpdatingApplication(applicationId);

      await apiPatch(`/industry/applications/${applicationId}/status`, {
        status: status,
      });

      // Update status locally after
      // successful backend response

      setRankedCandidates((current) =>
        current.map((candidate) =>
          candidate.application_id === applicationId
            ? {
                ...candidate,
                application_status: status,
              }
            : candidate,
        ),
      );
    } catch (error) {
      console.error("Failed to update application:", error);

      alert(error.message || "Failed to update application status.");
    } finally {
      setUpdatingApplication(null);
    }
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border rounded-2xl p-10 text-center">
          <p className="text-slate-500">Loading candidates...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border rounded-2xl p-10 text-center max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">
            Unable to Load Candidates
          </h1>

          <p className="text-red-500 mt-3">{error}</p>

          <button
            onClick={() => navigate("/industry/opportunities")}
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg"
          >
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // OPPORTUNITY NOT FOUND
  // ============================================================

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-bold">Opportunity Not Found</h1>

          <p className="text-slate-500 mt-2">
            The opportunity could not be found.
          </p>

          <button
            onClick={() => navigate("/industry/opportunities")}
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg"
          >
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="bg-white border-b">
        <div className="px-8 py-6">
          <button
            onClick={() => navigate("/industry/opportunities")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Opportunities
          </button>

          <p className="text-sm text-blue-600 font-medium mt-5">
            CANDIDATE MATCHING
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Matched Candidates
          </h1>

          <p className="text-slate-500 mt-2">
            Candidates ranked according to their skill compatibility.
          </p>
        </div>
      </div>

      <div className="p-8">
        {/* ==================================================
            OPPORTUNITY SUMMARY
            ================================================== */}

        <div className="bg-white border rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-5">
            <div>
              <h2 className="text-xl font-semibold">{opportunity.title}</h2>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin size={15} />

                  {opportunity.location}
                </span>

                <span className="flex items-center gap-1">
                  <GraduationCap size={15} />

                  {opportunity.type}
                </span>
              </div>
            </div>

            {/* Required Skills */}

            <div>
              <p className="text-sm text-slate-500">Required Skills</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {requiredSkills.length > 0 ? (
                  requiredSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {skill.name} • {skill.requiredScore}%
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    No required skills
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            CANDIDATE COUNT
            ================================================== */}

        <div className="mt-6">
          <p className="text-sm text-slate-500">
            {rankedCandidates.length} candidates analyzed
          </p>
        </div>

        {/* ==================================================
            EMPTY STATE
            ================================================== */}

        {rankedCandidates.length === 0 ? (
          <div className="mt-4 bg-white border border-dashed rounded-2xl p-12 text-center">
            <UserRound size={40} className="mx-auto text-slate-300" />

            <h2 className="font-semibold text-lg mt-4">No candidates yet</h2>

            <p className="text-sm text-slate-500 mt-2">
              Candidates will appear here when students apply to this
              opportunity.
            </p>
          </div>
        ) : (
          /* ==================================================
             CANDIDATES
             ================================================== */

          <div className="mt-4 space-y-5">
            {rankedCandidates.map((candidate, index) => (
              <div
                key={candidate.application_id}
                className="bg-white border rounded-2xl p-6"
              >
                {/* ============================================
                      CANDIDATE HEADER
                      ============================================ */}

                <div className="flex flex-col md:flex-row md:justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      {(candidate.name || "U")
  .charAt(0)
  .toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">
                          {candidate.name || "Unknown Candidate"}
                        </h2>

                        {index === 0 && (
                          <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                            Top Match
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-500 mt-1">
                        {candidate.career_goal || "Career goal not specified"}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Readiness: {candidate.readiness || 0}%
                      </p>
                    </div>
                  </div>

                  {/* Match Score */}

                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-500">Skill Match</p>

                    <p
                      className={`text-3xl font-bold mt-1 ${
                        candidate.match_score >= 85
                          ? "text-green-600"
                          : candidate.match_score >= 70
                            ? "text-blue-600"
                            : candidate.match_score >= 50
                              ? "text-yellow-600"
                              : "text-red-500"
                      }`}
                    >
                      {candidate.match_score}%
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {candidate.matchLevel}
                    </p>
                  </div>
                </div>

                {/* ============================================
                      MATCH PROGRESS
                      ============================================ */}

                <div className="mt-5">
                  <div className="h-2 bg-slate-100 rounded-full">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${candidate.match_score}%`,
                      }}
                    />
                  </div>
                </div>

                {/* ============================================
                      SKILLS
                      ============================================ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  {/* Matching Skills */}

                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle size={17} className="text-green-600" />

                      <p className="text-sm font-medium">Matching Skills</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {candidate.matchedSkills.length > 0 ? (
                        candidate.matchedSkills.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                          >
                            ✓ {skill.name}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">
                          No full matches.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Partial Matches */}

                  <div>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={17} className="text-yellow-500" />

                      <p className="text-sm font-medium">Partial Matches</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {candidate.partialMatches.length > 0 ? (
                        candidate.partialMatches.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full"
                          >
                            ◐ {skill.name}
                            {" · "}
                            {skill.student_score}/{skill.required_score}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">
                          No partial matches.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Skill Gaps */}

                  <div>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={17} className="text-red-500" />

                      <p className="text-sm font-medium">Skill Gaps</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {candidate.skillGaps.length > 0 ? (
                        candidate.skillGaps.map((skill) => (
                          <span
                            key={skill.id}
                            className={`px-3 py-1 text-xs rounded-full ${
                              skill.severity === "Critical"
                                ? "bg-red-100 text-red-700"
                                : skill.severity === "High"
                                  ? "bg-orange-50 text-orange-700"
                                  : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            ! {skill.name} · Gap {skill.gap} · {skill.severity}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-green-600">No skill gaps.</p>
                      )}
                    </div>
                  </div>
                </div>

                {candidate.matchExplanation && (
                  <div className="mt-5 bg-slate-50 border rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase">
                      Match Explanation
                    </p>

                    <p className="text-sm text-slate-600 mt-1">
                      {candidate.matchExplanation}
                    </p>
                  </div>
                )}
                {/* ============================================
                      APPLICATION STATUS
                      ============================================ */}

                <div className="mt-6 pt-5 border-t">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">
                        Application Status
                      </p>

                      <span
                        className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                          candidate.application_status === "Selected"
                            ? "bg-green-50 text-green-700"
                            : candidate.application_status === "Shortlisted"
                              ? "bg-blue-50 text-blue-700"
                              : candidate.application_status === "Rejected"
                                ? "bg-red-50 text-red-600"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {candidate.application_status}
                      </span>
                    </div>

                    {/* Actions */}

                    <div className="flex flex-wrap justify-end gap-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/industry/candidates/${id}/${candidate.student_id}`,
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50"
                      >
                        <UserRound size={15} />
                        View Profile
                      </button>

                      {candidate.application_status !== "Shortlisted" &&
                        candidate.application_status !== "Selected" &&
                        candidate.application_status !== "Rejected" && (
                          <button
                            disabled={
                              updatingApplication === candidate.application_id
                            }
                            onClick={() =>
                              updateApplicationStatus(
                                candidate.application_id,
                                "Shortlisted",
                              )
                            }
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                          >
                            {updatingApplication === candidate.application_id
                              ? "Updating..."
                              : "Shortlist"}
                          </button>
                        )}

                      {candidate.application_status === "Shortlisted" && (
                        <button
                          disabled={
                            updatingApplication === candidate.application_id
                          }
                          onClick={() =>
                            updateApplicationStatus(
                              candidate.application_id,
                              "Selected",
                            )
                          }
                          className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingApplication === candidate.application_id
                            ? "Updating..."
                            : "Select"}
                        </button>
                      )}

                      {candidate.application_status !== "Rejected" &&
                        candidate.application_status !== "Selected" && (
                          <button
                            disabled={
                              updatingApplication === candidate.application_id
                            }
                            onClick={() =>
                              updateApplicationStatus(
                                candidate.application_id,
                                "Rejected",
                              )
                            }
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Candidates;
