import { useEffect, useMemo, useState } from "react";
import { getIndustryOpportunities } from "../../utils/storage";
import { opportunities as defaultOpportunities } from "../../data/opportunities";
import {
  calculateSkillMatch,
  getMatchLabel,
  getMissingSkills,
} from "../../utils/skillMatching";

import {
  Search,
  Filter,
  BriefcaseBusiness,
  Building2,
  MapPin,
  CalendarDays,
  Users,
  X,
  ChevronRight,
  Code2,
  Target,
  Clock3,
  GraduationCap,
} from "lucide-react";


/* =========================================
   HELPERS
   ========================================= */

function normalizeSkills(opportunity) {
  if (Array.isArray(opportunity.skills)) {
    return opportunity.skills.map((skill) => {
      if (typeof skill === "string") {
        return {
          name: skill,
          required: 80,
        };
      }

      return {
        name: skill.name || "Skill",
        required: skill.required ?? 80,
      };
    });
  }

  if (Array.isArray(opportunity.skillRequirements)) {
    return opportunity.skillRequirements.map((skill) => {
      if (typeof skill === "string") {
        return {
          name: skill,
          required: 80,
        };
      }

      return {
        name: skill.name || "Skill",
        required: skill.required ?? 80,
      };
    });
  }

  return [];
}


function normalizeOpportunity(opportunity) {
  const skills = normalizeSkills(opportunity);

  return {
    ...opportunity,

    company:
      opportunity.company ||
      opportunity.organization ||
      "Industry Partner",

    type:
      opportunity.type ||
      "Internship",

    sector:
      opportunity.sector ||
      "General",

    description:
      opportunity.description ||
      "Industry opportunity requiring relevant technical and professional skills.",

    location:
      opportunity.location ||
      "Not specified",

    mode:
      opportunity.mode ||
      "Not specified",

    duration:
      opportunity.duration ||
      "Not specified",

    deadline:
      opportunity.deadline ||
      "Not specified",

    skills,

    match:
      typeof opportunity.match === "number"
        ? opportunity.match
        : 0,

    applications:
      opportunity.applications ?? 0,

    candidates:
      opportunity.candidates ?? 0,
  };
}


function getMatchStyle(percentage) {
  if (percentage >= 75) {
    return "bg-green-50 text-green-700";
  }

  if (percentage >= 50) {
    return "bg-yellow-50 text-yellow-700";
  }

  return "bg-slate-100 text-slate-600";
}


function getTypeStyle(type) {
  if (type === "Internship") {
    return "bg-blue-50 text-blue-700";
  }

  if (type === "Job") {
    return "bg-green-50 text-green-700";
  }

  return "bg-purple-50 text-purple-700";
}


/* =========================================
   STAT CARD
   ========================================= */

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


/* =========================================
   MAIN COMPONENT
   ========================================= */

