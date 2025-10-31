import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Image,
  Popconfirm,
  message,
  Modal,
  Typography,
  Input,
  Space,
  Tag,
  Descriptions,
  Select,
} from "antd";
import {
  getMagazines,
  deleteMagazine2,
  approveMagazine2,
  getMagazineHistoryById,
} from "../../service/Magazine/MagazineService2";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getMagazineByYearMarchofKarnataka } from "../../service/Magazine/MagazineService2";

const { Option } = Select;

function MagazineTable() {
  const [magazines, setMagazines] = useState([]);
  const [filteredMagazines, setFilteredMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApprovalModalVisible, setIsApprovalModalVisible] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [approving, setApproving] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    fetchMagazines();
  }, []);

  const fetchMagazines = async () => {
    try {
      const response = await getMagazines();
      console.log("Magazine table response get all magazines", response);
      if (response.success) {
        setMagazines(response.data);
        setFilteredMagazines(response.data);
      } else {
        message.error("Failed to load magazines");
      }
    } catch (error) {
      message.error("Error fetching magazines");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch magazines by year (new)
  const fetchMagazinesByYear = async (year) => {
    try {
      setLoading(true);
      const response = await getMagazineByYearMarchofKarnataka(year);
      if (response.success) {
        setFilteredMagazines(response.data);
      } else {
        message.error("No magazines found for the selected year");
      }
    } catch (error) {
      message.error("Error fetching magazines by year");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteMagazine2(id);
      if (response.success) {
        message.success("Magazine deleted successfully!");
        const updatedMagazines = magazines.filter(
          (magazine) => magazine._id !== id
        );
        setMagazines(updatedMagazines);
        setFilteredMagazines(updatedMagazines);
      } else {
        message.error(response.message || "Failed to delete magazine");
      }
    } catch (error) {
      message.error("Error deleting magazine");
    }
  };

  const handleView = (magazine) => {
    setSelectedMagazine(magazine);
    setIsModalVisible(true);
  };

  const handleStatusClick = (magazine) => {
    if (userRole === "admin" && magazine.status === "pending") {
      setSelectedMagazine(magazine);
      setIsApprovalModalVisible(true);
    }
  };

  const handleApprove = async () => {
    if (!selectedMagazine) return;

    setApproving(true);
    try {
      const response = await approveMagazine2(selectedMagazine._id);
      if (response.success) {
        message.success("Magazine approved successfully!");
        const updatedMagazines = magazines.map((magazine) =>
          magazine._id === selectedMagazine._id
            ? { ...magazine, status: "approved" }
            : magazine
        );
        setMagazines(updatedMagazines);
        setFilteredMagazines(updatedMagazines);
        setIsApprovalModalVisible(false);
      } else {
        message.error(response.message || "Failed to approve magazine");
      }
    } catch (error) {
      message.error("Error approving magazine");
    } finally {
      setApproving(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = magazines.filter((magazine) =>
      magazine.title.toLowerCase().includes(value)
    );
    setFilteredMagazines(filtered);
  };

  // ✅ Handle Year Change (new)
  const handleYearChange = (value) => {
    setSelectedYear(value);
    if (value) {
      fetchMagazinesByYear(value);
    } else {
      setFilteredMagazines(magazines);
    }
  };

  // ✅ Extract unique years from magazine data
  const uniqueYears = [
    ...new Set(magazines.map((mag) => mag.publishedYear).filter(Boolean)),
  ].sort((a, b) => b - a);

  const handleEdit = async (id) => {
    try {
      const res = await getMagazineHistoryById(id);
      if (res.success && Array.isArray(res.data)) {
        if (res.data.length <= 1) {
          navigate(`/edit-marchofkarnataka/${id}`);
        } else {
          navigate(`/magazine2-history/${id}`);
        }
      } else {
        navigate(`/edit-marchofkarnataka/${id}`);
      }
    } catch (err) {
      message.warning(
        "Error checking magazine history. Redirecting to edit page."
      );
      navigate(`/edit-marchofkarnataka/${id}`);
    }
  };

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "magazineThumbnail",
      key: "magazineThumbnail",
      render: (text) => (
        <Image width={60} src={text} alt="Magazine Thumbnail" />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Edition",
      dataIndex: "editionNumber",
      key: "editionNumber",
    },
    {
      title: "Published Date",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "PDF URL",
      dataIndex: "magazinePdf",
      key: "magazinePdf",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          View PDF
        </a>
      ),
    },
    {
      title: "Published month",
      dataIndex: "publishedMonth",
      key: "publishedMonth",
    },
    {
      title: "Published year",
      dataIndex: "publishedYear",
      key: "publishedYear",
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (_, record) => record.createdBy?.displayName,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Tag
          color={status === "approved" ? "green" : "orange"}
          style={{
            cursor:
              userRole === "admin" && status !== "approved"
                ? "pointer"
                : "default",
          }}
          onClick={() => handleStatusClick(record)}
        >
          {status.toUpperCase()}
          {userRole === "admin" && status === "pending" && <CheckOutlined />}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
          />
          {(userRole === "admin" ||
            (userRole === "moderator" &&
              record.createdBy?._id === localStorage.getItem("userId"))) && (
            <Popconfirm
              title="Are you sure to delete this magazine?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {/* ✅ Search + Year Dropdown */}
      <Space
        style={{ display: "flex", justifyContent: "right", marginBottom: 16 }}
      >
        <Select
          placeholder="Select Year"
          style={{ width: 150 }}
          value={selectedYear}
          onChange={handleYearChange}
          allowClear
        >
          <Option value={null}>All Years</Option>
          {uniqueYears.map((year) => (
            <Option key={year} value={year}>
              {year}
            </Option>
          ))}
        </Select>

        <Input
          placeholder="Search by Title"
          value={searchText}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          allowClear
          style={{ width: 250 }}
        />
      </Space>

      <Table
        dataSource={filteredMagazines}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      {/* View Modal */}
      <Modal
        title="Magazine Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedMagazine && (
          <>
            <Image
              width="100%"
              height={300}
              src={selectedMagazine.magazineThumbnail}
              alt="Magazine Thumbnail"
              style={{ marginBottom: 20 }}
            />
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Title">
                {selectedMagazine.title}
              </Descriptions.Item>
              <Descriptions.Item label="Edition Number">
                {selectedMagazine.editionNumber || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Published Date">
                {new Date(selectedMagazine.createdTime).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedMagazine.status === "approved" ? "green" : "orange"
                  }
                >
                  {selectedMagazine.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Published month">
                {selectedMagazine.publishedMonth || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Published year">
                {selectedMagazine.publishedYear || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedMagazine.createdBy?.displayName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="PDF Link">
                <a
                  href={selectedMagazine.magazinePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View PDF
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Description">
                {selectedMagazine.description}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>

      {/* Approval Modal */}
      <Modal
        title="Approve Magazine"
        visible={isApprovalModalVisible}
        onOk={handleApprove}
        onCancel={() => setIsApprovalModalVisible(false)}
        confirmLoading={approving}
        width={800}
        okText="Approve"
        cancelText="Cancel"
      >
        {selectedMagazine && (
          <>
            <Image
              width="100%"
              height={300}
              src={selectedMagazine.magazineThumbnail}
              alt="Magazine Thumbnail"
              style={{ marginBottom: 20 }}
            />
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Title">
                {selectedMagazine.title}
              </Descriptions.Item>
              <Descriptions.Item label="Edition Number">
                {selectedMagazine.editionNumber || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Published Date">
                {new Date(selectedMagazine.createdTime).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedMagazine.status === "approved" ? "green" : "orange"
                  }
                >
                  {selectedMagazine.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedMagazine.createdBy?.displayName || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </>
  );
}

export default MagazineTable;
