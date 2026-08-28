// import StudentLayout from "../../layouts/StudentLayout";
// import {
//   Target,
//   BriefcaseBusiness,
//   FileText,
//   TrendingUp
// } from "lucide-react";

// const skills = [
//   { name: "Python", score: 80 },
//   { name: "SQL", score: 65 },
//   { name: "Machine Learning", score: 45 },
//   { name: "Power BI", score: 30 }
// ];

// const opportunities = [
//   {
//     title: "Data Analyst Intern",
//     company: "ABC Technologies",
//     match: 87
//   },
//   {
//     title: "Machine Learning Intern",
//     company: "TechNova",
//     match: 82
//   },
//   {
//     title: "Business Analyst Intern",
//     company: "Insight Labs",
//     match: 74
//   }
// ];

// function Dashboard() {

//   return (
//     <StudentLayout>

//       <div className="p-8">

//         {/* Header */}
//         <div className="mb-8">

//           <p className="text-sm text-slate-500">
//             Student Dashboard
//           </p>

//           <h1 className="text-3xl font-bold text-slate-900 mt-1">
//             Good morning, Harsh 👋
//           </h1>

//           <p className="text-slate-500 mt-2">
//             Here's an overview of your career readiness.
//           </p>

//         </div>

//         {/* Career Readiness */}
//         <div className="bg-white rounded-2xl border p-6 mb-6">

//           <div className="flex justify-between items-center">

//             <div>
//               <p className="text-sm text-slate-500">
//                 Career Goal
//               </p>

//               <h2 className="text-xl font-semibold mt-1">
//                 Data Scientist
//               </h2>
//             </div>

//             <div className="text-right">

//               <p className="text-sm text-slate-500">
//                 Skill Readiness
//               </p>

//               <p className="text-3xl font-bold text-blue-600">
//                 78%
//               </p>

//             </div>

//           </div>

//           <div className="mt-5 h-3 bg-slate-100 rounded-full overflow-hidden">

//             <div
//               className="h-full bg-blue-600 rounded-full"
//               style={{ width: "78%" }}
//             />

//           </div>

//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

//           <StatCard
//             icon={<Target />}
//             label="Skills"
//             value="12"
//           />

//           <StatCard
//             icon={<TrendingUp />}
//             label="Skill Gaps"
//             value="4"
//           />

//           <StatCard
//             icon={<BriefcaseBusiness />}
//             label="Matches"
//             value="18"
//           />

//           <StatCard
//             icon={<FileText />}
//             label="Applications"
//             value="6"
//           />

//         </div>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

//           {/* Skills */}
//           <div className="bg-white border rounded-2xl p-6">

//             <div className="flex justify-between mb-6">

//               <h2 className="font-semibold text-lg">
//                 Skill Development
//               </h2>

//               <a
//                 href="/skills"
//                 className="text-sm text-blue-600"
//               >
//                 View all
//               </a>

//             </div>

//             <div className="space-y-5">

//               {skills.map((skill) => (

//                 <div key={skill.name}>

//                   <div className="flex justify-between text-sm mb-2">

//                     <span className="font-medium">
//                       {skill.name}
//                     </span>

//                     <span className="text-slate-500">
//                       {skill.score}%
//                     </span>

//                   </div>

//                   <div className="h-2 bg-slate-100 rounded-full">

//                     <div
//                       className="h-full bg-blue-600 rounded-full"
//                       style={{
//                         width: `${skill.score}%`
//                       }}
//                     />

//                   </div>

//                 </div>

//               ))}

//             </div>

//           </div>

//           {/* Opportunities */}
//           <div className="bg-white border rounded-2xl p-6">

//             <div className="flex justify-between mb-6">

//               <h2 className="font-semibold text-lg">
//                 Recommended for You
//               </h2>

//               <a
//                 href="/opportunities"
//                 className="text-sm text-blue-600"
//               >
//                 View all
//               </a>

//             </div>

//             <div className="space-y-4">

//               {opportunities.map((job) => (

//                 <div
//                   key={job.title}
//                   className="border rounded-xl p-4 hover:border-blue-300 transition"
//                 >

//                   <div className="flex justify-between">

//                     <div>

//                       <h3 className="font-medium">
//                         {job.title}
//                       </h3>

//                       <p className="text-sm text-slate-500 mt-1">
//                         {job.company}
//                       </p>

//                     </div>

//                     <div className="text-right">

//                       <p className="text-xs text-slate-500">
//                         Match
//                       </p>

//                       <p className="font-bold text-green-600">
//                         {job.match}%
//                       </p>

//                     </div>

//                   </div>

//                 </div>

//               ))}

//             </div>

//           </div>

//         </div>

//       </div>

//     </StudentLayout>
//   );
// }

// function StatCard({ icon, label, value }) {

//   return (
//     <div className="bg-white border rounded-2xl p-5">

//       <div className="flex items-center justify-between">

//         <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
//           {icon}
//         </div>

//         <p className="text-2xl font-bold">
//           {value}
//         </p>

//       </div>

//       <p className="text-sm text-slate-500 mt-4">
//         {label}
//       </p>

//     </div>
//   );
// }

// export default Dashboard;

function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-10">
            <h1 className="text-4xl font-bold text-blue-600">
                Student Dashboard
            </h1>

            <p className="mt-4 text-slate-600">
                If you can see this, Dashboard.jsx is working.
            </p>
        </div>
    );
}

export default Dashboard;