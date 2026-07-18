import React from "react";
import { Table } from "antd";
import { DataTableShellRoot } from "./ui.styles";
import EmptyState from "./EmptyState";

/**
 * Visual shell around Ant Design Table — keeps existing columns/data/handlers.
 */
export default function DataTableShell({
  toolbar,
  emptyTitle,
  emptyDescription,
  locale,
  sticky = true,
  ...tableProps
}) {
  return (
    <DataTableShellRoot>
      {toolbar ? <div className="dts-toolbar">{toolbar}</div> : null}
      <div className="dts-body">
        <Table
          sticky={sticky}
          size="middle"
          locale={{
            emptyText: (
              <EmptyState
                title={emptyTitle || "No records found"}
                description={
                  emptyDescription || "Try adjusting filters or add a new item."
                }
              />
            ),
            ...locale,
          }}
          {...tableProps}
        />
      </div>
    </DataTableShellRoot>
  );
}
