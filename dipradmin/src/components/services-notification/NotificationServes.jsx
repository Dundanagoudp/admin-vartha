import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  message,
  Space,
  Modal,
  Typography,
  Descriptions,
  Tooltip,
} from "antd";
import { Eye, Pencil, Trash2, Plus, ExternalLink, RefreshCw } from "lucide-react";
import {
  listNewArticles,
  deleteNewArticle,
} from "../../service/servicenotification/Servicenotification";
import { useNavigate } from "react-router-dom";
import {
  NotificationWrapper,
  TitleCell,
  LinkCell,
  MetaChip,
  CountText,
} from "./Notification.styles";
import PageHeader from "../ui/PageHeader";
import DataTableShell from "../ui/DataTableShell";
import SearchBar from "../ui/SearchBar";
import { IconActionBtn } from "../ui/ui.styles";

const { Text } = Typography;

function normalizeId(value) {
  if (!value) return "";
  if (typeof value === "object" && value.$oid) return value.$oid;
  return String(value);
}

function formatDate(value) {
  if (!value) return "—";
  let date = value;
  if (typeof date === "object" && date.$date) date = date.$date;
  try {
    return new Date(date).toLocaleDateString();
  } catch (_) {
    return "—";
  }
}

function NotificationServes() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listNewArticles();
      const list = Array.isArray(response?.data?.newarticles)
        ? response.data.newarticles
        : [];
      setArticles(list);
    } catch (error) {
      console.error(error);
      message.error(error.message || "Failed to load services");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const filteredArticles = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (article) =>
        article.title?.toLowerCase().includes(q) ||
        article.link?.toLowerCase().includes(q) ||
        article.English?.toLowerCase().includes(q) ||
        article.kannada?.toLowerCase().includes(q) ||
        article.hindi?.toLowerCase().includes(q)
    );
  }, [articles, searchText]);

  const dataSource = useMemo(
    () =>
      filteredArticles.map((article, index) => {
        const id = normalizeId(article._id) || article.id || `row-${index}`;
        return { ...article, _id: id, key: id };
      }),
    [filteredArticles]
  );

  const handleDelete = (articleId) => {
    Modal.confirm({
      title: "Delete this service?",
      content: "This removes it from Our Services on the website.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteNewArticle(articleId);
          message.success("Service deleted");
          setArticles((prev) =>
            prev.filter((item) => normalizeId(item._id) !== articleId)
          );
        } catch (error) {
          console.error(error);
          message.error(error.message || "Failed to delete");
          throw error;
        }
      },
    });
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setViewModalVisible(true);
  };

  const handleLinkClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text) => <TitleCell>{text || "—"}</TitleCell>,
      onCell: () => ({ "data-label": "Title" }),
    },
    {
      title: "Link",
      dataIndex: "link",
      key: "link",
      ellipsis: true,
      render: (text) =>
        text ? (
          <LinkCell type="button" onClick={() => handleLinkClick(text)}>
            <ExternalLink size={14} />
            <span title={text}>{text}</span>
          </LinkCell>
        ) : (
          <Text type="secondary">—</Text>
        ),
      onCell: () => ({ "data-label": "Link" }),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (text, record) => (
        <MetaChip>{formatDate(text || record.created_at)}</MetaChip>
      ),
      sorter: (a, b) =>
        new Date(a.createdAt || a.created_at || 0) -
        new Date(b.createdAt || b.created_at || 0),
      onCell: () => ({ "data-label": "Created" }),
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="View">
            <IconActionBtn type="button" title="View" onClick={() => handleView(record)}>
              <Eye size={16} />
            </IconActionBtn>
          </Tooltip>
          <Tooltip title="Edit">
            <IconActionBtn
              type="button"
              title="Edit"
              onClick={() =>
                navigate(`/ServiceNotification/edit/${record._id}`)
              }
            >
              <Pencil size={16} />
            </IconActionBtn>
          </Tooltip>
          <Tooltip title="Delete">
            <IconActionBtn
              type="button"
              title="Delete"
              $danger
              onClick={() => handleDelete(record._id)}
            >
              <Trash2 size={16} />
            </IconActionBtn>
          </Tooltip>
        </Space>
      ),
      onCell: () => ({ "data-label": "Actions" }),
    },
  ];

  return (
    <NotificationWrapper>
      <PageHeader
        title="Our Services"
        breadcrumbs={[{ title: "Our Services" }]}
        extra={
          <Space wrap>
            <Button
              icon={<RefreshCw size={16} />}
              onClick={fetchArticles}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={() => navigate("/ServiceNotification/add")}
            >
              Add service
            </Button>
          </Space>
        }
      />
      <Text type="secondary" style={{ display: "block", marginTop: -8, marginBottom: 16 }}>
        Same list as the website Our Services menu.
      </Text>

      <DataTableShell
        toolbar={[
          <SearchBar
            key="search"
            placeholder="Search title or link"
            value={searchText}
            onChange={(value) => {
              setSearchText(value);
              setPage(1);
            }}
          />,
          <CountText key="count">
            {filteredArticles.length} of {articles.length} services
          </CountText>,
        ]}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowKey="key"
        pagination={{
          current: page,
          pageSize,
          total: filteredArticles.length,
          showTotal: (total, range) =>
            `${range[0]}–${range[1]} of ${total}`,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          onChange: (nextPage, nextSize) => {
            setPage(nextPage);
            setPageSize(nextSize);
          },
        }}
        scroll={{ x: 720 }}
        emptyTitle="No services found"
      />

      <Modal
        title="Service details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedArticle(null);
        }}
        footer={
          selectedArticle?.link ? (
            <Button
              type="primary"
              icon={<ExternalLink size={16} />}
              onClick={() => handleLinkClick(selectedArticle.link)}
            >
              Open link
            </Button>
          ) : null
        }
        width={640}
        centered
      >
        {selectedArticle ? (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Title">
              {selectedArticle.title || "—"}
            </Descriptions.Item>
            {selectedArticle.English ? (
              <Descriptions.Item label="English">
                {selectedArticle.English}
              </Descriptions.Item>
            ) : null}
            {selectedArticle.kannada ? (
              <Descriptions.Item label="Kannada">
                {selectedArticle.kannada}
              </Descriptions.Item>
            ) : null}
            {selectedArticle.hindi ? (
              <Descriptions.Item label="Hindi">
                {selectedArticle.hindi}
              </Descriptions.Item>
            ) : null}
            <Descriptions.Item label="Link">
              <Text
                style={{
                  color: "#5d5fef",
                  cursor: "pointer",
                  wordBreak: "break-all",
                }}
                onClick={() => handleLinkClick(selectedArticle.link)}
              >
                {selectedArticle.link || "—"}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {selectedArticle.createdAt
                ? new Date(selectedArticle.createdAt).toLocaleString()
                : "—"}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Modal>
    </NotificationWrapper>
  );
}

export default NotificationServes;
