import styled from "styled-components";

export const SidebarRoot = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #eef0f4;
`;

export const BrandBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px 16px;
  border-bottom: 1px solid #eef0f4;
  flex-shrink: 0;
`;

export const BrandMark = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f8fc;
  border: 1px solid #eef0f4;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 40px !important;
    height: 40px !important;
    max-width: 40px;
    object-fit: contain;
    display: block;
  }
`;

export const BrandTextWrap = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.25;

  .brand-title {
    font-size: 15px;
    color: #151d48;
  }

  .brand-sub {
    font-size: 12px;
    color: #737791;
  }
`;

export const MenuScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 8px 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d9dce5;
    border-radius: 999px;
  }

  .ant-menu {
    border-inline-end: none !important;
    background: transparent;
  }

  .ant-menu-item {
    height: 42px;
    line-height: 42px;
    margin: 2px 0 !important;
    width: 100% !important;
    border-radius: 10px;
    font-weight: 500;
    color: #3d4465;
  }

  .ant-menu-item .ant-menu-item-icon,
  .ant-menu-item .anticon {
    font-size: 16px;
  }

  .ant-menu-item:hover {
    background: #f4f5fb !important;
  }

  .ant-menu-item-selected {
    background: #eef0ff !important;
    color: #5d5fef !important;
    font-weight: 600;
  }

  .ant-menu-item-selected .ant-menu-item-icon,
  .ant-menu-item-selected .anticon {
    color: #5d5fef !important;
  }
`;

export const LogoutBar = styled.div`
  flex-shrink: 0;
  padding: 12px 16px 16px;
  border-top: 1px solid #eef0f4;
  background: #fff;
`;
