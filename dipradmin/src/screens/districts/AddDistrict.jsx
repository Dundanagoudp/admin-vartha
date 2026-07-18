import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { createDistrict } from "../../service/districts/DistrictsApi";
import PageHeader from "../../components/ui/PageHeader";
import { FormCard } from "../../components/ui";

function AddDistrict() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const districtData = {
        district_name: values.district_name,
        district_code: values.district_code,
      };

      const response = await createDistrict(districtData);

      if (response?.success) {
        message.success("District created successfully!");
        form.resetFields();
        navigate("/districts");
      } else {
        message.error(response?.message || "Failed to create district.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error creating district.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New District"
        breadcrumbs={[
          { title: "Districts", path: "/districts" },
          { title: "Add District" },
        ]}
      />
      <FormCard style={{ maxWidth: 520 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="District Name"
            name="district_name"
            rules={[{ required: true, message: "District name is required" }]}
          >
            <Input placeholder="Enter district name" />
          </Form.Item>

          <Form.Item
            label="District Code"
            name="district_code"
            rules={[{ required: true, message: "District code is required" }]}
          >
            <Input placeholder="Enter district code (e.g., BG, BL)" maxLength={10} />
          </Form.Item>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ flex: 1 }}
            >
              {loading ? "Creating..." : "Create District"}
            </Button>
            <Button onClick={() => navigate(-1)} block style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </Form>
      </FormCard>
    </div>
  );
}

export default AddDistrict;
