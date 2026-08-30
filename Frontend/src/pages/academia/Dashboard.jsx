import {
  Users,
  TrendingUp,
  AlertTriangle,
  BriefcaseBusiness,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Target,
  CheckCircle2,
} from "lucide-react";

const departmentData = [
  { name: "Computer Science", score: 78 },
  { name: "Information Technology", score: 72 },
  { name: "Electronics", score: 64 },
  { name: "Mechanical", score: 57 },
];

const skillDemand = [
  { skill: "Python", demand: 85, supply: 72 },
  { skill: "SQL", demand: 80, supply: 61 },
  { skill: "Machine Learning", demand: 75, supply: 45 },
  { skill: "Cloud", demand: 70, supply: 32 },
  { skill: "Power BI", demand: 65, supply: 30 },
];

const skillGaps = [
  {
    skill: "Cloud Computing",
    gap: 38,
    students: 184,
    priority: "Critical",
  },
  {
    skill: "Power BI",
    gap: 35,
    students: 169,
    priority: "Critical",
  },
  {
    skill: "Machine Learning",
    gap: 30,
    students: 143,
    priority: "High",
  },
  {
    skill: "SQL",
    gap: 19,
    students: 91,
    priority: "Moderate",
  },
];

const activities = [
  {
    title: "Industry Workshop",
    company: "TechNova Solutions",
    detail: "Cloud Computing Workshop",
    date: "Today",
  },
  {
    title: "Internship Drive",
    company: "DataSphere Labs",
    detail: "12 internship positions opened",
    date: "Yesterday",
  },
  {
    title: "Industry Collaboration",
    company: "InnovateX",
    detail: "Machine Learning project proposed",
    date: "2 days ago",
  },
];

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon size={21} className="text-blue-600" />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 mt-4">
          {trendType === "up" ? (
            <ArrowUpRight size={15} className="text-green-600" />
          ) : (
            <ArrowDownRight size={15} className="text-red-500" />
          )}

          <span
            className={`text-xs font-medium ${
              trendType === "up"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {trend}
          </span>

          <span className="text-xs text-slate-400">
            from last month
          </span>
        </div>
      )}
    </div>
  );
}

function AcademiaDashboard() {
  return (
    <div className="space-y-7">

      {/* Page Header */}
      <div>
        <p className="text-sm text-blue-600 font-medium">
          INSTITUTIONAL OVERVIEW
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Academia Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Monitor student skills, industry demand and
          institutional readiness.
        </p>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

        <StatCard
          title="Total Students"
          value="1,248"
          subtitle="Active students"
          icon={Users}
          trend="+8.4%"
          trendType="up"
        />

        <StatCard
          title="Skill Readiness"
          value="68%"
          subtitle="Average readiness"
          icon={TrendingUp}
          trend="+5.2%"
          trendType="up"
        />

        <StatCard
          title="Critical Skill Gaps"
          value="184"
          subtitle="Students affected"
          icon={AlertTriangle}
          trend="-7.1%"
          trendType="up"
        />

        <StatCard
          title="Active Internships"
          value="326"
          subtitle="Students participating"
          icon={BriefcaseBusiness}
          trend="+12.6%"
          trendType="up"
        />

        <StatCard
          title="Placement Rate"
          value="72%"
          subtitle="Current academic year"
          icon={GraduationCap}
          trend="+4.8%"
          trendType="up"
        />

      </div>


      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Skill Readiness */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Department Readiness
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Average skill readiness by department
              </p>
            </div>

            <Target size={20} className="text-slate-400" />
          </div>

          <div className="mt-6 space-y-5">

            {departmentData.map((department) => (
              <div key={department.name}>

                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {department.name}
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {department.score}%
                  </span>
                </div>

                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${department.score}%`,
                    }}
                  />
                </div>

              </div>
            ))}

          </div>

        </section>


        {/* Skill Demand */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Industry Demand vs Student Supply
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Identify where industry demand exceeds student readiness
            </p>
          </div>

          <div className="mt-6 space-y-5">

            {skillDemand.map((item) => (
              <div key={item.skill}>

                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {item.skill}
                  </span>

                  <span className="text-xs text-slate-500">
                    Demand {item.demand}% · Supply {item.supply}%
                  </span>
                </div>

                <div className="relative">

                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${item.demand}%`,
                      }}
                    />
                  </div>

                  <div
                    className="absolute top-0 left-0 h-2.5 bg-slate-400 rounded-full"
                    style={{
                      width: `${item.supply}%`,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>

          <div className="flex gap-5 mt-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              Industry Demand
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              Student Supply
            </div>
          </div>

        </section>

      </div>


      {/* Bottom Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Skill Gaps */}
        <section className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Priority Skill Gaps
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Skills requiring institutional attention
              </p>
            </div>

            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
              View All
            </button>

          </div>

          <div className="mt-5 overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="pb-3 font-medium text-slate-500">
                    Skill
                  </th>

                  <th className="pb-3 font-medium text-slate-500">
                    Gap
                  </th>

                  <th className="pb-3 font-medium text-slate-500">
                    Students
                  </th>

                  <th className="pb-3 font-medium text-slate-500">
                    Priority
                  </th>
                </tr>
              </thead>

              <tbody>

                {skillGaps.map((item) => (
                  <tr
                    key={item.skill}
                    className="border-b border-slate-50 last:border-0"
                  >

                    <td className="py-4 font-medium text-slate-800">
                      {item.skill}
                    </td>

                    <td className="py-4">
                      <span className="font-semibold text-red-500">
                        {item.gap}%
                      </span>
                    </td>

                    <td className="py-4 text-slate-600">
                      {item.students}
                    </td>

                    <td className="py-4">

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          item.priority === "Critical"
                            ? "bg-red-50 text-red-600"
                            : item.priority === "High"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {item.priority}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>


        {/* Recent Activity */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Industry Activity
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest institutional activity
            </p>
          </div>

          <div className="mt-5 space-y-5">

            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex gap-3"
              >

                <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
                  {index === 0 ? (
                    <Building2
                      size={17}
                      className="text-blue-600"
                    />
                  ) : index === 1 ? (
                    <BriefcaseBusiness
                      size={17}
                      className="text-blue-600"
                    />
                  ) : (
                    <CheckCircle2
                      size={17}
                      className="text-blue-600"
                    />
                  )}
                </div>

                <div className="min-w-0">

                  <p className="text-sm font-medium text-slate-800">
                    {activity.title}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {activity.company}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {activity.detail}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {activity.date}
                  </p>

                </div>

              </div>
            ))}

          </div>

          <button className="w-full mt-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            View Activity
          </button>

        </section>

      </div>

    </div>
  );
}

export default AcademiaDashboard;