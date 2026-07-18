import styled from "styled-components";

export const NotificationWrapper = styled.div`
  width: 100%;
  max-width: 100%;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  h3 {
    margin: 0 0 4px !important;
    color: #151d48;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  .search-box {
    flex: 1;
    min-width: 220px;
    max-width: 420px;
  }
`;

export const TableCard = styled.div`
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 14px;
  padding: 8px 8px 4px;
  box-shadow: 0 1px 2px rgba(21, 29, 72, 0.04);
  overflow: hidden;

  .ant-table {
    background: transparent;
  }

  .ant-table-thead > tr > th {
    background: #f7f8fc !important;
    color: #5a627d;
    font-weight: 600;
    border-bottom: 1px solid #eef0f4 !important;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f2f7 !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8f9fd !important;
  }

  .ant-pagination {
    margin: 12px 8px 8px !important;
  }

  @media (max-width: 768px) {
    padding: 4px;

    .ant-table-thead {
      display: none;
    }

    .ant-table-tbody > tr {
      display: block;
      margin-bottom: 12px;
      border: 1px solid #eef0f4;
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
    }

    .ant-table-tbody > tr > td {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      border-bottom: 1px solid #f0f2f7 !important;
      padding: 10px 14px !important;
      white-space: normal;
    }

    .ant-table-tbody > tr > td::before {
      content: attr(data-label);
      font-weight: 600;
      color: #737791;
      flex-shrink: 0;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .ant-table-tbody > tr > td:last-child {
      border-bottom: none !important;
    }
  }
`;

export const TitleCell = styled.div`
  font-weight: 600;
  color: #151d48;
  line-height: 1.4;
`;

export const LinkCell = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: #5d5fef;
  cursor: pointer;
  font-size: 13px;
  text-align: left;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 280px;
  }

  &:hover {
    color: #3b3dd8;
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    span {
      max-width: 180px;
      white-space: normal;
    }
  }
`;

export const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #f4f5fb;
  color: #5a627d;
  font-size: 12px;
`;

export const CountText = styled.span`
  color: #737791;
  font-size: 13px;
  white-space: nowrap;
`;
