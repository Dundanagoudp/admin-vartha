import styled from "styled-components";

export const TopNavbarRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 68px;
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(17, 24, 39, 0.04);

  .tn-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .tn-menu-btn {
    display: none;
    color: #111827;
  }

  .tn-titles {
    min-width: 0;
  }

  .tn-crumb {
    font-size: 12px;
  }

  .tn-title {
    margin: 0 !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    color: #111827 !important;
    line-height: 1.25 !important;
  }

  .tn-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .tn-icon-btn {
    width: 40px;
    height: 40px;
    color: #374151;
  }

  .tn-user {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 4px 8px 4px 4px;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    background: #fff;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: #f8fafc;
    }
  }

  .tn-user-meta {
    text-align: left;
  }

  .tn-name {
    font-size: 13px !important;
    line-height: 1.2 !important;
    color: #111827 !important;
  }

  .tn-role {
    font-size: 11px !important;
    text-transform: capitalize;
    line-height: 1.2 !important;
  }

  @media (max-width: 992px) {
    .tn-menu-btn {
      display: inline-flex;
    }
  }

  @media (max-width: 576px) {
    padding: 10px 12px;

    .tn-user-meta {
      display: none;
    }
  }
`;
