import {
  BriefcaseBusiness,
  Users,
  TrendingUp,
  IndianRupee,
  Building2,
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
  Award,
  Target,
} from "lucide-react";

const departmentData = [
  {
    department: "Computer Science",
    students: 420,
    placed: 361,
    rate: 86,
    average: "8.4 LPA",
  },
  {
    department: "Information Technology",
    students: 310,
    placed: 254,
    rate: 82,
    average: "7.8 LPA",
  },
  {
    department: "Electronics",
    students: 265,
    placed: 188,
    rate: 71,
    average: "6.5 LPA",
  },
  {
    department: "Mechanical",
    students: 253,
    placed: 149,
    rate: 59,
    average: "5.4 LPA",
  },
];

const placementTrend = [
  { year: "2022", rate: 62 },
  { year: "2023", rate: 68 },
  { year: "2024", rate: 72 },
  { year: "2025", rate: 77 },
  { year: "2026", rate: 76 },
];

const sectorData = [
  { sector: "Technology", students: 382, percentage: 42 },
  { sector: "Analytics", students: 176, percentage: 19 },
  { sector: "FinTech", students: 121, percentage: 13 },
  { sector: "Consulting", students: 98, percentage: 11 },
  { sector: "Manufacturing", students: 87, percentage: 10 },
  { sector: "Other", students: 42, percentage: 5 },
];

const recruiters = [
  {
    company: "TechNova Solutions",
    hires: 74,
    average: "9.2 LPA",
    sector: "Technology",
  },
  {
    company: "DataSphere Labs",
    hires: 61,
    average: "8.6 LPA",
    sector: "Analytics",
  },
  {
    company: "InnovateX",
    hires: 48,
    average: "7.9 LPA",
    sector: "Technology",
  },
  {
    company: "FinEdge Consulting",
    hires: 43,
    average: "7.5 LPA",
    sector: "FinTech",
  },
  {
    company: "AIWorks Research",
    hires: 31,
    average: "10.1 LPA",
    sector: "Artificial Intelligence",
  },
];

const salaryRanges = [
  { range: "< 4 LPA", students: 128, percentage: 14 },
  { range: "4–6 LPA", students: 284, percentage: 31 },
  { range: "6–8 LPA", students: 265, percentage: 29 },
  { range: "8–10 LPA", students: 146, percentage: 16 },
  { range: "> 10 LPA", students: 92, percentage: 10 },
];

function getRateStyle(rate) {
  if (rate >= 80) return "text-green-600";
  if (rate >= 70) return "text-yellow-600";
  return "text-red-600";
}

function getRateBar(rate) {
  if (rate >= 80) return "bg-green-500";
  if (rate >= 70) return "bg-yellow-500";
  return "bg-red-500";
}

function StatCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </p>

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
          <ArrowUpRight size={14} className="text-green-600" />

          <span className="text-xs font-medium text-green-600">
            {trend}
          </span>

          <span className="text-xs text-slate-400">
            from previous year
          </span>
        </div>
      )}
    </div>
  );
}

