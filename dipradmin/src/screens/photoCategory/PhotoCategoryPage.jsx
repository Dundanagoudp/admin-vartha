import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Plus } from "lucide-react";
import PhotoCategoryTable from "./PhotoCategoryTable";
import PageHeader from "../../components/ui/PageHeader";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 20px;

  .block-Table {
    margin-top: 8px;
  }
`;

function PhotoCategoryPage() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/photo-category/add");
  };

  return (
    <Wrapper>
      <PageHeader
        title="Photo Categories"
        breadcrumbs={[{ title: "Photo Categories" }]}
        extra={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleAddClick}
          >
            Add Photo Category
          </Button>
        }
      />

      <div className="block-Table">
        <PhotoCategoryTable />
      </div>
    </Wrapper>
  );
}

export default PhotoCategoryPage;
