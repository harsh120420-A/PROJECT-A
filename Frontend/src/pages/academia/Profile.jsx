import {
  UserRound,
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";

function Profile() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Academician",
    role: "Institution Admin",
    institution: "SkillBridge Institute",
    email: "academia@skillbridge.edu",
    phone: "+91 98765 43210",
    location: "India",
  });

  const handleChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="space-y-7">

      {/* Header */}
      <div>
        <p className="text-sm text-blue-600 font-medium">
          ACCOUNT
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-1">
          Profile
        </h1>

        <p className="text-slate-500 mt-2">
          Manage your academic administrator profile and institution details.
        </p>
      </div>


      {/* Profile Header Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">

              <UserRound
                size={30}
                className="text-blue-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                {profile.name}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {profile.role}
              </p>

              <div className="flex items-center gap-1.5 mt-2">

                <ShieldCheck
                  size={15}
                  className="text-green-600"
                />

                <span className="text-xs text-green-600 font-medium">
                  Verified Institution Account
                </span>

              </div>

            </div>

          </div>


          {!editing ? (

            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>

          ) : (

            <div className="flex gap-2">

              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
              >
                <Save size={16} />
                Save Changes
              </button>

            </div>

          )}

        </div>

      </section>


      {/* Profile Information */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-center gap-2">

          <UserRound
            size={19}
            className="text-blue-600"
          />

          <div>
            <h2 className="font-semibold text-slate-900">
              Personal Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Your administrator account information.
            </p>
          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

          {/* Name */}
          <div>

            <label className="block text-xs font-medium text-slate-500 mb-2">
              Full Name
            </label>

            <div className="relative">

              <UserRound
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={profile.name}
                disabled={!editing}
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none ${
                  editing
                    ? "border-slate-200 bg-white focus:border-blue-500"
                    : "border-slate-100 bg-slate-50 text-slate-600"
                }`}
              />

            </div>

          </div>


          {/* Role */}
          <div>

            <label className="block text-xs font-medium text-slate-500 mb-2">
              Role
            </label>

            <input
              value={profile.role}
              disabled
              className="w-full px-4 py-2.5 border border-slate-100 rounded-xl text-sm bg-slate-50 text-slate-600"
            />

          </div>


          {/* Email */}
          <div>

            <label className="block text-xs font-medium text-slate-500 mb-2">
              Email Address
            </label>

            <div className="relative">

              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={profile.email}
                disabled={!editing}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none ${
                  editing
                    ? "border-slate-200 bg-white focus:border-blue-500"
                    : "border-slate-100 bg-slate-50 text-slate-600"
                }`}
              />

            </div>

          </div>


          {/* Phone */}
          <div>

            <label className="block text-xs font-medium text-slate-500 mb-2">
              Phone Number
            </label>

            <div className="relative">

              <Phone
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={profile.phone}
                disabled={!editing}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none ${
                  editing
                    ? "border-slate-200 bg-white focus:border-blue-500"
                    : "border-slate-100 bg-slate-50 text-slate-600"
                }`}
              />

            </div>

          </div>

        </div>

      </section>


      {/* Institution Information */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">

        <div className="flex items-center gap-2">

          <Building2
            size={19}
            className="text-blue-600"
          />

          <div>

            <h2 className="font-semibold text-slate-900">
              Institution Information
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Institution associated with this account.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

          <div>

            <label className="block text-xs font-medium text-slate-500 mb-2">
              Institution
            </label>

            <div className="relative">

              <Building2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={profile.institution}
                disabled={!editing}
                onChange={(e) =>
                  handleChange(
                    "institution",
                    e.target.value
                  )
                }
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none ${
                  editing
                    ? "border-slate-200 bg-white focus:border-blue-500"
                    : "border-slate-100 bg-slate-50 text-slate-600"
                }`}
              />

            </div>

          </div>


          <div>

            <label className="block text-xs font-medium text-slate-500 mb-2">
              Location
            </label>

            <div className="relative">

              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={profile.location}
                disabled={!editing}
                onChange={(e) =>
                  handleChange(
                    "location",
                    e.target.value
                  )
                }
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none ${
                  editing
                    ? "border-slate-200 bg-white focus:border-blue-500"
                    : "border-slate-100 bg-slate-50 text-slate-600"
                }`}
              />

            </div>

          </div>

        </div>

      </section>


      {/* Account Status */}
      <section className="bg-green-50 border border-green-100 rounded-2xl p-6">

        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">

            <ShieldCheck
              size={20}
              className="text-green-600"
            />

          </div>

          <div>

            <p className="text-xs text-green-600 font-medium tracking-wide">
              ACCOUNT STATUS
            </p>

            <h2 className="text-lg font-semibold text-green-900 mt-1">
              Institution account is active.
            </h2>

            <p className="text-sm text-green-800/70 mt-2">
              Your Academia Portal account currently has administrator
              access to institutional analytics, industry engagement and
              placement information.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Profile;