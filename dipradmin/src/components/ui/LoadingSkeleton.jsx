import React from "react";
import { Card, Col, Row, Skeleton } from "antd";

export function StatsSkeleton({ count = 4 }) {
  return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: count }).map((_, i) => (
        <Col key={i} xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: 12 }}>
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: "40%" }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export function TableSkeleton({ rows = 6 }) {
  return (
    <Card style={{ borderRadius: 12 }}>
      <Skeleton active paragraph={{ rows }} title={false} />
    </Card>
  );
}

export default function LoadingSkeleton({ variant = "table", ...rest }) {
  if (variant === "stats") return <StatsSkeleton {...rest} />;
  return <TableSkeleton {...rest} />;
}
