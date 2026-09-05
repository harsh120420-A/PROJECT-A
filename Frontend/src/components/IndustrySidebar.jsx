import {
  LayoutDashboard,
  PlusCircle,
  BriefcaseBusiness,
  Users,
  UserCheck,
  Handshake,
  UserRound,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/industry/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Post Opportunity",
    path: "/industry/post-opportunity",
    icon: PlusCircle,
  },
  {
    name: "My Opportunities",
    path: "/industry/opportunities",
    icon: BriefcaseBusiness,
  },
  {
    name: "Candidates",
    path: "/industry/candidates",
    icon: Users,
  },
  {
    name: "Shortlisted Candidates",
    path: "/industry/shortlisted",
    icon: UserCheck,
  },
  {
    name: "Academia Collaborations",
    path: "/industry/academia-collaborations",
    icon: Handshake,
  },
];

function IndustrySidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r flex flex-col">
      
      {/* Logo */}
      <div className="px-6 py-6 border-b">
        <h1 className="text-xl font-bold text-blue-600">
          SkillBridge
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Academia × Industry
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={19} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t p-4">
        <NavLink
          to="/industry/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50"
            }`
          }
        >
          <UserRound size={19} />
          Profile
        </NavLink>

        <button
          onClick={() => {
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 mt-1 text-sm text-slate-600 hover:text-red-600"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default IndustrySidebar;