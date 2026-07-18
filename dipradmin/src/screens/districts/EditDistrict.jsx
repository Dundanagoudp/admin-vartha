import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, message, Spin } from "antd";
import { getDistrictById, updateDistrict } from "../../service/districts/DistrictsApi";
import PageHeader from "../../components/ui/PageHeader";
import { FormCard } from "../../components/ui";

function EditDistrict() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { districtId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        setFetching(true);
        const response = await getDistrictById(districtId);
        
        let district = null;
        if (response?.success && response?.data) {
          district = response.data;
        } else if (response?.data) {
          district = response.data;
        } else if (response && !response.success) {
          district = response;
        }

        if (district) {
          form.setFieldsValue({
            district_name: district.district_name || "",
            district_code: district.district_code || "",
          });
        } else {
          message.error("Failed to load district details.");
        }
      } catch (error) {
        console.error("Error fetching district:", error);
        message.error("Error fetching district details.");
      } finally {
        setFetching(false);
      }
    };

    if (districtId) {
      fetchDistrict();
    }
  }, [districtId, form]);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      const districtData = {
        district_name: values.district_name,
        district_code: values.district_code,
      };

      const response = await updateDistrict(districtId, districtData);

      if (response?.success) {
        message.success("District updated successfully!");
        navigate("/districts");
      } else {
        message.error(response?.message || "Failed to update district.");
      }
    } catch (error) {
      console.error(error);
      message.error("Error updating district.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f7f9",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit District"
        breadcrumbs={[
          { title: "Districts", path: "/districts" },
          { title: "Edit District" },
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
              {loading ? "Updating..." : "Update District"}
            </Button>
            <Button onClick={() => navigate("/districts")} block style={{ flex: 1 }}>
              Cancel
            </Button>
          </div>
        </Form>
      </FormCard>
    </div>
  );
}

export default EditDistrict;
