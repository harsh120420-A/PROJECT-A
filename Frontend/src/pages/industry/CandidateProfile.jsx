import {
  getApplicationsForOpportunity,
  updateApplicationStatus
} from "../../utils/application";
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
  Star
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


function CandidateProfile() {

  const navigate = useNavigate();

  const { candidateId, opportunityId } =
    useParams();

  const [candidate, setCandidate] =
    useState(null);

  const [opportunity, setOpportunity] =
    useState(null);

  const [match, setMatch] =
    useState(0);

  const [matchedSkills, setMatchedSkills] =
    useState([]);

  const [missingSkills, setMissingSkills] =
    useState([]);

  const [shortlisted, setShortlisted] =
    useState(false);

  const [status, setStatus] =
    useState("Shortlisted");


  useEffect(() => {

    const selectedCandidate =
      candidates.find(
        (item) =>
          item.id.toString() === candidateId
      );

    const opportunities =
      getIndustryOpportunities();

    const selectedOpportunity =
      opportunities.find(
        (item) =>
          item.id.toString() === opportunityId
      );


    if (!selectedCandidate ||
        !selectedOpportunity) {

      return;

    }


    setCandidate(selectedCandidate);

    setOpportunity(selectedOpportunity);


    const candidateMatch =
      calculateMatch(
        selectedCandidate.skills,
        selectedOpportunity.skills
      );


    setMatch(candidateMatch);


    setMatchedSkills(
      getMatchedSkills(
        selectedCandidate.skills,
        selectedOpportunity.skills
      )
    );


    setMissingSkills(
      getMissingSkills(
        selectedCandidate.skills,
        selectedOpportunity.skills
      )
    );


    const shortlistKey =
      `shortlisted_${opportunityId}_${candidateId}`;

    const savedShortlist =
      localStorage.getItem(shortlistKey);

    setShortlisted(
      savedShortlist === "true"
    );

    const applications =
  getApplicationsForOpportunity(
    Number(opportunityId)
  );


const application =
  applications.find(
    (item) =>
      item.studentId ===
      selectedCandidate.id
  );


if (application) {

  setStatus(
    application.status
  );

  setShortlisted(
    application.status !==
      "Applied"
  );

} else {

  setStatus("Applied");

  setShortlisted(false);

}

  }, [
    candidateId,
    opportunityId
  ]);


  function toggleShortlist() {

  const applications =
    getApplicationsForOpportunity(
      Number(opportunityId)
    );


  const existingApplication =
    applications.find(
      (application) =>
        application.studentId ===
        candidate.id
    );


  if (shortlisted) {

    if (existingApplication) {

      updateApplicationStatus(
        existingApplication.id,
        "Applied"
      );

    }

    setShortlisted(false);

    setStatus("Applied");

    return;

  }


  if (existingApplication) {

    updateApplicationStatus(
      existingApplication.id,
      "Shortlisted"
    );

  } else {

    const newApplication = {

      id: Date.now(),

      opportunityId:
        Number(opportunityId),

      opportunityTitle:
        opportunity.title,

      company:
        opportunity.company ||
        "Industry Partner",

      studentId:
        candidate.id,

      status:
        "Shortlisted",

      appliedDate:
        new Date().toISOString(),

      updatedDate:
        new Date().toISOString(),

      matchScore:
        match

    };


    const existingApplications =
      JSON.parse(
        localStorage.getItem(
          "applications"
        ) || "[]"
      );


    localStorage.setItem(
      "applications",
      JSON.stringify([
        ...existingApplications,
        newApplication
      ])
    );

  }


  setShortlisted(true);

  setStatus("Shortlisted");

}

  function updateStatus(newStatus) {

  const key =
    `status_${opportunityId}_${candidateId}`;


  localStorage.setItem(
    key,
    newStatus
  );


  const applications =
    getApplicationsForOpportunity(
      Number(opportunityId)
    );


  const application =
    applications.find(
      (item) =>
        item.studentId ===
        candidate.id
    );


  if (application) {

    updateApplicationStatus(
      application.id,
      newStatus
    );

  }


  setStatus(newStatus);


  if (newStatus === "Shortlisted") {

    setShortlisted(true);

  } else {

    setShortlisted(
      newStatus !== "Applied"
    );

  }

}


  if (!candidate || !opportunity) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="bg-white border rounded-2xl p-10 text-center">

          <h1 className="text-2xl font-bold">
            Candidate Not Found
          </h1>

          <p className="text-slate-500 mt-2">
            The candidate or opportunity could not be found.
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


  return (

    <div className="min-h-screen bg-slate-50">

      {/* Header */}

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

        {/* Profile Summary */}

        <div className="bg-white border rounded-2xl p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
                {candidate.name
                  .charAt(0)
                  .toUpperCase()}
              </div>


              <div>

                <h2 className="text-2xl font-semibold">
                  {candidate.name}
                </h2>

                <p className="text-slate-500 mt-1">
                  {candidate.degree} •{" "}
                  {candidate.branch}
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Graduation Year:{" "}
                  {candidate.graduationYear}
                </p>

              </div>

            </div>


            <button
              onClick={toggleShortlist}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium ${
                shortlisted
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
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

              {shortlisted
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
                  {candidate.degree}
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


        {/* Match Overview */}

        <div className="bg-white border rounded-2xl p-6 mt-6">

          <div className="flex flex-col md:flex-row md:justify-between gap-6">

            <div>

              <h2 className="text-xl font-semibold">
                Opportunity Match
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Skill compatibility with {opportunity.title}.
              </p>

            </div>


            <div className="text-left md:text-right">

              <p className="text-sm text-slate-500">
                Overall Match
              </p>

              <p
                className={`text-4xl font-bold ${
                  match >= 75
                    ? "text-green-600"
                    : match >= 50
                    ? "text-yellow-600"
                    : "text-red-500"
                }`}
              >
                {match}%
              </p>

            </div>

          </div>


          <div className="mt-5">

            <div className="h-3 bg-slate-100 rounded-full">

              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${match}%`
                }}
              />

            </div>

          </div>


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

                {matchedSkills.length > 0 ? (

                  matchedSkills.map(
                    (skill) => (

                      <span
                        key={skill}
                        className="px-3 py-2 bg-green-50 text-green-700 text-sm rounded-full"
                      >
                        ✓ {skill}
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

                {missingSkills.length > 0 ? (

                  missingSkills.map(
                    (skill) => (

                      <span
                        key={skill}
                        className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded-full"
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

        </div>


        {/* Skills Breakdown */}

        <div className="bg-white border rounded-2xl p-6 mt-6">

          <h2 className="text-xl font-semibold">
            Skills Breakdown
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Current proficiency across the candidate's skills.
          </p>


          <div className="mt-6 space-y-5">

            {candidate.skills.map(
              (skill) => {

                const isRequired =
                  opportunity.skills.some(
                    (requiredSkill) =>
                      requiredSkill
                        .toLowerCase()
                        .trim() ===
                      skill.name
                        .toLowerCase()
                        .trim()
                  );


                return (

                  <div key={skill.name}>

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
                          width: `${skill.score}%`
                        }}
                      />

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>


        {/* Portfolio Preview */}

        <div className="bg-white border rounded-2xl p-6 mt-6">

          <div className="flex items-center gap-3">

            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <BriefcaseBusiness size={20} />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Portfolio
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Projects and achievements relevant to the candidate.
              </p>

            </div>

          </div>


          {/* Demo Portfolio */}

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
                Interactive dashboard analyzing business performance using Python, SQL and Power BI.
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
                Certification demonstrating practical knowledge of data analysis and machine learning.
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
                <ExternalLink size={14} />
              </button>

            </div>

          </div>

        </div>

                {/* Recruitment Status */}

<div className="bg-white border rounded-2xl p-6 mt-6">

  <h2 className="text-xl font-semibold">
    Recruitment Status
  </h2>

  <p className="text-sm text-slate-500 mt-1">
    Track the candidate through your recruitment process.
  </p>


  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

    {[
      "Shortlisted",
      "Interview",
      "Selected",
      "Rejected"
    ].map((option) => (

      <button
        key={option}
        onClick={() =>
          updateStatus(option)
        }
        className={`px-4 py-3 rounded-xl text-sm font-medium border ${
          status === option
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-slate-600 hover:bg-slate-50"
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
        {/* Bottom Actions */}

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
            onClick={toggleShortlist}
            className={`px-6 py-3 rounded-lg font-medium ${
              shortlisted
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {shortlisted
              ? "Candidate Shortlisted"
              : "Shortlist Candidate"}
          </button>

        </div>

      </div>

    </div>

  );
}

export default CandidateProfile;