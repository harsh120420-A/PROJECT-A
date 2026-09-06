import {
  UserRound,
  Building2,
  Mail,
  ShieldCheck,
  Edit3,
  Save,
  X,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  apiGet,
  apiPut,
} from "../../services/api";


function Profile() {

  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    institution_name: "",
    email: "",
    designation: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // --------------------------------------------------------
  // LOAD PROFILE
  // --------------------------------------------------------

  const loadProfile = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await apiGet(
        "/academia/profile"
      );

      setProfile({
        name: data.name || "",
        role: data.role || "",
        institution_name:
          data.institution_name || "",
        email: data.email || "",
        designation:
          data.designation || "",
      });

    } catch (err) {

      console.error(
        "Failed to load profile:",
        err
      );

      setError(
        err.message ||
        "Unable to load profile."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadProfile();

  }, []);


  // --------------------------------------------------------
  // HANDLE INPUT
  // --------------------------------------------------------

  const handleChange = (
    field,
    value
  ) => {

    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

  };


  // --------------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------------

  const handleSave = async () => {

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const response = await apiPut(
        "/academia/profile",
        {
          name: profile.name,
          email: profile.email,
          institution_name:
            profile.institution_name,
          designation:
            profile.designation,
        }
      );

      const updatedProfile =
        response.profile;

      setProfile({
        name: updatedProfile.name || "",
        role: updatedProfile.role || "",
        institution_name:
          updatedProfile.institution_name || "",
        email:
          updatedProfile.email || "",
        designation:
          updatedProfile.designation || "",
      });

      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );

    } catch (err) {

      console.error(
        "Failed to update profile:",
        err
      );

      setError(
        err.message ||
        "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }

  };


  // --------------------------------------------------------
  // CANCEL EDIT
  // --------------------------------------------------------

  const handleCancel = async () => {

    setEditing(false);

    setError("");
    setSuccess("");

    await loadProfile();

  };


  // --------------------------------------------------------
  // LOADING
  // --------------------------------------------------------

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-[400px]">

        <div className="text-center">

          <RefreshCw
            size={28}
            className="mx-auto text-blue-600 animate-spin"
          />

          <p className="text-sm text-slate-500 mt-3">
            Loading profile...
          </p>

        </div>

      </div>
    );

  }


  // --------------------------------------------------------
  // ERROR
  // --------------------------------------------------------

  if (error && !profile.name) {

    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

        <div className="flex items-start gap-4">

          <AlertTriangle
            size={22}
            className="text-red-600"
          />

          <div>

            <h2 className="font-semibold text-red-900">
              Unable to load profile
            </h2>

            <p className="text-sm text-red-700 mt-1">
              {error}
            </p>

            <button
              onClick={loadProfile}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700"
            >
              <RefreshCw size={15} />
              Retry
            </button>

          </div>

        </div>

      </div>
    );

  }


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


      {/* Success */}

      {success && (

        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
          {success}
        </div>

      )}


      {/* Error */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>

      )}


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
                {profile.designation || profile.role}
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
              onClick={() => {
                setEditing(true);
                setSuccess("");
                setError("");
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>

          ) : (

            <div className="flex gap-2">

              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>


              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
              >

                {saving ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}

              </button>

            </div>

          )}

        </div>

      </section>


      {/* Personal Information */}

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
                  handleChange(
                    "name",
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
                  handleChange(
                    "email",
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


          {/* Designation */}

          <div>

            <label className="block text-xs font-medium text-slate-500 mb-2">
              Designation
            </label>

            <input
              value={profile.designation}
              disabled={!editing}
              onChange={(e) =>
                handleChange(
                  "designation",
                  e.target.value
                )
              }
              className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none ${
                editing
                  ? "border-slate-200 bg-white focus:border-blue-500"
                  : "border-slate-100 bg-slate-50 text-slate-600"
              }`}
            />

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

          {/* Institution */}

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
                value={profile.institution_name}
                disabled={!editing}
                onChange={(e) =>
                  handleChange(
                    "institution_name",
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