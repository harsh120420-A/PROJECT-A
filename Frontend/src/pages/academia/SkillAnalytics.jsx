import {
  BarChart3,
  Users,
  TrendingUp,
  Brain,
  Award,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { apiGet } from "../../services/api";


function getScoreColor(score) {

  if (score >= 70) {
    return "text-green-600";
  }

  if (score >= 50) {
    return "text-yellow-600";
  }

  return "text-red-600";
}


function getBarColor(score) {

  if (score >= 70) {
    return "bg-green-500";
  }

  if (score >= 50) {
    return "bg-yellow-500";
  }

  return "bg-red-500";
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


function SkillAnalytics() {

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
   * Load analytics
   */

  useEffect(() => {

    async function loadAnalytics() {

      try {

        setLoading(true);
        setError("");

        const data =
          await apiGet(
            "/academia/skill-analytics"
          );

        setAnalytics(data);

      } catch (err) {

        console.error(
          "Failed to load skill analytics:",
          err
        );

        setError(
          err.message ||
          "Failed to load skill analytics."
        );

      } finally {

        setLoading(false);

      }

    }

    loadAnalytics();

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
            Loading skill analytics...
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
            Unable to load analytics
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


  const summary =
    analytics?.summary || {};

  const skillData =
    analytics?.skills || [];

  const proficiencyData =
    analytics?.proficiency_distribution ||
    [];


  /*
   * Strongest skills
   */

  const strongestSkills =
    [...skillData]
      .sort(
        (a, b) =>
          b.average_score -
          a.average_score
      )
      .slice(0, 3)
      .map((item) => ({
        skill: item.name,
        score: item.average_score,
      }));


  /*
   * Priority skills
   */

  const prioritySkills =
    [...skillData]
      .sort(
        (a, b) =>
          a.average_score -
          b.average_score
      )
      .slice(0, 3)
      .map((item) => ({

        skill: item.name,

        score:
          item.average_score,

        reason:
          item.average_score < 40
            ? "Low institutional readiness"
            : item.average_score < 60
            ? "Needs further development"
            : "Requires continued improvement",

      }));


  /*
   * Category readiness
   */

  const technicalSkills =
    skillData.filter(
      (skill) =>
        skill.category ===
        "Technical"
    );

  const softSkills =
    skillData.filter(
      (skill) =>
        skill.category ===
        "Soft Skill"
    );


  const technicalAverage =
    technicalSkills.length > 0
      ? Math.round(
          technicalSkills.reduce(
            (total, skill) =>
              total +
              skill.average_score,
            0
          ) /
            technicalSkills.length
        )
      : 0;


  const softAverage =
    softSkills.length > 0
      ? Math.round(
          softSkills.reduce(
            (total, skill) =>
              total +
              skill.average_score,
            0
          ) /
            softSkills.length
        )
      : 0;


  return (

    <div className="space-y-7">

      {/* Header */}

      <div>

        <p className="text-sm text-blue-600 font-medium">
          STUDENT INTELLIGENCE
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Skill Analytics
        </h1>

        <p className="text-slate-500 mt-2">
          Understand institution-wide skill readiness and
          identify areas requiring development.
        </p>

      </div>


      {/* KPI Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Average Skill Score"
          value={`${summary.average_skill_score || 0}%`}
          subtitle="Across all assessed skills"
          icon={BarChart3}
        />


        <StatCard
          title="Technical Readiness"
          value={`${summary.technical_readiness || 0}%`}
          subtitle="Technical skill average"
          icon={Brain}
        />


        <StatCard
          title="Soft Skill Readiness"
          value={`${summary.soft_skill_readiness || 0}%`}
          subtitle="Communication & soft skills"
          icon={Award}
        />


        <StatCard
          title="Students Assessed"
          value={
            summary.students_assessed || 0
          }
          subtitle="Students with skill records"
          icon={Users}
        />

      </div>


      {/* Skill Distribution + Category Readiness */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        {/* Skill Distribution */}

        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Skill Distribution
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Average proficiency across tracked skills
              </p>

            </div>

            <TrendingUp
              size={20}
              className="text-slate-400"
            />

          </div>


          <div className="mt-7 space-y-5">

            {skillData.length === 0 ? (

              <p className="text-sm text-slate-400">
                No skill data available.
              </p>

            ) : (

              skillData.map(
                (item) => (

                  <div key={item.id}>

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>

                      <span
                        className={`text-sm font-bold ${getScoreColor(
                          item.average_score
                        )}`}
                      >
                        {item.average_score}%
                      </span>

                    </div>


                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                      <div
                        className={`h-full rounded-full ${getBarColor(
                          item.average_score
                        )}`}
                        style={{
                          width: `${item.average_score}%`,
                        }}
                      />

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>


        {/* Category Readiness */}

        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Skill Category Readiness
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Compare technical and soft skill readiness
              </p>

            </div>

            <Users
              size={20}
              className="text-slate-400"
            />

          </div>


          <div className="mt-8 space-y-8">

            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium text-slate-700">
                  Technical Skills
                </span>

                <span
                  className={`text-sm font-bold ${getScoreColor(
                    technicalAverage
                  )}`}
                >
                  {technicalAverage}%
                </span>

              </div>


              <div className="h-3 bg-slate-100 rounded-full">

                <div
                  className={`h-full rounded-full ${getBarColor(
                    technicalAverage
                  )}`}
                  style={{
                    width: `${technicalAverage}%`,
                  }}
                />

              </div>

            </div>


            <div>

              <div className="flex justify-between mb-2">

                <span className="text-sm font-medium text-slate-700">
                  Soft Skills
                </span>

                <span
                  className={`text-sm font-bold ${getScoreColor(
                    softAverage
                  )}`}
                >
                  {softAverage}%
                </span>

              </div>


              <div className="h-3 bg-slate-100 rounded-full">

                <div
                  className={`h-full rounded-full ${getBarColor(
                    softAverage
                  )}`}
                  style={{
                    width: `${softAverage}%`,
                  }}
                />

              </div>

            </div>

          </div>


          <div className="mt-8 pt-5 border-t border-slate-100">

            <p className="text-xs text-slate-400">
              Institutional average
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {summary.average_skill_score || 0}%
            </p>

          </div>

        </section>

      </div>


      {/* Proficiency Distribution */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Student Proficiency Distribution
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Distribution based on each student's average skill score
          </p>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

          {proficiencyData.map(
            (item) => (

              <div
                key={item.label}
                className="border border-slate-100 rounded-xl p-5"
              >

                <div className="flex items-center justify-between">

                  <span className="font-medium text-slate-700">
                    {item.label}
                  </span>

                  <span className="text-lg font-bold text-slate-900">
                    {item.percentage}%
                  </span>

                </div>


                <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />

                </div>


                <p className="text-2xl font-bold text-slate-900 mt-4">
                  {item.count}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {item.description}
                </p>

              </div>

            )
          )}

        </div>

      </section>


      {/* Strengths + Priority Areas */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        {/* Strengths */}

        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">

              <CheckCircle2
                size={20}
                className="text-green-600"
              />

            </div>


            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Institutional Strengths
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Skills where students currently perform strongest
              </p>

            </div>

          </div>


          <div className="mt-5 space-y-4">

            {strongestSkills.map(
              (item, index) => (

                <div
                  key={item.skill}
                  className="flex items-center gap-4"
                >

                  <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center text-xs font-bold">
                    #{index + 1}
                  </div>


                  <div className="flex-1">

                    <div className="flex justify-between">

                      <span className="text-sm font-medium text-slate-700">
                        {item.skill}
                      </span>

                      <span className="text-sm font-semibold text-green-600">
                        {item.score}%
                      </span>

                    </div>


                    <div className="h-2 bg-slate-100 rounded-full mt-2">

                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{
                          width: `${item.score}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* Priority Areas */}

        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">

              <AlertTriangle
                size={20}
                className="text-red-500"
              />

            </div>


            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Priority Development Areas
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Skills requiring institutional attention
              </p>

            </div>

          </div>


          <div className="mt-5 space-y-4">

            {prioritySkills.map(
              (item) => (

                <div
                  key={item.skill}
                  className="border border-slate-100 rounded-xl p-4"
                >

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-semibold text-slate-800">
                      {item.skill}
                    </span>

                    <span className="text-sm font-bold text-red-600">
                      {item.score}%
                    </span>

                  </div>


                  <p className="text-xs text-slate-500 mt-2">
                    {item.reason}
                  </p>

                </div>

              )
            )}

          </div>

        </section>

      </div>


      {/* Institutional Insight */}

      <section className="bg-slate-900 rounded-2xl p-6 text-white">

        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">

            <BarChart3 size={20} />

          </div>


          <div>

            <p className="text-xs font-medium text-slate-300 tracking-wide">
              INSTITUTIONAL INSIGHT
            </p>

            <h2 className="text-xl font-semibold mt-1">
              Focus training where readiness is lowest.
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">

              {prioritySkills.length > 0
                ? `${prioritySkills
                    .map(
                      (skill) =>
                        skill.skill
                    )
                    .join(
                      ", "
                    )} currently show the lowest average readiness among tracked skills. These areas can be prioritized for targeted learning programs and industry-led training.`
                : "No priority development areas have been identified from the current student skill data."}

            </p>

          </div>

        </div>

      </section>

    </div>

  );
}

export default SkillAnalytics;