function Opportunities() {

  const [opportunitiesData, setOpportunitiesData] =
    useState(
      defaultOpportunities.map(normalizeOpportunity)
    );

  const [search, setSearch] =
    useState("");

  const [type, setType] =
    useState("All Types");

  const [sector, setSector] =
    useState("All Sectors");

  const [selectedOpportunity, setSelectedOpportunity] =
    useState(null);


  /* =========================================
     LOAD INDUSTRY OPPORTUNITIES
     ========================================= */

  useEffect(() => {

    const industryOpportunities =
      getIndustryOpportunities();

    if (industryOpportunities.length > 0) {

      setOpportunitiesData(
        industryOpportunities.map(
          normalizeOpportunity
        )
      );

    } else {

      setOpportunitiesData(
        defaultOpportunities.map(
          normalizeOpportunity
        )
      );

    }

  }, []);


  /* =========================================
     SECTORS
     ========================================= */

  const sectors = useMemo(() => {

    const uniqueSectors = [
      ...new Set(
        opportunitiesData
          .map((item) => item.sector)
          .filter(Boolean)
      ),
    ];

    return [
      "All Sectors",
      ...uniqueSectors,
    ];

  }, [opportunitiesData]);


  /* =========================================
     FILTERING
     ========================================= */

  const filteredOpportunities =
    useMemo(() => {

      return opportunitiesData.filter(
        (opportunity) => {

          const searchText =
            search.toLowerCase().trim();

          const title =
            String(
              opportunity.title || ""
            ).toLowerCase();

          const company =
            String(
              opportunity.company || ""
            ).toLowerCase();

          const skills =
            opportunity.skills || [];

          const matchesSearch =
            !searchText ||
            title.includes(searchText) ||
            company.includes(searchText) ||
            skills.some((skill) =>
              String(
                skill.name || ""
              )
                .toLowerCase()
                .includes(searchText)
            );

          const matchesType =
            type === "All Types" ||
            opportunity.type === type;

          const matchesSector =
            sector === "All Sectors" ||
            opportunity.sector === sector;

          return (
            matchesSearch &&
            matchesType &&
            matchesSector
          );

        }
      );

    }, [
      opportunitiesData,
      search,
      type,
      sector,
    ]);


  /* =========================================
     CLEAR FILTERS
     ========================================= */

  const clearFilters = () => {

    setSearch("");
    setType("All Types");
    setSector("All Sectors");

  };


  /* =========================================
     KPI VALUES
     ========================================= */

  const internshipCount =
    opportunitiesData.filter(
      (item) =>
        item.type === "Internship"
    ).length;

  const jobCount =
    opportunitiesData.filter(
      (item) =>
        item.type === "Job"
    ).length;

  const potentialMatches =
    opportunitiesData.reduce(
      (total, item) =>
        total +
        (Number(item.candidates) || 0),
      0
    );


  /* =========================================
     RENDER
     ========================================= */

  return (

    <div className="space-y-7">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">

        <div>

          <p className="text-sm text-blue-600 font-medium">
            INDUSTRY CONNECTION
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-1">
            Opportunities
          </h1>

          <p className="text-slate-500 mt-2">
            Explore industry opportunities and identify
            students who may be suitable based on their skills.
          </p>

        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <BriefcaseBusiness size={17} />

          <span>
            {filteredOpportunities.length} opportunities available
          </span>

        </div>

      </div>


      {/* KPI CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          title="Available Opportunities"
          value={opportunitiesData.length}
          subtitle="Across industry partners"
          icon={BriefcaseBusiness}
        />

        <StatCard
          title="Internships"
          value={internshipCount}
          subtitle="Student internship opportunities"
          icon={GraduationCap}
        />

        <StatCard
          title="Jobs"
          value={jobCount}
          subtitle="Full-time opportunities"
          icon={Building2}
        />

        <StatCard
          title="Potential Matches"
          value={potentialMatches}
          subtitle="Students matching requirements"
          icon={Users}
        />

      </div>


      {/* FILTERS */}

      <section className="bg-white border border-slate-200 rounded-2xl p-4">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search opportunities, companies or skills..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
            />

          </div>


          {/* TYPE */}

          <div className="relative">

            <Filter
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white"
            >

              <option>
                All Types
              </option>

              <option>
                Internship
              </option>

              <option>
                Job
              </option>

              <option>
                Project
              </option>

            </select>

          </div>


          {/* SECTOR */}

          <div className="relative">

            <Building2
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={sector}
              onChange={(e) =>
                setSector(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm bg-white"
            >

              {sectors.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}

            </select>

          </div>

        </div>


        {(search ||
          type !== "All Types" ||
          sector !== "All Sectors") && (

          <button
            onClick={clearFilters}
            className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
          >

            <X size={14} />

            Clear filters

          </button>

        )}

      </section>


      {/* OPPORTUNITY CARDS */}

      {filteredOpportunities.length === 0 ? (

        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

          <BriefcaseBusiness
            size={40}
            className="mx-auto text-slate-300"
          />

          <h3 className="font-semibold text-slate-800 mt-4">
            No opportunities found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Try changing your search or filters.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {filteredOpportunities.map(
            (opportunity) => {

              const matchPercentage =
  calculateSkillMatch(opportunity);

const matchLabel =
  getMatchLabel(matchPercentage);

const missingSkills =
  getMissingSkills(opportunity);

              return (

                <div
                  key={opportunity.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-sm transition"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-3">

                      <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">

                        <BriefcaseBusiness
                          size={20}
                          className="text-blue-600"
                        />

                      </div>

                      <div>

                        <h3 className="font-semibold text-slate-900">
                          {opportunity.title}
                        </h3>

                        <div className="flex items-center gap-2 mt-1">

                          <Building2
                            size={14}
                            className="text-slate-400"
                          />

                          <span className="text-xs text-slate-500">
                            {opportunity.company}
                          </span>

                        </div>

                      </div>

                    </div>


                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getTypeStyle(
                        opportunity.type
                      )}`}
                    >
                      {opportunity.type}
                    </span>

                  </div>


                  {/* DESCRIPTION */}

                  <p className="text-sm text-slate-500 mt-5 leading-relaxed">
                    {opportunity.description}
                  </p>


                  {/* DETAILS */}

                  <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4">

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">

                      <MapPin size={14} />

                      {opportunity.location}

                    </div>


                    <div className="flex items-center gap-1.5 text-xs text-slate-500">

                      <Clock3 size={14} />

                      {opportunity.duration}

                    </div>


                    <div className="flex items-center gap-1.5 text-xs text-slate-500">

                      <CalendarDays size={14} />

                      Deadline {opportunity.deadline}

                    </div>

                  </div>


                  {/* SKILLS */}

                  <div className="mt-5">

                    <div className="flex items-center gap-2">

                      <Code2
                        size={15}
                        className="text-slate-400"
                      />

                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        Required Skills
                      </span>

                    </div>


                    <div className="flex flex-wrap gap-2 mt-2">

                      {opportunity.skills.map(
                        (skill) => (

                          <span
                            key={skill.name}
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs"
                          >
                            {skill.name}
                          </span>

                        )
                      )}

                    </div>

                  </div>
                  {missingSkills.length > 0 && (
  <div className="mt-3">

    <p className="text-xs font-medium text-amber-600">
      Student Skill Gaps
    </p>

    <div className="flex flex-wrap gap-2 mt-2">

      {missingSkills.map((skill) => (
        <span
          key={skill}
          className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs"
        >
          {skill}
        </span>
      ))}

    </div>

  </div>
)}


                  {/* MATCH */}

                  <div className="mt-5 p-3.5 bg-slate-50 rounded-xl">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <Target
                          size={16}
                          className="text-blue-600"
                        />

                        <span className="text-sm font-medium text-slate-700">
                          Student skill compatibility
                        </span>

                      </div>

                      <span className="font-bold text-slate-900">
                        {matchLabel}
                      </span>

                    </div>


                    <div className="mt-3 flex items-center gap-3">

                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${matchPercentage}%`,
                          }}
                        />

                      </div>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchStyle(
                          matchPercentage
                        )}`}
                      >
                        {matchPercentage}% match
                      </span>

                    </div>

                  </div>


                  {/* FOOTER */}

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">

                    <span className="text-xs text-slate-400">
                      Industry opportunity
                    </span>

                    <button
                      onClick={() =>
                        setSelectedOpportunity(
                          opportunity
                        )
                      }
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >

                      View Opportunity

                      <ChevronRight size={16} />

                    </button>

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}


      {/* =========================================
          MODAL
         ========================================= */}

      {selectedOpportunity && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() =>
              setSelectedOpportunity(null)
            }
          />


          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="p-6 border-b border-slate-100 flex items-start justify-between">

              <div className="flex gap-4">

                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">

                  <BriefcaseBusiness
                    size={22}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedOpportunity.title}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {selectedOpportunity.company}
                  </p>

                </div>

              </div>


              <button
                onClick={() =>
                  setSelectedOpportunity(null)
                }
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X size={20} />
              </button>

            </div>


            {/* MODAL BODY */}

            <div className="p-6 space-y-6">

              <div className="flex flex-wrap gap-2">

                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getTypeStyle(
                    selectedOpportunity.type
                  )}`}
                >
                  {selectedOpportunity.type}
                </span>

                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs">
                  {selectedOpportunity.sector}
                </span>

              </div>


              <div>

                <h3 className="font-semibold text-slate-900">
                  About the opportunity
                </h3>

                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  {selectedOpportunity.description}
                </p>

              </div>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div className="bg-slate-50 rounded-xl p-4">

                  <MapPin
                    size={17}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Location
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedOpportunity.location}
                  </p>

                </div>


                <div className="bg-slate-50 rounded-xl p-4">

                  <Clock3
                    size={17}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Duration
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedOpportunity.duration}
                  </p>

                </div>


                <div className="bg-slate-50 rounded-xl p-4">

                  <CalendarDays
                    size={17}
                    className="text-slate-400"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Deadline
                  </p>

                  <p className="text-sm font-semibold text-slate-800 mt-1">
                    {selectedOpportunity.deadline}
                  </p>

                </div>

              </div>


              {/* SKILLS */}

              <div>

                <h3 className="font-semibold text-slate-900">
                  Required Skills
                </h3>

                <div className="mt-3 space-y-4">

                  {selectedOpportunity.skills.map(
                    (skill) => (

                      <div key={skill.name}>

                        <div className="flex justify-between mb-1.5">

                          <span className="text-sm text-slate-700">
                            {skill.name}
                          </span>

                          <span className="text-sm font-semibold text-slate-800">
                            {skill.required}%
                          </span>

                        </div>

                        <div className="h-2 bg-slate-100 rounded-full">

                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${skill.required}%`,
                            }}
                          />

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>


              {/* MATCH SUMMARY */}

              <div className="bg-blue-50 rounded-xl p-5">

                <div className="flex items-start gap-3">

                  <Target
                    size={20}
                    className="text-blue-600 mt-0.5"
                  />

                  <div>

                    <h3 className="font-semibold text-blue-900">
                      Student Match Summary
                    </h3>

                    <p className="text-sm text-blue-800/70 mt-1">

  Current student skill compatibility is{" "}

  <strong>
    {calculateSkillMatch(selectedOpportunity)}%
  </strong>

  {" "}

  {getMatchLabel(
    calculateSkillMatch(selectedOpportunity)
  ).toLowerCase()}

  {" "}for this opportunity based on
  the available student skill profile.

</p>

                  </div>

                </div>

              </div>

            </div>


            {/* MODAL FOOTER */}

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">

              <button
                onClick={() =>
                  setSelectedOpportunity(null)
                }
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() =>
                  setSelectedOpportunity(null)
                }
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
              >
                View Matching Students
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Opportunities;