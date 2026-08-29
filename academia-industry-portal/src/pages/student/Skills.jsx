import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { skills as defaultSkills } from "../../data/skills";
import { getAssessmentResults } from "../../utils/storage";

function Skills() {
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

  return (
    <StudentLayout>
      <div className="p-8">

        <p className="text-sm text-blue-600 font-medium">
          SKILL PROFILE
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-2">
          My Skills
        </h1>

        <p className="text-slate-500 mt-2">
          Your current technical and soft skill levels.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">

          {skills.map((skill) => (
            <div
              key={skill.id}
              className="bg-white border rounded-2xl p-6"
            >

              <div className="flex justify-between items-center">

                <div>
                  <h2 className="font-semibold text-lg">
                    {skill.name}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {skill.category}
                  </p>
                </div>

                <span className="text-xl font-bold text-blue-600">
                  {skill.score}%
                </span>

              </div>

              <div className="mt-5 h-2 bg-slate-100 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${skill.score}%` }}
                />
              </div>

            </div>
          ))}

        </div>

        <div className="mt-8">
          <p className="text-sm text-slate-500">
            Complete the assessment again anytime to update your skill profile.
          </p>
        </div>

      </div>
    </StudentLayout>
  );
}

export default Skills;