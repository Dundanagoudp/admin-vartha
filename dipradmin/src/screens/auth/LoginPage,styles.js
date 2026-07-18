import styled from "styled-components";

export const LoginWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f8fafc;
  background-image:
    radial-gradient(circle at 10% 20%, rgba(0, 91, 172, 0.06), transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(0, 91, 172, 0.05), transparent 40%);

  .login-card {
    width: 100%;
    max-width: 420px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 8px 28px rgba(17, 24, 39, 0.08);
    padding: 36px 32px 28px;
  }

  .login-brand {
    text-align: center;
    margin-bottom: 20px;
  }

  .login-logo {
    width: 72px !important;
    height: 72px;
    object-fit: contain;
    margin: 0 auto 12px;
  }

  .login-dept {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #005bac;
  }

  .login-title {
    margin: 0 0 4px !important;
    text-align: center;
    font-weight: 700 !important;
    color: #111827 !important;
  }

  .login-sub {
    text-align: center;
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 24px;
  }

  .login-footer {
    margin-top: 16px;
    text-align: center;
    font-size: 11px;
    color: #9ca3af;
  }
`;
