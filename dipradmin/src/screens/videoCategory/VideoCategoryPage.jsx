import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Plus } from "lucide-react";
import VideoCategoryTable from "./VideoCategoryTable";
import PageHeader from "../../components/ui/PageHeader";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 20px;

  .block-Table {
    margin-top: 8px;
  }
`;

function VideoCategoryPage() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/video-category/add");
  };

  return (
    <Wrapper>
      <PageHeader
        title="Video Categories"
        breadcrumbs={[{ title: "Video Categories" }]}
        extra={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleAddClick}
          >
            Add Video Category
          </Button>
        }
      />

      <div className="block-Table">
        <VideoCategoryTable />
      </div>
    </Wrapper>
  );
}

export default VideoCategoryPage;
