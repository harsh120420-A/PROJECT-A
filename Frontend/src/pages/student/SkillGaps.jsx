import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { skills as defaultSkills } from "../../data/skills";
import { getAssessmentResults } from "../../utils/storage";

function SkillGaps() {
  const [skills, setSkills] = useState(defaultSkills);

  useEffect(() => {
    const results = getAssessmentResults();

    if (!results) {
      return;
    }

    const updatedSkills = defaultSkills.map((skill) => ({
      ...skill,
      score:
        results[skill.name] !== undefined
          ? results[skill.name]
          : skill.score,
    }));

    setSkills(updatedSkills);
  }, []);

  const strengths = skills.filter(
    (skill) => skill.score >= 70
  );

  const developing = skills.filter(
    (skill) => skill.score >= 50 && skill.score < 70
  );

  const gaps = skills.filter(
    (skill) => skill.score < 50
  );

  return (
    <StudentLayout>
      <div className="p-8">

        <p className="text-sm text-blue-600 font-medium">
          SKILL ANALYSIS
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-2">
          Skill Gap Analysis
        </h1>

        <p className="text-slate-500 mt-2">
          Understand your strengths and identify the skills you should improve.
        </p>

        {/* Summary */}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Strong Skills
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {strengths.length}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Developing
            </p>

            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {developing.length}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-sm text-slate-500">
              Skill Gaps
            </p>

            <p className="text-3xl font-bold text-red-500 mt-2">
              {gaps.length}
            </p>
          </div>

        </div>

        {/* Strengths */}

        <section className="mt-10">

          <h2 className="text-xl font-semibold">
            Your Strengths
          </h2>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

            {strengths.map((skill) => (
              <div
                key={skill.id}
                className="bg-white border rounded-xl p-5"
              >

                <div className="flex justify-between">

                  <span className="font-medium">
                    {skill.name}
                  </span>

                  <span className="font-semibold text-green-600">
                    {skill.score}%
                  </span>

                </div>

                <div className="mt-3 h-2 bg-slate-100 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>

              </div>
            ))}

          </div>

        </section>

        {/* Developing */}

        {developing.length > 0 && (
          <section className="mt-10">

            <h2 className="text-xl font-semibold">
              Skills to Develop
            </h2>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              {developing.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-white border rounded-xl p-5"
                >

                  <div className="flex justify-between">

                    <span className="font-medium">
                      {skill.name}
                    </span>

                    <span className="font-semibold text-yellow-500">
                      {skill.score}%
                    </span>

                  </div>

                  <div className="mt-3 h-2 bg-slate-100 rounded-full">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>

                </div>
              ))}

            </div>

          </section>
        )}

        {/* Gaps */}

        <section className="mt-10">

          <h2 className="text-xl font-semibold">
            Priority Skill Gaps
          </h2>

          {gaps.length === 0 ? (

            <div className="mt-4 bg-white border rounded-xl p-6">
              <p className="text-green-600 font-medium">
                Excellent!
              </p>

              <p className="text-slate-500 mt-1">
                You currently don't have any critical skill gaps.
              </p>
            </div>

          ) : (

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              {gaps.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-white border border-red-100 rounded-xl p-5"
                >

                  <div className="flex justify-between">

                    <div>
                      <span className="font-medium">
                        {skill.name}
                      </span>

                      <p className="text-sm text-slate-500 mt-1">
                        {skill.category}
                      </p>
                    </div>

                    <span className="font-semibold text-red-500">
                      {skill.score}%
                    </span>

                  </div>

                  <div className="mt-3 h-2 bg-slate-100 rounded-full">
                    <div
                      className="h-full bg-red-400 rounded-full"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>

                  <p className="text-sm text-slate-500 mt-3">
                    Recommended priority for improvement.
                  </p>

                </div>
              ))}

            </div>

          )}

        </section>

      </div>
    </StudentLayout>
  );
}

export default SkillGaps;