
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { Plus } from "lucide-react";
import { StaticWrapper } from "../../screens/static/static.style";
import StaticTable from "../../components/static/statictable";
import PageHeader from "../../components/ui/PageHeader";

function StaticPage() {
  const navigate = useNavigate();

  const handleAddBannerClick = () => {
    navigate("/website-pages/addpages"); // Navigate to the new banner creation page
  };

  return (
    <StaticWrapper>
      <PageHeader
        title="Websites"
        breadcrumbs={[{ title: "Websites" }]}
        extra={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleAddBannerClick}
          >
            Add Websites
          </Button>
        }
      />

      <div className="block-Table">
        <StaticTable />
      </div>
    </StaticWrapper>
  );
}

export default StaticPage;
