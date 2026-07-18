import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const HeaderCopy = styled.div`
  min-width: 0;

  h3 {
    margin: 0 0 4px !important;
    color: #151d48;
  }
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 0.95fr) minmax(320px, 1.15fr);
  gap: 20px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div`
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(21, 29, 72, 0.04);
`;

export const PlayerPanel = styled(Panel)`
  padding: 16px;
`;

export const PlayerShell = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #0f1117;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

export const LiveBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(220, 38, 38, 0.92);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  pointer-events: none;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    animation: livePulse 1.4s ease-out infinite;
  }

  @keyframes livePulse {
    70% {
      box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
    }
  }
`;

export const PlayerEmpty = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9aa3b5;
  background: linear-gradient(160deg, #1a1d27 0%, #0f1117 100%);
  text-align: center;
  padding: 24px;

  .empty-icon {
    font-size: 36px;
    color: #5d5fef;
    opacity: 0.85;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Hint = styled.p`
  margin: 0 0 16px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f4f5fb;
  color: #5a627d;
  font-size: 13px;
  line-height: 1.45;
`;
