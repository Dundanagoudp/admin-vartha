import { css } from "styled-components";

export const theme = {
  colors: {
    primary: "#005BAC",
    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    background: "#F8FAFC",
    card: "#FFFFFF",
    border: "#E5E7EB",
    text: "#111827",
    textSecondary: "#6B7280",

    // Legacy aliases used across older styled files
    blue: "#005BAC",
    seasalt: "#F8FAFC",
    gray700: "#6B7280",
    ashgray: "#9CA3AF",
    dodgerBlue: "#005BAC",
    emerald: "#16A34A",
    red: "#DC2626",
    violet: "#005BAC",
    yellow: "#F59E0B",
    pink: "#DC2626",
    salmon: "#F59E0B",
    cadet: "#111827",
    malachite: "#16A34A",
    floralWhite: "#F8FAFC",
    orange: "#F59E0B",
    white: "#FFFFFF",
    black: "#111827",
    columbiaBlue: "#E5E7EB",
    latte: "#FEF3C7",
    nyanza: "#DCFCE7",
    palePurple: "#DBEAFE",
    mistyRose: "#FEE2E2",
    sunset: "#FEF3C7",
    mauve: "#BFDBFE",
    aquamarine: "#BBF7D0",
    aliceBlue: "#EFF6FF",
    frenchGray: "#D1D5DB",
  },

  shadows: {
    soft: "0 1px 2px rgba(17, 24, 39, 0.04), 0 4px 16px rgba(17, 24, 39, 0.06)",
    card: "0 1px 3px rgba(17, 24, 39, 0.06), 0 8px 24px rgba(17, 24, 39, 0.04)",
  },

  radius: {
    md: "12px",
    sm: "8px",
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },

  breakpoints: {
    xs: "480px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
    xxl: "1440px",
    xxxl: "1600px",
  },
};

export const antdTheme = {
  token: {
    colorPrimary: "#005BAC",
    colorSuccess: "#16A34A",
    colorWarning: "#F59E0B",
    colorError: "#DC2626",
    colorInfo: "#005BAC",
    colorText: "#111827",
    colorTextSecondary: "#6B7280",
    colorBorder: "#E5E7EB",
    colorBgLayout: "#F8FAFC",
    colorBgContainer: "#FFFFFF",
    borderRadius: 12,
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    controlHeight: 40,
    boxShadow: "0 1px 2px rgba(17, 24, 39, 0.04), 0 4px 16px rgba(17, 24, 39, 0.06)",
  },
  components: {
    Button: {
      controlHeight: 40,
      borderRadius: 10,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 20,
    },
    Table: {
      headerBg: "#F8FAFC",
      headerColor: "#111827",
      rowHoverBg: "#EFF6FF",
      borderColor: "#E5E7EB",
    },
    Menu: {
      itemBorderRadius: 10,
      itemMarginInline: 8,
      itemHeight: 44,
      iconSize: 18,
    },
    Input: {
      borderRadius: 10,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 10,
      controlHeight: 40,
    },
    Modal: {
      borderRadiusLG: 12,
    },
    Tag: {
      borderRadiusSM: 8,
    },
    Layout: {
      siderBg: "#FFFFFF",
      headerBg: "#FFFFFF",
      bodyBg: "#F8FAFC",
    },
  },
};

export const media = {
  xxxl: (...args) => css`
    @media (max-width: ${(props) => props.theme.breakpoints.xxxl}) {
      ${css(...args)}
    }
  `,
  xxl: (...args) => css`
    @media (max-width: ${(props) => props.theme.breakpoints.xxl}) {
      ${css(...args)}
    }
  `,
  xl: (...args) => css`
    @media (max-width: ${(props) => props.theme.breakpoints.xl}) {
      ${css(...args)}
    }
  `,
  lg: (...args) => css`
    @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
      ${css(...args)}
    }
  `,
  md: (...args) => css`
    @media (max-width: ${(props) => props.theme.breakpoints.md}) {
      ${css(...args)}
    }
  `,
  sm: (...args) => css`
    @media (max-width: ${(props) => props.theme.breakpoints.sm}) {
      ${css(...args)}
    }
  `,
  xs: (...args) => css`
    @media (max-width: ${(props) => props.theme.breakpoints.xs}) {
      ${css(...args)}
    }
  `,
};
