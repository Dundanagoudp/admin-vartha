import React from "react";
import { Inbox } from "lucide-react";
import { EmptyStateRoot } from "./ui.styles";

/**
 * @param {{ title?: string, description?: string, icon?: React.ReactNode }} props
 */
export default function EmptyState({
  title = "No data found",
  description = "There is nothing to display here yet.",
  icon,
}) {
  return (
    <EmptyStateRoot>
      <div className="es-icon">{icon || <Inbox size={24} />}</div>
      <div className="es-title">{title}</div>
      {description ? <div className="es-desc">{description}</div> : null}
    </EmptyStateRoot>
  );
}
