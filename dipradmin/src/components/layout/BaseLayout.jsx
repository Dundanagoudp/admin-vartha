import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.jsx";

const { Sider, Content } = Layout;

const BaseLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f6fa" }}>
      <Sider
        width={260}
        theme="light"
        style={{
          background: "#fff",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 100,
          boxShadow: "0 0 0 1px #eef0f4, 4px 0 24px rgba(21, 29, 72, 0.04)",
        }}
      >
        <Sidebar />
      </Sider>

      <Layout
        style={{
          marginLeft: 260,
          minHeight: "100vh",
          background: "#f5f6fa",
        }}
      >
        <Content
          style={{
            margin: 16,
            padding: "20px 20px 28px",
            background: "#fff",
            borderRadius: 12,
            minHeight: "calc(100vh - 32px)",
            boxShadow: "0 1px 2px rgba(21, 29, 72, 0.04)",
            overflowX: "auto",
            width: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
