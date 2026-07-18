import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import {
  Users,
  Newspaper,
  BookOpen,
  Film,
  Images,
  Eye,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getTotalUsers,
  getTotalArticles,
  getTotalMagazine,
  getTotalVideos,
} from "../../../service/Dashboard/Dashboardapi";
import { getTotalVisitors } from "../../../service/statsService/statsService";
import { getAllPhotos } from "../../../service/Photos/photosService";
import { getArticles } from "../../../service/Article/ArticleService";
import StatsCardUI from "../../ui/StatsCard";
import { StatsSkeleton } from "../../ui/LoadingSkeleton";

function isToday(dateLike) {
  if (!dateLike) return false;
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function StatsCard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArticles: 0,
    totalMagazines: 0,
    totalVideos: 0,
    totalPhotos: null,
    totalVisitors: null,
    pendingApproval: null,
    publishedToday: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, articles, magazines, videos, visitors, photos, news] =
          await Promise.all([
            getTotalUsers().catch(() => null),
            getTotalArticles().catch(() => null),
            getTotalMagazine().catch(() => null),
            getTotalVideos().catch(() => null),
            getTotalVisitors().catch(() => null),
            getAllPhotos().catch(() => null),
            getArticles().catch(() => null),
          ]);

        const newsList = Array.isArray(news?.data)
          ? news.data
          : Array.isArray(news)
            ? news
            : [];

        const pending = newsList.filter((n) => {
          const s = String(n.status || n.approvalStatus || "").toLowerCase();
          return s.includes("pending");
        }).length;

        const publishedToday = newsList.filter((n) => {
          const s = String(n.status || "").toLowerCase();
          const published =
            s.includes("publish") ||
            s.includes("approv") ||
            n.isPublished === true;
          return published && isToday(n.publishedAt || n.updatedAt || n.createdAt);
        }).length;

        const photoCount = Array.isArray(photos?.data)
          ? photos.data.length
          : Array.isArray(photos)
            ? photos.length
            : null;

        setStats({
          totalUsers: users?.totalUsers ?? 0,
          totalArticles: articles?.data ?? 0,
          totalMagazines: magazines?.data ?? 0,
          totalVideos: videos?.data ?? 0,
          totalPhotos: photoCount,
          totalVisitors: visitors?.totalVisits ?? null,
          pendingApproval: newsList.length ? pending : null,
          publishedToday: newsList.length ? publishedToday : null,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <StatsSkeleton count={8} />;

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      subtitle: "Registered officers",
      icon: <Users size={20} />,
      accent: "#005BAC",
      onClick: () => navigate("/manage-users"),
    },
    {
      label: "Total Articles",
      value: stats.totalArticles,
      subtitle: "All news items",
      icon: <Newspaper size={20} />,
      accent: "#16A34A",
      onClick: () => navigate("/manage-articles"),
    },
    {
      label: "Total Magazines",
      value: stats.totalMagazines,
      subtitle: "Vartha & March",
      icon: <BookOpen size={20} />,
      accent: "#F59E0B",
      onClick: () => navigate("/manage-varthajanapada"),
    },
    {
      label: "Total Videos",
      value: stats.totalVideos,
      subtitle: "Short & long videos",
      icon: <Film size={20} />,
      accent: "#005BAC",
      onClick: () => navigate("/manage-longvideo"),
    },
    {
      label: "Total Photos",
      value: stats.totalPhotos ?? "—",
      subtitle: stats.totalPhotos == null ? "Unavailable" : "Gallery items",
      icon: <Images size={20} />,
      accent: "#16A34A",
      onClick: () => navigate("/manage-photos"),
    },
    {
      label: "Website Visitors",
      value: stats.totalVisitors ?? "—",
      subtitle: stats.totalVisitors == null ? "Unavailable" : "Total visits",
      icon: <Eye size={20} />,
      accent: "#005BAC",
    },
    {
      label: "Pending Approval",
      value: stats.pendingApproval ?? "—",
      subtitle:
        stats.pendingApproval == null ? "Unavailable" : "Awaiting review",
      icon: <Clock3 size={20} />,
      accent: "#F59E0B",
      onClick: () => navigate("/manage-articles"),
    },
    {
      label: "Published Today",
      value: stats.publishedToday ?? "—",
      subtitle:
        stats.publishedToday == null ? "Unavailable" : "Articles today",
      icon: <CheckCircle2 size={20} />,
      accent: "#16A34A",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      {cards.map((card) => (
        <Col key={card.label} xs={24} sm={12} lg={6}>
          <StatsCardUI {...card} />
        </Col>
      ))}
    </Row>
  );
}

export default StatsCard;
