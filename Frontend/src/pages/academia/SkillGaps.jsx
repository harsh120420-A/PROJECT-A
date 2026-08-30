import {
  AlertTriangle,
  TrendingDown,
  Users,
  Target,
  GraduationCap,
  Building2,
  BookOpen,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const skillGapData = [
  {
    skill: "Cloud Computing",
    demand: 70,
    readiness: 32,
    gap: 38,
    students: 184,
    priority: "Critical",
    recommendation:
      "Launch cloud certification and industry-led workshops.",
  },
  {
    skill: "Power BI",
    demand: 65,
    readiness: 30,
    gap: 35,
    students: 169,
    priority: "Critical",
    recommendation:
      "Introduce Power BI training with real business projects.",
  },
  {
    skill: "Machine Learning",
    demand: 75,
    readiness: 45,
    gap: 30,
    students: 143,
    priority: "High",
    recommendation:
      "Conduct ML bootcamps and industry project programs.",
  },
  {
    skill: "Statistics",
    demand: 65,
    readiness: 55,
    gap: 10,
    students: 74,
    priority: "Moderate",
    recommendation:
      "Strengthen statistics through applied data-science coursework.",
  },
  {
    skill: "SQL",
    demand: 80,
    readiness: 61,
    gap: 19,
    students: 91,
    priority: "High",
    recommendation:
      "Organize advanced SQL and database optimization workshops.",
  },
];

const departmentGaps = [
  {
    department: "Computer Science",
    cloud: 42,
    ml: 31,
    powerBI: 28,
  },
  {
    department: "Information Technology",
    cloud: 35,
    ml: 27,
    powerBI: 39,
  },
  {
    department: "Electronics",
    cloud: 47,
    ml: 34,
    powerBI: 22,
  },
  {
    department: "Mechanical",
    cloud: 51,
    ml: 38,
    powerBI: 18,
  },
];

const actions = [
  {
    title: "Cloud Computing Program",
    description:
      "Create a structured cloud learning pathway with certification support.",
    type: "Learning Program",
    priority: "Critical",
  },
  {
    title: "Power BI Industry Workshop",
    description:
      "Partner with an industry expert for practical dashboard training.",
    type: "Industry Collaboration",
    priority: "Critical",
  },
  {
    title: "Machine Learning Bootcamp",
    description:
      "Provide hands-on ML training using real-world datasets and projects.",
    type: "Skill Development",
    priority: "High",
  },
];

function getPriorityStyle(priority) {
  if (priority === "Critical") {
    return "bg-red-50 text-red-600";
  }

  if (priority === "High") {
    return "bg-orange-50 text-orange-600";
  }

  return "bg-yellow-50 text-yellow-700";
}

function getGapBar(gap) {
  if (gap >= 30) return "bg-red-500";
  if (gap >= 20) return "bg-orange-500";
  return "bg-yellow-500";
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </p>

          <p className="text-xs text-slate-400 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
          <Icon
            size={21}
            className="text-red-500"
          />
        </div>

      </div>

    </div>
  );
}

