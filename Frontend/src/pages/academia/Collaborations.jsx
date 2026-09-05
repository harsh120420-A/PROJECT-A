import { useEffect, useState } from "react";
import {
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  Presentation,
  FlaskConical,
  Lightbulb,
  Handshake,
  ChevronRight,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { apiGet } from "../../services/api";


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

  if (status === "Pending") {
    return "bg-yellow-50 text-yellow-700";
  }

  if (status === "Approved") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "Rejected") {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-600";
}


function formatDate(date) {
  if (!date) {
    return "Not specified";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function StatCard({ title, value, subtitle, icon: Icon }) {
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


function Collaborations() {

  const [collaborations, setCollaborations] = useState([]);

  const [filter, setFilter] = useState("All");

  const [selectedCollaboration, setSelectedCollaboration] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // --------------------------------------------------------
  // Load collaborations from backend
  // --------------------------------------------------------

  useEffect(() => {

    const loadCollaborations = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await apiGet(
          "/academia/collaborations"
        );

        setCollaborations(
          Array.isArray(data) ? data : []
        );

      } catch (err) {

        console.error(
          "Failed to load collaborations:",
          err
        );

        setError(
          err.message ||
          "Unable to load collaborations."
        );

      } finally {

        setLoading(false);

      }

    };

    loadCollaborations();

  }, []);


  // --------------------------------------------------------
  // Derived statistics
  // --------------------------------------------------------

  const totalCollaborations =
    collaborations.length;

  const pendingCollaborations =
    collaborations.filter(
      (item) => item.status === "Pending"
    ).length;

  const activeCollaborations =
    collaborations.filter(
      (item) => item.status === "Active"
    ).length;

  const totalPartners =
    new Set(
      collaborations.map(
        (item) => item.company_id
      )
    ).size;


  // --------------------------------------------------------
  // Filtering
  // --------------------------------------------------------

  const filteredCollaborations =
    filter === "All"
      ? collaborations
      : collaborations.filter(
          (item) => item.status === filter
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


      {/* Error */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>

      )}


      {/* KPI Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Total Collaborations"
          value={totalCollaborations}
          subtitle="Recorded collaboration requests"
          icon={Handshake}
        />

        <StatCard
          title="Industry Partners"
          value={totalPartners}
          subtitle="Organizations represented"
          icon={Building2}
        />

        <StatCard
          title="Active Collaborations"
          value={activeCollaborations}
          subtitle="Currently active"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Pending Requests"
          value={pendingCollaborations}
          subtitle="Awaiting company response"
          icon={CalendarDays}
        />

      </div>


      {/* Collaboration Categories */}

      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">

        {[
          {
            label: "Total",
            count: totalCollaborations,
            icon: Handshake,
          },
          {
            label: "Active",
            count: activeCollaborations,
            icon: BriefcaseBusiness,
          },
          {
            label: "Pending",
            count: pendingCollaborations,
            icon: CalendarDays,
          },
          {
            label: "Partners",
            count: totalPartners,
            icon: Building2,
          },
        ].map((item) => {

          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >

              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">

                <Icon
                  size={18}
                  className="text-slate-600"
                />

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
              Collaboration requests and industry engagement.
            </p>

          </div>


          {/* Filters */}

          <div className="flex flex-wrap gap-2">

            {[
              "All",
              "Pending",
              "Active",
              "Approved",
              "Rejected",
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


        {/* Loading */}

        {loading && (

          <div className="flex items-center justify-center py-16">

            <div className="flex items-center gap-2 text-slate-500">

              <Loader2
                size={20}
                className="animate-spin"
              />

              <span className="text-sm">
                Loading collaborations...
              </span>

            </div>

          </div>

        )}


        {/* Empty */}

        {!loading &&
          !error &&
          filteredCollaborations.length === 0 && (

            <div className="text-center py-16">

              <Handshake
                size={36}
                className="mx-auto text-slate-300"
              />

              <h3 className="text-sm font-semibold text-slate-700 mt-4">
                No collaborations found
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                There are no collaboration records for this filter.
              </p>

            </div>

          )}


        {/* Collaboration List */}

        {!loading &&
          filteredCollaborations.length > 0 && (

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


                      {/* Main information */}

                      <div className="flex-1">

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="font-semibold text-slate-900">
                            {item.title}
                          </h3>

                          {item.type && (

                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyle(
                                item.type
                              )}`}
                            >
                              {item.type}
                            </span>

                          )}

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

                            {formatDate(item.created_at)}

                          </span>

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

          )}

      </section>


      {/* Industry Partners */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Industry Partners
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Organizations represented in collaboration requests.
            </p>

          </div>

          <Handshake
            size={21}
            className="text-slate-400"
          />

        </div>


        <div className="mt-6 overflow-x-auto">

          <table className="w-full min-w-[500px]">

            <thead>

              <tr className="border-b border-slate-100">

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Organization
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Collaborations
                </th>

                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {Array.from(
                new Map(
                  collaborations.map((item) => [
                    item.company_id,
                    item.company,
                  ])
                )
              ).map(([companyId, companyName]) => {

                const companyCollaborations =
                  collaborations.filter(
                    (item) =>
                      item.company_id === companyId
                  );

                const hasActive =
                  companyCollaborations.some(
                    (item) =>
                      item.status === "Active" ||
                      item.status === "Approved"
                  );

                return (

                  <tr
                    key={companyId}
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
                          {companyName}
                        </span>

                      </div>

                    </td>


                    <td className="py-4 text-sm text-slate-600">
                      {companyCollaborations.length}
                    </td>


                    <td className="py-4">

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          hasActive
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {hasActive
                          ? "Active"
                          : "Pending"}
                      </span>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

          {!loading &&
            collaborations.length === 0 && (

              <p className="text-sm text-slate-400 text-center py-8">
                No industry partners found.
              </p>

            )}

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
              Collaboration requests provide a structured way for
              academic institutions and industry partners to establish
              practical engagement. Approved collaborations can
              eventually contribute to workshops, projects, research,
              internships and verified student outcomes.
            </p>

          </div>

        </div>

      </section>


      {/* Detail Modal */}

      {selectedCollaboration && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() =>
              setSelectedCollaboration(null)
            }
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
                onClick={() =>
                  setSelectedCollaboration(null)
                }
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >

                <X size={20} />

              </button>

            </div>


            {/* Modal Body */}

            <div className="p-6 space-y-6">


              <div className="flex flex-wrap gap-2">

                {selectedCollaboration.type && (

                  <span
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getTypeStyle(
                      selectedCollaboration.type
                    )}`}
                  >
                    {selectedCollaboration.type}
                  </span>

                )}

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
                  {selectedCollaboration.description ||
                    "No description has been provided."}
                </p>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


                <div className="bg-slate-50 rounded-xl p-4">

                  <CalendarDays
                    size={18}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Created
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {formatDate(
                      selectedCollaboration.created_at
                    )}
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


              <div className="bg-blue-50 rounded-xl p-5">

                <div className="flex items-start gap-3">

                  <Handshake
                    size={20}
                    className="text-blue-600 mt-0.5"
                  />

                  <div>

                    <h3 className="font-semibold text-blue-800">
                      Collaboration Status
                    </h3>

                    <p className="text-sm text-blue-700/80 mt-1">

                      This collaboration is currently{" "}

                      <strong>
                        {selectedCollaboration.status}
                      </strong>

                      . Further engagement can be tracked as the
                      collaboration progresses.

                    </p>

                  </div>

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
                      Successful industry collaborations can support
                      practical learning, industry exposure and
                      student skill development.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* Footer */}

            <div className="p-6 border-t border-slate-100 flex justify-end">

              <button
                onClick={() =>
                  setSelectedCollaboration(null)
                }
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