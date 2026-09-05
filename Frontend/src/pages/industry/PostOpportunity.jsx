import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  MapPin,
  Clock,
  Plus,
  X
} from "lucide-react";

import { apiPost } from "../../services/api";


// ============================================================
// DATABASE SKILL IDs
// ============================================================

const SKILL_ID_MAP = {
  Python: 1,
  SQL: 2,
  "Machine Learning": 3,
  "Power BI": 4,
  Communication: 5
};


// ============================================================
// COMPONENT
// ============================================================

function PostOpportunity() {

  const navigate = useNavigate();


  // ==========================================================
  // FORM STATE
  // ==========================================================

  const [form, setForm] = useState({
    title: "",
    type: "Internship",
    description: "",
    location: "",
    mode: "Hybrid",
    duration: "",
    deadline: ""
  });


  // ==========================================================
  // SKILL STATE
  // ==========================================================

  const [skillInput, setSkillInput] = useState("");

  const [skills, setSkills] = useState([]);


  // ==========================================================
  // MESSAGE STATE
  // ==========================================================

  const [message, setMessage] = useState("");


  // ==========================================================
  // HANDLE FORM CHANGES
  // ==========================================================

  function handleChange(e) {

    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));

  }


  // ==========================================================
  // ADD SKILL
  // ==========================================================

  function addSkill() {

    const skill = skillInput.trim();

    if (!skill) {
      return;
    }


    // Find matching database skill
    const matchedSkill = Object.keys(SKILL_ID_MAP).find(
      (name) =>
        name.toLowerCase() ===
        skill.toLowerCase()
    );


    // Invalid skill
    if (!matchedSkill) {

      setMessage(
        "Please enter a valid skill: Python, SQL, Machine Learning, Power BI, or Communication."
      );

      return;
    }


    // Prevent duplicate skill
    const alreadyExists = skills.some(
      (existingSkill) =>
        existingSkill.name.toLowerCase() ===
        matchedSkill.toLowerCase()
    );


    if (alreadyExists) {

      setSkillInput("");

      return;
    }


    // Add skill
    setSkills((previous) => [
      ...previous,
      {
        name: matchedSkill,
        requiredScore: 50
      }
    ]);


    setSkillInput("");

    setMessage("");

  }


  // ============================================================
  // REMOVE SKILL
  // ============================================================

  function removeSkill(skillToRemove) {

    setSkills((previous) =>
      previous.filter(
        (skill) =>
          skill.name !== skillToRemove
      )
    );

  }


  // ============================================================
  // HANDLE ENTER KEY FOR SKILL
  // ============================================================

  function handleSkillKeyDown(e) {

    if (e.key === "Enter") {

      e.preventDefault();

      addSkill();

    }

  }


  // ============================================================
  // SUBMIT OPPORTUNITY
  // ============================================================

  async function handleSubmit(e) {

    e.preventDefault();


    // ----------------------------------------------------------
    // Validate skills
    // ----------------------------------------------------------

    if (skills.length === 0) {

      setMessage(
        "Please add at least one required skill."
      );

      return;
    }


    // ----------------------------------------------------------
    // Convert frontend skills to database skill IDs
    // ----------------------------------------------------------

    const skillIds = skills.map(
      (skill) =>
        SKILL_ID_MAP[skill.name]
    );


    // ----------------------------------------------------------
    // Send opportunity to backend
    // ----------------------------------------------------------

    try {

      const response = await apiPost(
        "/industry/opportunities",
        {
          title: form.title,
          type: form.type,
          description: form.description,
          location: form.location,
          mode: form.mode,
          duration: form.duration,
          deadline: form.deadline,

          skill_ids: skillIds
        }
      );


      console.log(
        "Opportunity created:",
        response
      );


      // --------------------------------------------------------
      // Success message
      // --------------------------------------------------------

      setMessage(
        "Opportunity published successfully!"
      );


      // --------------------------------------------------------
      // Redirect to dashboard
      // --------------------------------------------------------

      setTimeout(() => {

        navigate("/industry/dashboard");

      }, 800);

    } catch (error) {

      console.error(
        "Failed to create opportunity:",
        error
      );


      setMessage(
        error.message ||
        "Failed to publish opportunity."
      );

    }

  }


  // ============================================================
  // UI
  // ============================================================

  return (

    <div className="min-h-screen bg-slate-50">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="bg-white border-b">

        <div className="px-8 py-6">

          <p className="text-sm text-blue-600 font-medium">
            INDUSTRY PORTAL
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Post Opportunity
          </h1>

          <p className="text-slate-500 mt-2">
            Create an internship, job or industry collaboration opportunity.
          </p>

        </div>

      </div>


      <div className="p-8 max-w-5xl">

        <form onSubmit={handleSubmit}>

          {/* ==================================================
              OPPORTUNITY DETAILS
              ================================================== */}

          <div className="bg-white border rounded-2xl p-6">

            <div className="flex items-center gap-3">

              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">

                <BriefcaseBusiness size={20} />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Opportunity Details
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Provide the basic information about the opportunity.
                </p>

              </div>

            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              {/* ==================================================
                  TITLE
                  ================================================== */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium mb-2">
                  Opportunity Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Data Analyst Intern"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>


              {/* ==================================================
                  TYPE
                  ================================================== */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Opportunity Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Full-time Job">
                    Full-time Job
                  </option>

                  <option value="Industrial Training">
                    Industrial Training
                  </option>

                  <option value="Industry Project">
                    Industry Project
                  </option>

                </select>

              </div>


              {/* ==================================================
                  DURATION
                  ================================================== */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Duration
                </label>

                <div className="relative">

                  <Clock
                    size={17}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />

                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g. 3 Months"
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                </div>

              </div>


              {/* ==================================================
                  LOCATION
                  ================================================== */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Location
                </label>

                <div className="relative">

                  <MapPin
                    size={17}
                    className="absolute left-3 top-3.5 text-slate-400"
                  />

                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore"
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />

                </div>

              </div>


              {/* ==================================================
                  WORK MODE
                  ================================================== */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Work Mode
                </label>

                <select
                  name="mode"
                  value={form.mode}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="On-site">
                    On-site
                  </option>

                  <option value="Hybrid">
                    Hybrid
                  </option>

                  <option value="Remote">
                    Remote
                  </option>

                </select>

              </div>


              {/* ==================================================
                  DEADLINE
                  ================================================== */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Application Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>


              {/* ==================================================
                  DESCRIPTION
                  ================================================== */}

              <div className="md:col-span-2">

                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Describe the role, responsibilities and what the student will work on..."
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />

              </div>

            </div>

          </div>


          {/* ======================================================
              REQUIRED SKILLS
              ====================================================== */}

          <div className="bg-white border rounded-2xl p-6 mt-6">

            <h2 className="text-xl font-semibold">
              Required Skills
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Add the skills candidates should have for this opportunity.
            </p>


            {/* ==================================================
                SKILL INPUT
                ================================================== */}

            <div className="flex gap-3 mt-6">

              <input
                type="text"
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. Python"
                className="flex-1 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={addSkill}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
              >

                <Plus size={17} />

                Add

              </button>

            </div>


            {/* ==================================================
                SKILL TAGS
                ================================================== */}

            <div className="mt-6 space-y-4">

              {skills.map((skill, index) => (

                <div
                  key={skill.name}
                  className="border rounded-xl p-4"
                >

                  <div className="flex items-center justify-between">

                    <span className="font-medium text-slate-800">
                      {skill.name}
                    </span>

                    <span className="text-sm font-semibold text-blue-600">
                      {skill.requiredScore}%
                    </span>

                  </div>


                  <div className="flex items-center gap-4 mt-4">

                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={skill.requiredScore}
                      onChange={(e) => {

                        const updatedSkills =
                          [...skills];

                        updatedSkills[index] = {
                          ...updatedSkills[index],
                          requiredScore:
                            Number(e.target.value)
                        };

                        setSkills(updatedSkills);

                      }}
                      className="flex-1"
                    />


                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(skill.name)
                      }
                      className="p-2 text-slate-400 hover:text-red-500"
                    >

                      <X size={16} />

                    </button>

                  </div>


                  <div className="flex justify-between text-xs text-slate-400 mt-2">

                    <span>
                      Basic
                    </span>

                    <span>
                      Advanced
                    </span>

                  </div>

                </div>

              ))}

            </div>


            {/* ==================================================
                EMPTY SKILLS
                ================================================== */}

            {skills.length === 0 && (

              <p className="text-sm text-slate-400 mt-4">
                No skills added yet. Add the skills required for this opportunity.
              </p>

            )}

          </div>


          {/* ======================================================
              MESSAGE
              ====================================================== */}

          {message && (

            <div
              className={`mt-6 p-4 rounded-xl text-sm ${
                message.includes("successfully")
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-600"
              }`}
            >

              {message}

            </div>

          )}


          {/* ======================================================
              ACTIONS
              ====================================================== */}

          <div className="flex justify-end gap-3 mt-6">

            <button
              type="button"
              onClick={() =>
                navigate("/industry/dashboard")
              }
              className="px-5 py-3 border border-slate-200 bg-white rounded-lg font-medium hover:bg-slate-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Publish Opportunity
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default PostOpportunity;