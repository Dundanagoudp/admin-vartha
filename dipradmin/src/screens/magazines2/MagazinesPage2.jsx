import React from "react";
import { MagazineWrapper } from "../magazines/MagazinesPage.styles";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import MagazineTable2 from "../../components/magazines/MagazineTable2";
import PageHeader from "../../components/ui/PageHeader";

function MagazinesPage2() {
  const navigate = useNavigate();

  const handleAddArticleClick = () => {
    navigate("/add-varthajanapada");
  };

  return (
    <MagazineWrapper>
      <PageHeader
        title="Vartha Janapada"
        breadcrumbs={[{ title: "Magazines" }]}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddArticleClick}
          >
            Add Magazine
          </Button>
        }
      />
      <div className="block-table">
        <MagazineTable2 />
      </div>
    </MagazineWrapper>
  );
}

export default MagazinesPage2;
