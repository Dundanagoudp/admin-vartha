import React, { useEffect, useState } from "react";
import { DashboardWrapper } from "./DashboardPage.styles";
import StatsCard from "../../components/dashboard/statsCard/StatsCard";
import DashboardCharts from "../../components/dashboard/charts/DashboardCharts";
import {
  getUserProfile,
  updateUserProfileById,
} from "../../service/Dashboard/Dashboardapi";
import { Modal, Input, Button, message, Upload, Form, Tag } from "antd";
import { Pencil, Upload as UploadIcon } from "lucide-react";
import { uploadFileToAzureStorage } from "../../config/azurestorageservice";
import PageHeader from "../../components/ui/PageHeader";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    profileImage: "",
  });
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile();
        if (res.success) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUser();
  }, []);

  const handleEdit = () => {
    setFormData({
      displayName: user.displayName || "",
      email: user.email || "",
      profileImage: user.profileImage || "",
    });
    setEditVisible(true);
  };

  const handleImageUpload = async ({ file }) => {
    try {
      setUploading(true);
      const res = await uploadFileToAzureStorage(file, "profileImages");
      if (res?.blobUrl) {
        setFormData((prev) => ({ ...prev, profileImage: res.blobUrl }));
        message.success("Profile image uploaded successfully!");
      } else {
        message.error("Failed to upload to Azure Storage.");
      }
    } catch (error) {
      console.error("Azure upload error:", error);
      message.error("Error uploading image to Azure.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setUpdating(true);
      const res = await updateUserProfileById(user._id, formData);
      if (res.success) {
        message.success("Profile updated successfully!");
        setUser((prev) => ({ ...prev, ...formData }));
        setEditVisible(false);
      } else {
        message.error(res.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      message.error("Something went wrong while updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <DashboardWrapper>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ title: "Dashboard" }]}
      />

      {user && (
        <div className="profile-card">
          <div className="profile-left">
            <img
              src={user.profileImage || "/image.webp"}
              alt="Profile"
              className="profile-avatar"
            />
            <div>
              <h3 className="profile-name">{user.displayName}</h3>
              <p className="profile-meta">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="profile-meta">
                <strong>Phone:</strong> {user.phone_Number || "—"}
              </p>
              <p className="profile-meta" style={{ marginTop: 4 }}>
                <Tag color="processing" style={{ borderRadius: 8, fontWeight: 600 }}>
                  {user.role}
                </Tag>
              </p>
            </div>
          </div>
          <Button icon={<Pencil size={15} />} onClick={handleEdit}>
            Edit Profile
          </Button>
        </div>
      )}

      <Modal
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        footer={null}
        title="Edit Profile"
        centered
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Name">
            <Input
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Email">
            <Input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Profile Image">
            <Upload
              customRequest={handleImageUpload}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadIcon size={15} />} loading={uploading}>
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </Upload>
          </Form.Item>

          {formData.profileImage && (
            <Form.Item label="Preview">
              <img
                src={formData.profileImage}
                alt="Preview"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 12,
                  border: "1px solid #E5E7EB",
                  objectFit: "cover",
                }}
              />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={() => setEditVisible(false)}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={updating}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className="stats-card">
        <StatsCard />
      </div>
      <div className="charts-block">
        <DashboardCharts />
      </div>
    </DashboardWrapper>
  );
}

export default DashboardPage;
