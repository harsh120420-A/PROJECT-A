import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Users,
  MapPin,
  ArrowRight
} from "lucide-react";

import { apiGet } from "../../services/api";


function CandidatesList() {

  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    async function loadOpportunities() {

      try {

        setLoading(true);
        setError("");

        const data =
          await apiGet("/industry/opportunities");

        setOpportunities(data || []);

      } catch (error) {

        console.error(
          "Failed to load opportunities:",
          error
        );

        setError(
          error.message ||
          "Failed to load opportunities."
        );

      } finally {

        setLoading(false);

      }

    }

    loadOpportunities();

  }, []);


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="bg-white border rounded-2xl p-10 text-center">

          <p className="text-slate-500">
            Loading opportunities...
          </p>

        </div>

      </div>
    );

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error) {

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="bg-white border rounded-2xl p-10 text-center max-w-md">

          <h1 className="text-2xl font-bold text-slate-900">
            Unable to Load Opportunities
          </h1>

          <p className="text-red-500 mt-3">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/industry/dashboard")
            }
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );

  }


  return (

    <div className="min-h-screen bg-slate-50">


      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="bg-white border-b">

        <div className="px-8 py-6">

          <p className="text-sm text-blue-600 font-medium">
            INDUSTRY PORTAL
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Candidates
          </h1>

          <p className="text-slate-500 mt-2">
            Select an opportunity to view and evaluate its candidates.
          </p>

        </div>

      </div>


      <div className="p-8">


        {/* ==================================================
            EMPTY STATE
            ================================================== */}

        {opportunities.length === 0 ? (

          <div className="bg-white border border-dashed rounded-2xl p-12 text-center">

            <BriefcaseBusiness
              size={42}
              className="mx-auto text-slate-300"
            />

            <h2 className="text-lg font-semibold mt-4">
              No opportunities available
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Post an opportunity before viewing candidates.
            </p>

            <button
              onClick={() =>
                navigate("/industry/post-opportunity")
              }
              className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Post Opportunity
            </button>

          </div>

        ) : (

          <div className="space-y-5">

            {opportunities.map((opportunity) => (

              <div
                key={opportunity.id}
                className="bg-white border rounded-2xl p-6"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">


                  {/* Opportunity information */}

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                        <BriefcaseBusiness size={20} />

                      </div>

                      <div>

                        <h2 className="text-lg font-semibold text-slate-900">
                          {opportunity.title}
                        </h2>

                        <p className="text-sm text-slate-500">
                          {opportunity.type}
                        </p>

                      </div>

                    </div>


                    <div className="flex flex-wrap gap-5 mt-4 text-sm text-slate-500">

                      <span className="flex items-center gap-1">

                        <MapPin size={15} />

                        {opportunity.location ||
                          "Location not specified"}

                      </span>


                      <span className="flex items-center gap-1">

                        <Users size={15} />

                        {opportunity.candidates || 0}
                        {" "}Candidates

                      </span>


                      <span>

                        {opportunity.applications || 0}
                        {" "}Applications

                      </span>

                    </div>


                    {/* Skills */}

                    <div className="flex flex-wrap gap-2 mt-4">

                      {(opportunity.skills || []).map(
                        (skill) => (

                          <span
                            key={skill}
                            className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  </div>


                  {/* Action */}

                  <button
                    onClick={() =>
                      navigate(
                        `/industry/candidates/${opportunity.id}`
                      )
                    }
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >

                    View Candidates

                    <ArrowRight size={16} />

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}

export default CandidatesList;