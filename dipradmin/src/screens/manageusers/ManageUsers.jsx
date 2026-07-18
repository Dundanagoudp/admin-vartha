import React from "react";
import { ManageUsersWrapper } from "./ManageUsersPage.styles";
import UsersTable from "../../components/users/UsersTable";
import PageHeader from "../../components/ui/PageHeader";

function ManageUsers() {
  return (
    <ManageUsersWrapper>
      <PageHeader
        title="Manage Users"
        breadcrumbs={[{ title: "Users" }]}
      />
      <div className="users-table">
        <UsersTable />
      </div>
    </ManageUsersWrapper>
  );
}

export default ManageUsers;
