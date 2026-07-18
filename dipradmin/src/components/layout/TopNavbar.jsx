import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Breadcrumb, Button, Dropdown, Space, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, User } from "lucide-react";
import { getUserProfile } from "../../service/Dashboard/Dashboardapi";
import { TopNavbarRoot } from "./TopNavbar.styles";

const { Text } = Typography;

const TITLE_MAP = {
  "/dashboard": "Dashboard",
  "/manage-users": "Users",
  "/manage-articles": "Articles",
  "/manage-varthajanapada": "Vartha Janapada",
  "/manage-marchofkarnataka": "March of Karnataka",
  "/manage-shortvideos": "Short Videos",
  "/manage-longvideo": "Long Videos",
  "/manage-photos": "Photos",
  "/website-pages": "Websites",
  "/latestnotification": "Latest Notification",
  "/ServiceNotification": "Our Services",
  "/live-tv": "Live TV",
  "/video-categories": "Video Categories",
  "/photo-categories": "Photo Categories",
  "/districts": "Districts",
  "/manage-moderation": "Comments",
  "/manage-category": "Categories",
  "/manage-banners": "Banners",
};

function resolveTitle(pathname) {
  if (TITLE_MAP[pathname]) return TITLE_MAP[pathname];
  const match = Object.keys(TITLE_MAP).find((k) => pathname.startsWith(`${k}/`));
  if (match) {
    if (pathname.includes("/add") || pathname.includes("/create")) return `Add ${TITLE_MAP[match]}`;
    if (pathname.includes("/edit") || pathname.includes("/update")) return `Edit ${TITLE_MAP[match]}`;
    if (pathname.includes("/history")) return `${TITLE_MAP[match]} History`;
    return TITLE_MAP[match];
  }
  return "Admin";
}

export default function TopNavbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const role = localStorage.getItem("role") || "officer";
  const title = useMemo(
    () => resolveTitle(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    let mounted = true;
    getUserProfile()
      .then((res) => {
        if (mounted && res?.success) setUser(res.data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const crumbItems = [
    { title: <Link to="/dashboard">Home</Link> },
    { title },
  ];

  const menu = {
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
        onClick: () => navigate("/dashboard"),
      },
      {
        key: "logout",
        label: "Logout",
        danger: true,
        onClick: () => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        },
      },
    ],
  };

  const displayName = user?.displayName || user?.name || "Officer";
  const initial = String(displayName).charAt(0).toUpperCase();

  return (
    <TopNavbarRoot>
      <div className="tn-left">
        <Button
          type="text"
          className="tn-menu-btn"
          icon={<Menu size={20} />}
          onClick={onMenuClick}
          aria-label="Open menu"
        />
        <div className="tn-titles">
          <Breadcrumb items={crumbItems} className="tn-crumb" />
        </div>
      </div>

      <div className="tn-right">
        <Button
          type="text"
          className="tn-icon-btn"
          icon={<Bell size={18} />}
          onClick={() => navigate("/latestnotification")}
          aria-label="Notifications"
        />
        <Dropdown menu={menu} trigger={["click"]}>
          <button type="button" className="tn-user">
            <Avatar size={36} style={{ background: "#005BAC" }}>
              {initial || <User size={16} />}
            </Avatar>
            <Space direction="vertical" size={0} className="tn-user-meta">
              <Text strong className="tn-name">
                {displayName}
              </Text>
              <Text type="secondary" className="tn-role">
                {role}
              </Text>
            </Space>
            <ChevronDown size={16} color="#6B7280" />
          </button>
        </Dropdown>
      </div>
    </TopNavbarRoot>
  );
}
