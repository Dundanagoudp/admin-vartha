import React, { useEffect, useState } from "react";
import {
  Popconfirm,
  message,
  Image,
  Space,
  Modal,
  Descriptions,
  Tooltip,
} from "antd";
import { Eye, Pencil, Trash2, Check } from "lucide-react";
import {
  getAllPhotos,
  deletePhotosById,
  approvePhotosById,
} from "../../service/Photos/photosService";
import { useNavigate } from "react-router-dom";
import DataTableShell from "../ui/DataTableShell";
import StatusBadge from "../ui/StatusBadge";
import { IconActionBtn } from "../ui/ui.styles";

function PhotosTable() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [approvalModalVisible, setApprovalModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPhotos();
  }, []);

const fetchPhotos = async () => {
  try {
    setLoading(true);
    const response = await getAllPhotos();

    // Normalize to an array
    let list = Array.isArray(response) ? response : (response?.data || []);

    // 🔽 Sort by createdTime: newest → oldest
    list = list.sort(
      (a, b) => new Date(b.createdTime || 0) - new Date(a.createdTime || 0)
    );

    setPhotos(list);
  } catch (error) {
    message.error("Error fetching photos");
    console.error("Error fetching photos:", error);
    setPhotos([]);
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id) => {
    try {
      const response = await deletePhotosById(id);
      if (
        response &&
        (response.success || response.message?.includes("deleted"))
      ) {
        message.success("Photo deleted successfully!");
        setPhotos(photos.filter((photo) => photo._id !== id));
      } else {
        message.error(response?.message || "Failed to delete photo");
      }
    } catch (error) {
      message.error("Error deleting photo");
      console.error("Error deleting photo:", error);
    }
  };

  const handleView = (photo) => {
    setSelectedPhoto(photo);
    setViewModalVisible(true);
  };

  const handleEdit = (photo) => {
    navigate(`/photos/edit/${photo._id}`);
  };

  const handleApproveClick = (photo) => {
    setSelectedPhoto(photo);
    setApprovalModalVisible(true);
  };

  const handleApprove = async () => {
    if (!selectedPhoto) return;

    setApproving(true);
    try {
      const response = await approvePhotosById({
        id: selectedPhoto._id,
        createdBy:
          selectedPhoto.createdBy?._id || localStorage.getItem("userId"),
      });

      if (response && response.success) {
        message.success("Photo approved successfully!");
        setPhotos((prevPhotos) =>
          prevPhotos.map((photo) =>
            photo._id === selectedPhoto._id
              ? { ...photo, status: "approved" }
              : photo
          )
        );
        setApprovalModalVisible(false);
        setSelectedPhoto(null);
      } else {
        message.error(response?.message || "Failed to approve photo");
      }
    } catch (error) {
      message.error("Error approving photo");
      console.error("Error approving photo:", error);
    } finally {
      setApproving(false);
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Image",
      dataIndex: "photoImage",
      key: "photoImage",
      render: (text) => (
        <Image
          width={100}
          src={text}
          alt="Photo"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <div
          onClick={() =>
            role === "admin" &&
            status !== "approved" &&
            handleApproveClick(record)
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            cursor:
              role === "admin" && status !== "approved" ? "pointer" : "default",
          }}
        >
          <StatusBadge status={status} />
          {role === "admin" && status !== "approved" && <Check size={14} />}
        </div>
      ),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy) => (
        <span>{createdBy?.displayName || createdBy?.email || "Unknown"}</span>
      ),
    },
    {
      title: "Created Time",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
      sorter: (a, b) => new Date(a.createdTime) - new Date(b.createdTime),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <IconActionBtn type="button" title="View" onClick={() => handleView(record)}>
              <Eye size={16} />
            </IconActionBtn>
          </Tooltip>
          {(role === "admin" || role === "moderator") && (
            <Tooltip title="Edit">
              <IconActionBtn type="button" title="Edit" onClick={() => handleEdit(record)}>
                <Pencil size={16} />
              </IconActionBtn>
            </Tooltip>
          )}
          {(role === "admin" ||
            (role === "moderator" && record.createdBy?._id === userId)) && (
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure to delete this photo?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
                okType="danger"
              >
                <IconActionBtn type="button" title="Delete" $danger>
                  <Trash2 size={16} />
                </IconActionBtn>
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <DataTableShell
        columns={columns}
        dataSource={photos.map((photo) => ({ ...photo, key: photo._id }))}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 5,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        scroll={{ x: 800 }}
        emptyTitle="No photos found"
      />

      {/* View Photo Modal */}
      <Modal
        title="Photo Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedPhoto(null);
        }}
        footer={null}
        width={700}
      >
        {selectedPhoto && (
          <div>
            <Image
              width="100%"
              src={selectedPhoto.photoImage}
              alt="Photo"
              style={{
                marginBottom: 20,
                maxHeight: "400px",
                objectFit: "contain",
              }}
            />
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Status">
                <StatusBadge status={selectedPhoto.status} />
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedPhoto.createdBy?.displayName ||
                  selectedPhoto.createdBy?.email ||
                  "Unknown"}
              </Descriptions.Item>
              <Descriptions.Item label="Created Time">
                {selectedPhoto.createdTime
                  ? new Date(selectedPhoto.createdTime).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Last Updated">
                {selectedPhoto.last_updated
                  ? new Date(selectedPhoto.last_updated).toLocaleString()
                  : "N/A"}
              </Descriptions.Item> */}
              {/* <Descriptions.Item label="Photo ID">
                {selectedPhoto._id || "N/A"}
              </Descriptions.Item> */}
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* Approval Modal */}
      <Modal
        title="Approve Photo"
        open={approvalModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setApprovalModalVisible(false);
          setSelectedPhoto(null);
        }}
        confirmLoading={approving}
        okText="Approve"
        cancelText="Cancel"
        okType="primary"
        width={600}
      >
        {selectedPhoto && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Image
                width="100%"
                src={selectedPhoto.photoImage}
                alt="Photo to approve"
                style={{ maxHeight: "300px", objectFit: "contain" }}
              />
            </div>

            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Current Status">
                <StatusBadge status="pending" />
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedPhoto.createdBy?.displayName ||
                  selectedPhoto.createdBy?.email ||
                  "Unknown"}
              </Descriptions.Item>
              <Descriptions.Item label="Created Time">
                {selectedPhoto.createdTime
                  ? new Date(selectedPhoto.createdTime).toLocaleString()
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>

        
          </>
        )}
      </Modal>
    </div>
  );
}

export default PhotosTable;
