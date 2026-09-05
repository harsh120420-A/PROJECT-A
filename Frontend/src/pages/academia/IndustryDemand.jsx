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
import { useEffect, useState } from "react";
import { apiGet } from "../../services/api";

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

function getPriority(gap) {
  if (gap >= 30) return "Critical";
  if (gap >= 15) return "High";
  return "Moderate";
}

function getPriorityStyle(priority) {
  if (priority === "Critical") {
    return "bg-red-50 text-red-600";
  }

  if (priority === "High") {
    return "bg-orange-50 text-orange-600";
  }

  return "bg-yellow-50 text-yellow-700";
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

        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon
            size={21}
            className="text-blue-600"
          />
        </div>

      </div>

    </div>
  );
}

function IndustryDemand() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadIndustryDemand();
  }, []);

  async function loadIndustryDemand() {
    try {
      setLoading(true);
      setError("");

      const response = await apiGet(
        "/academia/industry-demand"
      );

      setData(response);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load industry demand data."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">
          Loading industry demand analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-3">

          <AlertTriangle
            size={22}
            className="text-red-500"
          />

          <div>
            <h2 className="font-semibold text-red-700">
              Unable to load industry demand
            </h2>

            <p className="text-sm text-red-600 mt-1">
              {error}
            </p>
          </div>

        </div>
      </div>
    );
  }

  const summary = data?.summary || {};
  const skills = data?.skills || [];

  const activeOpportunities =
    summary.active_opportunities || 0;

  const skillsInDemand =
    summary.skills_in_demand || 0;

  const totalSkillRequirements =
    summary.total_skill_requirements || 0;

  const skillsWithShortage =
    summary.skills_with_shortage || 0;

  const highestDemandSkill =
    summary.highest_demand_skill || "None";

  const largestGapSkill =
    summary.largest_gap_skill || "None";

  const largestGap =
    summary.largest_gap || 0;

  const prioritySkills = skills.filter(
    (item) => item.gap > 0
  );

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
          title="Active Opportunities"
          value={activeOpportunities}
          subtitle="Currently open industry opportunities"
          icon={Building2}
        />

        <StatCard
          title="Skills in Demand"
          value={skillsInDemand}
          subtitle="Skills requested by industry"
          icon={Target}
        />

        <StatCard
          title="Skill Requirements"
          value={totalSkillRequirements}
          subtitle="Across active opportunities"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Skills with Shortage"
          value={skillsWithShortage}
          subtitle="Demand exceeds student supply"
          icon={TrendingUp}
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
              Industry demand compared with current student
              skill supply.
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


        {skills.length === 0 ? (

          <div className="py-14 text-center">

            <CheckCircle2
              size={40}
              className="mx-auto text-green-500"
            />

            <h3 className="font-semibold text-slate-800 mt-4">
              No industry demand data available
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Active industry opportunities with required
              skills will appear here.
            </p>

          </div>

        ) : (

          <div className="mt-6 overflow-x-auto">

            <table className="w-full min-w-[850px]">

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
                    Opportunities
                  </th>

                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Avg. Score
                  </th>

                </tr>

              </thead>


              <tbody>

                {skills.map((item) => (

                  <tr
                    key={item.id}
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

                        <div>

                          <span className="text-sm font-semibold text-slate-800">
                            {item.name}
                          </span>

                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.category}
                          </p>

                        </div>

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

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

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

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

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


                    {/* Opportunities */}
                    <td className="py-5">

                      <div className="flex items-center gap-2">

                        <BriefcaseBusiness
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="text-sm text-slate-700">
                          {item.opportunity_count}
                        </span>

                      </div>

                    </td>


                    {/* Average score */}
                    <td className="py-5">

                      <span className="text-sm font-semibold text-slate-700">
                        {item.average_score}%
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* Demand Gap Overview */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Skill Shortages */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Skill Shortages
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Skills where industry demand exceeds
                available student supply.
              </p>

            </div>

            <AlertTriangle
              size={20}
              className="text-orange-500"
            />

          </div>


          {prioritySkills.length === 0 ? (

            <div className="py-10 text-center">

              <CheckCircle2
                size={34}
                className="mx-auto text-green-500"
              />

              <p className="text-sm text-slate-500 mt-3">
                No significant shortages detected.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-5">

              {prioritySkills
                .slice(0, 5)
                .map((item) => {

                  const priority =
                    getPriority(item.gap);

                  return (
                    <div key={item.id}>

                      <div className="flex justify-between mb-2">

                        <div className="flex items-center gap-2">

                          <span className="text-sm font-medium text-slate-700">
                            {item.name}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${getPriorityStyle(
                              priority
                            )}`}
                          >
                            {priority}
                          </span>

                        </div>

                        <span className="text-sm font-semibold text-slate-800">
                          {item.gap}% gap
                        </span>

                      </div>


                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full rounded-full ${getBarColor(
                            item.gap
                          )}`}
                          style={{
                            width: `${Math.min(
                              item.gap,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                })}

            </div>

          )}

        </section>


        {/* Demand Insight */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Demand Insight
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Current industry demand signals from active
                opportunities.
              </p>

            </div>

          </div>


          <div className="mt-6 space-y-4">

            <div className="p-4 bg-blue-50 rounded-xl">

              <div className="flex justify-between gap-4">

                <span className="text-sm font-semibold text-blue-700">
                  Highest Demand
                </span>

                <span className="text-sm font-bold text-blue-600">
                  {highestDemandSkill}
                </span>

              </div>

              <p className="text-xs text-blue-600/80 mt-2">
                This skill currently has the strongest
                normalized demand across active opportunities.
              </p>

            </div>


            <div className="p-4 bg-red-50 rounded-xl">

              <div className="flex justify-between gap-4">

                <span className="text-sm font-semibold text-red-700">
                  Largest Shortage
                </span>

                <span className="text-sm font-bold text-red-600">
                  {largestGap}%
                </span>

              </div>

              <p className="text-xs text-red-600/80 mt-2">
                {largestGapSkill} has the largest difference
                between industry demand and student supply.
              </p>

            </div>


            <div className="p-4 bg-slate-50 rounded-xl">

              <div className="flex justify-between">

                <span className="text-sm font-semibold text-slate-700">
                  Active Opportunities
                </span>

                <span className="text-sm font-bold text-slate-800">
                  {activeOpportunities}
                </span>

              </div>

              <p className="text-xs text-slate-500 mt-2">
                Industry demand is calculated from the skills
                required by these active opportunities.
              </p>

            </div>

          </div>

        </section>

      </div>


      {/* Recommended Development Areas */}
      <section>

        <div>

          <p className="text-sm text-blue-600 font-medium">
            INDUSTRY-ACADEMIA RESPONSE
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-1">
            Recommended Development Areas
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Use current demand-supply gaps to prioritize
            institutional skill development.
          </p>

        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">

          {prioritySkills
            .slice(0, 3)
            .map((item) => {

              const priority =
                getPriority(item.gap);

              return (
                <div
                  key={item.id}
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
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                        priority
                      )}`}
                    >
                      {priority}
                    </span>

                  </div>


                  <h3 className="font-semibold text-slate-900 mt-5">
                    {item.name}
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
                        Student Supply
                      </p>

                      <p className="text-lg font-bold text-slate-800 mt-1">
                        {item.supply}%
                      </p>

                    </div>

                  </div>


                  <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                    Focus institutional training and practical
                    projects on {item.name} to reduce the current
                    {` ${item.gap}%`} demand-supply gap.
                  </p>


                  <div className="flex items-center gap-1 mt-5 text-sm font-medium text-blue-600">
                    Development Priority
                    <ArrowUpRight size={15} />
                  </div>

                </div>
              );
            })}

        </div>

      </section>


      {/* Final Insight */}
      {skills.length > 0 && (
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
                Align institutional training with real
                industry demand.
              </h2>

              <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
                {largestGapSkill} currently shows the largest
                demand-supply gap at {largestGap}%. Industry
                opportunities should therefore be used as
                continuous signals for curriculum planning,
                training programs and practical projects.
              </p>

            </div>

          </div>

        </section>
      )}

    </div>
  );
}

export default IndustryDemand;