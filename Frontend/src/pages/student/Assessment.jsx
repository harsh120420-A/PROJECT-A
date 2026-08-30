import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { saveAssessmentResults } from "../../utils/storage";

const questions = [
  {
    id: 1,
    skill: "Python",
    category: "Technical",
    question: "How comfortable are you with Python?",
  },
  {
    id: 2,
    skill: "SQL",
    category: "Technical",
    question: "How comfortable are you with SQL?",
  },
  {
    id: 3,
    skill: "Machine Learning",
    category: "Technical",
    question: "How comfortable are you with Machine Learning?",
  },
  {
    id: 4,
    skill: "Power BI",
    category: "Technical",
    question: "How comfortable are you with Power BI?",
  },
  {
    id: 5,
    skill: "Communication",
    category: "Soft Skill",
    question: "How confident are you in communication?",
  },
];

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
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});

  function handleChange(skill, score) {
    setAnswers({
      ...answers,
      [skill]: score,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    saveAssessmentResults(answers);

    navigate("/skills");
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

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white border rounded-2xl p-6"
            >

              <div className="flex justify-between items-start mb-5">

                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    {question.category}
                  </p>

                  <h2 className="text-lg font-semibold mt-1">
                    {index + 1}. {question.question}
                  </h2>
                </div>

                {answers[question.skill] && (
                  <span className="text-sm font-medium text-blue-600">
                    {answers[question.skill]}%
                  </span>
                )}

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {levels.map((level) => (
                  <label
                    key={level.label}
                    className={`border rounded-xl p-4 cursor-pointer transition ${
                      answers[question.skill] === level.score
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >

                    <input
                      type="radio"
                      name={question.skill}
                      value={level.score}
                      checked={
                        answers[question.skill] === level.score
                      }
                      onChange={() =>
                        handleChange(
                          question.skill,
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Submit Assessment
            </button>
          </div>

        </form>

      </div>
    </StudentLayout>
  );
}

export default Assessment;