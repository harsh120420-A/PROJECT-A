import { NavLink } from "react-router-dom";

const navItems = [
  {
    section: "MAIN",
    items: [
      { label: "Dashboard", path: "/academia/dashboard", icon: "▣" },
    ],
  },
  {
    section: "STUDENT INTELLIGENCE",
    items: [
      { label: "Students", path: "/academia/students", icon: "♙" },
      { label: "Skill Analytics", path: "/academia/skill-analytics", icon: "◈" },
      { label: "Skill Gaps", path: "/academia/skill-gaps", icon: "△" },
    ],
  },
  {
    section: "INDUSTRY CONNECTION",
    items: [
      { label: "Industry Demand", path: "/academia/industry-demand", icon: "◉" },
      { label: "Opportunities", path: "/academia/opportunities", icon: "◆" },
      { label: "Collaborations", path: "/academia/collaborations", icon: "⇄" },
    ],
  },
  {
    section: "INSTITUTION",
    items: [
      { label: "Placement Analytics", path: "/academia/placement-analytics", icon: "▥" },
      { label: "Reports", path: "/academia/reports", icon: "▤" },
    ],
  },
];

function AcademiaSidebar() {
  return (
    <aside className="academia-sidebar">
      <div className="academia-brand">
        <div className="brand-icon">S</div>

        <div>
          <h2>SkillBridge</h2>
          <span>ACADEMIA PORTAL</span>
        </div>
      </div>

      <nav className="academia-nav">
        {navItems.map((section) => (
          <div className="academia-nav-section" key={section.section}>
            <p className="academia-section-title">
              {section.section}
            </p>

            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `academia-nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="academia-nav-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="academia-sidebar-bottom">
        <NavLink
          to="/academia/profile"
          className={({ isActive }) =>
            `academia-nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="academia-nav-icon">◎</span>
          <span>Profile</span>
        </NavLink>

        <button className="academia-logout">
          <span className="academia-nav-icon">↪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AcademiaSidebar;