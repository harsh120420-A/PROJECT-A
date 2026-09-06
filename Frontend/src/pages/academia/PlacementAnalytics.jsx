import { useEffect, useState } from "react";

import { apiGet } from "../../services/api";

import {
  BriefcaseBusiness,
  Users,
  TrendingUp,
  IndianRupee,
  Building2,
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
  Target,
  FileText,
} from "lucide-react";



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
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlacementAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiGet("/academia/placement-analytics");

        setPlacementData(data);
      } catch (err) {
        console.error(
          "Failed to load placement analytics:",
          err
        );

        setError(
          err.message ||
            "Unable to load placement analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPlacementAnalytics();
  }, []);

  const branchAnalytics =
    placementData?.branch_analytics || [];

  const recruiterAnalytics =
    placementData?.recruiter_analytics || [];

  const institutionalInsights =
    placementData?.institutional_insights || {};


  const sectorAnalytics = placementData?.sector_analytics || [];

  const placementTrend =
  placementData?.placement_trend || [];

  const salaryAnalytics =
  placementData?.salary_analytics || [];

  const strongestBranch =
    institutionalInsights?.strongest_branch || null;

  const weakestBranch =
    institutionalInsights?.weakest_branch || null;

  // --------------------------------------------------------
  // Loading state
  // --------------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-sm text-slate-500 mt-4">
            Loading placement analytics...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------
  // Error state
  // --------------------------------------------------------

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm text-blue-600 font-medium">
            INSTITUTIONAL OUTCOMES
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            Placement Analytics
          </h1>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
          <p className="text-sm font-semibold text-red-700">
            Unable to load placement analytics
          </p>

          <p className="text-sm text-red-600 mt-2">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* ====================================================
          HEADER
      ==================================================== */}

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

      {/* ====================================================
          KPI CARDS
      ==================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Selection Rate"
          value={`${placementData?.summary?.selection_rate || 0}%`}
          subtitle="Selected applications from shortlisted"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Selected Students"
          value={placementData?.summary?.selected || 0}
          subtitle="Successful selections"
          icon={Users}
        />

        <StatCard
          title="Total Applications"
          value={
            placementData?.summary?.total_applications || 0
          }
          subtitle="Applications received"
          icon={FileText}
        />

        <StatCard
          title="Active Opportunities"
          value={
            placementData?.summary?.active_opportunities || 0
          }
          subtitle="Currently active opportunities"
          icon={BriefcaseBusiness}
        />
      </div>

      {/* ====================================================
          PLACEMENT TREND + SECTOR DISTRIBUTION
      ==================================================== */}

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
                    {item.placement_rate}%
                  </span>

                  <div className="w-full max-w-12 bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      className="w-full bg-blue-600 rounded-t-lg"
                      style={{
                        height: `${Math.min(item.placement_rate, 100)}%`,
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
                Overall improvement
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                <p className="text-xl font-bold text-slate-900 mt-1">
  {placementTrend.length >= 2
    ? `${
        placementTrend[placementTrend.length - 1]
          .placement_rate -
        placementTrend[0].placement_rate
      }%`
    : "0%"}
</p>
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
  {sectorAnalytics.length > 0 ? (
    sectorAnalytics.map((item) => {
      const percentage = item.selection_rate || 0;

      return (
        <div key={item.sector}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              {item.sector}
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {item.applications} applications · {item.selected} selected
              </span>

              <span className="text-sm font-semibold text-slate-800">
                {percentage}%
              </span>
            </div>
          </div>

          <div className="h-2.5 bg-slate-100 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>
        </div>
      );
    })
  ) : (
    <p className="text-sm text-slate-400">
      No sector data available yet.
    </p>
  )}
</div>
        </section>
      </div>

      {/* ====================================================
          BRANCH ANALYTICS
      ==================================================== */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Branch-wise Selection Analytics
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Compare student participation and selection
              outcomes across branches.
            </p>
          </div>

          <GraduationCap
            size={20}
            className="text-slate-400"
          />
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-187.5">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Branch
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Students
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Selected
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Selection Rate
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Applications
                </th>
              </tr>
            </thead>

            <tbody>
              {branchAnalytics.length > 0 ? (
                branchAnalytics.map((item) => (
                  <tr
                    key={item.branch}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-5">
                      <span className="text-sm font-semibold text-slate-800">
                        {item.branch}
                      </span>
                    </td>

                    <td className="py-5 text-sm text-slate-600">
                      {item.students}
                    </td>

                    <td className="py-5 text-sm text-slate-600">
                      {item.selected}
                    </td>

                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getRateBar(
                              item.selection_rate
                            )}`}
                            style={{
                              width: `${Math.min(
                                item.selection_rate,
                                100
                              )}%`,
                            }}
                          />
                        </div>

                        <span
                          className={`text-sm font-semibold ${getRateStyle(
                            item.selection_rate
                          )}`}
                        >
                          {item.selection_rate}%
                        </span>
                      </div>
                    </td>

                    <td className="py-5">
                      <span className="text-sm font-semibold text-slate-800">
                        {item.applications}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="py-8 text-center text-sm text-slate-400"
                  >
                    No branch analytics available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ====================================================
          SALARY DISTRIBUTION + TOP RECRUITERS
      ==================================================== */}

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
            {salaryAnalytics.length > 0 ? (
              salaryAnalytics.map((item) => (
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
                        width: `${Math.min(
                          item.percentage,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {item.percentage}% of placed students
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400">
                  No salary data available yet.
                </p>
              </div>
            )}
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
                Organizations hiring the highest number of
                graduates.
              </p>
            </div>

            <Building2
              size={20}
              className="text-slate-400"
            />
          </div>

          <div className="mt-5 space-y-3">
            {recruiterAnalytics.length > 0 ? (
              recruiterAnalytics.map((item, index) => (
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
                      {item.applications} applications
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {item.selected} selected
                    </p>

                    <p className="text-xs text-slate-400">
                      {item.selection_rate}% selection rate
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400">
                  No recruiter data available.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ====================================================
          DYNAMIC INSTITUTIONAL INSIGHTS
      ==================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Strongest Branch */}

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
                {strongestBranch
                  ? `${strongestBranch.branch} leads institutional placement.`
                  : "No leading branch identified yet."}
              </h2>

              <p className="text-sm text-green-800/70 mt-2 leading-relaxed">
                {strongestBranch
                  ? `${strongestBranch.branch} currently records the highest selection rate at ${strongestBranch.selection_rate}%, with ${strongestBranch.selected} selected from ${strongestBranch.applications} applications.`
                  : "Branch-level placement data will appear here once student application activity is available."}
              </p>
            </div>
          </div>
        </section>

        {/* Weakest Branch */}

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
                {weakestBranch
                  ? `${weakestBranch.branch} requires attention.`
                  : "No improvement area identified yet."}
              </h2>

              <p className="text-sm text-orange-800/70 mt-2 leading-relaxed">
                {weakestBranch
                  ? `${weakestBranch.branch} currently has the lowest selection rate at ${weakestBranch.selection_rate}%, with ${weakestBranch.selected} selected from ${weakestBranch.applications} applications.`
                  : "Branch-level placement data will appear here once student application activity is available."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ====================================================
          FINAL INSTITUTIONAL INSIGHT
      ==================================================== */}

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
              Industry engagement is generating measurable
              application and selection outcomes.
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
              The institution currently has{" "}
              <span className="font-semibold text-white">
                {placementData?.summary?.total_applications || 0}
              </span>{" "}
              applications across{" "}
              <span className="font-semibold text-white">
                {placementData?.summary?.total_opportunities || 0}
              </span>{" "}
              opportunities, with{" "}
              <span className="font-semibold text-white">
                {placementData?.summary?.selected || 0}
              </span>{" "}
              successful selections. Continued industry
              engagement and targeted skill development can
              further improve student outcomes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PlacementAnalytics;