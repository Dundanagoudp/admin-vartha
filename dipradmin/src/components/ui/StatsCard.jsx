import React from "react";
import { StatsCardRoot } from "./ui.styles";

/**
 * @param {{
 *  label: string,
 *  value: string|number,
 *  subtitle?: string,
 *  icon?: React.ReactNode,
 *  accent?: string,
 *  iconBg?: string,
 *  onClick?: () => void,
 * }} props
 */
export default function StatsCard({
  label,
  value,
  subtitle = "",
  icon,
  accent = "#005BAC",
  iconBg,
  onClick,
}) {
  return (
    <StatsCardRoot
      type="button"
      className="cms-stats-card"
      $accent={accent}
      $iconBg={iconBg}
      $clickable={Boolean(onClick)}
      onClick={onClick}
    >
      <div className="sc-top">
        <div>
          <div className="sc-value">{value ?? "—"}</div>
          <div className="sc-label">{label}</div>
          {subtitle ? <div className="sc-sub">{subtitle}</div> : null}
        </div>
        {icon ? <div className="sc-icon">{icon}</div> : null}
      </div>
    </StatsCardRoot>
  );
}
