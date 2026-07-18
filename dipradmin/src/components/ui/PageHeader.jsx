import React from "react";
import { Breadcrumb, Typography } from "antd";
import { Link } from "react-router-dom";
import { PageHeaderRoot } from "./ui.styles";

const { Title } = Typography;

/**
 * @param {{ title: string, breadcrumbs?: Array<{ title: string, path?: string }>, extra?: React.ReactNode }} props
 */
export default function PageHeader({ title, breadcrumbs = [], extra }) {
  const items = [
    { title: <Link to="/dashboard">Home</Link> },
    ...breadcrumbs.map((b) =>
      b.path ? { title: <Link to={b.path}>{b.title}</Link> } : { title: b.title }
    ),
  ];

  return (
    <PageHeaderRoot className="page-fade">
      <div className="ph-left">
        {breadcrumbs.length > 0 && (
          <Breadcrumb items={items} style={{ marginBottom: 4 }} />
        )}
        <Title level={3} className="ph-title">
          {title}
        </Title>
      </div>
      {extra ? <div className="ph-actions">{extra}</div> : null}
    </PageHeaderRoot>
  );
}
