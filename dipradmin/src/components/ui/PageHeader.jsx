import React from "react";
import { Typography } from "antd";
import { PageHeaderRoot } from "./ui.styles";

const { Title } = Typography;

/**
 * @param {{ title: string, breadcrumbs?: Array<{ title: string, path?: string }>, extra?: React.ReactNode }} props
 */
export default function PageHeader({ title, extra }) {
  return (
    <PageHeaderRoot className="page-fade">
      <div className="ph-left">
        <Title level={3} className="ph-title">
          {title}
        </Title>
      </div>
      {extra ? <div className="ph-actions">{extra}</div> : null}
    </PageHeaderRoot>
  );
}
