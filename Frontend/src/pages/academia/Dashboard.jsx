import { useEffect, useState } from "react";

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

import { apiGet } from "../../services/api";


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

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h2>

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

          {trendType === "up" ? (
            <ArrowUpRight
              size={15}
              className="text-green-600"
            />
          ) : (
            <ArrowDownRight
              size={15}
              className="text-red-500"
            />
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

  const [dashboard, setDashboard] =
    useState(null);

  const [placement, setPlacement] =
    useState(null);

  const [skillDemand, setSkillDemand] =
    useState([]);

  const [skillGaps, setSkillGaps] =
    useState([]);

  const [opportunities, setOpportunities] =
    useState([]);

  const [collaborations, setCollaborations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {

    async function loadDashboard() {

      try {

        setLoading(true);
        setError("");

        const [
          dashboardData,
          placementData,
          demandData,
          gapsData,
          opportunitiesData,
          collaborationsData,
        ] = await Promise.all([

          apiGet("/academia/dashboard"),

          apiGet("/academia/placement-analytics"),

          apiGet("/academia/industry-demand"),

          apiGet("/academia/skill-gaps"),

          apiGet("/academia/opportunities"),

          apiGet("/academia/collaborations"),

        ]);


        setDashboard(
          dashboardData
        );

        setPlacement(
          placementData
        );

        setSkillDemand(
          demandData || []
        );

        setSkillGaps(
          gapsData || []
        );

        setOpportunities(
          opportunitiesData || []
        );

        setCollaborations(
          collaborationsData || []
        );


      } catch (err) {

        console.error(
          "Failed to load academia dashboard:",
          err
        );

        setError(
          err.message ||
          "Failed to load academia dashboard."
        );

      } finally {

        setLoading(false);

      }

    }

    loadDashboard();

  }, []);


  /*
   * Loading
   */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-sm text-slate-500 mt-4">
            Loading Academia Dashboard...
          </p>

        </div>

      </div>

    );

  }


  /*
   * Error
   */

  if (error) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md">

          <h2 className="text-xl font-semibold text-red-600">
            Unable to load dashboard
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium"
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  /*
   * Prepare dashboard data
   */

  const totalStudents =
    dashboard?.stats?.total_students || 0;

  const averageReadiness =
    dashboard?.stats?.average_readiness || 0;

  const activeInternships =
    placement?.summary?.active_opportunities || 0;

  const placementRate =
    placement?.summary?.placement_rate || 0;


  /*
   * Critical skill gap count
   *
   * We use the number of students
   * affected by the largest current gap.
   */

  const criticalGapStudents =
    skillGaps.length > 0
      ? skillGaps[0].student_count || 0
      : 0;


  /*
   * Show the five most relevant
   * industry-demand skills.
   */

  const displayedDemand =
  Array.isArray(skillDemand)
    ? skillDemand.slice(0, 5)
    : Array.isArray(skillDemand?.skills)
      ? skillDemand.skills.slice(0, 5)
      : [];


  /*
   * Show top four skill gaps.
   */

  const displayedGaps =
  Array.isArray(skillGaps)
    ? skillGaps.slice(0, 4)
    : Array.isArray(skillGaps?.gaps)
      ? skillGaps.gaps.slice(0, 4)
      : [];


  /*
   * Build recent activity from
   * real opportunities and collaborations.
   */

  const recentActivities = [

    ...opportunities.slice(0, 3).map(
      (opportunity) => ({
        title: "Industry Opportunity",
        company:
          opportunity.company,
        detail:
          `${opportunity.type} opportunity opened`,
        date:
          opportunity.title,
        icon: "opportunity",
      })
    ),

    ...collaborations.slice(0, 3).map(
      (collaboration) => ({
        title:
          "Industry Collaboration",
        company:
          collaboration.company,
        detail:
          collaboration.title,
        date:
          collaboration.status,
        icon: "collaboration",
      })
    ),

  ].slice(0, 4);


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
          value={totalStudents}
          subtitle="Active students"
          icon={Users}
        />


        <StatCard
          title="Skill Readiness"
          value={`${averageReadiness}%`}
          subtitle="Average readiness"
          icon={TrendingUp}
        />


        <StatCard
          title="Critical Skill Gaps"
          value={criticalGapStudents}
          subtitle="Students affected"
          icon={AlertTriangle}
        />


        <StatCard
          title="Active Internships"
          value={activeInternships}
          subtitle="Active industry opportunities"
          icon={BriefcaseBusiness}
        />


        <StatCard
          title="Placement Rate"
          value={`${placementRate}%`}
          subtitle="Current placement rate"
          icon={GraduationCap}
        />

      </div>


      {/* Main Analytics Row */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        {/* Department Readiness */}

        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Department Readiness
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Department-level analytics will appear once department data is available.
              </p>

            </div>

            <Target
              size={20}
              className="text-slate-400"
            />

          </div>


          <div className="mt-8 border border-dashed rounded-xl p-8 text-center">

            <GraduationCap
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="text-sm font-medium text-slate-600 mt-3">
              Department analytics coming next
            </p>

            <p className="text-xs text-slate-400 mt-1">
              The current Student model does not yet store department information.
            </p>

          </div>

        </section>


        {/* Industry Demand */}

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

            {displayedDemand.length === 0 ? (

              <p className="text-sm text-slate-400">
                No industry demand data available.
              </p>

            ) : (

              displayedDemand.map((item) => (

                <div key={item.id}>

                  <div className="flex justify-between mb-2">

                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
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

              ))

            )}

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

          </div>


          <div className="mt-5 overflow-x-auto">

            {displayedGaps.length === 0 ? (

              <div className="py-8 text-center text-sm text-slate-400">
                No significant skill gaps found.
              </div>

            ) : (

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

                  {displayedGaps.map(
                    (item) => {

                      const priority =
                        item.gap >= 30
                          ? "Critical"
                          : item.gap >= 20
                          ? "High"
                          : "Moderate";


                      return (

                        <tr
                          key={item.id}
                          className="border-b border-slate-50 last:border-0"
                        >

                          <td className="py-4 font-medium text-slate-800">
                            {item.name}
                          </td>


                          <td className="py-4">

                            <span className="font-semibold text-red-500">
                              {item.gap}%
                            </span>

                          </td>


                          <td className="py-4 text-slate-600">
                            {item.student_count}
                          </td>


                          <td className="py-4">

                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                priority === "Critical"
                                  ? "bg-red-50 text-red-600"
                                  : priority === "High"
                                  ? "bg-orange-50 text-orange-600"
                                  : "bg-yellow-50 text-yellow-600"
                              }`}
                            >
                              {priority}
                            </span>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>


        {/* Recent Industry Activity */}

        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Recent Industry Activity
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest opportunities and collaborations
            </p>

          </div>


          <div className="mt-5 space-y-5">

            {recentActivities.length === 0 ? (

              <p className="text-sm text-slate-400">
                No recent industry activity.
              </p>

            ) : (

              recentActivities.map(
                (activity, index) => (

                  <div
                    key={index}
                    className="flex gap-3"
                  >

                    <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">

                      {activity.icon ===
                      "opportunity" ? (

                        <BriefcaseBusiness
                          size={17}
                          className="text-blue-600"
                        />

                      ) : (

                        <Building2
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

                )
              )

            )}

          </div>


          <button
            onClick={() =>
              window.location.href =
                "/academia/opportunities"
            }
            className="w-full mt-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View Activity
          </button>

        </section>

      </div>

    </div>

  );
}

export default AcademiaDashboard;