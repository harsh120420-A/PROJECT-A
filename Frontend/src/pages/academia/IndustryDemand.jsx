import {
  Building2,
  TrendingUp,
  Users,
  Target,
  BriefcaseBusiness,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";

const skillDemandData = [
  {
    skill: "Python",
    demand: 85,
    supply: 72,
    gap: 13,
    postings: 34,
    trend: "+12%",
  },
  {
    skill: "SQL",
    demand: 80,
    supply: 61,
    gap: 19,
    postings: 29,
    trend: "+9%",
  },
  {
    skill: "Machine Learning",
    demand: 75,
    supply: 45,
    gap: 30,
    postings: 24,
    trend: "+18%",
  },
  {
    skill: "Cloud Computing",
    demand: 70,
    supply: 32,
    gap: 38,
    postings: 21,
    trend: "+22%",
  },
  {
    skill: "Power BI",
    demand: 65,
    supply: 30,
    gap: 35,
    postings: 18,
    trend: "+16%",
  },
  {
    skill: "Java",
    demand: 62,
    supply: 58,
    gap: 4,
    postings: 16,
    trend: "+5%",
  },
  {
    skill: "React",
    demand: 59,
    supply: 54,
    gap: 5,
    postings: 14,
    trend: "+7%",
  },
];

const sectorData = [
  {
    sector: "Technology",
    demand: 82,
    partners: 18,
  },
  {
    sector: "FinTech",
    demand: 74,
    partners: 7,
  },
  {
    sector: "Analytics",
    demand: 71,
    partners: 6,
  },
  {
    sector: "Consulting",
    demand: 65,
    partners: 5,
  },
  {
    sector: "Manufacturing",
    demand: 54,
    partners: 6,
  },
];

const recommendations = [
  {
    skill: "Cloud Computing",
    demand: 70,
    readiness: 32,
    message:
      "Create an industry-supported cloud certification pathway.",
    priority: "Critical",
  },
  {
    skill: "Power BI",
    demand: 65,
    readiness: 30,
    message:
      "Partner with analytics companies for practical dashboard training.",
    priority: "Critical",
  },
  {
    skill: "Machine Learning",
    demand: 75,
    readiness: 45,
    message:
      "Launch an ML bootcamp using real-world industry datasets.",
    priority: "High",
  },
];

function getGapStyle(gap) {
  if (gap >= 30) {
    return "bg-red-50 text-red-600";
  }

  if (gap >= 15) {
    return "bg-orange-50 text-orange-600";
  }

  return "bg-green-50 text-green-600";
}

function getBarColor(gap) {
  if (gap >= 30) return "bg-red-500";
  if (gap >= 15) return "bg-orange-500";
  return "bg-green-500";
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
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

        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon
            size={21}
            className="text-blue-600"
          />
        </div>

      </div>

      {trend && (
        <div className="flex items-center gap-1 mt-4">

          <ArrowUpRight
            size={14}
            className="text-green-600"
          />

          <span className="text-xs font-medium text-green-600">
            {trend}
          </span>

          <span className="text-xs text-slate-400">
            this month
          </span>

        </div>
      )}

    </div>
  );
}

