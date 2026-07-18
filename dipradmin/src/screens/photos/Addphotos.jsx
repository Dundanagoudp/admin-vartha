import React, { useState, useEffect } from "react";
import { Button, Upload, message, Input, Form, Typography, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { uploadFileToAzureStorage } from "../../config/azurestorageservice";
import { createPhotos } from "../../service/Photos/photosService";
import { getPhotoCategories } from "../../service/photoCategory/PhotoCategoryApi";
import PageHeader from "../../components/ui/PageHeader";
import { FormCard } from "../../components/ui";

const { Text } = Typography;
const { Option } = Select;

function AddPhotos() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [photoCategories, setPhotoCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getPhotoCategories();
        if (response?.success && response?.data?.photo_categories && Array.isArray(response.data.photo_categories)) {
          setPhotoCategories(response.data.photo_categories);
        } else {
          message.error("Failed to load photo categories.");
        }
      } catch (error) {
        console.error("Error fetching photo categories:", error);
        message.error("Error fetching photo categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleUpload = async ({ file }) => {
    if (!file.type?.startsWith("image/")) {
      message.error("Only image files are allowed!");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    setUploading(true);
    try {
      const response = await uploadFileToAzureStorage(file, "photos");
      if (response?.blobUrl) {
        setImageUrl(response.blobUrl);
        message.success("Image uploaded to Azure successfully!");
      } else {
        message.error("Failed to upload image to Azure!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Error uploading image to Azure.");
    } finally {
      setUploading(false);
    }
    return false; // prevent AntD auto-upload
  };

  const onFinish = async (values) => {
    if (!imageUrl) {
      message.error("Please upload an image first.");
      return;
    }
    setSaving(true);
    try {
      const payload = { 
        photoImage: imageUrl, 
        title: values.title,
        category: values.category // photo category ID
      };
      const response = await createPhotos(payload);

      if (response?.success) {
        message.success("Photo saved successfully!");
        form.resetFields();
        setImageUrl("");
        navigate("/manage-photos");
      } else {
        message.error(response?.message || "Failed to save photo.");
      }
    } catch (err) {
      message.error("Error saving photo to database.");
    } finally {
      setSaving(false);
    }
  };

  const onReset = () => {
    form.resetFields();
    setImageUrl("");
  };

  return (
    <div>
      <PageHeader
        title="Add New Photo"
        breadcrumbs={[
          { title: "Photos", path: "/manage-photos" },
          { title: "Add Photo" },
        ]}
      />
      <FormCard style={{ maxWidth: 520 }}>
        <Text type="secondary">Upload a photo and give it a title.</Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Title is required" },
              { max: 120, message: "Title must be 120 characters or less" },
            ]}
          >
            <Input placeholder="Enter a title for this photo" />
          </Form.Item>

          <Form.Item
            label="Photo Category"
            name="category"
          >
            <Select placeholder="Select photo category">
              {photoCategories.map((category) => {
                const categoryId = typeof category._id === 'object' && category._id?.$oid 
                  ? category._id.$oid 
                  : category._id;
                return (
                  <Option key={categoryId} value={categoryId}>
                    {category.category_name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {/* Preview Box */}
          <div
            style={{
              width: "100%",
              height: 280,
              border: "1px dashed #d9d9d9",
              borderRadius: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              marginBottom: 12,
              background: "#fafafa",
            }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Uploaded preview"
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            ) : (
              <Text type="secondary">No image uploaded</Text>
            )}
          </div>

          <Upload
            customRequest={handleUpload}
            showUploadList={false}
            accept="image/*"
            disabled={uploading || saving}
          >
            <Button
              icon={<UploadOutlined />}
              block
              loading={uploading}
              style={{ marginBottom: 16 }}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </Upload>

          <div style={{ display: "flex", gap: 8 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={!imageUrl || uploading}
              loading={saving}
              style={{ flex: 1 }}
            >
              {saving ? "Saving..." : "Save Photo"}
            </Button>
            <Button onClick={onReset} block disabled={uploading || saving} style={{ flex: 1 }}>
              Reset
            </Button>
          </div>
        </Form>
      </FormCard>
    </div>
  );
}

export default AddPhotos;
