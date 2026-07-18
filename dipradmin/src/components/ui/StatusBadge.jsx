import React from "react";
import { Tag } from "antd";

const STATUS_MAP = {
  approved: { color: "success", label: "Approved" },
  published: { color: "success", label: "Published" },
  active: { color: "success", label: "Active" },
  pending: { color: "warning", label: "Pending" },
  "pending approval": { color: "warning", label: "Pending" },
  rejected: { color: "error", label: "Rejected" },
  inactive: { color: "error", label: "Inactive" },
  draft: { color: "default", label: "Draft" },
  online: { color: "success", label: "Online" },
  offline: { color: "default", label: "Offline" },
};

/**
 * @param {{ status?: string, children?: React.ReactNode }} props
 */
export default function StatusBadge({ status, children }) {
  const key = String(status || children || "")
    .trim()
    .toLowerCase();
  const mapped = STATUS_MAP[key];
  const label = children || mapped?.label || status || "—";
  const color = mapped?.color || "default";

  return (
    <Tag
      color={color}
      style={{
        borderRadius: 8,
        padding: "2px 10px",
        fontWeight: 600,
        fontSize: 12,
        margin: 0,
      }}
    >
      {label}
    </Tag>
  );
}