function IndustryDemand() {
  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <p className="text-sm text-blue-600 font-medium">
          INDUSTRY CONNECTION
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Industry Demand
        </h1>

        <p className="text-slate-500 mt-2">
          Understand what industries need and compare demand
          with student readiness.
        </p>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Industry Partners"
          value="42"
          subtitle="Active organizations"
          icon={Building2}
          trend="+6%"
        />

        <StatCard
          title="Skills Tracked"
          value="28"
          subtitle="Across opportunities"
          icon={Target}
        />

        <StatCard
          title="High-Demand Skills"
          value="9"
          subtitle="Demand above 60%"
          icon={TrendingUp}
          trend="+11%"
        />

        <StatCard
          title="Demand Coverage"
          value="61%"
          subtitle="Average student readiness"
          icon={Users}
          trend="+4%"
        />

      </div>


      {/* Demand Table */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              High-Demand Skills
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Industry demand compared with current student readiness.
            </p>
          </div>

          <div className="flex gap-5 text-xs text-slate-500">

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              Demand
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              Student Supply
            </div>

          </div>

        </div>


        <div className="mt-6 overflow-x-auto">

          <table className="w-full min-w-[800px]">

            <thead>

              <tr className="border-b border-slate-100">

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Skill
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Industry Demand
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Student Supply
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Gap
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Job Postings
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Trend
                </th>

              </tr>

            </thead>

            <tbody>

              {skillDemandData.map((item) => (

                <tr
                  key={item.skill}
                  className="border-b border-slate-50 last:border-0"
                >

                  {/* Skill */}
                  <td className="py-5">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Target
                          size={17}
                          className="text-blue-600"
                        />
                      </div>

                      <span className="text-sm font-semibold text-slate-800">
                        {item.skill}
                      </span>

                    </div>

                  </td>


                  {/* Demand */}
                  <td className="py-5">

                    <div className="w-32">

                      <div className="flex justify-between text-xs mb-1">

                        <span className="text-slate-400">
                          Demand
                        </span>

                        <span className="font-semibold text-slate-700">
                          {item.demand}%
                        </span>

                      </div>

                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${item.demand}%`,
                          }}
                        />
                      </div>

                    </div>

                  </td>


                  {/* Supply */}
                  <td className="py-5">

                    <div className="w-32">

                      <div className="flex justify-between text-xs mb-1">

                        <span className="text-slate-400">
                          Supply
                        </span>

                        <span className="font-semibold text-slate-700">
                          {item.supply}%
                        </span>

                      </div>

                      <div className="h-2 bg-slate-100 rounded-full">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{
                            width: `${item.supply}%`,
                          }}
                        />
                      </div>

                    </div>

                  </td>


                  {/* Gap */}
                  <td className="py-5">

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getGapStyle(
                        item.gap
                      )}`}
                    >
                      {item.gap}%
                    </span>

                  </td>


                  {/* Postings */}
                  <td className="py-5">

                    <div className="flex items-center gap-2">

                      <BriefcaseBusiness
                        size={15}
                        className="text-slate-400"
                      />

                      <span className="text-sm text-slate-700">
                        {item.postings}
                      </span>

                    </div>

                  </td>


                  {/* Trend */}
                  <td className="py-5">

                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <ArrowUpRight size={13} />
                      {item.trend}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* Sector + Demand Coverage */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Sector Demand */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Industry Sector Demand
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Demand intensity across partner industries.
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

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-medium text-slate-700">
                    {item.sector}
                  </span>

                  <div className="flex items-center gap-3">

                    <span className="text-xs text-slate-400">
                      {item.partners} partners
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {item.demand}%
                    </span>

                  </div>

                </div>

                <div className="h-2.5 bg-slate-100 rounded-full">

                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${item.demand}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* Demand Insight */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <AlertTriangle
                size={20}
                className="text-orange-500"
              />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Demand Coverage Insight
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Areas where industry requirements are not being
                sufficiently met.
              </p>

            </div>

          </div>


          <div className="mt-6 space-y-4">

            <div className="p-4 bg-red-50 rounded-xl">

              <div className="flex justify-between">

                <span className="text-sm font-semibold text-red-700">
                  Cloud Computing
                </span>

                <span className="text-sm font-bold text-red-600">
                  38% gap
                </span>

              </div>

              <p className="text-xs text-red-600/80 mt-2">
                High industry demand with low student readiness.
              </p>

            </div>


            <div className="p-4 bg-orange-50 rounded-xl">

              <div className="flex justify-between">

                <span className="text-sm font-semibold text-orange-700">
                  Power BI
                </span>

                <span className="text-sm font-bold text-orange-600">
                  35% gap
                </span>

              </div>

              <p className="text-xs text-orange-600/80 mt-2">
                Growing analytics demand requires additional training.
              </p>

            </div>


            <div className="p-4 bg-yellow-50 rounded-xl">

              <div className="flex justify-between">

                <span className="text-sm font-semibold text-yellow-700">
                  Machine Learning
                </span>

                <span className="text-sm font-bold text-yellow-600">
                  30% gap
                </span>

              </div>

              <p className="text-xs text-yellow-700/80 mt-2">
                Demand is increasing faster than student readiness.
              </p>

            </div>

          </div>

        </section>

      </div>


      {/* Recommendations */}
      <section>

        <div>
          <p className="text-sm text-blue-600 font-medium">
            INDUSTRY-ACADEMIA RESPONSE
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-1">
            Recommended Actions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Use industry demand signals to guide institutional
            skill development.
          </p>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">

          {recommendations.map((item) => (

            <div
              key={item.skill}
              className="bg-white border border-slate-200 rounded-2xl p-5"
            >

              <div className="flex items-center justify-between">

                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <GraduationCap
                    size={19}
                    className="text-blue-600"
                  />
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.priority === "Critical"
                      ? "bg-red-50 text-red-600"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  {item.priority}
                </span>

              </div>


              <h3 className="font-semibold text-slate-900 mt-5">
                {item.skill}
              </h3>


              <div className="grid grid-cols-2 gap-3 mt-4">

                <div className="bg-slate-50 rounded-lg p-3">

                  <p className="text-xs text-slate-400">
                    Industry Demand
                  </p>

                  <p className="text-lg font-bold text-slate-800 mt-1">
                    {item.demand}%
                  </p>

                </div>

                <div className="bg-slate-50 rounded-lg p-3">

                  <p className="text-xs text-slate-400">
                    Student Readiness
                  </p>

                  <p className="text-lg font-bold text-slate-800 mt-1">
                    {item.readiness}%
                  </p>

                </div>

              </div>


              <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                {item.message}
              </p>


              <button className="flex items-center gap-1 mt-5 text-sm font-medium text-blue-600 hover:text-blue-700">
                Create Initiative
                <ArrowUpRight size={15} />
              </button>

            </div>

          ))}

        </div>

      </section>


      {/* Final Insight */}
      <section className="bg-slate-900 rounded-2xl p-6 text-white">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <CheckCircle2 size={21} />
          </div>

          <div>

            <p className="text-xs text-slate-400 font-medium tracking-wide">
              INDUSTRY-ACADEMIA INSIGHT
            </p>

            <h2 className="text-xl font-semibold mt-1">
              Align institutional training with real industry demand.
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
              Cloud Computing, Machine Learning and Power BI show
              significant demand-readiness gaps. These areas provide
              the strongest opportunities for industry partnerships,
              targeted training and practical student projects.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default IndustryDemand;