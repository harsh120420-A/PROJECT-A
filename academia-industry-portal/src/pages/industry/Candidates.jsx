import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  UserRound
} from "lucide-react";

import { candidates } from "../../data/candidates";

import {
  getIndustryOpportunities
} from "../../utils/storage";

import {
  calculateMatch,
  getMatchedSkills,
  getMissingSkills
} from "../../utils/matching";


function Candidates() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [opportunity, setOpportunity] =
    useState(null);

  const [rankedCandidates, setRankedCandidates] =
    useState([]);


  useEffect(() => {

    const opportunities =
      getIndustryOpportunities();

    const selectedOpportunity =
      opportunities.find(
        (item) =>
          item.id.toString() === id
      );

    if (!selectedOpportunity) {
      return;
    }

    setOpportunity(selectedOpportunity);


    const ranked =
      candidates
        .map((candidate) => {

          const requiredSkills =
  selectedOpportunity.skillRequirements ||
  selectedOpportunity.skills ||
  [];

const match =
  calculateMatch(
    candidate.skills,
    requiredSkills
  );

          const matchedSkills =
  getMatchedSkills(
    candidate.skills,
    requiredSkills
  );

          const missingSkills =
  getMissingSkills(
    candidate.skills,
    requiredSkills
  );

          return {
            ...candidate,
            match,
            matchedSkills,
            missingSkills
          };

        })
        .sort(
          (a, b) =>
            b.match - a.match
        );


    setRankedCandidates(ranked);

  }, [id]);


  if (!opportunity) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="bg-white border rounded-2xl p-10 text-center">

          <h1 className="text-2xl font-bold">
            Opportunity Not Found
          </h1>

          <p className="text-slate-500 mt-2">
            The opportunity could not be found.
          </p>

          <button
            onClick={() =>
              navigate(
                "/industry/opportunities"
              )
            }
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg"
          >
            Back to Opportunities
          </button>

        </div>

      </div>

    );
  }


  return (

    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <div className="bg-white border-b">

        <div className="px-8 py-6">

          <button
            onClick={() =>
              navigate(
                "/industry/opportunities"
              )
            }
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

        {/* Opportunity Summary */}

        <div className="bg-white border rounded-2xl p-6">

          <div className="flex flex-col md:flex-row md:justify-between gap-5">

            <div>

              <h2 className="text-xl font-semibold">
                {opportunity.title}
              </h2>

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


            <div>

              <p className="text-sm text-slate-500">
                Required Skills
              </p>

              <div className="flex flex-wrap gap-2 mt-2">

                {(
  opportunity.skillRequirements ||
  (opportunity.skills || []).map(
    (skill) => ({
      name: skill,
      requiredScore: 50
    })
  )
).map(
  (skill) => (

    <span
      key={skill.name}
      className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
    >
      {skill.name} • {skill.requiredScore}%
    </span>

  )
)}

              </div>

            </div>

          </div>

        </div>


        {/* Candidate Count */}

        <div className="mt-6">

          <p className="text-sm text-slate-500">
            {rankedCandidates.length} candidates analyzed
          </p>

        </div>


        {/* Candidates */}

        <div className="mt-4 space-y-5">

          {rankedCandidates.map(
            (candidate, index) => (

              <div
                key={candidate.id}
                className="bg-white border rounded-2xl p-6"
              >

                {/* Candidate Header */}

                <div className="flex flex-col md:flex-row md:justify-between gap-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      {candidate.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>


                    <div>

                      <div className="flex items-center gap-3">

                        <h2 className="text-lg font-semibold">
                          {candidate.name}
                        </h2>

                        {index === 0 && (

                          <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs rounded-full">
                            Top Match
                          </span>

                        )}

                      </div>


                      <p className="text-sm text-slate-500 mt-1">
                        {candidate.degree} •{" "}
                        {candidate.branch}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {candidate.careerGoal}
                      </p>

                    </div>

                  </div>


                  {/* Match Score */}

                  <div className="text-left md:text-right">

                    <p className="text-sm text-slate-500">
                      Skill Match
                    </p>

                    <p
                      className={`text-3xl font-bold mt-1 ${
                        candidate.match >= 75
                          ? "text-green-600"
                          : candidate.match >= 50
                          ? "text-yellow-600"
                          : "text-red-500"
                      }`}
                    >
                      {candidate.match}%
                    </p>

                  </div>

                </div>


                {/* Match Progress */}

                <div className="mt-5">

                  <div className="h-2 bg-slate-100 rounded-full">

                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${candidate.match}%`
                      }}
                    />

                  </div>

                </div>


                {/* Skills */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                  {/* Matched */}

                  <div>

                    <div className="flex items-center gap-2">

                      <CheckCircle
                        size={17}
                        className="text-green-600"
                      />

                      <p className="text-sm font-medium">
                        Matching Skills
                      </p>

                    </div>


                    <div className="flex flex-wrap gap-2 mt-3">

                      {candidate.matchedSkills.length > 0 ? (

                        candidate.matchedSkills.map(
                          (skill) => (

                            <span
                              key={skill}
                              className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                            >
                              ✓ {skill}
                            </span>

                          )
                        )

                      ) : (

                        <p className="text-sm text-slate-400">
                          No strong skill matches.
                        </p>

                      )}

                    </div>

                  </div>


                  {/* Missing */}

                  <div>

                    <div className="flex items-center gap-2">

                      <AlertCircle
                        size={17}
                        className="text-red-500"
                      />

                      <p className="text-sm font-medium">
                        Skill Gaps
                      </p>

                    </div>


                    <div className="flex flex-wrap gap-2 mt-3">

                      {candidate.missingSkills.length > 0 ? (

                        candidate.missingSkills.map(
                          (skill) => (

                            <span
                              key={skill}
                              className="px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full"
                            >
                              ! {skill}
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


                {/* Actions */}

                <div className="flex justify-end gap-3 mt-6 pt-5 border-t">

                  <button
  onClick={() =>
    navigate(
      `/industry/candidates/${opportunity.id}/${candidate.id}`
    )
  }
  className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-slate-50"
>
  <UserRound size={15} />
  View Profile
</button>


                  <button
                    onClick={() =>
                      alert(
                        `${candidate.name} has been shortlisted.`
                      )
                    }
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Shortlist
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );
}

export default Candidates;