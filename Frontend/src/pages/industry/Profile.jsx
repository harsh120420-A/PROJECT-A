import { useEffect, useState } from "react";
import {
  UserRound,
  Building2,
  Mail,
  ShieldCheck,
  Pencil,
  Save,
  X,
} from "lucide-react";

import {
  apiGet,
  apiPut,
} from "../../services/api";


function IndustryProfile() {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    company_name: "",
  });

  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {

    async function loadProfile() {

      try {

        setLoading(true);
        setError("");

        const data =
          await apiGet("/industry/profile");

        setProfile({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
          company_name: data.company_name || "",
        });

      } catch (error) {

        console.error(
          "Failed to load industry profile:",
          error
        );

        setError(
          error.message ||
          "Failed to load profile."
        );

      } finally {

        setLoading(false);

      }

    }

    loadProfile();

  }, []);


  // ============================================================
  // HANDLE INPUT
  // ============================================================

  function handleChange(event) {

    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

  }


  // ============================================================
  // SAVE PROFILE
  // ============================================================

  async function handleSave(event) {

    event.preventDefault();

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const response =
        await apiPut(
          "/industry/profile",
          {
            name: profile.name,
            email: profile.email,
            company_name: profile.company_name,
          }
        );

      setProfile({
        name: response.profile.name,
        email: response.profile.email,
        role: response.profile.role,
        company_name:
          response.profile.company_name,
      });

      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );

    } catch (error) {

      console.error(
        "Failed to update profile:",
        error
      );

      setError(
        error.message ||
        "Failed to update profile."
      );

    } finally {

      setSaving(false);

    }

  }


  // ============================================================
  // CANCEL EDITING
  // ============================================================

  function handleCancel() {

    setEditing(false);
    setError("");
    setSuccess("");

  }


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50 flex items-center justify-center">

        <div className="bg-white border rounded-2xl p-10 text-center">

          <p className="text-slate-500">
            Loading profile...
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="min-h-screen bg-slate-50">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="bg-white border-b">

        <div className="px-8 py-6">

          <p className="text-sm text-blue-600 font-medium">
            INDUSTRY PORTAL
          </p>

          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your account and company information.
          </p>

        </div>

      </div>


      <div className="p-8 max-w-4xl">


        {/* ==================================================
            ALERTS
            ================================================== */}

        {error && (

          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>

        )}


        {success && (

          <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
            {success}
          </div>

        )}


        {/* ==================================================
            PROFILE CARD
            ================================================== */}

        <div className="bg-white border rounded-2xl overflow-hidden">


          {/* Profile header */}

          <div className="p-6 border-b">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">

                  <Building2 size={28} />

                </div>


                <div>

                  <h2 className="text-xl font-semibold text-slate-900">
                    {profile.company_name ||
                      "Company"}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Industry Account
                  </p>

                </div>

              </div>


              {!editing && (

                <button
                  onClick={() => {
                    setEditing(true);
                    setSuccess("");
                    setError("");
                  }}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50"
                >

                  <Pencil size={16} />

                  Edit Profile

                </button>

              )}

            </div>

          </div>


          {/* ==================================================
              FORM
              ================================================== */}

          <form
            onSubmit={handleSave}
            className="p-6"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              {/* Name */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Contact Name
                </label>

                <div className="relative">

                  <UserRound
                    size={17}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />

                </div>

              </div>


              {/* Email */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={17}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />

                </div>

              </div>


              {/* Company */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name
                </label>

                <div className="relative">

                  <Building2
                    size={17}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="text"
                    name="company_name"
                    value={profile.company_name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />

                </div>

              </div>


              {/* Role */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Account Role
                </label>

                <div className="relative">

                  <ShieldCheck
                    size={17}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-slate-50 text-slate-500"
                  />

                </div>

              </div>

            </div>


            {/* ==================================================
                ACTION BUTTONS
                ================================================== */}

            {editing && (

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 border rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                >

                  <X size={16} />

                  Cancel

                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >

                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            )}

          </form>

        </div>


        {/* ==================================================
            SECURITY INFORMATION
            ================================================== */}

        <div className="bg-white border rounded-2xl p-6 mt-6">

          <div className="flex items-start gap-4">

            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">

              <ShieldCheck size={20} />

            </div>

            <div>

              <h2 className="font-semibold text-slate-900">
                Account Security
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your profile changes are saved securely to
                your account.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default IndustryProfile;