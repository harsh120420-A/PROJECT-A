import { Outlet } from "react-router-dom";
import IndustrySidebar from "../components/IndustrySidebar";

function IndustryLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <IndustrySidebar />

      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default IndustryLayout;