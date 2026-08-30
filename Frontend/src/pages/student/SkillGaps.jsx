import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { apiGet } from "../../services/api";

function SkillGaps() {

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================================
  // LOAD SKILLS FROM BACKEND
  // ==========================================================

  useEffect(() => {

    async function loadSkills() {

      try {

        setLoading(true);
        setError("");

        const data = await apiGet(
          "/student/skills"
        );

        setSkills(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          "Skill gaps error:",
          err
        );

        setError(
          err.message ||
          "Unable to load your skill analysis."
        );

      } finally {

        setLoading(false);

      }
    }

    loadSkills();

  }, []);


  // ==========================================================
  // CLASSIFY SKILLS
  // ==========================================================

  const strengths = skills.filter(
    (skill) => (skill.score ?? 0) >= 70
  );

  const developing = skills.filter(
    (skill) =>
      (skill.score ?? 0) >= 50 &&
      (skill.score ?? 0) < 70
  );

  const gaps = skills.filter(
    (skill) => (skill.score ?? 0) < 50
  );


  // ==========================================================
  // PAGE
  // ==========================================================

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


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div className="mt-8">

            <p className="text-slate-500">
              Loading your skill analysis...
            </p>

          </div>

        )}


        {/* ==================================================
            ERROR
        ================================================== */}

        {!loading && error && (

          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5">

            <p className="text-red-600 font-medium">
              Unable to load skill analysis
            </p>

            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>

          </div>

        )}


        {/* ==================================================
            CONTENT
        ================================================== */}

        {!loading && !error && (

          <>

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


            {/* ==================================================
                NO SKILLS
            ================================================== */}

            {skills.length === 0 && (

              <div className="mt-10 bg-white border rounded-2xl p-6">

                <p className="font-medium text-slate-800">
                  No skill data available yet.
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Complete the assessment to build your skill profile.
                </p>

              </div>

            )}


            {/* ==================================================
                STRENGTHS
            ================================================== */}

            {strengths.length > 0 && (

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
                          {skill.score ?? 0}%
                        </span>

                      </div>


                      <div className="mt-3 h-2 bg-slate-100 rounded-full">

                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{
                            width: `${skill.score ?? 0}%`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </section>

            )}


            {/* ==================================================
                DEVELOPING
            ================================================== */}

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
                          {skill.score ?? 0}%
                        </span>

                      </div>


                      <div className="mt-3 h-2 bg-slate-100 rounded-full">

                        <div
                          className="h-full bg-yellow-400 rounded-full"
                          style={{
                            width: `${skill.score ?? 0}%`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </section>

            )}


            {/* ==================================================
                GAPS
            ================================================== */}

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
                          {skill.score ?? 0}%
                        </span>

                      </div>


                      <div className="mt-3 h-2 bg-slate-100 rounded-full">

                        <div
                          className="h-full bg-red-400 rounded-full"
                          style={{
                            width: `${skill.score ?? 0}%`,
                          }}
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

          </>

        )}

      </div>

    </StudentLayout>
  );
}

export default SkillGaps;