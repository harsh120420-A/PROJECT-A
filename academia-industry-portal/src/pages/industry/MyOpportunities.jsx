import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  MapPin,
  Clock,
  Search,
  Pencil,
  XCircle,
  CheckCircle,
  Users
} from "lucide-react";

import {
  getIndustryOpportunities,
  saveIndustryOpportunities
} from "../../utils/storage";

function MyOpportunities() {

  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");


  useEffect(() => {

    const storedOpportunities =
      getIndustryOpportunities();

    setOpportunities(storedOpportunities);

  }, []);


  function updateOpportunities(updated) {

    setOpportunities(updated);

    saveIndustryOpportunities(updated);

  }


  function toggleStatus(id) {

    const updated = opportunities.map(
      (opportunity) => {

        if (opportunity.id !== id) {
          return opportunity;
        }

        return {
          ...opportunity,
          status:
            opportunity.status === "Closed"
              ? "Active"
              : "Closed"
        };

      }
    );

    updateOpportunities(updated);

  }


  const filteredOpportunities =
    opportunities.filter((opportunity) => {

      const matchesSearch =
        opportunity.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        opportunity.location
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        opportunity.status === filter;

      return matchesSearch && matchesFilter;

    });


  return (

    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <div className="bg-white border-b">

        <div className="px-8 py-6">

          <p className="text-sm text-blue-600 font-medium">
            INDUSTRY PORTAL
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            My Opportunities
          </h1>

          <p className="text-slate-500 mt-2">
            Manage the opportunities posted by your organization.
          </p>

        </div>

      </div>


      <div className="p-8">

        {/* Controls */}

        <div className="bg-white border rounded-2xl p-5">

          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

            <div className="relative flex-1 max-w-xl">

              <Search
                size={18}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search opportunities..."
                className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            <div className="flex gap-2">

              {["All", "Active", "Closed"].map(
                (option) => (

                  <button
                    key={option}
                    onClick={() =>
                      setFilter(option)
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      filter === option
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {option}
                  </button>

                )
              )}

            </div>

          </div>

        </div>


        {/* Opportunity List */}

        <div className="mt-6 space-y-5">

          {filteredOpportunities.length === 0 ? (

            <div className="bg-white border border-dashed rounded-2xl p-12 text-center">

              <BriefcaseBusiness
                size={40}
                className="mx-auto text-slate-300"
              />

              <h2 className="font-semibold text-lg mt-4">
                No opportunities found
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Try changing your search or create a new opportunity.
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

            filteredOpportunities.map(
              (opportunity) => (

                <div
                  key={opportunity.id}
                  className="bg-white border rounded-2xl p-6"
                >

                  {/* Top */}

                  <div className="flex flex-col md:flex-row md:justify-between gap-5">

                    <div>

                      <div className="flex items-center gap-3">

                        <h2 className="text-xl font-semibold">
                          {opportunity.title}
                        </h2>

                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            opportunity.status === "Closed"
                              ? "bg-slate-100 text-slate-500"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {opportunity.status || "Active"}
                        </span>

                      </div>


                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">

                        <span className="flex items-center gap-1">
                          <MapPin size={15} />
                          {opportunity.location}
                        </span>

                        <span className="flex items-center gap-1">
                          <BriefcaseBusiness size={15} />
                          {opportunity.mode}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock size={15} />
                          {opportunity.duration}
                        </span>

                      </div>

                    </div>


                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          navigate(
                            `/industry/opportunities/${opportunity.id}/edit`
                          )
                        }
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>


                      <button
                        onClick={() =>
                          toggleStatus(opportunity.id)
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                          opportunity.status === "Closed"
                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >

                        {opportunity.status === "Closed" ? (
                          <>
                            <CheckCircle size={15} />
                            Reopen
                          </>
                        ) : (
                          <>
                            <XCircle size={15} />
                            Close
                          </>
                        )}

                      </button>

                    </div>

                  </div>


                  {/* Description */}

                  <p className="text-sm text-slate-500 mt-5 max-w-4xl">
                    {opportunity.description}
                  </p>


                  {/* Skills */}

                  <div className="mt-5">

                    <p className="text-sm font-medium">
                      Required Skills
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">

                      {(opportunity.skills || []).map(
                        (skill) => (

                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  </div>


                  {/* Bottom Stats */}

                  <div className="flex flex-wrap items-center gap-6 mt-6 pt-5 border-t">

                    <div className="flex items-center gap-2 text-sm text-slate-500">

                      <BriefcaseBusiness size={16} />

                      <span>
                        {opportunity.type}
                      </span>

                    </div>


                    <div className="flex items-center gap-2 text-sm text-slate-500">

                      <Users size={16} />

                      <span>
                        {opportunity.applications || 0}
                        {" "}
                        Applications
                      </span>

                    </div>


                    <div className="flex items-center gap-2 text-sm text-slate-500">

                      <Users size={16} />

                      <span>
                        {opportunity.candidates || 0}
                        {" "}
                        Matched Candidates
                      </span>

                    </div>


                    <div className="ml-auto">

                      <button
                        onClick={() =>
                          navigate(
                            `/industry/candidates/${opportunity.id}`
                          )
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        View Candidates
                      </button>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

    </div>

  );
}

export default MyOpportunities;