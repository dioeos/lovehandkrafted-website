import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaLuggageCart, FaTags } from "react-icons/fa";
import { MdSupervisorAccount } from "react-icons/md";
import { ImNewspaper } from "react-icons/im";
import { MdAttachMoney } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";

const RouteSelect = () => {
  return (
    <div className="space-y-1">
      <Route Icon={FaHome} path="/vendor-dashboard" title="Dashboard" />
      <Route
        Icon={ImNewspaper}
        path="/vendor-dashboard/newsletter"
        title="Newsletter"
      />
      <Route
        Icon={FaLuggageCart}
        path="/vendor-dashboard/orders"
        title="Orders"
      />
      <Route
        Icon={MdSupervisorAccount}
        path="/vendor-dashboard/accounts"
        title="Accounts"
      />
      <Route
        Icon={MdAttachMoney}
        path="/vendor-dashboard/finances"
        title="Finance"
      />
      <Route
        Icon={FaBoxOpen}
        path="/vendor-dashboard/products"
        title="Products"
      />
      <Route Icon={FaTags} path="/vendor-dashboard/tags" title="Tags" />
    </div>
  );
};

const Route = ({ path, Icon, title }) => {
  const location = useLocation(); // Get current URL
  const selected = location.pathname === path; // Check if the route is selected

  return (
    <Link
      to={path}
      className={`flex items-center justify-start gap-2 w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
        selected
          ? "bg-white text-stone-950 shadow"
          : "hover:bg-stone-200 bg-transparent text-stone-500 shadow-none"
      }`}
    >
      <Icon className={selected ? "text-violet-500" : ""} />
      <span>{title}</span>
    </Link>
  );
};

export default RouteSelect;
