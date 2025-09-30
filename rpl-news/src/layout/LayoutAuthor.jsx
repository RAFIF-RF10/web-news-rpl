import React, { useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";

const LayoutAuthor = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className={`flex-1 min-w-screen min-h-screen transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
        {children}
      </div>
    </div>
  );
};

export default LayoutAuthor;