function PlacementAnalytics() {
  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <p className="text-sm text-blue-600 font-medium">
          INSTITUTIONAL OUTCOMES
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Placement Analytics
        </h1>

        <p className="text-slate-500 mt-2">
          Monitor placement performance, salary outcomes and
          employer engagement across the institution.
        </p>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Overall Placement Rate"
          value="76%"
          subtitle="Across graduating students"
          icon={BriefcaseBusiness}
          trend="+4.1%"
        />

        <StatCard
          title="Students Placed"
          value="952"
          subtitle="Successful placements"
          icon={Users}
          trend="+8.6%"
        />

        <StatCard
          title="Average Package"
          value="7.4 LPA"
          subtitle="Overall average salary"
          icon={IndianRupee}
          trend="+9.2%"
        />

        <StatCard
          title="Highest Package"
          value="18.5 LPA"
          subtitle="Current placement cycle"
          icon={Award}
          trend="+12.4%"
        />

      </div>


      {/* Placement Trend + Sector Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Placement Trend */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Placement Trend
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Overall placement rate across recent years.
              </p>
            </div>

            <TrendingUp
              size={20}
              className="text-slate-400"
            />

          </div>


          <div className="mt-7">

            <div className="flex items-end justify-between h-52 gap-4">

              {placementTrend.map((item) => (

                <div
                  key={item.year}
                  className="flex-1 h-full flex flex-col justify-end items-center"
                >

                  <span className="text-xs font-semibold text-slate-700 mb-2">
                    {item.rate}%
                  </span>

                  <div className="w-full max-w-12 bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">

                    <div
                      className="w-full bg-blue-600 rounded-t-lg"
                      style={{
                        height: `${item.rate}%`,
                      }}
                    />

                  </div>

                  <span className="text-xs text-slate-400 mt-2">
                    {item.year}
                  </span>

                </div>

              ))}

            </div>

          </div>


          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">

            <div>
              <p className="text-xs text-slate-400">
                Five-year improvement
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                +14%
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-green-600">
              <TrendingUp size={15} />
              Positive trend
            </div>

          </div>

        </section>


        {/* Sector Distribution */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Placement by Sector
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Where graduates are joining after placement.
              </p>
            </div>

            <Building2
              size={20}
              className="text-slate-400"
            />

          </div>


          <div className="mt-6 space-y-5">

            {sectorData.map((item) => (

              <div key={item.sector}>

                <div className="flex items-center justify-between mb-2">

                  <span className="text-sm font-medium text-slate-700">
                    {item.sector}
                  </span>

                  <div className="flex items-center gap-3">

                    <span className="text-xs text-slate-400">
                      {item.students} students
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {item.percentage}%
                    </span>

                  </div>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full">

                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${item.percentage * 2}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>


      {/* Department Placement */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-start justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Department-wise Placement
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Compare placement performance and salary outcomes.
            </p>
          </div>

          <GraduationCap
            size={20}
            className="text-slate-400"
          />

        </div>


        <div className="mt-6 overflow-x-auto">

          <table className="w-full min-w-[750px]">

            <thead>

              <tr className="border-b border-slate-100">

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Department
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Graduating Students
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Placed
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Placement Rate
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Average Package
                </th>

              </tr>

            </thead>

            <tbody>

              {departmentData.map((item) => (

                <tr
                  key={item.department}
                  className="border-b border-slate-50 last:border-0"
                >

                  <td className="py-5">

                    <span className="text-sm font-semibold text-slate-800">
                      {item.department}
                    </span>

                  </td>

                  <td className="py-5 text-sm text-slate-600">
                    {item.students}
                  </td>

                  <td className="py-5 text-sm text-slate-600">
                    {item.placed}
                  </td>

                  <td className="py-5">

                    <div className="flex items-center gap-3">

                      <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full rounded-full ${getRateBar(
                            item.rate
                          )}`}
                          style={{
                            width: `${item.rate}%`,
                          }}
                        />

                      </div>

                      <span
                        className={`text-sm font-semibold ${getRateStyle(
                          item.rate
                        )}`}
                      >
                        {item.rate}%
                      </span>

                    </div>

                  </td>

                  <td className="py-5">

                    <span className="text-sm font-semibold text-slate-800">
                      {item.average}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* Salary Distribution + Recruiters */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Salary Distribution */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Salary Distribution
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Distribution of placed students by salary range.
              </p>
            </div>

            <IndianRupee
              size={20}
              className="text-slate-400"
            />

          </div>


          <div className="mt-6 space-y-5">

            {salaryRanges.map((item) => (

              <div key={item.range}>

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-medium text-slate-700">
                    {item.range}
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {item.students}
                  </span>

                </div>

                <div className="h-3 bg-slate-100 rounded-full">

                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${item.percentage * 2.5}%`,
                    }}
                  />

                </div>

                <p className="text-xs text-slate-400 mt-1">
                  {item.percentage}% of placed students
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* Top Recruiters */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Top Recruiters
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Organizations hiring the highest number of graduates.
              </p>
            </div>

            <Building2
              size={20}
              className="text-slate-400"
            />

          </div>


          <div className="mt-5 space-y-3">

            {recruiters.map((item, index) => (

              <div
                key={item.company}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50"
              >

                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {item.company}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {item.sector}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-sm font-bold text-slate-800">
                    {item.hires}
                  </p>

                  <p className="text-xs text-slate-400">
                    {item.average}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>

      </div>


      {/* Institutional Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        <section className="bg-green-50 border border-green-100 rounded-2xl p-6">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
              <CheckCircle2
                size={20}
                className="text-green-600"
              />
            </div>

            <div>

              <p className="text-xs text-green-600 font-medium tracking-wide">
                STRENGTH
              </p>

              <h2 className="text-lg font-semibold text-green-900 mt-1">
                Computer Science leads institutional placement.
              </h2>

              <p className="text-sm text-green-800/70 mt-2 leading-relaxed">
                Computer Science currently records the highest placement
                rate at 86%, supported by strong technology-sector
                recruitment and an average package of 8.4 LPA.
              </p>

            </div>

          </div>

        </section>


        <section className="bg-orange-50 border border-orange-100 rounded-2xl p-6">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
              <Target
                size={20}
                className="text-orange-600"
              />
            </div>

            <div>

              <p className="text-xs text-orange-600 font-medium tracking-wide">
                AREA FOR IMPROVEMENT
              </p>

              <h2 className="text-lg font-semibold text-orange-900 mt-1">
                Mechanical placement requires attention.
              </h2>

              <p className="text-sm text-orange-800/70 mt-2 leading-relaxed">
                Mechanical Engineering currently has the lowest placement
                rate at 59%. Targeted industry partnerships, skill
                development and sector-specific opportunities could
                improve graduate outcomes.
              </p>

            </div>

          </div>

        </section>

      </div>


      {/* Final Institutional Insight */}
      <section className="bg-slate-900 rounded-2xl p-6 text-white">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <TrendingUp size={21} />
          </div>

          <div>

            <p className="text-xs text-slate-400 font-medium tracking-wide">
              INSTITUTIONAL OUTCOME INSIGHT
            </p>

            <h2 className="text-xl font-semibold mt-1">
              Strong industry engagement is translating into placement outcomes.
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
              The institution currently records a 76% placement rate with
              an average package of 7.4 LPA. Technology and analytics
              remain the strongest placement sectors, while departments
              with lower placement rates provide opportunities for
              targeted industry engagement and skill-development programs.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default PlacementAnalytics;