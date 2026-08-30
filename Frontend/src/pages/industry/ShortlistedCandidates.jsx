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

import { candidates } from "../../data/candidates";

function ShortlistedCandidates() {

  const navigate = useNavigate();

  const [shortlisted, setShortlisted] =
    useState([]);


  useEffect(() => {

    const selected = [];


    candidates.forEach(
      (candidate) => {

        Object.keys(localStorage)
          .filter((key) =>
            key.startsWith("shortlisted_")
          )
          .forEach((key) => {

            const value =
              localStorage.getItem(key);

            if (value !== "true") {
              return;
            }


            const parts =
              key.split("_");


            const candidateId =
              parts[2];


            if (
              candidateId ===
              candidate.id.toString()
            ) {

              selected.push(candidate);

            }

          });

      }
    );


    const uniqueCandidates =
      selected.filter(
        (candidate, index, array) =>
          array.findIndex(
            (item) =>
              item.id === candidate.id
          ) === index
      );


    setShortlisted(
      uniqueCandidates
    );

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
                  key={candidate.id}
                  className="bg-white border rounded-2xl p-6"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div className="flex items-center gap-4">

                      <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
                        {candidate.name
                          .charAt(0)
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
                          {candidate.degree} •{" "}
                          {candidate.branch}
                        </p>

                      </div>

                    </div>


                    <button
                      onClick={() =>
                        navigate(
                          `/industry/candidate/${candidate.id}`
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
                          Graduation
                        </p>

                        <p className="text-sm font-medium">
                          {candidate.graduationYear}
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