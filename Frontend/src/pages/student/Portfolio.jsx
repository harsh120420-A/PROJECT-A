import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";

import { student } from "../../data/student";
import { skills as defaultSkills } from "../../data/skills";

import { apiGet, apiPost, apiDelete } from "../../services/api";

import {
  ExternalLink,
  Award,
  BriefcaseBusiness,
  GraduationCap,
  Plus,
  Trash2
} from "lucide-react";


function Portfolio() {

  const [profile, setProfile] = useState(null);

  const [skills, setSkills] = useState(defaultSkills);

  const [applications, setApplications] = useState([]);

  const [portfolio, setPortfolio] = useState({
    projects: [],
    certifications: [],
    achievements: []
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showProjectForm, setShowProjectForm] =
    useState(false);

  const [showCertificationForm, setShowCertificationForm] =
    useState(false);

  const [showAchievementForm, setShowAchievementForm] =
    useState(false);


  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    technologies: "",
    github: "",
    demo: ""
  });


  const [certificationForm, setCertificationForm] = useState({
    name: "",
    issuer: "",
    date: ""
  });


  const [achievementForm, setAchievementForm] = useState({
    title: "",
    description: "",
    date: ""
  });


  // ==========================================================
  // LOAD PORTFOLIO DATA
  // ==========================================================

  useEffect(() => {

    async function loadPortfolio() {

      try {

        setLoading(true);
        setError("");

        const [
          portfolioData,
          skillsData,
          applicationsData
        ] = await Promise.all([

          apiGet("/student/portfolio"),

          apiGet("/student/skills"),

          apiGet("/student/applications")

        ]);


        // ----------------------------------------------------
        // Portfolio
        // ----------------------------------------------------

        setPortfolio({

          projects:
            Array.isArray(
              portfolioData?.projects
            )
              ? portfolioData.projects
              : [],

          certifications:
            Array.isArray(
              portfolioData?.certifications
            )
              ? portfolioData.certifications
              : [],

          achievements:
            Array.isArray(
              portfolioData?.achievements
            )
              ? portfolioData.achievements
              : []

        });


        // ----------------------------------------------------
        // Skills
        // ----------------------------------------------------

        if (Array.isArray(skillsData)) {

          setSkills(skillsData);

        }


        // ----------------------------------------------------
        // Applications
        // ----------------------------------------------------

        setApplications(

          Array.isArray(applicationsData)
            ? applicationsData
            : []

        );


      } catch (err) {

        console.error(
          "Portfolio loading error:",
          err
        );

        setError(
          err.message ||
          "Unable to load portfolio."
        );

      } finally {

        setLoading(false);

      }

    }


    loadPortfolio();

  }, []);


  // ==========================================================
  // FORM HANDLERS
  // ==========================================================

  function handleProjectChange(e) {

    const { name, value } = e.target;

    setProjectForm((previous) => ({
      ...previous,
      [name]: value
    }));

  }


  function handleCertificationChange(e) {

    const { name, value } = e.target;

    setCertificationForm((previous) => ({
      ...previous,
      [name]: value
    }));

  }


  function handleAchievementChange(e) {

    const { name, value } = e.target;

    setAchievementForm((previous) => ({
      ...previous,
      [name]: value
    }));

  }


  // ==========================================================
  // ADD PROJECT
  // ==========================================================

  async function addProject(e) {

    e.preventDefault();

    if (!projectForm.title.trim()) {
      return;
    }


    try {

      const response = await apiPost(
        "/student/portfolio/projects",
        {
          title: projectForm.title.trim(),

          description:
            projectForm.description.trim() ||
            null,

          technologies:
            projectForm.technologies
              .split(",")
              .map(
                (technology) =>
                  technology.trim()
              )
              .filter(Boolean),

          github:
            projectForm.github.trim() ||
            null,

          demo:
            projectForm.demo.trim() ||
            null
        }
      );


      const newProject =
        response.project;


      setPortfolio((previous) => ({

        ...previous,

        projects: [
          newProject,
          ...previous.projects
        ]

      }));


      setProjectForm({
        title: "",
        description: "",
        technologies: "",
        github: "",
        demo: ""
      });


      setShowProjectForm(false);


    } catch (err) {

      console.error(
        "Project error:",
        err
      );

      alert(
        err.message ||
        "Unable to add project."
      );

    }

  }


  // ==========================================================
  // ADD CERTIFICATION
  // ==========================================================

  async function addCertification(e) {

    e.preventDefault();

    if (!certificationForm.name.trim()) {
      return;
    }


    try {

      const response = await apiPost(
        "/student/portfolio/certifications",
        {
          name:
            certificationForm.name.trim(),

          issuer:
            certificationForm.issuer.trim() ||
            null,

          date:
            certificationForm.date ||
            null
        }
      );


      const newCertification =
        response.certification;


      setPortfolio((previous) => ({

        ...previous,

        certifications: [
          newCertification,
          ...previous.certifications
        ]

      }));


      setCertificationForm({
        name: "",
        issuer: "",
        date: ""
      });


      setShowCertificationForm(false);


    } catch (err) {

      console.error(
        "Certification error:",
        err
      );

      alert(
        err.message ||
        "Unable to add certification."
      );

    }

  }


  // ==========================================================
  // ADD ACHIEVEMENT
  // ==========================================================

  async function addAchievement(e) {

    e.preventDefault();

    if (!achievementForm.title.trim()) {
      return;
    }


    try {

      const response = await apiPost(
        "/student/portfolio/achievements",
        {
          title:
            achievementForm.title.trim(),

          description:
            achievementForm.description.trim() ||
            null,

          date:
            achievementForm.date ||
            null
        }
      );


      const newAchievement =
        response.achievement;


      setPortfolio((previous) => ({

        ...previous,

        achievements: [
          newAchievement,
          ...previous.achievements
        ]

      }));


      setAchievementForm({
        title: "",
        description: "",
        date: ""
      });


      setShowAchievementForm(false);


    } catch (err) {

      console.error(
        "Achievement error:",
        err
      );

      alert(
        err.message ||
        "Unable to add achievement."
      );

    }

  }


  // ==========================================================
  // DELETE PROJECT
  // ==========================================================

  async function removeProject(id) {

    try {

      await apiDelete(
        `/student/portfolio/projects/${id}`
      );


      setPortfolio((previous) => ({

        ...previous,

        projects:
          previous.projects.filter(
            (project) =>
              project.id !== id
          )

      }));


    } catch (err) {

      console.error(
        "Delete project error:",
        err
      );

      alert(
        err.message ||
        "Unable to delete project."
      );

    }

  }


  // ==========================================================
  // DELETE CERTIFICATION
  // ==========================================================

  async function removeCertification(id) {

    try {

      await apiDelete(
        `/student/portfolio/certifications/${id}`
      );


      setPortfolio((previous) => ({

        ...previous,

        certifications:
          previous.certifications.filter(
            (certification) =>
              certification.id !== id
          )

      }));


    } catch (err) {

      console.error(
        "Delete certification error:",
        err
      );

      alert(
        err.message ||
        "Unable to delete certification."
      );

    }

  }


  // ==========================================================
  // DELETE ACHIEVEMENT
  // ==========================================================

  async function removeAchievement(id) {

    try {

      await apiDelete(
        `/student/portfolio/achievements/${id}`
      );


      setPortfolio((previous) => ({

        ...previous,

        achievements:
          previous.achievements.filter(
            (achievement) =>
              achievement.id !== id
          )

      }));


    } catch (err) {

      console.error(
        "Delete achievement error:",
        err
      );

      alert(
        err.message ||
        "Unable to delete achievement."
      );

    }

  }


  // ==========================================================
  // DISPLAY DATA
  // ==========================================================

  const displayName =
    profile?.name ||
    student.name;

  const careerGoal =
    profile?.careerGoal ||
    student.careerGoal;

  const degree =
    profile?.degree ||
    "Degree not specified";

  const branch =
    profile?.branch ||
    "Specialization not specified";


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <StudentLayout>

        <div className="p-8">

          <p className="text-sm text-blue-600 font-medium">
            DIGITAL PORTFOLIO
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            My Portfolio
          </h1>

          <p className="text-slate-500 mt-2">
            Loading your portfolio...
          </p>

        </div>

      </StudentLayout>

    );

  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (

      <StudentLayout>

        <div className="p-8">

          <p className="text-sm text-blue-600 font-medium">
            DIGITAL PORTFOLIO
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            My Portfolio
          </h1>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">

            <p className="font-medium text-red-600">
              Unable to load portfolio
            </p>

            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>

          </div>

        </div>

      </StudentLayout>

    );

  }


  return (

    <StudentLayout>

      <div className="p-8">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="bg-white border rounded-2xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl font-bold">

                {displayName
                  ? displayName
                      .charAt(0)
                      .toUpperCase()
                  : "S"}

              </div>


              <div>

                <p className="text-sm text-blue-600 font-medium">
                  DIGITAL PORTFOLIO
                </p>

                <h1 className="text-3xl font-bold text-slate-900 mt-1">
                  {displayName}
                </h1>

                <p className="text-slate-500 mt-1">
                  Aspiring {careerGoal}
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  {degree} • {branch}
                </p>

              </div>

            </div>


            <div className="text-left md:text-right">

              <p className="text-sm text-slate-500">
                Career Readiness
              </p>

              <p className="text-4xl font-bold text-blue-600 mt-1">
                {student.readiness}%
              </p>

            </div>

          </div>

        </div>


        {/* ==================================================
            SKILLS
        ================================================== */}

        <div className="mt-8 bg-white border rounded-2xl p-6">

          <h2 className="text-xl font-semibold">
            Skills
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your current skill profile.
          </p>


          <div className="mt-6 space-y-5">

            {skills.map((skill) => (

              <div key={skill.id}>

                <div className="flex justify-between text-sm mb-2">

                  <span className="font-medium">
                    {skill.name}
                  </span>

                  <span className="text-slate-500">
                    {skill.score}%
                  </span>

                </div>


                <div className="h-2 bg-slate-100 rounded-full">

                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{
                      width: `${skill.score}%`
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* ==================================================
            PROJECTS
        ================================================== */}

        <div className="mt-8 bg-white border rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Projects
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Showcase your academic and personal projects.
              </p>

            </div>


            <button
              onClick={() =>
                setShowProjectForm(
                  !showProjectForm
                )
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Project
            </button>

          </div>


          {showProjectForm && (

            <form
              onSubmit={addProject}
              className="mt-6 border rounded-xl p-5 bg-slate-50"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="title"
                  value={projectForm.title}
                  onChange={handleProjectChange}
                  placeholder="Project title"
                  className="border rounded-lg px-4 py-3 bg-white"
                  required
                />


                <input
                  type="text"
                  name="technologies"
                  value={projectForm.technologies}
                  onChange={handleProjectChange}
                  placeholder="Technologies (React, Python, SQL)"
                  className="border rounded-lg px-4 py-3 bg-white"
                />


                <textarea
                  name="description"
                  value={projectForm.description}
                  onChange={handleProjectChange}
                  placeholder="Project description"
                  rows="3"
                  className="border rounded-lg px-4 py-3 bg-white md:col-span-2"
                />


                <input
                  type="url"
                  name="github"
                  value={projectForm.github}
                  onChange={handleProjectChange}
                  placeholder="GitHub URL"
                  className="border rounded-lg px-4 py-3 bg-white"
                />


                <input
                  type="url"
                  name="demo"
                  value={projectForm.demo}
                  onChange={handleProjectChange}
                  placeholder="Live demo URL"
                  className="border rounded-lg px-4 py-3 bg-white"
                />

              </div>


              <div className="flex justify-end gap-3 mt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowProjectForm(false)
                  }
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                  Save Project
                </button>

              </div>

            </form>

          )}


          <div className="mt-6 space-y-4">

            {portfolio.projects.length === 0 ? (

              <div className="border border-dashed rounded-xl p-8 text-center">

                <p className="text-slate-500">
                  No projects added yet.
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Add your first project to strengthen your portfolio.
                </p>

              </div>

            ) : (

              portfolio.projects.map(
                (project) => (

                  <div
                    key={project.id}
                    className="border rounded-xl p-5"
                  >

                    <div className="flex justify-between gap-4">

                      <div>

                        <h3 className="font-semibold text-lg">
                          {project.title}
                        </h3>

                        <p className="text-slate-500 text-sm mt-2">
                          {project.description}
                        </p>


                        <div className="flex flex-wrap gap-2 mt-4">

                          {(Array.isArray(
                            project.technologies
                          )
                            ? project.technologies
                            : []
                          ).map(
                            (technology) => (

                              <span
                                key={technology}
                                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                              >
                                {technology}
                              </span>

                            )
                          )}

                        </div>


                        <div className="flex gap-4 mt-4">

                          {project.github && (

                            <a
                              href={project.github}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-sm text-blue-600"
                            >
                              <ExternalLink size={15} />
                              GitHub
                            </a>

                          )}


                          {project.demo && (

                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-sm text-blue-600"
                            >
                              <ExternalLink size={15} />
                              Live Demo
                            </a>

                          )}

                        </div>

                      </div>


                      <button
                        onClick={() =>
                          removeProject(
                            project.id
                          )
                        }
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </div>


        {/* ==================================================
            CERTIFICATIONS
        ================================================== */}

        <div className="mt-8 bg-white border rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Certifications
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Showcase certifications and completed programs.
              </p>

            </div>


            <button
              onClick={() =>
                setShowCertificationForm(
                  !showCertificationForm
                )
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Certification
            </button>

          </div>


          {showCertificationForm && (

            <form
              onSubmit={addCertification}
              className="mt-6 border rounded-xl p-5 bg-slate-50"
            >

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <input
                  type="text"
                  name="name"
                  value={certificationForm.name}
                  onChange={
                    handleCertificationChange
                  }
                  placeholder="Certification name"
                  className="border rounded-lg px-4 py-3 bg-white"
                  required
                />


                <input
                  type="text"
                  name="issuer"
                  value={certificationForm.issuer}
                  onChange={
                    handleCertificationChange
                  }
                  placeholder="Issuing organization"
                  className="border rounded-lg px-4 py-3 bg-white"
                />


                <input
                  type="month"
                  name="date"
                  value={certificationForm.date}
                  onChange={
                    handleCertificationChange
                  }
                  className="border rounded-lg px-4 py-3 bg-white"
                />

              </div>


              <div className="flex justify-end gap-3 mt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowCertificationForm(false)
                  }
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                  Save Certification
                </button>

              </div>

            </form>

          )}


          <div className="mt-6 space-y-4">

            {portfolio.certifications.length === 0 ? (

              <div className="border border-dashed rounded-xl p-8 text-center">

                <Award
                  className="mx-auto text-slate-300"
                  size={32}
                />

                <p className="text-slate-500 mt-3">
                  No certifications added yet.
                </p>

              </div>

            ) : (

              portfolio.certifications.map(
                (certification) => (

                  <div
                    key={certification.id}
                    className="flex justify-between items-center border rounded-xl p-5"
                  >

                    <div className="flex items-center gap-4">

                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <Award size={20} />
                      </div>

                      <div>

                        <h3 className="font-semibold">
                          {certification.name}
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          {certification.issuer}
                        </p>

                        {certification.date && (

                          <p className="text-xs text-slate-400 mt-1">
                            {certification.date}
                          </p>

                        )}

                      </div>

                    </div>


                    <button
                      onClick={() =>
                        removeCertification(
                          certification.id
                        )
                      }
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                )
              )

            )}

          </div>

        </div>


        {/* ==================================================
            INTERNSHIPS
        ================================================== */}

        <div className="mt-8 bg-white border rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <BriefcaseBusiness size={20} />
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Internships & Applications
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your industry opportunities and application history.
              </p>

            </div>

          </div>


          <div className="mt-6 space-y-4">

            {applications.length === 0 ? (

              <div className="border border-dashed rounded-xl p-8 text-center">

                <p className="text-slate-500">
                  No applications yet.
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  Applied opportunities will appear here.
                </p>

              </div>

            ) : (

              applications.map(
                (application) => (

                  <div
                    key={application.id}
                    className="border rounded-xl p-5 flex justify-between items-center"
                  >

                    <div>

                      <h3 className="font-semibold">
                        {application.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {application.company}
                      </p>

                      <p className="text-xs text-slate-400 mt-2">
                        Applied on{" "}
                        {application.applied_at
                          ? new Date(
                              application.applied_at
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "Date unavailable"}
                      </p>

                    </div>


                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                      {application.status}
                    </span>

                  </div>

                )
              )

            )}

          </div>

        </div>


        {/* ==================================================
            ACHIEVEMENTS
        ================================================== */}

        <div className="mt-8 bg-white border rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Achievements
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Showcase hackathons, awards and accomplishments.
              </p>

            </div>


            <button
              onClick={() =>
                setShowAchievementForm(
                  !showAchievementForm
                )
              }
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus size={16} />
              <span>Add Achievement</span>
            </button>

          </div>


          {showAchievementForm && (

            <form
              onSubmit={addAchievement}
              className="mt-6 border rounded-xl p-5 bg-slate-50"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="title"
                  value={achievementForm.title}
                  onChange={
                    handleAchievementChange
                  }
                  placeholder="Achievement title"
                  className="border rounded-lg px-4 py-3 bg-white"
                  required
                />


                <input
                  type="date"
                  name="date"
                  value={achievementForm.date}
                  onChange={
                    handleAchievementChange
                  }
                  className="border rounded-lg px-4 py-3 bg-white"
                />


                <textarea
                  name="description"
                  value={
                    achievementForm.description
                  }
                  onChange={
                    handleAchievementChange
                  }
                  placeholder="Describe your achievement"
                  rows="3"
                  className="border rounded-lg px-4 py-3 bg-white md:col-span-2"
                />

              </div>


              <div className="flex justify-end gap-3 mt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowAchievementForm(false)
                  }
                  className="px-4 py-2 border rounded-lg text-sm"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                >
                  Save Achievement
                </button>

              </div>

            </form>

          )}


          <div className="mt-6 space-y-4">

            {portfolio.achievements.length === 0 ? (

              <div className="border border-dashed rounded-xl p-8 text-center">

                <GraduationCap
                  className="mx-auto text-slate-300"
                  size={32}
                />

                <p className="text-slate-500 mt-3">
                  No achievements added yet.
                </p>

              </div>

            ) : (

              portfolio.achievements.map(
                (achievement) => (

                  <div
                    key={achievement.id}
                    className="flex justify-between border rounded-xl p-5"
                  >

                    <div>

                      <h3 className="font-semibold">
                        {achievement.title}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {achievement.description}
                      </p>

                      {achievement.date && (

                        <p className="text-xs text-slate-400 mt-2">
                          {achievement.date}
                        </p>

                      )}

                    </div>


                    <button
                      onClick={() =>
                        removeAchievement(
                          achievement.id
                        )
                      }
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                )
              )

            )}

          </div>

        </div>

      </div>

    </StudentLayout>

  );

}


export default Portfolio;