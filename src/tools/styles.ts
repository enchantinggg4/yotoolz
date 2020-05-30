import { css } from "styled-components";

export const shadows = {
  tab: css`
    box-shadow: 0px 0px 2px rgba(32, 20, 41, 0.15);
  `,
  inputBigShadow: css`
    box-shadow: 0px 4px 24px rgba(104, 66, 135, 0.15);
  `,
  dropdown: css`
    box-shadow: 0px 8px 24px rgba(32, 20, 41, 0.2);
  `,
  smallShadow: css`
    box-shadow: 0px 2px 8px rgba(104, 66, 135, 0.12);
  `
};

export const colors = {
  white: "#FFFFFF",

  cool: `hsl(227, 10%, 10%)`,

  main: {
    default: "#684287",
    L1: "#867BB0",
    L2: "#B6BAD6",
    L3: "#F5F7FA",
    D1: "#512C6B",
    D2: "#39194B"
  },
  primary: {
    default: "#201429",
    L1: "#474052",
    L2: "#6F6C7B",
    L3: "#9999A4",
    L4: "#C6C7CC",
    L5: "#F3F4F5"
  },
  secondary: {
    default: "#F37021",
    L3: "#FFF4F3",
    D1: "#BF5807"
  },
  success: {
    default: "#5db25d",
    L1: "#58D592",
    L2: "#A4EABD",
    L3: "#F3FCF5"
  },
  error: "#DC183B",
  digitalBlue: "#0F61DC"
};

export const fonts = {
  overlines: {
    O1: css`
      font-weight: 500;
      font-size: 12px;
      line-height: 120%;
      letter-spacing: 0.015em;
    `
  },
  captions: {
    C1: css`
      font-weight: 500;
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.015em;
    `
  },
  paragraphs: {
    P1: css`
      font-weight: normal;
      font-size: 28px;
      line-height: 144%;
    `,
    P2: css`
      font-weight: normal;
      font-size: 24px;
      line-height: 144%;
    `,
    P3: css`
      font-weight: normal;
      font-size: 20px;
      line-height: 30px;
    `,
    P4: css`
      font-weight: normal;
      font-size: 18px;
      line-height: 24px;
      letter-spacing: 0.005em;
    `,
    P5: css`
      font-weight: normal;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 0.01em;
    `,
    P6: css`
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.015em;
    `
  },
  subtitles: {
    S1: css`
      font-weight: 500;
      font-size: 20px;
      line-height: 120%;
    `,
    S2: css`
      font-weight: 500;
      font-size: 18px;
      line-height: 120%;
      letter-spacing: 0.005em;
    `,
    S3: css`
      font-weight: 500;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: 0.01em;
    `,
    S4: css`
      font-weight: 500;
      font-size: 14px;
      line-height: 120%;
      letter-spacing: 0.015em;
    `
  },
  headlines: {
    H3: css`
      font-weight: 500;
      font-size: 40px;
      line-height: 120%;
      letter-spacing: -0.005em;

      @media (max-width: 500px) {
      }
    `,
    H4: css`
      font-weight: 500;
      font-size: 32px;
      line-height: 128%;
      letter-spacing: -0.005em;
    `,
    H5: css`
      font-weight: 500;
      font-size: 24px;
      line-height: 128%;
    `
  },
  buttons: {
    B1: css`
      font-weight: 500;
      font-size: 18px;
      line-height: 120%;
      letter-spacing: 0.02em;
    `,
    B2: css`
      font-weight: 500;
      font-size: 16px;
      line-height: 18px;
      letter-spacing: 0.02em;
    `,
    B3: css`
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      letter-spacing: 0.02em;
    `
  }
};
