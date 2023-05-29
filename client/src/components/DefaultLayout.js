import React, { useState } from "react";
import "../resources/layout.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

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
    // {
    //   name: "Profile",
    //   path: "/user",
    //   icon: "ri-user-line",
    // },
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
      path: "/",
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
      path: "/booking",
      icon: "ri-file-list-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const menuTobeRendered = user?.isAdmin ? adminMenu : userMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("/book-now")) {
    activeRoute = "/";
  }
  return (
    <div className="layout-parent">
      <div className="side-bar">
        <div className="sidebar-header">
          <h3 className="logo">
            <img
              alt="logo"
              className={collapsed ? "img-collapsed" : "img-not-collapsed"}
              src="/logo.jpg"
            />
          </h3>
          <div className="role text-center mt-4">
            {user?.isAdmin && " Welcome Admin !"}
          </div>
        </div>
        <div className="d-flex flex-column gap-3 menu">
          {menuTobeRendered.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  activeRoute === item.path && "active-menu-item"
                } menu-item`}
                onClick={() => {
                  if (item.path === "/logout") {
                    if (window.confirm("Are you sure want to logout ?")) {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }
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
        <div className="header d-flex">
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
          <article>
            <h5 class="example-left">
              Connecting You to Your Destination: Fast, Convenient, and Reliable
              Bus Travel with Our Ticket System App!
            </h5>

            {/* <p class="example-right">Your scrolling text goes here Your scrolling text goes here Your scrolling text goes here Your scrolling text goes here Your scrolling text goes here Your scrolling text Your scrolling text goes here Your scrolling text goes here </p> */}
          </article>
        </div>
        <div className="content"> {children}</div>
        <h5 className="footer text-center">
          Made with <i class="fa fa-heart"></i>
          {" "}by Vijay
        </h5>
      </div>
    </div>
  );
}

export default DefaultLayout;
