import {
  BarChart3,
  Users,
  TrendingUp,
  Brain,
  Award,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const skillData = [
  { skill: "Python", score: 78 },
  { skill: "SQL", score: 65 },
  { skill: "Java", score: 58 },
  { skill: "Statistics", score: 55 },
  { skill: "Machine Learning", score: 45 },
  { skill: "Cloud Computing", score: 32 },
  { skill: "Power BI", score: 30 },
];

const departmentData = [
  { department: "Computer Science", score: 78 },
  { department: "Information Technology", score: 72 },
  { department: "Electronics", score: 64 },
  { department: "Mechanical", score: 57 },
];

const proficiencyData = [
  {
    label: "Advanced",
    count: 225,
    percentage: 18,
    description: "Highly proficient",
  },
  {
    label: "Intermediate",
    count: 574,
    percentage: 46,
    description: "Industry-ready in core areas",
  },
  {
    label: "Basic",
    count: 349,
    percentage: 28,
    description: "Needs further development",
  },
  {
    label: "Beginner",
    count: 100,
    percentage: 8,
    description: "Requires foundational training",
  },
];

const strongestSkills = [
  { skill: "Python", score: 78 },
  { skill: "SQL", score: 65 },
  { skill: "Java", score: 58 },
];

const prioritySkills = [
  {
    skill: "Power BI",
    score: 30,
    reason: "Low institutional readiness",
  },
  {
    skill: "Cloud Computing",
    score: 32,
    reason: "High industry relevance",
  },
  {
    skill: "Machine Learning",
    score: 45,
    reason: "Growing industry demand",
  },
];

function getScoreColor(score) {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function getBarColor(score) {
  if (score >= 70) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
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
          value="68%"
          subtitle="Across all assessed skills"
          icon={BarChart3}
        />

        <StatCard
          title="Technical Readiness"
          value="71%"
          subtitle="Technical skill average"
          icon={Brain}
        />

        <StatCard
          title="Soft Skill Readiness"
          value="74%"
          subtitle="Communication & leadership"
          icon={Award}
        />

        <StatCard
          title="Students Assessed"
          value="1,248"
          subtitle="Current academic year"
          icon={Users}
        />

      </div>


      {/* Skill Distribution + Department */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Skill Distribution */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Skill Distribution
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Average proficiency across key technical skills
              </p>
            </div>

            <TrendingUp
              size={20}
              className="text-slate-400"
            />

          </div>


          <div className="mt-7 space-y-5">

            {skillData.map((item) => (

              <div key={item.skill}>

                <div className="flex items-center justify-between mb-2">

                  <span className="text-sm font-medium text-slate-700">
                    {item.skill}
                  </span>

                  <span
                    className={`text-sm font-bold ${getScoreColor(
                      item.score
                    )}`}
                  >
                    {item.score}%
                  </span>

                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full ${getBarColor(
                      item.score
                    )}`}
                    style={{
                      width: `${item.score}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* Department Readiness */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Department Readiness
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Compare average readiness between departments
              </p>
            </div>

            <Users
              size={20}
              className="text-slate-400"
            />

          </div>


          <div className="mt-7 space-y-7">

            {departmentData.map((item, index) => (

              <div key={item.department}>

                <div className="flex items-center justify-between mb-2">

                  <div className="flex items-center gap-3">

                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                      {index + 1}
                    </div>

                    <span className="text-sm font-medium text-slate-700">
                      {item.department}
                    </span>

                  </div>

                  <span
                    className={`text-sm font-bold ${getScoreColor(
                      item.score
                    )}`}
                  >
                    {item.score}%
                  </span>

                </div>

                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full ${getBarColor(
                      item.score
                    )}`}
                    style={{
                      width: `${item.score}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>


          <div className="mt-7 pt-5 border-t border-slate-100">

            <p className="text-xs text-slate-400">
              Institutional average
            </p>

            <div className="flex items-center gap-2 mt-1">

              <span className="text-2xl font-bold text-slate-900">
                68%
              </span>

              <span className="text-xs text-green-600 font-medium">
                +5.2% this semester
              </span>

            </div>

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
            Distribution of students according to their overall skill level
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">

          {proficiencyData.map((item) => (

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

          ))}

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

            {strongestSkills.map((item, index) => (

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

            ))}

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

            {prioritySkills.map((item) => (

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

            ))}

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
              Cloud Computing, Power BI and Machine Learning currently
              show the lowest institutional readiness among the tracked
              technical skills. These areas can be prioritized for
              industry-led workshops, certifications and targeted
              learning programs.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default SkillAnalytics;