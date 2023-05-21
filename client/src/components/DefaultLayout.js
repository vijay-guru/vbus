import React, { useState } from "react";
import "../resources/layout.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const [collapsed, setCollapsed] = useState(false);
  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      name: "Users",
      path: "/users",
      icon: "ri-user-line",
    },
    {
      name: "Bookings",
      path: "/booking",
      icon: "ri-file-list-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/admin",
      icon: "ri-home-line",
    },
    {
      name: "Buses",
      path: "/admin/buses",
      icon: "ri-bus-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line",
    },
    {
      name: "Bookings",
      path: "/admin/booking",
      icon: "ri-file-list-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const menuTobeRendered = user?.isAdmin ? adminMenu : userMenu;
  const activeRoute = window.location.pathname;
  return (
    <div className="layout-parent">
      <div className="side-bar">
        <div className="sidebar-header">
          <h3 className="logo"><img alt = 'logo' className={collapsed ? 'img-collapsed':'img-not-collapsed'} src="logo.jpg"/></h3>
          <div className="role">{user?.isAdmin && " Welcome Admin !"}</div>
        </div>
        <div className="d-flex flex-column gap-3 menu">
          {menuTobeRendered.map((item) => {
            return (
              <div
                className={`${
                  activeRoute === item.path && "active-menu-item"
                } menu-item`}
                onClick={() => {
                  if (item.path === "/logout") {
                    localStorage.removeItem("token");
                    navigate("/login");
                  } else navigate(item.path);
                }}
              >
                <i className={item.icon}></i>
                {!collapsed && <span>{item.name}</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="body">
        <div className="header">
          {collapsed ? (
            <i
              className="ri-menu-2-fill"
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            ></i>
          ) : (
            <i
              className="ri-close-line"
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            ></i>
          )}
        </div>
        <div className="content"> {children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
