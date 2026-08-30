import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";

import {
  getApplicationsForStudent
} from "../../utils/application";
import {
  getCurrentStudentId
} from "../../utils/currentStudent";

function ApplicationProgress({ status }) {

  const stages = [
    "Applied",
    "Shortlisted",
    "Interview",
    "Selected"
  ];


  const currentIndex =
    stages.indexOf(status);


  /*
   * Rejected is handled separately
   */

  if (status === "Rejected") {

    return (

      <div className="mt-5">

        <div className="flex items-center">

          {stages.slice(0, 3).map(
            (stage, index) => (

              <div
                key={stage}
                className="flex items-center"
              >

                <div className="flex flex-col items-center">

                  <div
                    className={`w-3 h-3 rounded-full ${
                      index <= 2
                        ? "bg-blue-600"
                        : "bg-slate-200"
                    }`}
                  />

                  <span className="text-xs text-slate-400 mt-1">
                    {stage}
                  </span>

                </div>


                {index < 2 && (

                  <div className="w-10 h-0.5 mx-2 bg-blue-600" />

                )}

              </div>

            )
          )}

        </div>


        <div className="mt-4">

          <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-xs rounded-full">
            Application not selected
          </span>

        </div>

      </div>

    );

  }


  return (

    <div className="flex items-center mt-5 overflow-x-auto">

      {stages.map(
        (stage, index) => (

          <div
            key={stage}
            className="flex items-center flex-shrink-0"
          >

            <div className="flex flex-col items-center">

              <div
                className={`w-3 h-3 rounded-full ${
                  index <= currentIndex
                    ? "bg-blue-600"
                    : "bg-slate-200"
                }`}
              />

              <span
                className={`text-xs mt-1 ${
                  index <= currentIndex
                    ? "text-blue-600 font-medium"
                    : "text-slate-400"
                }`}
              >
                {stage}
              </span>

            </div>


            {index <
              stages.length - 1 && (

              <div
                className={`w-10 h-0.5 mx-2 ${
                  index < currentIndex
                    ? "bg-blue-600"
                    : "bg-slate-200"
                }`}
              />

            )}

          </div>

        )
      )}

    </div>

  );

}


function getStatusStyle(status) {

  switch (status) {

    case "Selected":

      return "bg-green-50 text-green-700";

    case "Interview":

      return "bg-blue-50 text-blue-700";

    case "Shortlisted":

      return "bg-yellow-50 text-yellow-700";

    case "Rejected":

      return "bg-red-50 text-red-600";

    case "Applied":

    default:

      return "bg-slate-100 text-slate-600";

  }

}


function formatDate(date) {

  if (!date) {
    return "Date unavailable";
  }


  const parsedDate =
    new Date(date);


  if (Number.isNaN(
    parsedDate.getTime()
  )) {

    return date;

  }


  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


function Applications() {

  const [applications, setApplications] =
    useState([]);


  useEffect(() => {

    const studentId =
  getCurrentStudentId();

const studentApplications =
  getApplicationsForStudent(
    studentId
  );

    setApplications(
      studentApplications
    );

  }, []);


  return (

    <StudentLayout>

      <div className="p-8">

        {/* Page Header */}

        <p className="text-sm text-blue-600 font-medium">
          APPLICATIONS
        </p>


        <h1 className="text-3xl font-bold text-slate-900 mt-2">
          My Applications
        </h1>


        <p className="text-slate-500 mt-2">
          Track your internship and job applications.
        </p>


        {/* Applications */}

        <div className="mt-8 space-y-5">

          {applications.length === 0 ? (

            <div className="bg-white border rounded-2xl p-10 text-center">

              <h2 className="text-xl font-semibold">
                No applications yet
              </h2>


              <p className="text-slate-500 mt-2">
                Explore opportunities and apply for roles
                that match your skills.
              </p>


              <button
                onClick={() =>
                  window.location.href =
                    "/student/opportunities"
                }
                className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Explore Opportunities
              </button>

            </div>

          ) : (

            applications.map(
              (application) => (

                <div
                  key={application.id}
                  className="bg-white border rounded-2xl p-6"
                >

                  {/* Application Header */}

                  <div className="flex flex-col md:flex-row md:justify-between gap-5">

                    <div>

                      <h2 className="text-xl font-semibold text-slate-900">
                        {application.opportunityTitle}
                      </h2>


                      <p className="text-slate-500 mt-1">
                        {application.company}
                      </p>


                      <p className="text-sm text-slate-400 mt-2">
                        Applied on{" "}
                        {formatDate(
                          application.appliedDate
                        )}
                      </p>

                    </div>


                    {/* Status */}

                    <div className="text-left md:text-right">

                      <p className="text-sm text-slate-500">
                        Current Status
                      </p>


                      <span
                        className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                    </div>

                  </div>


                  {/* Match Score */}

                  {application.matchScore > 0 && (

                    <div className="mt-5 pt-5 border-t">

                      <div className="flex items-center justify-between">

                        <p className="text-sm text-slate-500">
                          Skill Match
                        </p>


                        <p className="text-sm font-semibold text-green-600">
                          {application.matchScore}%
                        </p>

                      </div>


                      <div className="h-2 bg-slate-100 rounded-full mt-2">

                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${Math.min(
                              application.matchScore,
                              100
                            )}%`
                          }}
                        />

                      </div>

                    </div>

                  )}


                  {/* Progress */}

                  <ApplicationProgress
                    status={
                      application.status
                    }
                  />


                  {/* Last Updated */}

                  {application.updatedDate && (

                    <p className="text-xs text-slate-400 mt-5 pt-4 border-t">

                      Last updated{" "}
                      {formatDate(
                        application.updatedDate
                      )}

                    </p>

                  )}

                </div>

              )
            )

          )}

        </div>

      </div>

    </StudentLayout>

  );

}


export default Applications;