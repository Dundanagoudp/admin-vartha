import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${(props) => props.theme.typography.fontFamily};
    font-weight: 400;
    font-size: 15px;
    line-height: 1.55;
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    -webkit-font-smoothing: antialiased;
  }

  html {
    scroll-behavior: smooth;
  }

  ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    font-family: inherit;
  }

  a {
    color: unset;
    text-decoration: none;
  }

  *:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.primary};
    outline-offset: 2px;
  }

  .page-fade {
    animation: pageFade 0.28s ease;
  }

  @keyframes pageFade {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ant-btn {
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
  }

  .ant-btn:active {
    transform: translateY(1px);
  }

  .ant-table-wrapper .ant-table-thead > tr > th {
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.01em;
  }

  .ant-table-wrapper .ant-table-tbody > tr > td {
    font-size: 14px;
  }
`;
