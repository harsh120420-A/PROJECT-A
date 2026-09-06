import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { apiGet, apiPost } from "../../services/api";

const levels = [
  {
    label: "Beginner",
    score: 30,
  },
  {
    label: "Intermediate",
    score: 60,
  },
  {
    label: "Advanced",
    score: 90,
  },
];

function Assessment() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoading(true);
        setError("");

        const data = await apiGet("/student/skills/catalog");

        setSkills(data);
      } catch (err) {
        console.error("Skill catalog error:", err);

        setError(err.message || "Unable to load assessment skills.");
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  function handleChange(skill, score) {
    setAnswers({
      ...answers,
      [skill]: score,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (Object.keys(answers).length !== skills.length) {
      alert("Please answer all questions before submitting.");

      return;
    }

    try {
      await apiPost("/student/assessment", {
        answers: answers,
      });

      navigate("/skills");
    } catch (err) {
      console.error("Assessment submission error:", err);

      alert(err.message || "Unable to submit assessment.");
    }
  }

  return (
  <StudentLayout>
    <div className="p-8">

      <p className="text-sm text-blue-600 font-medium">
        SKILL ASSESSMENT
      </p>

      <h1 className="text-3xl font-bold text-slate-900 mt-2">
        Skill Assessment
      </h1>

      <p className="text-slate-500 mt-2">
        Rate your current confidence level for each skill.
      </p>


      {/* Loading */}

      {loading && (
        <div className="mt-8 bg-white border rounded-2xl p-6">
          <p className="text-slate-500">
            Loading assessment...
          </p>
        </div>
      )}


      {/* Error */}

      {!loading && error && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6">

          <p className="text-red-600 font-medium">
            Unable to load assessment
          </p>

          <p className="text-sm text-red-500 mt-1">
            {error}
          </p>

        </div>
      )}


      {/* Assessment */}

      {!loading && !error && skills.length > 0 && (

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {skills.map((skill, index) => (

            <div
              key={skill.id}
              className="bg-white border rounded-2xl p-6"
            >

              <div className="flex justify-between items-start mb-5">

                <div>

                  <p className="text-sm text-blue-600 font-medium">
                    {skill.category}
                  </p>

                  <h2 className="text-lg font-semibold mt-1">
                    {index + 1}. How comfortable are you with{" "}
                    {skill.name}?
                  </h2>

                </div>


                {answers[skill.name] && (
                  <span className="text-sm font-medium text-blue-600">
                    {answers[skill.name]}%
                  </span>
                )}

              </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {levels.map((level) => (

                  <label
                    key={level.label}
                    className={`border rounded-xl p-4 cursor-pointer transition ${
                      answers[skill.name] === level.score
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >

                    <input
                      type="radio"
                      name={skill.name}
                      value={level.score}
                      checked={
                        answers[skill.name] === level.score
                      }
                      onChange={() =>
                        handleChange(
                          skill.name,
                          level.score
                        )
                      }
                      className="mr-3"
                    />

                    <span className="font-medium">
                      {level.label}
                    </span>

                    <p className="text-xs text-slate-500 mt-1 ml-6">
                      {level.score}% skill level
                    </p>

                  </label>

                ))}

              </div>

            </div>

          ))}


          {/* Submit */}

          <div className="flex justify-end">

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Submit Assessment
            </button>

          </div>

        </form>

      )}


      {/* No skills */}

      {!loading && !error && skills.length === 0 && (

        <div className="mt-8 bg-white border rounded-2xl p-6">

          <p className="text-slate-500">
            No skills are currently available for assessment.
          </p>

        </div>

      )}

    </div>
  </StudentLayout>
);
}

export default Assessment;
