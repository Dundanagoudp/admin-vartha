import React, { useEffect, useState } from "react";
import { Space, message, Modal } from "antd";
import {
  getAllComments,
  deleteComment,
} from "../../service/Comments/CommentService";
import { Trash2 } from "lucide-react";
import DataTableShell from "../ui/DataTableShell";
import SearchBar from "../ui/SearchBar";
import { IconActionBtn } from "../ui/ui.styles";

function ModerationTable() {
  const [commentsData, setCommentsData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // 🧭 Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getAllComments();
        console.log("API response:", response);

        if (response.success) {
          const transformedData = response.data.map((comment) => ({
            key: comment._id,
            user:
              comment.user?.displayName ||
              comment.user?.email ||
              "Anonymous",
            email: comment.user?.email || "N/A",
            phone:
              comment.user?.phone_Number ||
              comment.user?.phoneNumber ||

              "N/A",
            comment: comment.comment,
            createdTime: new Date(comment.createdTime).toLocaleString(),
            videoTitle: comment.video ? comment.video.title : "N/A",
            newsTitle: comment.news ? comment.news.title : "N/A",
          }));

          setCommentsData(transformedData);
          setFilteredData(transformedData);
        } else {
          message.error("Failed to load comments.");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        message.error("Failed to fetch comments.");
      }
    };

    fetchComments();
  }, []);

  // 🔍 Auto filter comments as user types
  useEffect(() => {
    const filtered = commentsData.filter((comment) =>
      [comment.comment, comment.user, comment.newsTitle, comment.videoTitle]
        .some((field) =>
          field?.toLowerCase().includes(searchText.toLowerCase())
        )
    );
    setFilteredData(filtered);
  }, [searchText, commentsData]);

  // 🗑️ Delete comment with confirmation
  const handleDelete = (commentId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this comment?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await deleteComment(commentId);
          if (response.success) {
            const updated = filteredData.filter(
              (comment) => comment.key !== commentId
            );
            setFilteredData(updated);
            setCommentsData(
              commentsData.filter((comment) => comment.key !== commentId)
            );
            message.success("Comment deleted successfully!");
          } else {
            message.error("Failed to delete the comment.");
          }
        } catch (error) {
          console.error("Error deleting comment:", error);
          message.error("Error deleting comment.");
        }
      },
    });
  };

  // 📋 Table Columns
  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text) => <span>{text || "Anonymous"}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
      render: (text) =>
        text !== "N/A" ? (
          <a href={`mailto:${text}`} style={{ color: "#1677ff" }}>
            {text}
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      width: 180,
      render: (text) =>
        text !== "N/A" ? (
          <a href={`tel:${text}`} style={{ color: "#1677ff" }}>
            {text}
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "News",
      dataIndex: "newsTitle",
      key: "newsTitle",
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      key: "createdTime",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <IconActionBtn
            type="button"
            title="Delete"
            $danger
            onClick={() => handleDelete(record.key)}
          >
            <Trash2 size={16} />
          </IconActionBtn>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <DataTableShell
        toolbar={
          <SearchBar
            placeholder="Search by user, comment, news, or video"
            value={searchText}
            onChange={setSearchText}
            style={{ maxWidth: 360, marginLeft: "auto" }}
          />
        }
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
        emptyTitle="No comments found"
      />
    </div>
  );
}

export default ModerationTable;
