import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Star,
  Mail,
  GraduationCap,
  BriefcaseBusiness,
  ChevronRight,
  UserRound
} from "lucide-react";

import { apiGet } from "../../services/api";


function ShortlistedCandidates() {
  const navigate = useNavigate();

  const [shortlisted, setShortlisted] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
   * Load shortlisted candidates
   * from backend
   */
  useEffect(() => {
    async function loadShortlisted() {
      try {
        setLoading(true);
        setError("");

        const data =
          await apiGet("/industry/shortlisted");

        /*
         * Backend returns shortlisted
         * applications/candidates.
         *
         * Convert the response into
         * the structure expected by
         * the existing UI.
         */
        const mappedCandidates =
          (data || []).map((item) => ({
            id:
              item.student_id,

            name:
              item.name,

            email:
              item.email,

            careerGoal:
              item.career_goal ||
              "Not specified",

            readiness:
              item.readiness ||
              "Not specified",

            applicationId:
              item.application_id,

            opportunityId:
              item.opportunity_id,

            opportunityTitle:
              item.opportunity_title,

            status:
              item.status
          }));

        setShortlisted(
          mappedCandidates
        );

      } catch (err) {
        console.error(
          "Failed to load shortlisted candidates:",
          err
        );

        setError(
          err.message ||
            "Failed to load shortlisted candidates."
        );
      } finally {
        setLoading(false);
      }
    }

    loadShortlisted();
  }, []);


  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="bg-white border rounded-2xl p-10 text-center">

          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-slate-500 mt-4">
            Loading shortlisted candidates...
          </p>

        </div>

      </div>
    );
  }


  /*
   * Error state
   */
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="bg-white border-b">

          <div className="px-8 py-6">

            <p className="text-sm text-blue-600 font-medium">
              INDUSTRY PORTAL
            </p>

            <h1 className="text-3xl font-bold text-slate-900 mt-2">
              Shortlisted Candidates
            </h1>

          </div>

        </div>


        <div className="p-8">

          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">

            <h2 className="text-xl font-semibold text-red-600">
              Unable to load candidates
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <div className="bg-white border-b">

        <div className="px-8 py-6">

          <p className="text-sm text-blue-600 font-medium">
            INDUSTRY PORTAL
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Shortlisted Candidates
          </h1>

          <p className="text-slate-500 mt-2">
            Candidates your organization has shortlisted.
          </p>

        </div>

      </div>


      <div className="p-8">

        {shortlisted.length === 0 ? (

          <div className="bg-white border border-dashed rounded-2xl p-12 text-center">

            <Star
              size={40}
              className="mx-auto text-slate-300"
            />

            <h2 className="text-xl font-semibold mt-4">
              No shortlisted candidates
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Shortlist candidates from the matching page to see them here.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/industry/opportunities"
                )
              }
              className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              View Opportunities
            </button>

          </div>

        ) : (

          <div className="space-y-5">

            {shortlisted.map(
              (candidate) => (

                <div
                  key={candidate.applicationId}
                  className="bg-white border rounded-2xl p-6"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">

                        {candidate.name
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>


                      <div>

                        <div className="flex items-center gap-2">

                          <h2 className="text-xl font-semibold">
                            {candidate.name}
                          </h2>

                          <span className="flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-700 text-xs rounded-full">

                            <Star
                              size={12}
                              fill="currentColor"
                            />

                            Shortlisted

                          </span>

                        </div>


                        <p className="text-sm text-slate-500 mt-1">
                          Candidate
                        </p>

                      </div>

                    </div>


                    <button
                      onClick={() =>
                        navigate(
                          `/industry/candidates/${candidate.opportunityId}/${candidate.id}`
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50"
                    >

                      <UserRound size={15} />

                      View Profile

                      <ChevronRight size={15} />

                    </button>

                  </div>


                  {/* Candidate Information */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t">

                    <div className="flex items-center gap-3">

                      <GraduationCap
                        size={18}
                        className="text-slate-400"
                      />

                      <div>

                        <p className="text-xs text-slate-400">
                          Readiness
                        </p>

                        <p className="text-sm font-medium">
                          {candidate.readiness}
                        </p>

                      </div>

                    </div>


                    <div className="flex items-center gap-3">

                      <BriefcaseBusiness
                        size={18}
                        className="text-slate-400"
                      />

                      <div>

                        <p className="text-xs text-slate-400">
                          Career Goal
                        </p>

                        <p className="text-sm font-medium">
                          {candidate.careerGoal}
                        </p>

                      </div>

                    </div>


                    <div className="flex items-center gap-3">

                      <Mail
                        size={18}
                        className="text-slate-400"
                      />

                      <div>

                        <p className="text-xs text-slate-400">
                          Email
                        </p>

                        <p className="text-sm font-medium">
                          {candidate.email}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Opportunity */}

                  <div className="mt-5 pt-4 border-t">

                    <p className="text-xs text-slate-400">
                      Applied For
                    </p>

                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {candidate.opportunityTitle}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}


export default ShortlistedCandidates;