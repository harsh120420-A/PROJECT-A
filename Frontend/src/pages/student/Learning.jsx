import StudentLayout from "../../layouts/StudentLayout";

function Learning() {
  return (
    <StudentLayout>
      <div className="p-8">

        <p className="text-sm text-blue-600 font-medium">
          LEARNING
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-2">
          Learning Programs
        </h1>

        <p className="text-slate-500 mt-2">
          Learn the skills needed to close your skill gaps.
        </p>

        <div className="mt-8 bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">
            Recommended learning programs
          </h2>
        </div>

      </div>
    </StudentLayout>
  );
}

export default Learning;