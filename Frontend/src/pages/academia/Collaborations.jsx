import { useState } from "react";
import {
  Building2,
  Users,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Presentation,
  FlaskConical,
  Lightbulb,
  Handshake,
  Clock3,
  MapPin,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";

const collaborationsData = [
  {
    id: 1,
    title: "Cloud Computing Workshop",
    company: "TechNova Solutions",
    type: "Workshop",
    status: "Upcoming",
    date: "12 Sep 2026",
    time: "10:00 AM",
    location: "Seminar Hall A",
    participants: 48,
    description:
      "Hands-on introduction to cloud infrastructure, deployment and modern cloud services.",
    focus: ["Cloud Computing", "DevOps", "Linux"],
  },
  {
    id: 2,
    title: "Machine Learning Bootcamp",
    company: "AIWorks Research",
    type: "Training",
    status: "Upcoming",
    date: "18 Sep 2026",
    time: "09:30 AM",
    location: "Computer Lab 2",
    participants: 35,
    description:
      "Practical machine learning training using real-world datasets and industry case studies.",
    focus: ["Python", "Machine Learning", "Statistics"],
  },
  {
    id: 3,
    title: "Industry Expert Guest Lecture",
    company: "DataSphere Labs",
    type: "Guest Lecture",
    status: "Completed",
    date: "25 Aug 2026",
    time: "02:00 PM",
    location: "Auditorium",
    participants: 120,
    description:
      "Industry session covering current data analytics practices and career opportunities.",
    focus: ["Data Analytics", "SQL", "Power BI"],
  },
  {
    id: 4,
    title: "Smart Campus Innovation Challenge",
    company: "InnovateX",
    type: "Innovation Challenge",
    status: "Active",
    date: "01 Sep 2026",
    time: "09:00 AM",
    location: "Innovation Lab",
    participants: 64,
    description:
      "Students collaborate with industry mentors to develop solutions for smart campus problems.",
    focus: ["IoT", "React", "Cloud Computing"],
  },
  {
    id: 5,
    title: "Industry Live Project",
    company: "InsightWorks",
    type: "Live Project",
    status: "Active",
    date: "05 Sep 2026",
    time: "10:00 AM",
    location: "Hybrid",
    participants: 24,
    description:
      "Students work on a real business intelligence project using industry-provided datasets.",
    focus: ["Power BI", "SQL", "Data Analysis"],
  },
  {
    id: 6,
    title: "Research Collaboration Program",
    company: "TechResearch Labs",
    type: "Research",
    status: "Active",
    date: "20 Sep 2026",
    time: "11:00 AM",
    location: "Research Centre",
    participants: 12,
    description:
      "Faculty and industry researchers collaborate on applied artificial intelligence research.",
    focus: ["Artificial Intelligence", "Research", "Machine Learning"],
  },
];

const partnershipData = [
  {
    company: "TechNova Solutions",
    category: "Training Partner",
    activities: 6,
    status: "Active",
  },
  {
    company: "DataSphere Labs",
    category: "Industry Partner",
    activities: 4,
    status: "Active",
  },
  {
    company: "AIWorks Research",
    category: "Research Partner",
    activities: 3,
    status: "Active",
  },
  {
    company: "InnovateX",
    category: "Project Partner",
    activities: 5,
    status: "Active",
  },
];

function getTypeIcon(type) {
  if (type === "Workshop") {
    return Presentation;
  }

  if (type === "Training") {
    return GraduationCap;
  }

  if (type === "Guest Lecture") {
    return Presentation;
  }

  if (type === "Innovation Challenge") {
    return Lightbulb;
  }

  if (type === "Live Project") {
    return BriefcaseBusiness;
  }

  return FlaskConical;
}

function getTypeStyle(type) {
  if (type === "Workshop" || type === "Training") {
    return "bg-blue-50 text-blue-700";
  }

  if (type === "Innovation Challenge") {
    return "bg-purple-50 text-purple-700";
  }

  if (type === "Live Project") {
    return "bg-green-50 text-green-700";
  }

  if (type === "Research") {
    return "bg-orange-50 text-orange-700";
  }

  return "bg-slate-100 text-slate-700";
}

function getStatusStyle(status) {
  if (status === "Active") {
    return "bg-green-50 text-green-700";
  }

  if (status === "Upcoming") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-slate-100 text-slate-600";
}

function StatCard({ title, value, subtitle, icon: Icon }) {
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
    </div>
  );
}

