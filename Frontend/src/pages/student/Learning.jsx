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

        {/* ==================================================
            HEADER
        ================================================== */}

        <p className="text-sm text-blue-600 font-medium">
          LEARNING
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-2">
          Learning Programs
        </h1>

        <p className="text-slate-500 mt-2">
          Learn the skills needed to close your skill gaps.
        </p>


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

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

            {/* ==================================================
                SECTION HEADER
            ================================================== */}

            <div className="flex items-center gap-3 mb-5">

              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">

                <BookOpen size={20} />

              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  Recommended Learning Programs
                </h2>

                <p className="text-sm text-slate-500">
                  Resources to help you strengthen your skills.
                </p>

              </div>

            </div>


            {/* ==================================================
                RESOURCE CARDS
            ================================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {resources.map(
                (resource) => (

                  <div
                    key={resource.id}
                    className="bg-white border rounded-2xl p-6 hover:border-blue-300 transition"
                  >

                    {/* Header */}

                    <div className="flex justify-between gap-4">

                      <div>

                        <p className="text-sm text-blue-600 font-medium">
                          {resource.skill}
                        </p>

                        <h3 className="text-xl font-semibold text-slate-900 mt-1">
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


                    {/* Description */}

                    <p className="text-sm text-slate-500 mt-4">
                      {resource.description}
                    </p>


                    {/* Details */}

                    <div className="flex flex-wrap gap-4 mt-5 text-sm text-slate-500">

                      {resource.provider && (

                        <span>
                          {resource.provider}
                        </span>

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


                    {/* Progress */}

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
                            )}%`
                          }}
                        />

                      </div>

                    </div>


                    {/* Actions */}

                    <div className="mt-6 flex flex-wrap gap-3">

                      {resource.status !== "Completed" && (

                        <button
                          onClick={() =>
                            startLearning(resource)
                          }
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


                    {/* Progress Controls */}

                    {resource.status === "In Progress" && (

                      <div className="mt-5 pt-5 border-t">

                        <p className="text-sm font-medium text-slate-700">
                          Update Progress
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">

                          {[25, 50, 75, 100].map(
                            (value) => (

                              <button
                                key={value}
                                onClick={() =>
                                  updateProgress(
                                    resource,
                                    value
                                  )
                                }
                                className="px-3 py-1.5 border rounded-lg text-xs hover:border-blue-400 hover:text-blue-600"
                              >
                                {value}%
                              </button>

                            )
                          )}

                        </div>

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>

    </StudentLayout>

  );

}


export default Learning;