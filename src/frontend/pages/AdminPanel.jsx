import AdminSidebar from "../components/admin-components/AdminSidebar.jsx";
import AdminRoutes from "../components/admin-components/AdminRoutes.jsx";
// import { useState } from "react";
// import axios from "axios";

const AdminPanel = () => {
  // const [schedules, setSchedules] = useState([]);

  // const fetchSchedules = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:5000/api/schedules/raw",
  //     );
  //     setSchedules(response.data);
  //   } catch (error) {
  //     console.error("Error fetching schedules:", error);
  //   }
  // };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex w-full items-start justify-center bg-white p-6">
        <AdminRoutes />
      </div>
    </div>
  );
};

export default AdminPanel;
