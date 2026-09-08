import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { apiGet, apiPost, apiPut } from "../../services/api";
import {
  BookOpen,
  Clock,
  ExternalLink,
  PlayCircle,
  CheckCircle
} from "lucide-react";


function ResourceCard({
  resource,
  startLearning,
  updateProgress,
}) {

  return (
    <div className="bg-white border rounded-2xl p-6 hover:border-blue-300 transition">

      <div className="flex justify-between gap-4">

        <div>

          <div className="flex items-center gap-2 flex-wrap">

            <p className="text-sm text-blue-600 font-medium">
              {resource.skill}
            </p>

            {resource.recommendation === "High Priority" && (
              <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                High Priority
              </span>
            )}

            {resource.recommendation === "Recommended" && (
              <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium">
                Recommended
              </span>
            )}

          </div>

          <h3 className="text-xl font-semibold text-slate-900 mt-2">
            {resource.title}
          </h3>

        </div>

        {resource.status === "Completed" && (
          <CheckCircle
            size={22}
            className="text-green-600 flex-shrink-0"
          />
        )}

      </div>


      <div className="mt-4 bg-slate-50 rounded-xl p-4">

        <div className="flex justify-between">

          <span className="text-sm text-slate-500">
            Your current {resource.skill} score
          </span>

          <span className="font-semibold text-slate-900">
            {resource.student_score}%
          </span>

        </div>

        <div className="h-2 bg-slate-200 rounded-full mt-2">

          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${Math.min(
                resource.student_score || 0,
                100
              )}%`,
            }}
          />

        </div>

      </div>


      <p className="text-sm text-slate-500 mt-4">
        {resource.description}
      </p>


      <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-500">

        {resource.provider && (
          <span>{resource.provider}</span>
        )}

        {resource.difficulty && (
          <span className="px-2.5 py-1 bg-slate-100 rounded-full">
            {resource.difficulty}
          </span>
        )}

        {resource.duration && (
          <span className="flex items-center gap-1">
            <Clock size={15} />
            {resource.duration}
          </span>
        )}

      </div>


      <div className="mt-6">

        <div className="flex justify-between text-sm">

          <span className="text-slate-500">
            Progress
          </span>

          <span className="font-medium">
            {resource.progress || 0}%
          </span>

        </div>

        <div className="h-2 bg-slate-100 rounded-full mt-2">

          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{
              width: `${Math.min(
                resource.progress || 0,
                100
              )}%`,
            }}
          />

        </div>

      </div>


      <div className="mt-6 flex flex-wrap gap-3">

        {resource.status !== "Completed" && (

          <button
            onClick={() => startLearning(resource)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >

            <PlayCircle size={16} />

            {resource.status === "In Progress"
              ? "Continue Learning"
              : "Start Learning"}

          </button>

        )}

        {resource.url && (

          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium text-slate-700 hover:border-blue-300"
          >

            <ExternalLink size={16} />

            Open Resource

          </a>

        )}

      </div>


      {resource.status === "In Progress" && (

        <div className="mt-5 pt-5 border-t">

          <p className="text-sm font-medium text-slate-700">
            Update Progress
          </p>

          <div className="flex flex-wrap gap-2 mt-3">

            {[25, 50, 75, 100].map((value) => (

              <button
                key={value}
                onClick={() =>
                  updateProgress(resource, value)
                }
                className="px-3 py-1.5 border rounded-lg text-xs hover:border-blue-400 hover:text-blue-600"
              >
                {value}%
              </button>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}


function Learning() {

  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================================
  // LOAD LEARNING RESOURCES
  // ==========================================================

  useEffect(() => {

    async function loadLearning() {

      try {

        setLoading(true);
        setError("");

        const data = await apiGet(
          "/student/learning"
        );

        setResources(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          "Learning error:",
          err
        );

        setError(
          err.message ||
          "Unable to load learning resources."
        );

      } finally {

        setLoading(false);

      }

    }

    loadLearning();

  }, []);


  // ==========================================================
  // START LEARNING
  // ==========================================================

  async function startLearning(resource) {

    try {

      const response = await apiPost(
        `/student/learning/${resource.id}/start`
      );

      setResources((previous) =>
        previous.map((item) =>
          item.id === resource.id
            ? {
                ...item,
                status:
                  response.status ||
                  "In Progress",
                progress:
                  response.progress ||
                  1
              }
            : item
        )
      );

      if (resource.url) {

        window.open(
          resource.url,
          "_blank",
          "noopener,noreferrer"
        );

      }

    } catch (err) {

      console.error(
        "Start learning error:",
        err
      );

      alert(
        err.message ||
        "Unable to start learning resource."
      );

    }

  }


  // ==========================================================
  // UPDATE PROGRESS
  // ==========================================================

  async function updateProgress(
    resource,
    progress
  ) {

    try {

      const response = await apiPut(
        `/student/learning/${resource.id}/progress`,
        {
          progress: Number(progress)
        }
      );

      setResources((previous) =>
        previous.map((item) =>
          item.id === resource.id
            ? {
                ...item,
                status:
                  response.status ||
                  item.status,
                progress:
                  response.progress
              }
            : item
        )
      );

    } catch (err) {

      console.error(
        "Progress error:",
        err
      );

      alert(
        err.message ||
        "Unable to update progress."
      );

    }

  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (

      <StudentLayout>

        <div className="p-8">

          <p className="text-sm text-blue-600 font-medium">
            LEARNING
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Learning Programs
          </h1>

          <p className="text-slate-500 mt-2">
            Loading recommended learning resources...
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
            LEARNING
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Learning Programs
          </h1>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6">

            <p className="font-medium text-red-600">
              Unable to load learning resources
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

      {/* HEADER */}

      <p className="text-sm text-blue-600 font-medium">
        PERSONALIZED LEARNING
      </p>

      <h1 className="text-3xl font-bold text-slate-900 mt-2">
        Learning Programs
      </h1>

      <p className="text-slate-500 mt-2">
        Learning recommendations based on your current skill profile.
      </p>


      {/* EMPTY STATE */}

      {resources.length === 0 ? (

        <div className="mt-8 bg-white border rounded-2xl p-10 text-center">

          <BookOpen
            size={40}
            className="mx-auto text-slate-300"
          />

          <h2 className="text-xl font-semibold mt-4">
            No learning programs available
          </h2>

          <p className="text-slate-500 mt-2">
            Learning resources will appear here when they are available.
          </p>

        </div>

      ) : (

        <div className="mt-8">

          {/* SUMMARY */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

            <div className="bg-red-50 border border-red-100 rounded-xl p-5">

              <p className="text-sm text-red-600 font-medium">
                High Priority
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {
                  resources.filter(
                    (resource) =>
                      resource.recommendation === "High Priority"
                  ).length
                }
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Resources for your skill gaps
              </p>

            </div>


            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">

              <p className="text-sm text-yellow-600 font-medium">
                Recommended
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {
                  resources.filter(
                    (resource) =>
                      resource.recommendation === "Recommended"
                  ).length
                }
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Resources for developing skills
              </p>

            </div>


            <div className="bg-slate-50 border rounded-xl p-5">

              <p className="text-sm text-slate-600 font-medium">
                Total Resources
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {resources.length}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Available in the learning catalog
              </p>

            </div>

          </div>


          {/* HIGH PRIORITY */}

          {resources.some(
            (resource) =>
              resource.recommendation === "High Priority"
          ) && (

            <section className="mb-10">

              <div className="flex items-center gap-3 mb-5">

                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                  <BookOpen size={20} />
                </div>

                <div>

                  <h2 className="text-xl font-semibold">
                    Recommended for Your Skill Gaps
                  </h2>

                  <p className="text-sm text-slate-500">
                    Start with these resources to improve your weakest skills.
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {resources
                  .filter(
                    (resource) =>
                      resource.recommendation === "High Priority"
                  )
                  .map((resource) => (

                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      startLearning={startLearning}
                      updateProgress={updateProgress}
                    />

                  ))}

              </div>

            </section>

          )}


          {/* DEVELOPING */}

          {resources.some(
            (resource) =>
              resource.recommendation === "Recommended"
          ) && (

            <section className="mb-10">

              <div className="flex items-center gap-3 mb-5">

                <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                  <BookOpen size={20} />
                </div>

                <div>

                  <h2 className="text-xl font-semibold">
                    Strengthen Your Developing Skills
                  </h2>

                  <p className="text-sm text-slate-500">
                    These resources can help increase your readiness.
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {resources
                  .filter(
                    (resource) =>
                      resource.recommendation === "Recommended"
                  )
                  .map((resource) => (

                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      startLearning={startLearning}
                      updateProgress={updateProgress}
                    />

                  ))}

              </div>

            </section>

          )}


          {/* OPTIONAL */}

          {resources.some(
            (resource) =>
              resource.recommendation === "Optional"
          ) && (

            <section>

              <div className="flex items-center gap-3 mb-5">

                <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
                  <BookOpen size={20} />
                </div>

                <div>

                  <h2 className="text-xl font-semibold">
                    Explore Other Resources
                  </h2>

                  <p className="text-sm text-slate-500">
                    Additional resources you may find useful.
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {resources
                  .filter(
                    (resource) =>
                      resource.recommendation === "Optional"
                  )
                  .map((resource) => (

                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      startLearning={startLearning}
                      updateProgress={updateProgress}
                    />

                  ))}

              </div>

            </section>

          )}

        </div>

      )}

    </div>

  </StudentLayout>
);

}


export default Learning;