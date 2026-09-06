import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BriefcaseBusiness, MapPin, Clock, Plus, X } from "lucide-react";

import { apiGet, apiPatch } from "../../services/api";

function EditOpportunity() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    type: "Internship",
    description: "",
    location: "",
    mode: "Hybrid",
    duration: "",
    deadline: "",
    salary_min_lpa: "",
    salary_max_lpa: "",
  });

  const [skills, setSkills] = useState([]);

  const [skillInput, setSkillInput] = useState("");

  const [skillsList, setSkillsList] = useState([]);

  const [message, setMessage] = useState("");

  const [notFound, setNotFound] = useState(false);

  function getSkillId(skillName) {
    return SKILL_ID_MAP[skillName];
  }

  /*
   * Load opportunity
   */

  useEffect(() => {
    async function loadData() {
      function getSkillId(skillName) {
        const skill = skillsList.find(
          (item) => item.name.toLowerCase() === skillName.toLowerCase(),
        );

        return skill?.id;
      }
      try {
        const [opportunities, availableSkills] = await Promise.all([
          apiGet("/industry/opportunities"),
          apiGet("/industry/skills"),
        ]);

        setSkillsList(availableSkills);

        const opportunity = opportunities.find(
          (item) => item.id.toString() === id,
        );

        if (!opportunity) {
          setNotFound(true);
          return;
        }

        setForm({
          title: opportunity.title || "",
          type: opportunity.type || "Internship",
          description: opportunity.description || "",
          location: opportunity.location || "",
          mode: opportunity.mode || "Hybrid",
          duration: opportunity.duration || "",
          deadline: opportunity.deadline || "",
          salary_min_lpa: opportunity.salary_min_lpa ?? "",
          salary_max_lpa: opportunity.salary_max_lpa ?? "",
        });

        setSkills(
          (opportunity.skills || []).map((skill) => ({
            name: skill,
            requiredScore: 50,
          })),
        );
      } catch (error) {
        console.error("Failed to load opportunity data:", error);

        setNotFound(true);
      }
    }

    loadData();
  }, [id]);

  /*
   * Handle form changes
   */

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /*
   * Add skill
   */

  function addSkill() {
    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    const matchedSkill = skillsList.find(
      (item) => item.name.toLowerCase() === skill.toLowerCase(),
    );

    if (!matchedSkill) {
      setMessage("Please select a skill from the available skills.");
      return;
    }

    const alreadyExists = skills.some(
      (existingSkill) =>
        existingSkill.name.toLowerCase() === matchedSkill.name.toLowerCase(),
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setSkills((previous) => [
      ...previous,
      {
        name: matchedSkill.name,
        requiredScore: 50,
      },
    ]);

    setSkillInput("");
    setMessage("");
  }

  /*
   * Remove skill
   */

  function removeSkill(skillToRemove) {
    setSkills((previous) =>
      previous.filter((skill) => skill.name !== skillToRemove),
    );
  }

  /*
   * Add skill using Enter
   */

  function handleSkillKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      addSkill();
    }
  }

  /*
   * Save changes
   */

  async function handleSubmit(e) {
    const skillIds = skills
      .map((skill) => getSkillId(skill.name))
      .filter(Boolean);

    if (skillIds.length !== skills.length) {
      setMessage("One or more selected skills are not supported.");
      return;
    }

    const minSalary =
      form.salary_min_lpa === "" ? null : Number(form.salary_min_lpa);

    const maxSalary =
      form.salary_max_lpa === "" ? null : Number(form.salary_max_lpa);

    if (minSalary !== null && maxSalary !== null && minSalary > maxSalary) {
      setMessage("Minimum salary cannot be greater than maximum salary.");
      return;
    }

    try {
      await apiPatch(`/industry/opportunities/${id}`, {
        title: form.title,
        type: form.type,
        description: form.description,
        location: form.location,
        mode: form.mode,
        duration: form.duration,
        deadline: form.deadline,
        salary_min_lpa: minSalary,
        salary_max_lpa: maxSalary,
        skill_ids: skills.map((skill) => getSkillId(skill.name)),
      });

      setMessage("Opportunity updated successfully!");

      setTimeout(() => {
        navigate("/industry/opportunities");
      }, 800);
    } catch (error) {
      console.error("Failed to update opportunity:", error);

      setMessage(error.message || "Failed to update opportunity.");
    }
  }

  /*
   * Opportunity not found
   */

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Opportunity Not Found
          </h1>

          <p className="text-slate-500 mt-2">
            The opportunity you're trying to edit does not exist.
          </p>

          <button
            onClick={() => navigate("/industry/opportunities")}
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
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
          <p className="text-sm text-blue-600 font-medium">INDUSTRY PORTAL</p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Edit Opportunity
          </h1>

          <p className="text-slate-500 mt-2">
            Update the details and requirements of your opportunity.
          </p>
        </div>
      </div>

      <div className="p-8 max-w-5xl">
        <form onSubmit={handleSubmit}>
          {/* Opportunity Details */}

          <div className="bg-white border rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <BriefcaseBusiness size={20} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Opportunity Details</h2>

                <p className="text-sm text-slate-500 mt-1">
                  Update the basic information about this opportunity.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              {/* Title */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Opportunity Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Type */}

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
                  <option value="Internship">Internship</option>

                  <option value="Full-time Job">Full-time Job</option>

                  <option value="Industrial Training">
                    Industrial Training
                  </option>

                  <option value="Industry Project">Industry Project</option>
                </select>
              </div>

              {/* Duration */}

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

              {/* Salary Range */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Minimum Salary (LPA)
                </label>

                <input
                  type="number"
                  name="salary_min_lpa"
                  value={form.salary_min_lpa}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="0"
                  step="0.1"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Maximum Salary (LPA)
                </label>

                <input
                  type="number"
                  name="salary_max_lpa"
                  value={form.salary_max_lpa}
                  onChange={handleChange}
                  placeholder="e.g. 8"
                  min="0"
                  step="0.1"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}

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

              {/* Work Mode */}

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
                  <option value="On-site">On-site</option>

                  <option value="Hybrid">Hybrid</option>

                  <option value="Remote">Remote</option>
                </select>
              </div>

              {/* Deadline */}

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

              {/* Description */}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Skills */}

          <div className="bg-white border rounded-2xl p-6 mt-6">
            <h2 className="text-xl font-semibold">Required Skills</h2>

            <p className="text-sm text-slate-500 mt-1">
              Update the skills required for this opportunity.
            </p>

            <div className="flex gap-3 mt-6">
              <input
                type="text"
                list="available-skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Select a skill"
                className="flex-1 border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <datalist id="available-skills">
                {skillsList.map((skill) => (
                  <option key={skill.id} value={skill.name}>
                    {skill.category}
                  </option>
                ))}
              </datalist>

              <button
                type="button"
                onClick={addSkill}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
              >
                <Plus size={17} />
                Add
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {skills.map((skill, index) => (
                <div key={skill.name} className="border rounded-xl p-4">
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
                        const updatedSkills = [...skills];

                        updatedSkills[index] = {
                          ...updatedSkills[index],
                          requiredScore: Number(e.target.value),
                        };

                        setSkills(updatedSkills);
                      }}
                      className="flex-1"
                    />

                    <button
                      type="button"
                      onClick={() => removeSkill(skill.name)}
                      className="p-2 text-slate-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>Basic</span>

                    <span>Advanced</span>
                  </div>
                </div>
              ))}
            </div>

            {skills.length === 0 && (
              <p className="text-sm text-slate-400 mt-4">
                No skills added yet.
              </p>
            )}
          </div>

          {/* Message */}

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

          {/* Actions */}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/industry/opportunities")}
              className="px-5 py-3 border border-slate-200 bg-white rounded-lg font-medium hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Update Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditOpportunity;
