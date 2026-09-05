import { useEffect, useState } from "react";
import {
  Building2,
  Handshake,
  Clock3,
  CheckCircle2,
  XCircle,
  ChevronRight,
  X,
  Loader2,
} from "lucide-react";

import { apiGet, apiPatch } from "../../services/api";


function getStatusStyle(status) {
  if (status === "Approved") {
    return "bg-green-50 text-green-700";
  }

  if (status === "Rejected") {
    return "bg-red-50 text-red-700";
  }

  return "bg-yellow-50 text-yellow-700";
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


function AcademiaCollaborations() {

  const [collaborations, setCollaborations] = useState([]);

  const [filter, setFilter] = useState("All");

  const [selectedCollaboration, setSelectedCollaboration] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");


  // --------------------------------------------------------
  // Load collaboration requests
  // --------------------------------------------------------

  const loadCollaborations = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await apiGet(
        "/industry/collaborations"
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
        "Unable to load collaboration requests."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadCollaborations();
  }, []);


  // --------------------------------------------------------
  // Update collaboration status
  // --------------------------------------------------------

  const updateStatus = async (
    collaborationId,
    status
  ) => {

    try {

      setUpdatingId(collaborationId);
      setError("");

      await apiPatch(
        `/industry/collaborations/${collaborationId}/status?status=${status}`
      );

      setCollaborations((current) =>
        current.map((item) =>
          item.id === collaborationId
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSelectedCollaboration((current) =>
        current &&
        current.id === collaborationId
          ? {
              ...current,
              status,
            }
          : current
      );

    } catch (err) {

      console.error(
        "Failed to update collaboration:",
        err
      );

      setError(
        err.message ||
        "Unable to update collaboration status."
      );

    } finally {

      setUpdatingId(null);

    }

  };


  // --------------------------------------------------------
  // Statistics
  // --------------------------------------------------------

  const totalCollaborations =
    collaborations.length;

  const pendingCollaborations =
    collaborations.filter(
      (item) => item.status === "Pending"
    ).length;

  const approvedCollaborations =
    collaborations.filter(
      (item) => item.status === "Approved"
    ).length;

  const rejectedCollaborations =
    collaborations.filter(
      (item) => item.status === "Rejected"
    ).length;


  // --------------------------------------------------------
  // Filter
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
          ACADEMIA CONNECTION
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Collaboration Requests
        </h1>

        <p className="text-slate-500 mt-2">
          Review and manage collaboration requests
          received from academic institutions.
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
          title="Total Requests"
          value={totalCollaborations}
          subtitle="Collaboration requests received"
          icon={Handshake}
        />

        <StatCard
          title="Pending"
          value={pendingCollaborations}
          subtitle="Awaiting your response"
          icon={Clock3}
        />

        <StatCard
          title="Approved"
          value={approvedCollaborations}
          subtitle="Accepted collaborations"
          icon={CheckCircle2}
        />

        <StatCard
          title="Rejected"
          value={rejectedCollaborations}
          subtitle="Declined requests"
          icon={XCircle}
        />

      </div>


      {/* Requests */}

      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Collaboration Requests
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Requests submitted by academic institutions.
            </p>

          </div>


          {/* Filters */}

          <div className="flex flex-wrap gap-2">

            {[
              "All",
              "Pending",
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
                Loading collaboration requests...
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
                No collaboration requests
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                There are no requests for this filter.
              </p>

            </div>

          )}


        {/* Request List */}

        {!loading &&
          filteredCollaborations.length > 0 && (

            <div className="mt-6 space-y-4">

              {filteredCollaborations.map((item) => (

                <div
                  key={item.id}
                  className="border border-slate-100 rounded-xl p-5 hover:border-blue-200 transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">


                    {/* Icon */}

                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">

                      <Handshake
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

                          <Clock3 size={14} />

                          {formatDate(item.created_at)}

                        </span>

                      </div>

                    </div>


                    {/* Actions */}

                    {item.status === "Pending" && (

                      <div className="flex flex-wrap gap-2">

                        <button
                          disabled={
                            updatingId === item.id
                          }
                          onClick={() =>
                            updateStatus(
                              item.id,
                              "Approved"
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                        >

                          {updatingId === item.id ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}

                          Approve

                        </button>


                        <button
                          disabled={
                            updatingId === item.id
                          }
                          onClick={() =>
                            updateStatus(
                              item.id,
                              "Rejected"
                            )
                          }
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 disabled:opacity-50"
                        >

                          <XCircle size={14} />

                          Reject

                        </button>

                      </div>

                    )}


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

              ))}

            </div>

          )}

      </section>


      {/* Collaboration Insight */}

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
              Build stronger connections with academia.
            </h2>

            <p className="text-sm text-slate-300 mt-2 max-w-4xl leading-relaxed">
              Collaboration requests allow companies to connect
              with academic institutions for projects, workshops,
              research, training and other industry-engagement
              activities.
            </p>

          </div>

        </div>

      </section>


      {/* Details Modal */}

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

                  <Handshake
                    size={22}
                    className="text-blue-600"
                  />

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

                  <Building2
                    size={18}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Academic Institution
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    Academia
                  </p>

                </div>


                <div className="bg-slate-50 rounded-xl p-4">

                  <Clock3
                    size={18}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Request Date
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {formatDate(
                      selectedCollaboration.created_at
                    )}
                  </p>

                </div>

              </div>


              {/* Actions */}

              {selectedCollaboration.status ===
                "Pending" && (

                <div className="flex flex-col sm:flex-row gap-3">

                  <button
                    disabled={
                      updatingId ===
                      selectedCollaboration.id
                    }
                    onClick={() =>
                      updateStatus(
                        selectedCollaboration.id,
                        "Approved"
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >

                    <CheckCircle2 size={17} />

                    Approve Collaboration

                  </button>


                  <button
                    disabled={
                      updatingId ===
                      selectedCollaboration.id
                    }
                    onClick={() =>
                      updateStatus(
                        selectedCollaboration.id,
                        "Rejected"
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 disabled:opacity-50"
                  >

                    <XCircle size={17} />

                    Reject Collaboration

                  </button>

                </div>

              )}

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


export default AcademiaCollaborations;