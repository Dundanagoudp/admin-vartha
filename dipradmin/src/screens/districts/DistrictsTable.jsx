import React, { useEffect, useState } from "react";
import { message, Space, Modal, Descriptions, Popconfirm } from "antd";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDistricts, deleteDistrict } from "../../service/districts/DistrictsApi";
import DataTableShell from "../../components/ui/DataTableShell";
import { IconActionBtn } from "../../components/ui/ui.styles";

function DistrictsTable() {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      const response = await getDistricts();

      if (response?.success && Array.isArray(response?.data?.districts)) {
        setDistricts(response.data.districts);
      } else if (Array.isArray(response?.data)) {
        setDistricts(response.data);
      } else {
        setDistricts([]);
        message.error(response?.message || "Failed to load districts");
      }
    } catch (error) {
      message.error("Error fetching districts");
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (district) => {
    setSelectedDistrict(district);
    setViewModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteDistrict(id);
      if (response?.success || response?.message?.includes("deleted")) {
        message.success("District deleted successfully!");
        setDistricts(districts.filter((district) => {
          const districtId = typeof district._id === 'object' && district._id?.$oid ? district._id.$oid : district._id;
          return districtId !== id;
        }));
      } else {
        message.error(response?.message || "Failed to delete district");
      }
    } catch (error) {
      message.error("Error deleting district");
      console.error("Error deleting district:", error);
    }
  };

  const columns = [
    {
      title: "District Name",
      dataIndex: "district_name",
      key: "district_name",
      render: (text) => text || "No name",
    },
    {
      title: "District Code",
      dataIndex: "district_code",
      key: "district_code",
      render: (text) => text || "-",
    },
    {
      title: "English",
      dataIndex: "english",
      key: "english",
      render: (text) => text || "-",
    },
    {
      title: "Hindi",
      dataIndex: "hindi",
      key: "hindi",
      render: (text) => text || "-",
    },
    {
      title: "Kannada",
      dataIndex: "kannada",
      key: "kannada",
      render: (text) => text || "-",
    },
    {
      title: "Date Created",
      dataIndex: "date_created",
      key: "date_created",
      render: (date) => {
        if (!date) return "-";
        const dateObj = date?.$date ? new Date(date.$date) : new Date(date);
        return dateObj.toLocaleString();
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const recordId = typeof record._id === 'object' && record._id?.$oid ? record._id.$oid : record._id;
        return (
          <Space>
            <IconActionBtn type="button" title="View" onClick={() => handleView(record)}>
              <Eye size={16} />
            </IconActionBtn>
            <IconActionBtn
              type="button"
              title="Edit"
              onClick={() => navigate(`/districts/edit/${recordId}`)}
            >
              <Pencil size={16} />
            </IconActionBtn>
            <Popconfirm
              title="Are you sure to delete this district?"
              onConfirm={() => handleDelete(recordId)}
              okText="Yes"
              cancelText="No"
              okType="danger"
            >
              <IconActionBtn type="button" title="Delete" $danger>
                <Trash2 size={16} />
              </IconActionBtn>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <DataTableShell
        columns={columns}
        dataSource={districts.map((district) => {
          const id = typeof district._id === 'object' && district._id?.$oid ? district._id.$oid : district._id;
          return { ...district, key: id };
        })}
        loading={loading}
        rowKey={(record) => {
          const id = typeof record._id === 'object' && record._id?.$oid ? record._id.$oid : record._id;
          return id;
        }}
        pagination={{ pageSize: 10 }}
        emptyTitle="No districts found"
      />

      <Modal
        title="District Details"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedDistrict && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="District Name">
              {selectedDistrict.district_name || "No name"}
            </Descriptions.Item>
            <Descriptions.Item label="District Code">
              {selectedDistrict.district_code || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="English">
              {selectedDistrict.english || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Hindi">
              {selectedDistrict.hindi || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Kannada">
              {selectedDistrict.kannada || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Date Created">
              {selectedDistrict.date_created?.$date
                ? new Date(selectedDistrict.date_created.$date).toLocaleString()
                : "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

export default DistrictsTable;
