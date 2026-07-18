import React from "react";
import { ModerationWrapper } from "./Moderation.Styles";
import ModerationTable from "../../components/moderation/ModerationTable";
import PageHeader from "../../components/ui/PageHeader";

function ModerationPage() {
  return (
    <ModerationWrapper>
      <PageHeader
        title="Moderation"
        breadcrumbs={[{ title: "Moderation" }]}
      />
      <div className="moderation-table">
        <ModerationTable />
      </div>
    </ModerationWrapper>
  );
}

export default ModerationPage;