function Collaborations() {
  const [filter, setFilter] = useState("All");
  const [selectedCollaboration, setSelectedCollaboration] =
    useState(null);

  const filteredCollaborations =
    filter === "All"
      ? collaborationsData
      : collaborationsData.filter(
          (item) => item.type === filter
        );

  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <p className="text-sm text-blue-600 font-medium">
          INDUSTRY CONNECTION
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Collaborations
        </h1>

        <p className="text-slate-500 mt-2">
          Manage academic-industry workshops, projects,
          research and engagement activities.
        </p>
      </div>


      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Active Partnerships"
          value="18"
          subtitle="Ongoing institutional partnerships"
          icon={Handshake}
        />

        <StatCard
          title="Industry Partners"
          value="42"
          subtitle="Organizations engaged"
          icon={Building2}
        />

        <StatCard
          title="Active Projects"
          value="11"
          subtitle="Live industry projects"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Upcoming Activities"
          value="7"
          subtitle="Scheduled this month"
          icon={CalendarDays}
        />

      </div>


      {/* Collaboration Categories */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">

        {[
          {
            label: "Workshops",
            icon: Presentation,
            count: 12,
          },
          {
            label: "Training",
            icon: GraduationCap,
            count: 8,
          },
          {
            label: "Guest Lectures",
            icon: Presentation,
            count: 15,
          },
          {
            label: "Innovation",
            icon: Lightbulb,
            count: 6,
          },
          {
            label: "Live Projects",
            icon: BriefcaseBusiness,
            count: 11,
          },
          {
            label: "Research",
            icon: FlaskConical,
            count: 5,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                <Icon size={18} className="text-slate-600" />
              </div>

              <p className="text-xs text-slate-500 mt-3">
                {item.label}
              </p>

              <p className="text-xl font-bold text-slate-900 mt-1">
                {item.count}
              </p>
            </div>
          );
        })}

      </section>


      {/* Activities */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Collaboration Activities
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current and upcoming academic-industry engagement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            {[
              "All",
              "Workshop",
              "Training",
              "Guest Lecture",
              "Innovation Challenge",
              "Live Project",
              "Research",
            ].map((item) => (

              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filter === item
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>

            ))}

          </div>

        </div>


        <div className="mt-6 space-y-4">

          {filteredCollaborations.map((item) => {

            const Icon = getTypeIcon(item.type);

            return (
              <div
                key={item.id}
                className="border border-slate-100 rounded-xl p-5 hover:border-blue-200 transition"
              >

                <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Icon
                      size={20}
                      className="text-blue-600"
                    />
                  </div>


                  {/* Main info */}
                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyle(
                          item.type
                        )}`}
                      >
                        {item.type}
                      </span>

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </div>


                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">

                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Building2 size={14} />
                        {item.company}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays size={14} />
                        {item.date}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin size={14} />
                        {item.location}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Users size={14} />
                        {item.participants} participants
                      </span>

                    </div>

                  </div>


                  {/* Skills */}
                  <div className="lg:w-64">

                    <p className="text-xs text-slate-400 mb-2">
                      Focus Areas
                    </p>

                    <div className="flex flex-wrap gap-1.5">

                      {item.focus.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-xs text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}

                    </div>

                  </div>


                  {/* Action */}
                  <button
                    onClick={() =>
                      setSelectedCollaboration(item)
                    }
                    className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 shrink-0"
                  >
                    Details
                    <ChevronRight size={16} />
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </section>


      {/* Partnerships */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Industry Partnerships
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Organizations actively collaborating with the institution.
            </p>
          </div>

          <Handshake
            size={21}
            className="text-slate-400"
          />

        </div>


        <div className="mt-6 overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead>
              <tr className="border-b border-slate-100">

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Organization
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Partnership
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Activities
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {partnershipData.map((partner) => (

                <tr
                  key={partner.company}
                  className="border-b border-slate-50 last:border-0"
                >

                  <td className="py-4">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Building2
                          size={17}
                          className="text-blue-600"
                        />
                      </div>

                      <span className="text-sm font-semibold text-slate-800">
                        {partner.company}
                      </span>

                    </div>

                  </td>

                  <td className="py-4 text-sm text-slate-600">
                    {partner.category}
                  </td>

                  <td className="py-4 text-sm text-slate-600">
                    {partner.activities}
                  </td>

                  <td className="py-4">

                    <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                      {partner.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* Institutional Insight */}
      <section className="bg-slate-900 rounded-2xl p-6 text-white">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Handshake size={21} />
          </div>

          <div>

            <p className="text-xs text-slate-400 font-medium tracking-wide">
              COLLABORATION INSIGHT
            </p>

            <h2 className="text-xl font-semibold mt-1">
              Convert industry engagement into measurable student outcomes.
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
              Workshops, live projects, research collaborations and
              innovation challenges give students opportunities to
              develop skills in practical environments. Collaboration
              activity should ultimately contribute to skill development,
              internship participation and verified portfolio outcomes.
            </p>

          </div>

        </div>

      </section>


      {/* Detail Modal */}
      {selectedCollaboration && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setSelectedCollaboration(null)}
          />


          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">

                  {(() => {
                    const Icon = getTypeIcon(
                      selectedCollaboration.type
                    );

                    return (
                      <Icon
                        size={22}
                        className="text-blue-600"
                      />
                    );
                  })()}

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedCollaboration.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {selectedCollaboration.company}
                  </p>

                </div>

              </div>


              <button
                onClick={() => setSelectedCollaboration(null)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>

            </div>


            {/* Modal Body */}
            <div className="p-6 space-y-6">

              <div className="flex flex-wrap gap-2">

                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getTypeStyle(
                    selectedCollaboration.type
                  )}`}
                >
                  {selectedCollaboration.type}
                </span>

                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusStyle(
                    selectedCollaboration.status
                  )}`}
                >
                  {selectedCollaboration.status}
                </span>

              </div>


              <div>

                <h3 className="font-semibold text-slate-900">
                  About the collaboration
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {selectedCollaboration.description}
                </p>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-slate-50 rounded-xl p-4">

                  <CalendarDays
                    size={18}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Date & Time
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedCollaboration.date}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {selectedCollaboration.time}
                  </p>

                </div>


                <div className="bg-slate-50 rounded-xl p-4">

                  <MapPin
                    size={18}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Location
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedCollaboration.location}
                  </p>

                </div>


                <div className="bg-slate-50 rounded-xl p-4">

                  <Users
                    size={18}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Participants
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedCollaboration.participants} students
                  </p>

                </div>


                <div className="bg-slate-50 rounded-xl p-4">

                  <Building2
                    size={18}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Industry Partner
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedCollaboration.company}
                  </p>

                </div>

              </div>


              <div>

                <h3 className="font-semibold text-slate-900">
                  Skill Focus
                </h3>

                <div className="flex flex-wrap gap-2 mt-3">

                  {selectedCollaboration.focus.map((skill) => (

                    <span
                      key={skill}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>


              <div className="bg-green-50 rounded-xl p-5">

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={20}
                    className="text-green-600 mt-0.5"
                  />

                  <div>

                    <h3 className="font-semibold text-green-800">
                      Expected Outcome
                    </h3>

                    <p className="text-sm text-green-700/80 mt-1">
                      Participation can contribute to practical skill
                      development and may be reflected in student
                      learning and portfolio records.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Footer */}
            <div className="p-6 border-t border-slate-100 flex justify-end">

              <button
                onClick={() => setSelectedCollaboration(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Collaborations;