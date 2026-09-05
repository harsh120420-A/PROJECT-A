import {
  AlertTriangle,
  TrendingDown,
  Users,
  Target,
  GraduationCap,
  BookOpen,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiGet } from "../../services/api";

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

function GapCell({ value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getGapBar(value)}`}
          style={{
            width: `${Math.min(value, 100)}%`,
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

function SkillGaps() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSkillGaps();
  }, []);

  async function loadSkillGaps() {
    try {
      setLoading(true);
      setError("");

      const response = await apiGet(
        "/academia/skill-gaps"
      );

      setData(response);
    } catch (err) {
      setError(
        err.message || "Failed to load skill gap data."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">
          Loading skill gap analytics...
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
              Unable to load skill gaps
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
  const gaps = data?.gaps || [];

  const criticalSkills =
    summary.critical_skills || 0;

  const highPrioritySkills =
    summary.high_priority_skills || 0;

  const studentsAffected =
    summary.students_affected || 0;

  const largestGap =
    summary.largest_gap || 0;

  const largestGapSkill =
    summary.largest_gap_skill || "None";

  const priorityGaps = gaps.filter(
    (item) =>
      item.priority === "Critical" ||
      item.priority === "High"
  );

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
          Identify skill shortages and prioritize
          institutional development initiatives.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Critical Skills"
          value={criticalSkills}
          subtitle="Require immediate attention"
          icon={AlertTriangle}
        />

        <StatCard
          title="High Priority Skills"
          value={highPrioritySkills}
          subtitle="Require focused development"
          icon={TrendingDown}
        />

        <StatCard
          title="Students Affected"
          value={studentsAffected}
          subtitle="Across identified skill gaps"
          icon={Users}
        />

        <StatCard
          title="Largest Gap"
          value={`${largestGap}%`}
          subtitle={largestGapSkill}
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
              Compare current student readiness with the
              institutional target readiness level of 70%.
            </p>
          </div>

          <div className="flex gap-5 text-xs text-slate-500">

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              Target Readiness
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              Student Readiness
            </div>

          </div>

        </div>

        {gaps.length === 0 ? (
          <div className="py-14 text-center">
            <CheckCircle2
              size={40}
              className="mx-auto text-green-500"
            />

            <h3 className="font-semibold text-slate-800 mt-4">
              No skill gaps identified
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              All assessed skills currently meet the
              institutional target.
            </p>
          </div>
        ) : (
          <div className="mt-7 space-y-7">

            {gaps.map((item) => (

              <div key={item.id}>

                {/* Skill header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                  <div className="flex items-center gap-3">

                    <span className="font-medium text-slate-800">
                      {item.name}
                    </span>

                    <span className="text-xs text-slate-400">
                      {item.category}
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

                {/* Target bar */}
                <div className="mt-3">

                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>
                      Target Readiness
                    </span>

                    <span>
                      {item.target_score}%
                    </span>
                  </div>

                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${item.target_score}%`,
                      }}
                    />

                  </div>

                </div>

                {/* Student readiness */}
                <div className="mt-3">

                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>
                      Student Readiness
                    </span>

                    <span>
                      {item.average_score}%
                    </span>
                  </div>

                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-slate-400 rounded-full"
                      style={{
                        width: `${item.average_score}%`,
                      }}
                    />

                  </div>

                </div>

                {/* Bottom information */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-3">

                  <p className="text-xs text-slate-500">
                    {item.student_count} students assessed
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
        )}

      </section>

      {/* Skill Gap Overview */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Gap Overview
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Current skill gaps ranked by severity.
          </p>
        </div>

        <div className="mt-6 overflow-x-auto">

          <table className="w-full min-w-[600px]">

            <thead>

              <tr className="border-b border-slate-100">

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Skill
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Category
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Readiness
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Gap
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Priority
                </th>

              </tr>

            </thead>

            <tbody>

              {gaps.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-slate-50 last:border-0"
                >

                  <td className="py-4 text-sm font-medium text-slate-800">
                    {item.name}
                  </td>

                  <td className="py-4 text-sm text-slate-500">
                    {item.category}
                  </td>

                  <td className="py-4 text-sm text-slate-600">
                    {item.average_score}%
                  </td>

                  <td className="py-4">
                    <GapCell value={item.gap} />
                  </td>

                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                        item.priority
                      )}`}
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
            Convert identified skill gaps into actionable
            development programs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">

          {priorityGaps
            .slice(0, 3)
            .map((item) => {

              const isLearning =
                item.name === "Cloud Computing" ||
                item.name === "Power BI";

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5"
                >

                  <div className="flex items-start justify-between">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                      {isLearning ? (
                        <BookOpen
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
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>

                  </div>

                  <h3 className="font-semibold text-slate-900 mt-5">
                    {item.name} Development
                  </h3>

                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {item.recommendation}
                  </p>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">

                    <span className="text-xs text-slate-400">
                      Skill Development
                    </span>

                    <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                      Explore
                      <ChevronRight size={15} />
                    </button>

                  </div>

                </div>
              );
            })}

        </div>

      </section>

      {/* Institutional Recommendation */}
      {gaps.length > 0 && (
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
                Prioritize {largestGapSkill} first.
              </h2>

              <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
                {largestGapSkill} currently has the largest
                identified readiness gap at {largestGap}%.
                Institutional training, practical projects,
                and industry-supported learning can help
                address this shortage.
              </p>

            </div>

          </div>

        </section>
      )}

    </div>
  );
}

export default SkillGaps;