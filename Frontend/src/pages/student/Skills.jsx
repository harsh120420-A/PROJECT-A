import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { apiGet } from "../../services/api";

function Skills() {

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    async function loadSkills() {

      try {

        setLoading(true);
        setError("");

        const data = await apiGet(
          "/student/skills"
        );

        setSkills(data);

      } catch (err) {

        console.error(
          "Skills error:",
          err
        );

        setError(
          err.message ||
          "Unable to load your skills."
        );

      } finally {

        setLoading(false);

      }
    }

    loadSkills();

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


        {/* Loading */}

        {loading && (

          <div className="mt-8">

            <p className="text-slate-500">
              Loading your skills...
            </p>

          </div>

        )}


        {/* Error */}

        {!loading && error && (

          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5">

            <p className="text-red-600 font-medium">
              Unable to load skills
            </p>

            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>

          </div>

        )}


        {/* Skills */}

        {!loading && !error && (

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">

            {skills.length > 0 ? (

              skills.map((skill) => (

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
                      {skill.score ?? 0}%
                    </span>

                  </div>


                  <div className="mt-5 h-2 bg-slate-100 rounded-full">

                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{
                        width: `${skill.score ?? 0}%`,
                      }}
                    />

                  </div>

                </div>

              ))

            ) : (

              <div className="md:col-span-2 bg-white border rounded-2xl p-6">

                <p className="text-slate-500">
                  No skills have been added yet.
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  Complete the assessment to build your skill profile.
                </p>

              </div>

            )}

          </div>

        )}


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