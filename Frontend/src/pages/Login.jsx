import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { apiPost } from "../services/api";
import { saveAuth } from "../services/auth";


function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleLogin(e) {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      // ------------------------------------------------------
      // Call FastAPI
      // ------------------------------------------------------

      const data = await apiPost(
        "/auth/login",
        {
          email: email,
          password: password,
        }
      );


      // ------------------------------------------------------
      // Save JWT + user information
      // ------------------------------------------------------

      saveAuth(data);


      // ------------------------------------------------------
      // Redirect according to role
      // ------------------------------------------------------

      const role = data.user.role;

      if (role === "STUDENT") {

        navigate("/dashboard");

      } else if (role === "INDUSTRY") {

        navigate("/industry/dashboard");

      } else if (role === "ACADEMIA") {

        navigate("/academia/dashboard");

      } else {

        setError("Unknown user role.");

      }

    } catch (err) {

      console.error("Login error:", err);

      setError(
        err.message ||
        "Unable to login. Please check your credentials."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border">

        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back
        </h1>

        <p className="text-slate-500 mt-2">
          Sign in to continue your career journey.
        </p>


        {/* --------------------------------------------------
            ERROR MESSAGE
        -------------------------------------------------- */}

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          <div>

            <label className="block text-sm font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />

          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>


        <p className="text-sm text-center mt-6 text-slate-500">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-600 font-medium"
          >
            Create one
          </Link>

        </p>

      </div>

    </div>
  );
}


export default Login;