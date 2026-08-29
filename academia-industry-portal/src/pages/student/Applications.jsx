import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { getApplications } from "../../utils/storage";

function ApplicationProgress({ status }) {
  const stages = [
    "Applied",
    "Shortlisted",
    "Interview",
    "Selected",
  ];

  const currentIndex = stages.indexOf(status);

  return (
    <div className="flex items-center mt-3">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center">

          <div className="flex flex-col items-center">

            <div
              className={`w-3 h-3 rounded-full ${
                index <= currentIndex
                  ? "bg-blue-600"
                  : "bg-slate-200"
              }`}
            />

            <span className="text-xs text-slate-400 mt-1">
              {stage}
            </span>

          </div>

          {index < stages.length - 1 && (
            <div
              className={`w-10 h-0.5 mx-2 ${
                index < currentIndex
                  ? "bg-blue-600"
                  : "bg-slate-200"
              }`}
            />
          )}

        </div>
      ))}
    </div>
  );
}

function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    setApplications(getApplications());
  }, []);

  return (
    <StudentLayout>
      <div className="p-8">

        <p className="text-sm text-blue-600 font-medium">
          APPLICATIONS
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-2">
          My Applications
        </h1>

        <p className="text-slate-500 mt-2">
          Track your internship and job applications.
        </p>

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

            </div>

          ) : (

            applications.map((application) => (

              <div
                key={application.id}
                className="bg-white border rounded-2xl p-6"
              >

                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-semibold">
                      {application.title}
                    </h2>

                    <p className="text-slate-500 mt-1">
                      {application.company}
                    </p>

                    <p className="text-sm text-slate-400 mt-2">
                      Applied on {application.appliedDate}
                    </p>

                  </div>

                  <div className="text-left md:text-right">

                    <p className="text-sm text-slate-500">
                      Current Status
                    </p>

                    <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                      {application.status}
                    </span>

                  </div>

                </div>

                <ApplicationProgress
                  status={application.status}
                />

              </div>

            ))

          )}

        </div>

      </div>
    </StudentLayout>
  );
}

export default Applications;