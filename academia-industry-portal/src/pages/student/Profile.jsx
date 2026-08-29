import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { defaultProfile } from "../../data/profile";
import {
  getProfile,
  saveProfile
} from "../../utils/storage";

function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedProfile = getProfile();

    if (storedProfile) {
      setProfile({
        ...defaultProfile,
        ...storedProfile
      });
    }
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value
    }));

    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    saveProfile(profile);
    setSaved(true);
  }

  const requiredFields = [
    "name",
    "email",
    "college",
    "degree",
    "branch",
    "graduationYear",
    "careerGoal"
  ];

  const completedFields = requiredFields.filter(
    (field) =>
      profile[field] &&
      profile[field].toString().trim() !== ""
  ).length;

  const completionPercentage = Math.round(
    (completedFields / requiredFields.length) * 100
  );

  return (
    <StudentLayout>
      <div className="p-8">

        {/* Page Header */}

        <div className="mb-8">

          <p className="text-sm text-blue-600 font-medium">
            PROFILE
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Student Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Keep your academic and career information up to date.
          </p>

        </div>

        {/* Profile Summary */}

        <div className="bg-white border rounded-2xl p-6 mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
                {profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : "S"}
              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  {profile.name || "Student"}
                </h2>

                <p className="text-slate-500 mt-1">
                  {profile.careerGoal
                    ? `Aspiring ${profile.careerGoal}`
                    : "Career goal not set"}
                </p>

              </div>

            </div>

            <div className="w-full md:w-64">

              <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-500">
                  Profile Completion
                </span>

                <span className="font-semibold text-blue-600">
                  {completionPercentage}%
                </span>

              </div>

              <div className="h-2 bg-slate-100 rounded-full">

                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{
                    width: `${completionPercentage}%`
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* Profile Form */}

        <form onSubmit={handleSubmit}>

          {/* Personal Information */}

          <div className="bg-white border rounded-2xl p-6 mb-6">

            <h2 className="text-xl font-semibold">
              Personal Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Basic information about you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              {/* Name */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Email */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Phone */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

          </div>

          {/* Academic Information */}

          <div className="bg-white border rounded-2xl p-6 mb-6">

            <h2 className="text-xl font-semibold">
              Academic Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Add your current academic details.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              {/* College */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  College / Institution
                </label>

                <input
                  type="text"
                  name="college"
                  value={profile.college}
                  onChange={handleChange}
                  placeholder="Your college or university"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Degree */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Degree
                </label>

                <select
                  name="degree"
                  value={profile.degree}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >

                  <option value="">
                    Select degree
                  </option>

                  <option value="B.Tech">
                    B.Tech
                  </option>

                  <option value="B.E.">
                    B.E.
                  </option>

                  <option value="B.Sc">
                    B.Sc
                  </option>

                  <option value="BCA">
                    BCA
                  </option>

                  <option value="M.Tech">
                    M.Tech
                  </option>

                  <option value="MCA">
                    MCA
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* Branch */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Branch / Specialization
                </label>

                <input
                  type="text"
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

              {/* Graduation Year */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Graduation Year
                </label>

                <select
                  name="graduationYear"
                  value={profile.graduationYear}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >

                  <option value="">
                    Select year
                  </option>

                  <option value="2026">
                    2026
                  </option>

                  <option value="2027">
                    2027
                  </option>

                  <option value="2028">
                    2028
                  </option>

                  <option value="2029">
                    2029
                  </option>

                  <option value="2030">
                    2030
                  </option>

                </select>

              </div>

            </div>

          </div>

          {/* Career Information */}

          <div className="bg-white border rounded-2xl p-6 mb-6">

            <h2 className="text-xl font-semibold">
              Career Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Help us understand your career preferences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

              {/* Career Goal */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Career Goal
                </label>

                <select
                  name="careerGoal"
                  value={profile.careerGoal}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >

                  <option value="">
                    Select career goal
                  </option>

                  <option value="Data Scientist">
                    Data Scientist
                  </option>

                  <option value="Data Analyst">
                    Data Analyst
                  </option>

                  <option value="Software Engineer">
                    Software Engineer
                  </option>

                  <option value="Machine Learning Engineer">
                    Machine Learning Engineer
                  </option>

                  <option value="Business Analyst">
                    Business Analyst
                  </option>

                  <option value="Cloud Engineer">
                    Cloud Engineer
                  </option>

                  <option value="Cybersecurity Analyst">
                    Cybersecurity Analyst
                  </option>

                </select>

              </div>

              {/* Location */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Preferred Location
                </label>

                <input
                  type="text"
                  name="preferredLocation"
                  value={profile.preferredLocation}
                  onChange={handleChange}
                  placeholder="Bangalore / Remote"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

          </div>

          {/* Save */}

          <div className="flex items-center justify-end gap-4">

            {saved && (
              <p className="text-sm text-green-600 font-medium">
                Profile saved successfully.
              </p>
            )}

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Save Profile
            </button>

          </div>

        </form>

      </div>
    </StudentLayout>
  );
}

export default Profile;