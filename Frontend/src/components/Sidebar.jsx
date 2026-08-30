import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  Target,
  BriefcaseBusiness,
  BookOpen,
  FileText,
  UserRound,
  Award,
  LogOut
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "Skill Assessment",
    path: "/assessment",
    icon: ClipboardCheck
  },
  {
    name: "My Skills",
    path: "/skills",
    icon: BarChart3
  },
  {
    name: "Skill Gaps",
    path: "/skill-gaps",
    icon: Target
  },
  {
    name: "Opportunities",
    path: "/opportunities",
    icon: BriefcaseBusiness
  },
  {
    name: "Learning",
    path: "/learning",
    icon: BookOpen
  },
  {
    name: "Applications",
    path: "/applications",
    icon: FileText
  },
{
  name: "My Profile",
  path: "/profile",
  icon: UserRound
},
  {
    name: "My Portfolio",
    path: "/portfolio",
    icon: Award
  }
];

function Sidebar() {

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
      <button
  onClick={() => {
    window.location.href = "/login";
  }}
  className="flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:text-red-600"
>
  <LogOut size={19} />
  Logout
</button>

    </aside>
  );
}

export default Sidebar;