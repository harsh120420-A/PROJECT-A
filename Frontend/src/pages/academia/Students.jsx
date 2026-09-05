import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Search,
  Filter,
  Users,
  ChevronRight,
  X,
  TrendingUp,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";

import { apiGet } from "../../services/api";


function getReadinessColor(score) {
  if (score >= 75) {
    return "text-green-600";
  }

  if (score >= 60) {
    return "text-yellow-600";
  }

  return "text-red-600";
}


function getReadinessBar(score) {
  if (score >= 75) {
    return "bg-green-500";
  }

  if (score >= 60) {
    return "bg-yellow-500";
  }

  return "bg-red-500";
}


function getStatusStyle(status) {
  if (status === "On Track") {
    return "bg-green-50 text-green-700";
  }

  if (status === "Needs Attention") {
    return "bg-yellow-50 text-yellow-700";
  }

  return "bg-red-50 text-red-700";
}


function Students() {

  const [students, setStudents] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("All Departments");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
   * Load students from backend
   */

  useEffect(() => {

    async function loadStudents() {

      try {

        setLoading(true);
        setError("");

        const data =
          await apiGet("/academia/students");

        setStudents(
          data || []
        );

      } catch (err) {

        console.error(
          "Failed to load students:",
          err
        );

        setError(
          err.message ||
          "Failed to load students."
        );

      } finally {

        setLoading(false);

      }

    }

    loadStudents();

  }, []);


  /*
   * Department handling
   *
   * The current Student model does not
   * provide a department field.
   */

  const departments = [
    "All Departments"
  ];


  /*
   * Filter students
   */

  const filteredStudents =
    useMemo(() => {

      return students.filter(
        (student) => {

          const searchText =
            search.toLowerCase();

          const matchesSearch =
            student.name
              ?.toLowerCase()
              .includes(searchText) ||
            student.career_goal
              ?.toLowerCase()
              .includes(searchText);

          return matchesSearch;

        }
      );

    }, [
      students,
      search,
      department
    ]);


  /*
   * Loading state
   */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-sm text-slate-500 mt-4">
            Loading students...
          </p>

        </div>

      </div>

    );

  }


  /*
   * Error state
   */

  if (error) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md">

          <h2 className="text-xl font-semibold text-red-600">
            Unable to load students
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  return (

    <div className="space-y-7">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

        <div>

          <p className="text-sm text-blue-600 font-medium">
            STUDENT INTELLIGENCE
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            Students
          </h1>

          <p className="text-slate-500 mt-2">
            Explore student readiness, skills, career goals and skill gaps.
          </p>

        </div>


        <div className="flex items-center gap-2 text-sm text-slate-500">

          <Users size={17} />

          <span>
            {filteredStudents.length} of{" "}
            {students.length} students
          </span>

        </div>

      </div>


      {/* Filters */}

      <div className="bg-white border border-slate-200 rounded-2xl p-4">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by student name or career goal..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
            />

          </div>


          {/* Department */}

          <div className="relative">

            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white"
            >

              {departments.map(
                (item) => (
                  <option key={item}>
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

        </div>


        {search && (

          <button
            onClick={() => {
              setSearch("");
              setDepartment(
                "All Departments"
              );
            }}
            className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
          >

            <X size={14} />

            Clear filters

          </button>

        )}

      </div>


      {/* Student Cards */}

      {filteredStudents.length === 0 ? (

        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

          <Users
            size={40}
            className="mx-auto text-slate-300"
          />

          <h3 className="font-semibold text-slate-800 mt-4">
            No students found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Try changing your search.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {filteredStudents.map(
            (student) => (

              <div
                key={student.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition"
              >

                {/* Student Header */}

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">

                      {student.name
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>


                    <div>

                      <h3 className="font-semibold text-slate-900">
                        {student.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        Student
                      </p>

                    </div>

                  </div>


                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      student.status
                    )}`}
                  >
                    {student.status}
                  </span>

                </div>


                {/* Career Goal */}

                <div className="mt-5 flex items-center gap-2">

                  <GraduationCap
                    size={17}
                    className="text-slate-400"
                  />

                  <span className="text-sm text-slate-600">
                    Career Goal:
                  </span>

                  <span className="text-sm font-medium text-slate-800">
                    {student.career_goal ||
                      "Not specified"}
                  </span>

                </div>


                {/* Readiness */}

                <div className="mt-5">

                  <div className="flex justify-between items-center mb-2">

                    <span className="text-sm font-medium text-slate-700">
                      Skill Readiness
                    </span>

                    <span
                      className={`text-sm font-bold ${getReadinessColor(
                        student.readiness
                      )}`}
                    >
                      {student.readiness}%
                    </span>

                  </div>


                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full ${getReadinessBar(
                        student.readiness
                      )}`}
                      style={{
                        width: `${student.readiness}%`,
                      }}
                    />

                  </div>

                </div>


                {/* Skills */}

                <div className="mt-5">

                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Key Skills
                  </p>


                  <div className="flex flex-wrap gap-2 mt-2">

                    {(student.skills || []).map(
                      (skill) => (

                        <span
                          key={skill.id}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700"
                        >

                          {skill.name}

                          <span className="ml-1 font-semibold text-blue-600">
                            {skill.score}%
                          </span>

                        </span>

                      )
                    )}

                  </div>

                </div>


                {/* Footer */}

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <AlertTriangle
                      size={15}
                      className="text-orange-400"
                    />

                    <span className="text-xs text-slate-500">

                      {(student.gaps || []).length} skill gap
                      {(student.gaps || []).length !== 1
                        ? "s"
                        : ""}

                    </span>


                    <span className="text-xs text-slate-300">
                      ·
                    </span>


                    <span className="text-xs text-slate-500">

                      {student.internships || 0} internship
                      {(student.internships || 0) !== 1
                        ? "s"
                        : ""}

                    </span>

                  </div>


                  <button
                    onClick={() =>
                      setSelectedStudent(student)
                    }
                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >

                    View Profile

                    <ChevronRight size={16} />

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* Student Profile Modal */}

      {selectedStudent && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() =>
              setSelectedStudent(null)
            }
          />


          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="p-6 border-b border-slate-100 flex items-start justify-between">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">

                  {selectedStudent.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>


                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedStudent.name}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Student Profile
                  </p>

                </div>

              </div>


              <button
                onClick={() =>
                  setSelectedStudent(null)
                }
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >

                <X size={20} />

              </button>

            </div>


            {/* Modal Body */}

            <div className="p-6 space-y-6">

              {/* Overview */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="bg-slate-50 rounded-xl p-4">

                  <p className="text-xs text-slate-500">
                    Career Goal
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">
                    {selectedStudent.career_goal ||
                      "Not specified"}
                  </p>

                </div>


                <div className="bg-slate-50 rounded-xl p-4">

                  <p className="text-xs text-slate-500">
                    Skill Readiness
                  </p>

                  <p
                    className={`text-xl font-bold mt-1 ${getReadinessColor(
                      selectedStudent.readiness
                    )}`}
                  >
                    {selectedStudent.readiness}%
                  </p>

                </div>


                <div className="bg-slate-50 rounded-xl p-4">

                  <p className="text-xs text-slate-500">
                    Internships
                  </p>

                  <p className="text-xl font-bold text-slate-800 mt-1">
                    {selectedStudent.internships || 0}
                  </p>

                </div>

              </div>


              {/* Email */}

              <div className="bg-slate-50 rounded-xl p-4">

                <p className="text-xs text-slate-500">
                  Email
                </p>

                <p className="text-sm font-medium text-slate-800 mt-1">
                  {selectedStudent.email}
                </p>

              </div>


              {/* Skills */}

              <div>

                <div className="flex items-center gap-2">

                  <TrendingUp
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-semibold text-slate-900">
                    Skill Profile
                  </h3>

                </div>


                <div className="mt-4 space-y-4">

                  {(selectedStudent.skills || []).map(
                    (skill) => (

                      <div key={skill.id}>

                        <div className="flex justify-between mb-1.5">

                          <span className="text-sm text-slate-700">
                            {skill.name}
                          </span>

                          <span className="text-sm font-semibold text-slate-800">
                            {skill.score}%
                          </span>

                        </div>


                        <div className="h-2 bg-slate-100 rounded-full">

                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${skill.score}%`,
                            }}
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* Gaps */}

              <div>

                <div className="flex items-center gap-2">

                  <AlertTriangle
                    size={18}
                    className="text-orange-500"
                  />

                  <h3 className="font-semibold text-slate-900">
                    Priority Skill Gaps
                  </h3>

                </div>


                <div className="flex flex-wrap gap-2 mt-3">

                  {(selectedStudent.gaps || []).length > 0 ? (

                    selectedStudent.gaps.map(
                      (gap) => (

                        <span
                          key={gap}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm"
                        >
                          {gap}
                        </span>

                      )
                    )

                  ) : (

                    <p className="text-sm text-green-600">
                      No significant skill gaps.
                    </p>

                  )}

                </div>

              </div>

            </div>


            <div className="p-6 border-t border-slate-100 flex justify-end">

              <button
                onClick={() =>
                  setSelectedStudent(null)
                }
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}

export default Students;