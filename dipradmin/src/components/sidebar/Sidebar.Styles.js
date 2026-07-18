import styled from "styled-components";

export const SidebarRoot = styled.aside`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-right: 1px solid #e5e7eb;
`;

export const BrandBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 16px 16px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

export const BrandMark = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
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
  gap: 2px;

  .brand-title {
    color: #111827 !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
  }

  .brand-sub {
    color: #6b7280 !important;
    font-size: 11px !important;
    line-height: 1.3 !important;
  }
`;

export const MenuScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 0 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e5e7eb;
    border-radius: 4px;
  }

  .ant-menu {
    border-inline-end: none !important;
    background: transparent;
  }

  .ant-menu-item {
    margin-inline: 8px;
    width: calc(100% - 16px);
    border-radius: 10px;
    color: #374151;
    font-weight: 500;
  }

  .ant-menu-item-selected {
    background: rgba(0, 91, 172, 0.1) !important;
    color: #005bac !important;
    font-weight: 600;
    box-shadow: inset 3px 0 0 #005bac;
  }

  .ant-menu-item .lucide {
    display: inline-flex;
  }
`;

export const LogoutBar = styled.div`
  flex-shrink: 0;
  padding: 12px 14px 16px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
`;
