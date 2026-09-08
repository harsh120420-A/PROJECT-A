import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { apiPost } from "../services/api";


function Register() {

    const navigate = useNavigate();

    const [role, setRole] = useState("STUDENT");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Student
    const [careerGoal, setCareerGoal] = useState("");

    // Industry
    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    // Academia
    const [institutionName, setInstitutionName] = useState("");
    const [designation, setDesignation] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    async function handleRegister(e) {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");

            const requestData = {
                name: name,
                email: email,
                password: password,
                role: role,
            };


            // ------------------------------------------------
            // Student fields
            // ------------------------------------------------

            if (role === "STUDENT") {

                requestData.career_goal =
                    careerGoal || null;

            }


            // ------------------------------------------------
            // Industry fields
            // ------------------------------------------------

            if (role === "INDUSTRY") {

                requestData.company_name =
                    companyName;

                requestData.industry =
                    industry || null;

                requestData.location =
                    location || null;

                requestData.description =
                    description || null;

            }


            // ------------------------------------------------
            // Academia fields
            // ------------------------------------------------

            if (role === "ACADEMIA") {

                requestData.institution_name =
                    institutionName;

                requestData.designation =
                    designation || null;

            }


            const data = await apiPost(
                "/auth/register",
                requestData
            );


            console.log(
                "Registration successful:",
                data
            );


            navigate("/login");

        } catch (error) {

            console.error(
                "Registration failed:",
                error
            );

            setError(
                error.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }

    }


    return (

        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-sm border">

                {/* ==================================================
                    HEADER
                    ================================================== */}

                <h1 className="text-2xl font-bold text-slate-900">
                    Create your account
                </h1>

                <p className="text-slate-500 mt-2">
                    Join the Academia × Industry ecosystem.
                </p>


                {/* ==================================================
                    ERROR
                    ================================================== */}

                {error && (

                    <div className="mt-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>

                )}


                <form
                    onSubmit={handleRegister}
                    className="mt-8 space-y-5"
                >


                    {/* ==================================================
                        ROLE
                        ================================================== */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Account Type
                        </label>

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                            className="w-full border rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-100"
                        >

                            <option value="STUDENT">
                                Student
                            </option>

                            <option value="INDUSTRY">
                                Industry
                            </option>

                            <option value="ACADEMIA">
                                Academia
                            </option>

                        </select>

                    </div>


                    {/* ==================================================
                        COMMON INFORMATION
                        ================================================== */}

                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Full Name
                        </label>

                        <input
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Your name"
                            required
                        />

                    </div>


                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="you@example.com"
                            required
                        />

                    </div>


                    <div>

                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Create a password"
                            minLength={6}
                            required
                        />

                    </div>


                    {/* ==================================================
                        STUDENT FIELDS
                        ================================================== */}

                    {role === "STUDENT" && (

                        <div>

                            <label className="block text-sm font-medium mb-2">
                                Career Goal
                            </label>

                            <input
                                value={careerGoal}
                                onChange={(e) =>
                                    setCareerGoal(e.target.value)
                                }
                                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                                placeholder="e.g. Machine Learning Engineer"
                            />

                        </div>

                    )}


                    {/* ==================================================
                        INDUSTRY FIELDS
                        ================================================== */}

                    {role === "INDUSTRY" && (

                        <div className="space-y-5">

                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Company Name
                                </label>

                                <input
                                    value={companyName}
                                    onChange={(e) =>
                                        setCompanyName(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="Company name"
                                    required
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Industry
                                </label>

                                <input
                                    value={industry}
                                    onChange={(e) =>
                                        setIndustry(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="e.g. Information Technology"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Location
                                </label>

                                <input
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="e.g. Bengaluru, India"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Company Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={3}
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                                    placeholder="Brief description of the company"
                                />

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        ACADEMIA FIELDS
                        ================================================== */}

                    {role === "ACADEMIA" && (

                        <div className="space-y-5">

                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Institution Name
                                </label>

                                <input
                                    value={institutionName}
                                    onChange={(e) =>
                                        setInstitutionName(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="University / College name"
                                    required
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-2">
                                    Designation
                                </label>

                                <input
                                    value={designation}
                                    onChange={(e) =>
                                        setDesignation(e.target.value)
                                    }
                                    className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100"
                                    placeholder="e.g. Placement Officer"
                                />

                            </div>

                        </div>

                    )}


                    {/* ==================================================
                        SUBMIT
                        ================================================== */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>


                {/* ==================================================
                    LOGIN
                    ================================================== */}

                <p className="text-sm text-center mt-6">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-blue-600 font-medium"
                    >
                        Log in
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;