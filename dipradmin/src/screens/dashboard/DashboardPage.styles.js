import styled from "styled-components";

export const DashboardWrapper = styled.div`
  max-width: 1400px;

  .profile-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin: 0 0 20px;
    padding: 20px;
    border-radius: 12px;
    background: #fff;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.06);
  }

  .profile-left {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
  }

  .profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e5e7eb;
    background: #f8fafc;
  }

  .profile-name {
    margin: 0 0 6px;
    font-size: 18px;
    font-weight: 700;
    color: #111827;
  }

  .profile-meta {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
  }

  .stats-card {
    margin-bottom: 8px;
  }

  .charts-block {
    margin-top: 20px;
  }
`;
