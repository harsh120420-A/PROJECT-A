import { useState } from "react";
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
  BarChart3,
  GraduationCap
} from "lucide-react";

const reportMetrics = [
  {
    title: "Students Assessed",
    value: "1,248",
    change: "+8.4%",
    subtitle: "Skill assessment coverage",
    icon: Users,
  },
  {
    title: "Average Skill Readiness",
    value: "68%",
    change: "+5.2%",
    subtitle: "Across tracked skills",
    icon: Brain,
  },
  {
    title: "Industry Opportunities",
    value: "36",
    change: "+12%",
    subtitle: "Active opportunities",
    icon: BriefcaseBusiness,
  },
  {
    title: "Placement Rate",
    value: "76%",
    change: "+4.1%",
    subtitle: "Current placement cycle",
    icon: TrendingUp,
  },
];

const skillSummary = [
  { skill: "Python", readiness: 78, demand: 85 },
  { skill: "SQL", readiness: 61, demand: 80 },
  { skill: "Machine Learning", readiness: 45, demand: 75 },
  { skill: "Cloud Computing", readiness: 32, demand: 70 },
  { skill: "Power BI", readiness: 30, demand: 65 },
];

const departmentSummary = [
  {
    department: "Computer Science",
    readiness: 78,
    placement: 86,
  },
  {
    department: "Information Technology",
    readiness: 72,
    placement: 82,
  },
  {
    department: "Electronics",
    readiness: 64,
    placement: 71,
  },
  {
    department: "Mechanical",
    readiness: 57,
    placement: 59,
  },
];

const activitySummary = [
  {
    label: "Industry Workshops",
    value: 12,
    icon: BarChart3,
  },
  {
    label: "Live Projects",
    value: 11,
    icon: BriefcaseBusiness,
  },
  {
    label: "Guest Lectures",
    value: 15,
    icon: Users,
  },
  {
    label: "Research Collaborations",
    value: 5,
    icon: Building2,
  },
];

function MetricCard({
  title,
  value,
  change,
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

      <div className="flex items-center gap-1 mt-4">
        <TrendingUp
          size={14}
          className="text-green-600"
        />

        <span className="text-xs font-medium text-green-600">
          {change}
        </span>

        <span className="text-xs text-slate-400">
          from previous period
        </span>
      </div>

    </div>
  );
}

function Reports() {
  const [period, setPeriod] = useState("Current Academic Year");
  const [reportType, setReportType] = useState(
    "Institutional Overview"
  );

  const handleGenerate = () => {
    alert(
      `Report generated: ${reportType} — ${period}`
    );
  };

  const handleExport = () => {
    alert(
      "Export functionality will be connected to the backend."
    );
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

        {reportMetrics.map((item) => (

          <MetricCard
            key={item.title}
            {...item}
          />

        ))}

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
              Institutional readiness is improving, but targeted
              skill development remains necessary.
            </h2>

            <p className="text-sm text-slate-300 mt-3 max-w-4xl leading-relaxed">
              The institution currently has 1,248 assessed students
              with an average skill readiness of 68%. Technology and
              analytics remain strong areas, while Cloud Computing,
              Power BI and Machine Learning continue to show the
              largest demand-readiness gaps. Placement performance
              stands at 76%, supported by growing industry engagement.
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
                  item.demand - item.readiness;

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

          <GraduationCapIcon />

        </div>


        <div className="mt-6 space-y-5">

          {departmentSummary.map((item) => (

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

          ))}

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

          {activitySummary.map((item) => {

            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="border border-slate-100 rounded-xl p-4"
              >

                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">

                  <Icon
                    size={18}
                    className="text-blue-600"
                  />

                </div>

                <p className="text-xs text-slate-500 mt-3">
                  {item.label}
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {item.value}
                </p>

              </div>
            );
          })}

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
                Strong technology-sector alignment.
              </h2>

              <p className="text-sm text-green-800/70 mt-2 leading-relaxed">
                Python and core software skills demonstrate strong
                student readiness relative to current industry demand.
                Computer Science also records the highest placement
                performance.
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
                Emerging skills remain underdeveloped.
              </h2>

              <p className="text-sm text-red-800/70 mt-2 leading-relaxed">
                Cloud Computing, Power BI and Machine Learning show
                significant gaps between industry demand and student
                readiness. These areas should receive targeted
                institutional intervention.
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
              Institutional Overview — {period}
            </h2>

            <p className="text-sm text-slate-300 mt-2">
              Review the consolidated metrics before connecting
              report generation to the backend.
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

function GraduationCapIcon() {
  return (
    <GraduationCap
      size={20}
      className="text-slate-400"
    />
  );
}

export default Reports;