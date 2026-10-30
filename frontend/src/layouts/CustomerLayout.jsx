import { useState } from "react";
import { Outlet } from "react-router-dom";

import CustomerSidebar from "../components/customer/CustomerSidebar.jsx";
import CustomerTopbar from "../components/customer/CustomerTopbar.jsx";
import CustomerFooter from "../components/customer/CustomerFooter.jsx";

export default function CustomerLayout() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#f7f8fd] text-[#102338]">
      <CustomerSidebar />

      <div className="flex min-h-screen flex-col lg:ml-[212px]">
        <CustomerTopbar onSearch={setSearchTerm} />

        <main className="flex-1">
          <Outlet context={{ searchTerm }} />
        </main>

        <CustomerFooter />
      </div>
    </div>
  );
}