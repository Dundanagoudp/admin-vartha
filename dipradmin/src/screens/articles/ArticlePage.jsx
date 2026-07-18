import React from "react";
import { ArticlePageWrapper } from "./ArticlePage.styles";
import { Button } from "antd";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ArticleTable from "../../components/articles/ArticleTable";
import PageHeader from "../../components/ui/PageHeader";

function ArticlePage() {
  const navigate = useNavigate();

  const handleAddArticleClick = () => {
    navigate("/add-article");
  };

  return (
    <ArticlePageWrapper>
      <PageHeader
        title="Manage Articles"
        breadcrumbs={[{ title: "Articles" }]}
        extra={
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={handleAddArticleClick}
          >
            Add Article
          </Button>
        }
      />

      <div className="block-table">
        <ArticleTable />
      </div>
    </ArticlePageWrapper>
  );
}

export default ArticlePage;
