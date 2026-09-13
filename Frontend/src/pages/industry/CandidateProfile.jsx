import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Mail,
  GraduationCap,
  Target,
  CheckCircle,
  AlertCircle,
  BriefcaseBusiness,
  Award,
  ExternalLink,
  Star,
} from "lucide-react";

import {
  apiGet,
  apiPatch,
} from "../../services/api";

function CandidateProfile() {
  const navigate = useNavigate();

  const {
    candidateId,
    opportunityId,
  } = useParams();

  const [candidate, setCandidate] =
    useState(null);

  const [opportunity, setOpportunity] =
    useState(null);

  const [matchResult, setMatchResult] =
    useState(null);

  const [shortlisted, setShortlisted] =
    useState(false);

  const [status, setStatus] =
    useState("Applied");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingStatus,
    setUpdatingStatus,
  ] = useState(false);

  // ==========================================================
  // LOAD CANDIDATE PROFILE + OPPORTUNITY + MATCH
  // ==========================================================

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------------
        // Candidate profile
        // ------------------------------------------------------

        const profile = await apiGet(
          `/industry/candidates/${candidateId}`
        );

        // ------------------------------------------------------
        // Opportunity
        // ------------------------------------------------------

        const opportunities =
          await apiGet(
            "/industry/opportunities"
          );

        const selectedOpportunity =
          opportunities.find(
            (item) =>
              item.id.toString() ===
              opportunityId
          );

        if (!selectedOpportunity) {
          throw new Error(
            "Opportunity not found."
          );
        }

        // ------------------------------------------------------
        // Candidate data
        // ------------------------------------------------------

        const candidateData = {
          id: profile.student.id,

          name:
            profile.student.name ||
            "Unknown Candidate",

          email:
            profile.student.email ||
            "Not available",

          careerGoal:
            profile.student.career_goal ||
            "Not specified",

          readiness:
            profile.student.readiness ??
            "Not specified",

          skills:
            Array.isArray(profile.skills)
              ? profile.skills
              : [],
        };

        setCandidate(candidateData);
        setOpportunity(
          selectedOpportunity
        );

        // ------------------------------------------------------
        // Application status
        // ------------------------------------------------------

        const applicationStatus =
          profile.application?.status ||
          "Applied";

        setStatus(applicationStatus);

        setShortlisted(
          applicationStatus !== "Applied"
        );

        // ------------------------------------------------------
        // Backend matching result
        // ------------------------------------------------------

        const candidateList =
          await apiGet(
            `/industry/opportunities/${opportunityId}/candidates`
          );

        const candidates =
          Array.isArray(
            candidateList.candidates
          )
            ? candidateList.candidates
            : [];

        const backendMatch =
          candidates.find(
            (item) =>
              item.id === candidateId ||
              item.id?.toString() ===
                candidateId ||
              item.student_id ===
                candidateId ||
              item.student_id?.toString() ===
                candidateId
          );

        if (backendMatch) {
          setMatchResult({
            match_score:
              backendMatch.match_score ??
              0,

            match_level:
              backendMatch.match_level ??
              "Low",

            matched_skills:
              backendMatch.matched_skills ??
              [],

            partial_matches:
              backendMatch.partial_matches ??
              [],

            missing_skills:
              backendMatch.missing_skills ??
              [],

            skill_gaps:
              backendMatch.skill_gaps ??
              [],

            match_explanation:
              backendMatch.match_explanation ||
              "",
          });
        } else {
          setMatchResult({
            match_score: 0,
            match_level: "Low",
            matched_skills: [],
            partial_matches: [],
            missing_skills: [],
            skill_gaps: [],
            match_explanation:
              "Match information is unavailable for this candidate.",
          });
        }
      } catch (err) {
        console.error(
          "Failed to load candidate profile:",
          err
        );

        setError(
          err.message ||
            "Failed to load candidate profile."
        );
      } finally {
        setLoading(false);
      }
    }

    if (
      candidateId &&
      opportunityId
    ) {
      loadProfile();
    }
  }, [
    candidateId,
    opportunityId,
  ]);

  // ==========================================================
  // UPDATE RECRUITMENT STATUS
  // ==========================================================

  async function updateStatus(
    newStatus
  ) {
    if (!candidate) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError("");

      const profile =
        await apiGet(
          `/industry/candidates/${candidateId}`
        );

      const applicationId =
        profile.application?.id;

      if (!applicationId) {
        throw new Error(
          "Application ID not found."
        );
      }

      await apiPatch(
        `/industry/applications/${applicationId}/status`,
        {
          status: newStatus,
        }
      );

      setStatus(newStatus);

      setShortlisted(
        newStatus !== "Applied"
      );
    } catch (err) {
      console.error(
        "Failed to update application status:",
        err
      );

      setError(
        err.message ||
          "Failed to update recruitment status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  // ==========================================================
  // SHORTLIST / REMOVE
  // ==========================================================

  async function toggleShortlist() {
    if (!candidate) {
      return;
    }

    if (shortlisted) {
      await updateStatus("Applied");
    } else {
      await updateStatus(
        "Shortlisted"
      );
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border rounded-2xl p-10 text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-slate-500 mt-4">
            Loading candidate profile...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error ||
    !candidate ||
    !opportunity
  ) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border rounded-2xl p-10 text-center max-w-md">
          <h1 className="text-2xl font-bold">
            Candidate Not Found
          </h1>

          <p className="text-slate-500 mt-2">
            {error ||
              "The candidate or opportunity could not be found."}
          </p>

          <button
            onClick={() =>
              navigate(
                `/industry/candidates/${opportunityId}`
              )
            }
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium"
          >
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================
  // MATCHING DATA
  // ==========================================================

  const match =
    matchResult?.match_score ?? 0;

  const matchLevel =
    matchResult?.match_level ?? "Low";

  const matchedSkills =
    matchResult?.matched_skills ?? [];

  const partialMatches =
    matchResult?.partial_matches ?? [];

  const missingSkills =
    matchResult?.missing_skills ?? [];

  const skillGaps =
    matchResult?.skill_gaps ?? [];

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="bg-white border-b">
        <div className="px-8 py-6">
          <button
            onClick={() =>
              navigate(
                `/industry/candidates/${opportunityId}`
              )
            }
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Back to Candidates
          </button>

          <p className="text-sm text-blue-600 font-medium mt-5">
            CANDIDATE PROFILE
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            {candidate.name}
          </h1>

          <p className="text-slate-500 mt-2">
            Profile and skill compatibility for{" "}
            <span className="font-medium text-slate-700">
              {opportunity.title}
            </span>
          </p>
        </div>
      </div>

      <div className="p-8 max-w-6xl">
        {/* ==================================================
            PROFILE SUMMARY
            ================================================== */}

        <div className="bg-white border rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
                {(candidate.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-semibold">
                  {candidate.name}
                </h2>

                <p className="text-slate-500 mt-1">
                  Student
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Readiness:{" "}
                  {candidate.readiness}
                </p>
              </div>
            </div>

            <button
              onClick={
                toggleShortlist
              }
              disabled={
                updatingStatus
              }
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium ${
                shortlisted
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } ${
                updatingStatus
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
            >
              <Star
                size={17}
                fill={
                  shortlisted
                    ? "currentColor"
                    : "none"
                }
              />

              {updatingStatus
                ? "Updating..."
                : shortlisted
                ? "Shortlisted"
                : "Shortlist Candidate"}
            </button>
          </div>

          {/* Contact / Career */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Mail size={17} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Email
                </p>

                <p className="text-sm font-medium">
                  {candidate.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <GraduationCap size={17} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Education
                </p>

                <p className="text-sm font-medium">
                  Student Profile
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Target size={17} />
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Career Goal
                </p>

                <p className="text-sm font-medium">
                  {candidate.careerGoal}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            ERROR NOTIFICATION
            ================================================== */}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {/* ==================================================
            MATCH OVERVIEW
            ================================================== */}

        <div className="bg-white border rounded-2xl p-6 mt-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold">
                Opportunity Match
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Backend-calculated skill compatibility
                with {opportunity.title}.
              </p>

              <p className="text-sm font-medium text-slate-700 mt-3">
                Match Level:{" "}
                <span className="text-blue-600">
                  {matchLevel}
                </span>
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm text-slate-500">
                Overall Match
              </p>

              <p
                className={`text-4xl font-bold ${
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
            </div>
          </div>

          {/* Match Bar */}

          <div className="mt-5">
            <div className="h-3 bg-slate-100 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${Math.min(
                    Math.max(match, 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* ==================================================
              MATCH DETAILS
              ================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">
            {/* Matching Skills */}

            <div>
              <div className="flex items-center gap-2">
                <CheckCircle
                  size={18}
                  className="text-green-600"
                />

                <h3 className="font-medium">
                  Matching Skills
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {matchedSkills.length >
                0 ? (
                  matchedSkills.map(
                    (skill) => (
                      <span
                        key={`matched-${skill.id}`}
                        className="px-3 py-2 bg-green-50 text-green-700 text-sm rounded-full"
                      >
                        ✓ {skill.name}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm text-slate-400">
                    No strong matches.
                  </p>
                )}
              </div>
            </div>

            {/* Skill Gaps */}

            <div>
              <div className="flex items-center gap-2">
                <AlertCircle
                  size={18}
                  className="text-red-500"
                />

                <h3 className="font-medium">
                  Skill Gaps
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {skillGaps.length >
                0 ? (
                  skillGaps.map(
                    (gap) => (
                      <span
                        key={`gap-${gap.id}`}
                        className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded-full"
                      >
                        ! {gap.name}
                        {gap.severity &&
                          ` · ${gap.severity}`}
                      </span>
                    )
                  )
                ) : missingSkills.length >
                  0 ? (
                  missingSkills.map(
                    (skill) => (
                      <span
                        key={`missing-${skill.id}`}
                        className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded-full"
                      >
                        ! {skill.name}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-sm text-green-600">
                    No major skill gaps.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Partial Matches */}

          {partialMatches.length >
            0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2">
                <AlertCircle
                  size={18}
                  className="text-yellow-600"
                />

                <h3 className="font-medium">
                  Partial Matches
                </h3>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {partialMatches.map(
                  (skill) => (
                    <span
                      key={`partial-${skill.id}`}
                      className="px-3 py-2 bg-yellow-50 text-yellow-700 text-sm rounded-full"
                    >
                      ◐ {skill.name} ·{" "}
                      {skill.student_score}/
                      {skill.required_score}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Backend Explanation */}

          {matchResult?.match_explanation && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-400">
                Match Explanation
              </p>

              <p className="text-sm text-slate-600 mt-1">
                {matchResult.match_explanation}
              </p>
            </div>
          )}
        </div>

        {/* ==================================================
            SKILLS BREAKDOWN
            ================================================== */}

        <div className="bg-white border rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-semibold">
            Skills Breakdown
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Current proficiency across the
            candidate's skills.
          </p>

          <div className="mt-6 space-y-5">
            {candidate.skills.length >
            0 ? (
              candidate.skills.map(
                (skill) => {
                  const isRequired =
                    matchedSkills.some(
                      (item) =>
                        item.id === skill.id
                    ) ||
                    partialMatches.some(
                      (item) =>
                        item.id === skill.id
                    ) ||
                    missingSkills.some(
                      (item) =>
                        item.id === skill.id
                    );

                  return (
                    <div
                      key={skill.id}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {skill.name}
                          </span>

                          {isRequired && (
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                              Required
                            </span>
                          )}
                        </div>

                        <span className="text-sm font-semibold">
                          {skill.score}%
                        </span>
                      </div>

                      <div className="h-2 bg-slate-100 rounded-full mt-2">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                skill.score ||
                                  0,
                                0
                              ),
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <p className="text-sm text-slate-400">
                No skills available.
              </p>
            )}
          </div>
        </div>

        {/* ==================================================
            PORTFOLIO PREVIEW
            ================================================== */}

        <div className="bg-white border rounded-2xl p-6 mt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <BriefcaseBusiness
                size={20}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Portfolio
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Projects and achievements relevant
                to the candidate.
              </p>
            </div>
          </div>

          {/* Existing portfolio preview */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-2">
                <BriefcaseBusiness
                  size={17}
                  className="text-blue-600"
                />

                <h3 className="font-semibold">
                  Data Analytics Dashboard
                </h3>
              </div>

              <p className="text-sm text-slate-500 mt-3">
                Interactive dashboard analyzing
                business performance using Python,
                SQL and Power BI.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-2.5 py-1 bg-slate-100 text-xs rounded-full">
                  Python
                </span>

                <span className="px-2.5 py-1 bg-slate-100 text-xs rounded-full">
                  SQL
                </span>

                <span className="px-2.5 py-1 bg-slate-100 text-xs rounded-full">
                  Power BI
                </span>
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="flex items-center gap-2">
                <Award
                  size={17}
                  className="text-blue-600"
                />

                <h3 className="font-semibold">
                  Data Science Certification
                </h3>
              </div>

              <p className="text-sm text-slate-500 mt-3">
                Certification demonstrating practical
                knowledge of data analysis and machine
                learning.
              </p>

              <button
                onClick={() =>
                  alert(
                    "Certificate preview will be connected later."
                  )
                }
                className="flex items-center gap-1 text-sm text-blue-600 mt-4"
              >
                View Certificate
                <ExternalLink
                  size={14}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            RECRUITMENT STATUS
            ================================================== */}

        <div className="bg-white border rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-semibold">
            Recruitment Status
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Track the candidate through your
            recruitment process.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              "Shortlisted",
              "Interview",
              "Selected",
              "Rejected",
            ].map((option) => (
              <button
                key={option}
                onClick={() =>
                  updateStatus(
                    option
                  )
                }
                disabled={
                  updatingStatus
                }
                className={`px-4 py-3 rounded-xl text-sm font-medium border ${
                  status === option
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                } ${
                  updatingStatus
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-5 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-400">
              Current Status
            </p>

            <p className="font-semibold mt-1">
              {status}
            </p>
          </div>
        </div>

        {/* ==================================================
            BOTTOM ACTIONS
            ================================================== */}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() =>
              navigate(
                `/industry/candidates/${opportunityId}`
              )
            }
            className="px-5 py-3 border bg-white rounded-lg font-medium hover:bg-slate-50"
          >
            Back
          </button>

          <button
            onClick={
              toggleShortlist
            }
            disabled={
              updatingStatus
            }
            className={`px-6 py-3 rounded-lg font-medium ${
              shortlisted
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } ${
              updatingStatus
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
          >
            {updatingStatus
              ? "Updating..."
              : shortlisted
              ? "Candidate Shortlisted"
              : "Shortlist Candidate"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfile;