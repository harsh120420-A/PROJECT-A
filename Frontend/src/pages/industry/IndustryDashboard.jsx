import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Users,
  FileText,
  TrendingUp,
  Plus,
  MapPin
} from "lucide-react";

import { defaultCompany } from "../../data/company";
import { useNavigate } from "react-router-dom";

import { apiGet } from "../../services/api";


function IndustryDashboard() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(
    defaultCompany
  );

  const [opportunities, setOpportunities] =
    useState([]);

  const [stats, setStats] =
  useState({
    active_opportunities: 0,
    total_opportunities: 0,
    total_applications: 0,
    total_candidates: 0,
    shortlisted_candidates: 0,
    selected_candidates: 0,
    average_match: 0
  });


  useEffect(() => {

  async function loadIndustryData() {

    try {

      const [
        opportunitiesData,
        statsData
      ] = await Promise.all([
        apiGet("/industry/opportunities"),
        apiGet("/industry/dashboard/stats")
      ]);

      setOpportunities(
        opportunitiesData
      );

      setStats(
        statsData
      );

    } catch (error) {

      console.error(
        "Failed to load industry dashboard:",
        error
      );

    }

  }

  loadIndustryData();

}, []);


  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <div className="bg-white border-b">

        <div className="px-8 py-6">

          <p className="text-sm text-blue-600 font-medium">
            INDUSTRY PORTAL
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Industry Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Manage opportunities and discover skilled candidates.
          </p>

        </div>

      </div>


      <div className="p-8">

        {/* Company Card */}

        <div className="bg-white border rounded-2xl p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                {company.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  {company.name}
                </h2>

                <p className="text-slate-500 mt-1">
                  {company.industry}
                </p>

                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin size={14} />
                  {company.location}
                </p>

              </div>

            </div>


            <button
  onClick={() =>
    navigate("/industry/post-opportunity")
  }
  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
>
  <Plus size={17} />
  Post Opportunity
</button>

          </div>

        </div>


        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

          <div className="bg-white border rounded-2xl p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm text-slate-500">
                  Active Opportunities
                </p>

                <p className="text-3xl font-bold mt-2">
                  {stats.active_opportunities}
                </p>

              </div>

              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BriefcaseBusiness size={20} />
              </div>

            </div>

          </div>


          <div className="bg-white border rounded-2xl p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm text-slate-500">
                  Applications
                </p>

                <p className="text-3xl font-bold mt-2">
                 {stats.total_applications}
                </p>

              </div>

              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <FileText size={20} />
              </div>

            </div>

          </div>


          <div className="bg-white border rounded-2xl p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm text-slate-500">
                  Candidates
                </p>

                <p className="text-3xl font-bold mt-2">
                  {stats.total_candidates}
                </p>

              </div>

              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users size={20} />
              </div>

            </div>

          </div>


          <div className="bg-white border rounded-2xl p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm text-slate-500">
                  Candidate Match
                </p>

                <p className="text-3xl font-bold mt-2">
                 {stats.average_match}%
                </p>

              </div>

              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp size={20} />
              </div>

            </div>

          </div>

        </div>


        {/* Opportunities */}

        <div className="mt-8 bg-white border rounded-2xl p-6">

          <div className="flex items-center justify-between">

  <div>

    <h2 className="text-xl font-semibold">
      Your Opportunities
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Manage your published opportunities.
    </p>

  </div>

  <button
    onClick={() =>
      navigate("/industry/opportunities")
    }
    className="text-sm text-blue-600 font-medium hover:text-blue-700"
  >
    View All
  </button>

</div>


          <div className="mt-6 space-y-4">

            {opportunities.length === 0 ? (

              <div className="border border-dashed rounded-xl p-10 text-center">

                <BriefcaseBusiness
                  size={36}
                  className="mx-auto text-slate-300"
                />

                <h3 className="font-semibold mt-4">
                  No opportunities yet
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Post your first opportunity to start discovering candidates.
                </p>

              </div>

            ) : (

              opportunities.map(
                (opportunity) => (

                  <div
                    key={opportunity.id}
                    className="border rounded-xl p-5"
                  >

                    <div className="flex flex-col md:flex-row md:justify-between gap-4">

                      <div>

                        <h3 className="text-lg font-semibold">
                          {opportunity.title}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {opportunity.location} •{" "}
                          {opportunity.mode}
                        </p>

                      </div>


                      <span className="self-start px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                        {opportunity.status || "Active"}
                      </span>

                    </div>


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


                    <div className="flex gap-6 mt-4 text-sm text-slate-500">

                      <span>
                        {opportunity.applications || 0} Applications
                      </span>

                      <span>
                        {opportunity.candidates || 0} Candidates
                      </span>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default IndustryDashboard;