import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, User } from "lucide-react";
import { getUserProfile } from "../../service/Dashboard/Dashboardapi";
import { TopNavbarRoot } from "./TopNavbar.styles";

const { Text } = Typography;

export default function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const role = localStorage.getItem("role") || "officer";

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
