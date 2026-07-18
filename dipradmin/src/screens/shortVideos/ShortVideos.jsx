import React from "react";
import { ShortVideosWrapper } from "./ShortVideos.styles";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ShortVideosTable from "../../components/shortVideos/ShortVideosTable";
import PageHeader from "../../components/ui/PageHeader";

function ShortVideosPage() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/add-ShortVideos");
  };
  return (
    <ShortVideosWrapper>
      <PageHeader
        title="Short Videos"
        breadcrumbs={[{ title: "Videos" }]}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClick}
          >
            Add Short Video
          </Button>
        }
      />
      <div className="block-table">
        <ShortVideosTable />
      </div>
    </ShortVideosWrapper>
  );
}

export default ShortVideosPage;
