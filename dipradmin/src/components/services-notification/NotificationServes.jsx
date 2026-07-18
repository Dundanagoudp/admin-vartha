import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  message,
  Space,
  Modal,
  Typography,
  Descriptions,
  Tooltip,
  Input,
} from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  LinkOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  listNewArticles,
  deleteNewArticle,
} from "../../service/servicenotification/Servicenotification";
import { useNavigate } from "react-router-dom";
import {
  NotificationWrapper,
  HeaderRow,
  Toolbar,
  TableCard,
  TitleCell,
  LinkCell,
  MetaChip,
  CountText,
} from "./Notification.styles";

const { Title, Text } = Typography;

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
            <LinkOutlined />
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
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() =>
                navigate(`/ServiceNotification/edit/${record._id}`)
              }
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record._id)}
            />
          </Tooltip>
        </Space>
      ),
      onCell: () => ({ "data-label": "Actions" }),
    },
  ];

  return (
    <NotificationWrapper>
      <HeaderRow>
        <div>
          <Title level={3}>Our Services</Title>
          <Text type="secondary">
            Same list as the website Our Services menu.
          </Text>
        </div>
        <Space wrap>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchArticles}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/ServiceNotification/add")}
          >
            Add service
          </Button>
        </Space>
      </HeaderRow>

      <Toolbar>
        <div className="search-box">
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined style={{ color: "#9aa3b5" }} />}
            placeholder="Search title or link"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <CountText>
          {filteredArticles.length} of {articles.length} services
        </CountText>
      </Toolbar>

      <TableCard>
        <Table
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
          size="middle"
        />
      </TableCard>

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
              icon={<LinkOutlined />}
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
