import { useMemo, useState } from "react";
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

const studentsData = [
  {
    id: 1,
    name: "Aarav Sharma",
    initials: "AS",
    department: "Computer Science",
    year: "3rd Year",
    careerGoal: "Software Engineer",
    readiness: 82,
    skills: [
      { name: "Python", score: 88 },
      { name: "Java", score: 82 },
      { name: "SQL", score: 76 },
      { name: "DSA", score: 84 },
    ],
    gaps: ["Cloud Computing", "System Design"],
    internships: 2,
    status: "On Track",
  },
  {
    id: 2,
    name: "Priya Nair",
    initials: "PN",
    department: "Information Technology",
    year: "3rd Year",
    careerGoal: "Data Analyst",
    readiness: 71,
    skills: [
      { name: "Python", score: 79 },
      { name: "SQL", score: 68 },
      { name: "Power BI", score: 52 },
      { name: "Statistics", score: 74 },
    ],
    gaps: ["Power BI", "Advanced SQL"],
    internships: 1,
    status: "Needs Attention",
  },
  {
    id: 3,
    name: "Rohan Mehta",
    initials: "RM",
    department: "Computer Science",
    year: "4th Year",
    careerGoal: "ML Engineer",
    readiness: 75,
    skills: [
      { name: "Python", score: 91 },
      { name: "Machine Learning", score: 72 },
      { name: "Statistics", score: 61 },
      { name: "Cloud", score: 48 },
    ],
    gaps: ["Cloud Computing", "Statistics"],
    internships: 2,
    status: "On Track",
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    initials: "SK",
    department: "Information Technology",
    year: "2nd Year",
    careerGoal: "Business Analyst",
    readiness: 80,
    skills: [
      { name: "SQL", score: 82 },
      { name: "Power BI", score: 76 },
      { name: "Communication", score: 88 },
      { name: "Excel", score: 91 },
    ],
    gaps: ["Python", "Statistics"],
    internships: 1,
    status: "On Track",
  },
  {
    id: 5,
    name: "Vikram Singh",
    initials: "VS",
    department: "Electronics",
    year: "4th Year",
    careerGoal: "Embedded Engineer",
    readiness: 64,
    skills: [
      { name: "C++", score: 78 },
      { name: "Embedded Systems", score: 73 },
      { name: "Python", score: 54 },
      { name: "IoT", score: 61 },
    ],
    gaps: ["Cloud Computing", "Data Analytics"],
    internships: 1,
    status: "Needs Attention",
  },
  {
    id: 6,
    name: "Ananya Rao",
    initials: "AR",
    department: "Computer Science",
    year: "3rd Year",
    careerGoal: "Data Scientist",
    readiness: 69,
    skills: [
      { name: "Python", score: 84 },
      { name: "Statistics", score: 63 },
      { name: "Machine Learning", score: 58 },
      { name: "SQL", score: 71 },
    ],
    gaps: ["Machine Learning", "Cloud Computing"],
    internships: 0,
    status: "Needs Attention",
  },
  {
    id: 7,
    name: "Karan Patel",
    initials: "KP",
    department: "Mechanical",
    year: "4th Year",
    careerGoal: "Product Engineer",
    readiness: 57,
    skills: [
      { name: "CAD", score: 81 },
      { name: "Python", score: 42 },
      { name: "Data Analysis", score: 48 },
      { name: "Communication", score: 65 },
    ],
    gaps: ["Python", "Data Analytics", "Cloud"],
    internships: 1,
    status: "At Risk",
  },
  {
    id: 8,
    name: "Meera Joshi",
    initials: "MJ",
    department: "Information Technology",
    year: "3rd Year",
    careerGoal: "Full Stack Developer",
    readiness: 78,
    skills: [
      { name: "JavaScript", score: 86 },
      { name: "React", score: 81 },
      { name: "SQL", score: 73 },
      { name: "Node.js", score: 76 },
    ],
    gaps: ["Cloud Computing"],
    internships: 2,
    status: "On Track",
  },
];

function getReadinessColor(score) {
  if (score >= 75) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

function getReadinessBar(score) {
  if (score >= 75) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
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
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const departments = [
    "All Departments",
    ...new Set(studentsData.map((student) => student.department)),
  ];

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.careerGoal.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        department === "All Departments" ||
        student.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [search, department]);

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
            {filteredStudents.length} of {studentsData.length} students
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
              onChange={(e) => setSearch(e.target.value)}
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
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white"
            >
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

        </div>

        {(search || department !== "All Departments") && (
          <button
            onClick={() => {
              setSearch("");
              setDepartment("All Departments");
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
            Try changing your search or department filter.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {filteredStudents.map((student) => (

            <div
              key={student.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition"
            >

              {/* Student Header */}
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">
                    {student.initials}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {student.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {student.department} · {student.year}
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
                  {student.careerGoal}
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

                  {student.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-700"
                    >
                      {skill.name}
                      <span className="ml-1 font-semibold text-blue-600">
                        {skill.score}%
                      </span>
                    </span>
                  ))}

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
                    {student.gaps.length} skill gap
                    {student.gaps.length !== 1 ? "s" : ""}
                  </span>

                  <span className="text-xs text-slate-300">
                    ·
                  </span>

                  <span className="text-xs text-slate-500">
                    {student.internships} internship
                    {student.internships !== 1 ? "s" : ""}
                  </span>

                </div>

                <button
                  onClick={() => setSelectedStudent(student)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View Profile
                  <ChevronRight size={16} />
                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* Student Profile Modal */}
      {selectedStudent && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setSelectedStudent(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">
                  {selectedStudent.initials}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedStudent.name}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {selectedStudent.department} ·{" "}
                    {selectedStudent.year}
                  </p>
                </div>

              </div>

              <button
                onClick={() => setSelectedStudent(null)}
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
                    {selectedStudent.careerGoal}
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
                    {selectedStudent.internships}
                  </p>
                </div>

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

                  {selectedStudent.skills.map((skill) => (

                    <div key={skill.name}>

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

                  ))}

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

                  {selectedStudent.gaps.map((gap) => (
                    <span
                      key={gap}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm"
                    >
                      {gap}
                    </span>
                  ))}

                </div>

              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end">

              <button
                onClick={() => setSelectedStudent(null)}
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