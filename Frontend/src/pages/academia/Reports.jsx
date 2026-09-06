import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  Brain,
  BriefcaseBusiness,
  Building2,
  TrendingUp,
  Target,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  GraduationCap,
} from "lucide-react";

import { apiGet } from "../../services/api";

function MetricCard({
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


function Reports() {

  const [period, setPeriod] = useState(
    "Current Academic Year"
  );

  const [reportType, setReportType] = useState(
    "Institutional Overview"
  );

  const [reportData, setReportData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // --------------------------------------------------------
  // LOAD REPORT DATA
  // --------------------------------------------------------

  const loadReports = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await apiGet(
        "/academia/reports"
      );

      setReportData(data);

    } catch (err) {

      console.error(
        "Failed to load reports:",
        err
      );

      setError(
        err.message ||
        "Unable to load report data."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadReports();

  }, []);


  // --------------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------------

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-[400px]">

        <div className="text-center">

          <RefreshCw
            size={28}
            className="mx-auto text-blue-600 animate-spin"
          />

          <p className="text-sm text-slate-500 mt-3">
            Loading institutional report...
          </p>

        </div>

      </div>
    );

  }


  // --------------------------------------------------------
  // ERROR STATE
  // --------------------------------------------------------

  if (error) {

    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

        <div className="flex items-start gap-4">

          <AlertTriangle
            size={22}
            className="text-red-600 mt-0.5"
          />

          <div>

            <h2 className="font-semibold text-red-900">
              Unable to load report
            </h2>

            <p className="text-sm text-red-700 mt-1">
              {error}
            </p>

            <button
              onClick={loadReports}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
            >
              <RefreshCw size={15} />
              Retry
            </button>

          </div>

        </div>

      </div>
    );

  }


  if (!reportData) {
    return null;
  }


  // --------------------------------------------------------
  // EXTRACT DATABASE DATA
  // --------------------------------------------------------

  const students = reportData.students || {};

  const skills = reportData.skills || {};

  const opportunities =
    reportData.opportunities || {};

  const applications =
    reportData.applications || {};

  const collaborations =
    reportData.collaborations || {};

  const skillSummary =
    reportData.skill_alignment || [];

  const departmentSummary =
    reportData.department_performance || [];


  // --------------------------------------------------------
  // DYNAMIC VALUES
  // --------------------------------------------------------

  const totalStudents =
    students.total || 0;

  const averageReadiness =
    students.average_readiness || 0;

  const activeOpportunities =
    opportunities.active || 0;

  const placementRate =
    applications.placement_rate || 0;


  // --------------------------------------------------------
  // REPORT SUMMARY
  // --------------------------------------------------------

  const largestSkillGap =
    skillSummary.length > 0
      ? [...skillSummary]
          .sort(
            (a, b) =>
              (b.demand - b.readiness) -
              (a.demand - a.readiness)
          )[0]
      : null;


  const strongestSkill =
    skillSummary.length > 0
      ? [...skillSummary]
          .sort(
            (a, b) =>
              (b.readiness - b.demand) -
              (a.readiness - a.demand)
          )[0]
      : null;


  const strongestDepartment =
    departmentSummary.length > 0
      ? [...departmentSummary]
          .sort(
            (a, b) =>
              b.placement - a.placement
          )[0]
      : null;


  // --------------------------------------------------------
  // GENERATE REPORT
  // --------------------------------------------------------

  const handleGenerate = async () => {

    await loadReports();

  };


  // --------------------------------------------------------
  // EXPORT
  // --------------------------------------------------------

  const handleExport = () => {

    const reportText = `
${reportType}
${period}

Institution: ${reportData.institution?.name || "N/A"}

Students Assessed: ${totalStudents}
Average Skill Readiness: ${averageReadiness}%
Active Opportunities: ${activeOpportunities}
Placement Rate: ${placementRate}%

Total Skills: ${skills.total || 0}
Average Skill Score: ${skills.average_score || 0}%

Total Applications: ${applications.total || 0}
Shortlisted: ${applications.shortlisted || 0}
Selected: ${applications.selected || 0}
Rejected: ${applications.rejected || 0}

Total Collaborations: ${collaborations.total || 0}
Active Collaborations: ${collaborations.active || 0}
Pending Collaborations: ${collaborations.pending || 0}
Completed Collaborations: ${collaborations.completed || 0}
    `.trim();

    const blob = new Blob(
      [reportText],
      {
        type: "text/plain;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "academia-institutional-report.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

  };


  return (
    <div className="space-y-7">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

        <div>

          <p className="text-sm text-blue-600 font-medium">
            INSTITUTIONAL INTELLIGENCE
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            Reports
          </h1>

          <p className="text-slate-500 mt-2">
            Consolidated institutional insights across skills,
            industry engagement and placement outcomes.
          </p>

        </div>


        <div className="flex flex-wrap gap-3">

          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
          >
            <RefreshCw size={16} />
            Generate Report
          </button>


          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
          >
            <Download size={16} />
            Export
          </button>

        </div>

      </div>


      {/* Controls */}

      <section className="bg-white border border-slate-200 rounded-2xl p-5">

        <div className="flex items-center gap-2 mb-4">

          <FileText
            size={18}
            className="text-blue-600"
          />

          <h2 className="font-semibold text-slate-900">
            Report Configuration
          </h2>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>

            <label className="block text-xs font-medium text-slate-500 mb-2">
              Report Type
            </label>

            <select
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value)
              }
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm outline-none focus:border-blue-500"
            >
              <option>
                Institutional Overview
              </option>

              <option>
                Skill Development Report
              </option>

              <option>
                Industry Engagement Report
              </option>

              <option>
                Placement Performance Report
              </option>

              <option>
                Department Performance Report
              </option>

            </select>

          </div>


          <div>

            <label className="block text-xs font-medium text-slate-500 mb-2">
              Reporting Period
            </label>

            <div className="relative">

              <CalendarDays
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value)
                }
                className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-white text-sm outline-none focus:border-blue-500"
              >
                <option>
                  Current Academic Year
                </option>

                <option>
                  Previous Academic Year
                </option>

                <option>
                  Current Semester
                </option>

                <option>
                  Previous Semester
                </option>

              </select>

            </div>

          </div>

        </div>

      </section>


      {/* KPI Metrics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <MetricCard
          title="Students Assessed"
          value={totalStudents.toLocaleString()}
          subtitle="Skill assessment coverage"
          icon={Users}
        />

        <MetricCard
          title="Average Skill Readiness"
          value={`${averageReadiness}%`}
          subtitle="Across tracked students"
          icon={Brain}
        />

        <MetricCard
          title="Industry Opportunities"
          value={activeOpportunities}
          subtitle="Active opportunities"
          icon={BriefcaseBusiness}
        />

        <MetricCard
          title="Placement Rate"
          value={`${placementRate}%`}
          subtitle="Based on application outcomes"
          icon={TrendingUp}
        />

      </div>


      {/* Executive Summary */}

      <section className="bg-slate-900 rounded-2xl p-6 text-white">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">

            <FileText size={21} />

          </div>


          <div>

            <p className="text-xs text-slate-400 font-medium tracking-wide">
              EXECUTIVE SUMMARY
            </p>

            <h2 className="text-xl font-semibold mt-1">
              Institutional readiness is currently at{" "}
              {averageReadiness}%.
            </h2>

            <p className="text-sm text-slate-300 mt-3 max-w-4xl leading-relaxed">

              The institution currently has{" "}
              {totalStudents.toLocaleString()} assessed{" "}
              {totalStudents === 1
                ? "student"
                : "students"}{" "}
              with an average skill readiness of{" "}
              {averageReadiness}%.
              There are{" "}
              {activeOpportunities} active industry{" "}
              {activeOpportunities === 1
                ? "opportunity"
                : "opportunities"}{" "}
              and the current application-based placement
              rate is {placementRate}%.

              {largestSkillGap && (
                <>
                  {" "}
                  The largest current demand-readiness gap is
                  observed in{" "}
                  <strong>
                    {largestSkillGap.skill}
                  </strong>.
                </>
              )}

            </p>

          </div>

        </div>

      </section>


      {/* Skill & Industry Alignment */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Skill & Industry Alignment
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Compare student readiness against current industry demand.
            </p>

          </div>

          <Target
            size={20}
            className="text-slate-400"
          />

        </div>


        <div className="mt-6 overflow-x-auto">

          {skillSummary.length === 0 ? (

            <p className="text-sm text-slate-500 py-6 text-center">
              No skill alignment data available.
            </p>

          ) : (

            <table className="w-full min-w-[650px]">

              <thead>

                <tr className="border-b border-slate-100">

                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Skill
                  </th>

                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Student Readiness
                  </th>

                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Industry Demand
                  </th>

                  <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Alignment
                  </th>

                </tr>

              </thead>


              <tbody>

                {skillSummary.map((item) => {

                  const gap =
                    item.demand -
                    item.readiness;

                  return (
                    <tr
                      key={item.skill}
                      className="border-b border-slate-50 last:border-0"
                    >

                      <td className="py-4">

                        <span className="text-sm font-semibold text-slate-800">
                          {item.skill}
                        </span>

                      </td>


                      <td className="py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">

                            <div
                              className="h-full bg-slate-400 rounded-full"
                              style={{
                                width: `${item.readiness}%`,
                              }}
                            />

                          </div>

                          <span className="text-sm text-slate-700">
                            {item.readiness}%
                          </span>

                        </div>

                      </td>


                      <td className="py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">

                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{
                                width: `${item.demand}%`,
                              }}
                            />

                          </div>

                          <span className="text-sm text-slate-700">
                            {item.demand}%
                          </span>

                        </div>

                      </td>


                      <td className="py-4">

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            gap >= 30
                              ? "bg-red-50 text-red-600"
                              : gap >= 15
                              ? "bg-orange-50 text-orange-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {gap <= 10
                            ? "Strong"
                            : gap <= 20
                            ? "Moderate"
                            : "Needs Attention"}
                        </span>

                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          )}

        </div>

      </section>


      {/* Department Performance */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Department Performance
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Compare skill readiness and placement outcomes.
            </p>

          </div>

          <GraduationCap
            size={20}
            className="text-slate-400"
          />

        </div>


        <div className="mt-6 space-y-5">

          {departmentSummary.length === 0 ? (

            <p className="text-sm text-slate-500 py-6 text-center">
              No department data available.
            </p>

          ) : (

            departmentSummary.map((item) => (

              <div key={item.department}>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">

                  <span className="text-sm font-semibold text-slate-700">
                    {item.department}
                  </span>

                  <div className="flex items-center gap-5 text-xs">

                    <span className="text-slate-500">
                      Readiness{" "}
                      <strong className="text-slate-800">
                        {item.readiness}%
                      </strong>
                    </span>

                    <span className="text-slate-500">
                      Placement{" "}
                      <strong className="text-slate-800">
                        {item.placement}%
                      </strong>
                    </span>

                  </div>

                </div>


                <div className="grid grid-cols-2 gap-3">

                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${item.readiness}%`,
                      }}
                    />

                  </div>


                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${item.placement}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            ))

          )}

        </div>


        <div className="flex flex-wrap gap-5 mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            Skill Readiness
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Placement Rate
          </div>

        </div>

      </section>


      {/* Collaboration Summary */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Industry Collaboration Summary
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Institutional engagement with industry partners.
          </p>

        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          <div className="border border-slate-100 rounded-xl p-4">

            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">

              <Building2
                size={18}
                className="text-blue-600"
              />

            </div>

            <p className="text-xs text-slate-500 mt-3">
              Total Collaborations
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {collaborations.total || 0}
            </p>

          </div>


          <div className="border border-slate-100 rounded-xl p-4">

            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">

              <CheckCircle2
                size={18}
                className="text-blue-600"
              />

            </div>

            <p className="text-xs text-slate-500 mt-3">
              Active
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {collaborations.active || 0}
            </p>

          </div>


          <div className="border border-slate-100 rounded-xl p-4">

            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">

              <CalendarDays
                size={18}
                className="text-blue-600"
              />

            </div>

            <p className="text-xs text-slate-500 mt-3">
              Pending
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {collaborations.pending || 0}
            </p>

          </div>


          <div className="border border-slate-100 rounded-xl p-4">

            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">

              <TrendingUp
                size={18}
                className="text-blue-600"
              />

            </div>

            <p className="text-xs text-slate-500 mt-3">
              Completed
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {collaborations.completed || 0}
            </p>

          </div>

        </div>

      </section>


      {/* Key Findings */}

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
                KEY STRENGTH
              </p>

              <h2 className="text-lg font-semibold text-green-900 mt-1">

                {strongestSkill
                  ? `${strongestSkill.skill} shows strong readiness.`
                  : "No strength data available."}

              </h2>


              <p className="text-sm text-green-800/70 mt-2 leading-relaxed">

                {strongestSkill
                  ? `${strongestSkill.skill} currently has ${strongestSkill.readiness}% student readiness against ${strongestSkill.demand}% industry demand.`
                  : "Skill performance data will appear here once assessment data is available."}

                {strongestDepartment && (
                  <>
                    {" "}
                    {strongestDepartment.department} currently records
                    the highest placement performance at{" "}
                    {strongestDepartment.placement}%.
                  </>
                )}

              </p>

            </div>

          </div>

        </section>


        <section className="bg-red-50 border border-red-100 rounded-2xl p-6">

          <div className="flex items-start gap-4">

            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">

              <AlertTriangle
                size={20}
                className="text-red-500"
              />

            </div>


            <div>

              <p className="text-xs text-red-600 font-medium tracking-wide">
                KEY RISK
              </p>


              <h2 className="text-lg font-semibold text-red-900 mt-1">

                {largestSkillGap
                  ? `${largestSkillGap.skill} needs attention.`
                  : "No major skill gap identified."}

              </h2>


              <p className="text-sm text-red-800/70 mt-2 leading-relaxed">

                {largestSkillGap
                  ? `${largestSkillGap.skill} has ${largestSkillGap.readiness}% student readiness compared with ${largestSkillGap.demand}% industry demand.`
                  : "The system currently has insufficient skill-demand data to identify a major risk."}

              </p>

            </div>

          </div>

        </section>

      </div>


      {/* Final Report Action */}

      <section className="bg-slate-900 rounded-2xl p-6 text-white">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <p className="text-xs text-slate-400 font-medium tracking-wide">
              REPORT READY
            </p>

            <h2 className="text-xl font-semibold mt-1">
              {reportType} — {period}
            </h2>

            <p className="text-sm text-slate-300 mt-2">
              Report data is generated from the current
              institutional database.
            </p>

          </div>


          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-900 rounded-xl text-sm font-semibold hover:bg-slate-100 shrink-0"
          >
            <Download size={17} />
            Export Report
          </button>

        </div>

      </section>

    </div>
  );
}


export default Reports;