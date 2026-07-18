import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Plus } from "lucide-react";
import DistrictsTable from "./DistrictsTable";
import PageHeader from "../../components/ui/PageHeader";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 20px;

  .block-Table {
    margin-top: 8px;
  }
`;

function DistrictsPage() {
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/districts/add");
  };

  return (
    <Wrapper>
      <PageHeader
        title="Districts"
        breadcrumbs={[{ title: "Districts" }]}
        extra={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleAddClick}
          >
            Add District
          </Button>
        }
      />

      <div className="block-Table">
        <DistrictsTable />
      </div>
    </Wrapper>
  );
}

export default DistrictsPage;
