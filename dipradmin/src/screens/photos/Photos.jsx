
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PhotosWrapper } from "./Photos.style";
import PhotosTable from "../../components/photos/photostable";
import PageHeader from "../../components/ui/PageHeader";

function PhtotosPage() {
  const navigate = useNavigate();

  const handleAddBannerClick = () => {
    navigate("/manage-photos/addphotos"); // Navigate to the new banner creation page
  };

  return (
    <PhotosWrapper>
      <PageHeader
        title="Photos"
        breadcrumbs={[{ title: "Media" }]}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddBannerClick}
          >
            Add Photos
          </Button>
        }
      />

      {/* Banners Table */}
      <div className="block-Table">
        <PhotosTable />
      </div>
    </PhotosWrapper>
  );
}

export default PhtotosPage;
