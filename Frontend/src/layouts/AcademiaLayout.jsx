import { Outlet } from "react-router-dom";
import AcademiaSidebar from "../components/AcademiaSidebar";

function AcademiaLayout() {
  return (
    <div className="academia-layout">
      <AcademiaSidebar />

      <main className="academia-main">
        <header className="academia-topbar">
          <div>
            <h1>Academia Portal</h1>
            <p>
              Monitor student skills, industry demand and institutional
              readiness.
            </p>
          </div>

          <div className="academia-user">
            <div className="academia-user-avatar">A</div>

            <div>
              <strong>Academician</strong>
              <span>Institution Admin</span>
            </div>
          </div>
        </header>

        <section className="academia-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AcademiaLayout;