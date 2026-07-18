import React, { useMemo } from "react";
import { Menu, Button, Modal, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  BookOutlined,
  CommentOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { FaPhotoVideo, FaRegNewspaper, FaRegComments } from "react-icons/fa";
import { RiVideoOnLine, RiVideoOnFill } from "react-icons/ri";
import {
  MdOutlineWebStories,
  MdOutlineEditNotifications,
  MdLiveTv,
} from "react-icons/md";
import { TbCategoryFilled } from "react-icons/tb";
import { HiOutlineLocationMarker } from "react-icons/hi";
import {
  SidebarRoot,
  BrandBlock,
  BrandMark,
  BrandTextWrap,
  MenuScroll,
  LogoutBar,
} from "./Sidebar.Styles";
import logoimage from "../../assets/Logo.png";

const { Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const role = localStorage.getItem("role");
  const isAdminOrModerator = role === "admin" || role === "moderator";
  const isContentRole = role === "content";
  const canViewContent = isAdminOrModerator || isContentRole;

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      okText: "Logout",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,
      onOk: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
      },
    });
  };

  const menuItems = useMemo(() => {
    const items = [];

    if (isAdminOrModerator) {
      items.push(
        { key: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
        { key: "/manage-users", icon: <UserOutlined />, label: "Users" }
      );
    }

    if (canViewContent) {
      items.push(
        {
          key: "/manage-articles",
          icon: <FaRegNewspaper />,
          label: "Articles",
        },
        {
          key: "/manage-varthajanapada",
          icon: <BookOutlined />,
          label: "Vartha Janapada",
        },
        {
          key: "/manage-marchofkarnataka",
          icon: <BookOutlined />,
          label: "March of Karnataka",
        },
        {
          key: "/manage-shortvideos",
          icon: <RiVideoOnLine />,
          label: "Short Videos",
        },
        {
          key: "/manage-longvideo",
          icon: <RiVideoOnFill />,
          label: "Long Videos",
        },
        { key: "/manage-photos", icon: <FaPhotoVideo />, label: "Photos" },
        {
          key: "/website-pages",
          icon: <MdOutlineWebStories />,
          label: "Websites",
        },
        {
          key: "/latestnotification",
          icon: <MdOutlineEditNotifications />,
          label: "Latest Notification",
        },
        {
          key: "/ServiceNotification",
          icon: <CommentOutlined />,
          label: "Our Services",
        },
        { key: "/live-tv", icon: <MdLiveTv />, label: "Live TV" }
      );
    }

    if (isAdminOrModerator) {
      items.push(
        {
          key: "/video-categories",
          icon: <TbCategoryFilled />,
          label: "Video Categories",
        },
        {
          key: "/photo-categories",
          icon: <TbCategoryFilled />,
          label: "Photo Categories",
        },
        {
          key: "/districts",
          icon: <HiOutlineLocationMarker />,
          label: "Districts",
        },
        {
          key: "/manage-moderation",
          icon: <FaRegComments />,
          label: "Comments",
        }
      );
    }

    return items;
  }, [canViewContent, isAdminOrModerator]);

  const selectedKey =
    menuItems.find((item) => currentPath === item.key)?.key ||
    menuItems.find((item) => currentPath.startsWith(`${item.key}/`))?.key ||
    currentPath;

  return (
    <SidebarRoot>
      <BrandBlock>
        <BrandMark>
          <img src={logoimage} alt="Vartha Admin logo" />
        </BrandMark>
        <BrandTextWrap>
          <Text strong className="brand-title">
            Vartha Admin
          </Text>
          <Text type="secondary" className="brand-sub">
            DIPR Content Panel
          </Text>
        </BrandTextWrap>
      </BrandBlock>

      <MenuScroll>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </MenuScroll>

      <LogoutBar>
        <Button
          danger
          block
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          size="large"
        >
          Logout
        </Button>
      </LogoutBar>
    </SidebarRoot>
  );
};

export default Sidebar;
