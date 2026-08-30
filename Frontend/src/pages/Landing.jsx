import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b">
        <h1 className="text-2xl font-bold text-blue-600">
          SkillBridge
        </h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 text-slate-700 hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-8 py-24">

        <div className="max-w-3xl">

          <p className="text-blue-600 font-semibold mb-4">
            ACADEMIA × INDUSTRY
          </p>

          <h2 className="text-5xl font-bold text-slate-900 leading-tight">
            Turn your skills into
            <span className="text-blue-600"> career opportunities.</span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            Discover your strengths, identify skill gaps,
            learn what industry needs, and connect with
            opportunities that match your career goals.
          </p>

          <div className="mt-8 flex gap-4">

            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Build My Skill Profile
            </Link>

            <Link
              to="/login"
              className="px-6 py-3 border border-slate-300 rounded-lg font-medium hover:bg-white"
            >
              Explore Platform
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Landing;