function SkillGaps() {
  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <p className="text-sm text-blue-600 font-medium">
          STUDENT INTELLIGENCE
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Skill Gaps
        </h1>

        <p className="text-slate-500 mt-2">
          Identify skill shortages and prioritize institutional
          development initiatives.
        </p>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Critical Skills"
          value="2"
          subtitle="Require immediate attention"
          icon={AlertTriangle}
        />

        <StatCard
          title="High Priority Skills"
          value="3"
          subtitle="Require focused development"
          icon={TrendingDown}
        />

        <StatCard
          title="Students Affected"
          value="487"
          subtitle="Across priority skill gaps"
          icon={Users}
        />

        <StatCard
          title="Largest Gap"
          value="38%"
          subtitle="Cloud Computing"
          icon={Target}
        />

      </div>


      {/* Main Gap Analysis */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Institutional Skill Gap Analysis
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Compare industry requirements with current student readiness.
            </p>
          </div>

          <div className="flex gap-5 text-xs text-slate-500">

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              Industry Requirement
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              Student Readiness
            </div>

          </div>

        </div>


        <div className="mt-7 space-y-7">

          {skillGapData.map((item) => (

            <div key={item.skill}>

              {/* Skill header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                <div className="flex items-center gap-3">

                  <span className="font-medium text-slate-800">
                    {item.skill}
                  </span>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>

                </div>

                <div className="flex items-center gap-4 text-xs">

                  <span className="text-slate-500">
                    Gap
                  </span>

                  <span className="font-bold text-red-600">
                    {item.gap}%
                  </span>

                </div>

              </div>


              {/* Demand bar */}
              <div className="mt-3">

                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>
                    Industry Requirement
                  </span>

                  <span>
                    {item.demand}%
                  </span>
                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${item.demand}%`,
                    }}
                  />

                </div>

              </div>


              {/* Readiness bar */}
              <div className="mt-3">

                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>
                    Student Readiness
                  </span>

                  <span>
                    {item.readiness}%
                  </span>
                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{
                      width: `${item.readiness}%`,
                    }}
                  />

                </div>

              </div>


              {/* Bottom information */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-3">

                <p className="text-xs text-slate-500">
                  {item.students} students affected
                </p>

                <p className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    Recommended:
                  </span>{" "}
                  {item.recommendation}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Department Analysis */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Skill Gaps by Department
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Percentage gap between industry expectations and student readiness.
          </p>
        </div>


        <div className="mt-6 overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead>

              <tr className="border-b border-slate-100">

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Department
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Cloud
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Machine Learning
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Power BI
                </th>

              </tr>

            </thead>

            <tbody>

              {departmentGaps.map((item) => (

                <tr
                  key={item.department}
                  className="border-b border-slate-50 last:border-0"
                >

                  <td className="py-4 text-sm font-medium text-slate-800">
                    {item.department}
                  </td>

                  <td className="py-4">
                    <GapCell value={item.cloud} />
                  </td>

                  <td className="py-4">
                    <GapCell value={item.ml} />
                  </td>

                  <td className="py-4">
                    <GapCell value={item.powerBI} />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* Recommended Actions */}
      <section>

        <div>
          <p className="text-sm text-blue-600 font-medium">
            INSTITUTIONAL RESPONSE
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-1">
            Recommended Actions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Convert identified skill gaps into actionable development programs.
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">

          {actions.map((action) => (

            <div
              key={action.title}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >

              <div className="flex items-start justify-between">

                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  {action.type === "Learning Program" ? (
                    <BookOpen
                      size={19}
                      className="text-blue-600"
                    />
                  ) : action.type === "Industry Collaboration" ? (
                    <Building2
                      size={19}
                      className="text-blue-600"
                    />
                  ) : (
                    <GraduationCap
                      size={19}
                      className="text-blue-600"
                    />
                  )}
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                    action.priority
                  )}`}
                >
                  {action.priority}
                </span>

              </div>


              <h3 className="font-semibold text-slate-900 mt-5">
                {action.title}
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {action.description}
              </p>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">

                <span className="text-xs text-slate-400">
                  {action.type}
                </span>

                <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                  Explore
                  <ChevronRight size={15} />
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* Institutional Recommendation */}
      <section className="bg-slate-900 rounded-2xl p-6 text-white">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <CheckCircle2 size={21} />
          </div>

          <div>

            <p className="text-xs text-slate-400 font-medium tracking-wide">
              RECOMMENDATION
            </p>

            <h2 className="text-xl font-semibold mt-1">
              Prioritize Cloud Computing and Power BI first.
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
              These two skills combine low student readiness with meaningful
              industry demand. A targeted institutional training program,
              supported by industry workshops and practical projects, can
              address the largest identified skill shortages.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}


/* Department gap cell */

function GapCell({ value }) {
  return (
    <div className="flex items-center gap-3">

      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">

        <div
          className={`h-full rounded-full ${getGapBar(value)}`}
          style={{
            width: `${value}%`,
          }}
        />

      </div>

      <span
        className={`text-sm font-semibold ${
          value >= 40
            ? "text-red-600"
            : value >= 30
            ? "text-orange-600"
            : "text-yellow-600"
        }`}
      >
        {value}%
      </span>

    </div>
  );
}

export default SkillGaps;