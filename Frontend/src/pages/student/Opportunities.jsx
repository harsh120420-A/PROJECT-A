import StudentLayout from "../../layouts/StudentLayout";
import { opportunities } from "../../data/opportunities";
import {
  MapPin,
  Clock,
  BriefcaseBusiness
} from "lucide-react";
import { skills as studentSkills } from "../../data/skills";
import {
  calculateMatch,
  getMatchedSkills,
  getMissingSkills
} from "../../utils/matching";
import { applyToOpportunity } from "../../utils/application";

function Opportunities() {
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

        <div className="mt-8 space-y-5">

          {opportunities.map((job) => {

            const match = calculateMatch(
              studentSkills,
              job.skills
            );

            const matchedSkills = getMatchedSkills(
              studentSkills,
              job.skills
            );

            const missingSkills = getMissingSkills(
              studentSkills,
              job.skills
            );

            return (
              <div
                key={job.id}
                className="bg-white border rounded-2xl p-6 hover:border-blue-300 transition"
              >

                {/* Opportunity Header */}

                <div className="flex flex-col md:flex-row md:justify-between gap-5">

                  <div>

                    <h2 className="text-xl font-semibold">
                      {job.title}
                    </h2>

                    <p className="text-slate-500 mt-1">
                      {job.company}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">

                      <span className="flex items-center gap-1">
                        <MapPin size={16} />
                        {job.location}
                      </span>

                      <span className="flex items-center gap-1">
                        <BriefcaseBusiness size={16} />
                        {job.mode}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {job.duration}
                      </span>

                    </div>

                  </div>

                  {/* Skill Match */}

                  <div className="text-left md:text-right">

                    <p className="text-sm text-slate-500">
                      Skill Match
                    </p>

                    <p className="text-3xl font-bold text-green-600">
                      {match}%
                    </p>

                  </div>

                </div>

                {/* Required Skills */}

                <div className="mt-6">

                  <p className="text-sm font-medium">
                    Required Skills
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {job.skills.map((skill) => (

                      <span
                        key={skill}
                        className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full"
                      >
                        {skill}
                      </span>

                    ))}

                  </div>

                </div>

                {/* Why This Matches You */}

                <div className="mt-6">

                  <p className="text-sm font-medium">
                    Why this matches you
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {/* Matched Skills */}

                    {matchedSkills.map((skill) => (

                      <span
                        key={skill}
                        className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full"
                      >
                        ✓ {skill}
                      </span>

                    ))}

                    {/* Missing Skills */}

                    {missingSkills.map((skill) => (

                      <span
                        key={skill}
                        className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full"
                      >
                        ! {skill}
                      </span>

                    ))}

                  </div>

                </div>

                {/* Apply Button */}

                <div className="mt-6 flex justify-end">

                  <button
                    onClick={() => {

                      const success = applyToOpportunity(job);

                      if (success) {

                        alert(
                          "Application submitted successfully!"
                        );

                      } else {

                        alert(
                          "You have already applied for this opportunity."
                        );

                      }

                    }}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Apply Now
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