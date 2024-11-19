/**
 * See https://m3.material.io/styles/typography/applying-type
 */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  fontFamily: {
    sans: ["Roboto", ...defaultTheme.fontFamily.sans],
    serif: ["Roboto Serif", ...defaultTheme.fontFamily.serif],
    mono: defaultTheme.fontFamily.mono
  },
  fontSize: {
    display: [
      "var(--md-sys-typescale-display-medium-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-display-medium-line-height)",
        letterSpacing: "var(--md-sys-typescale-display-medium-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-display-medium-font-weight)"
      }
    ],
    "display-sm": [
      "var(--md-sys-typescale-display-small-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-display-small-line-height)",
        letterSpacing: "var(--md-sys-typescale-display-small-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-display-small-font-weight)"
      }
    ],
    "display-lg": [
      "var(--md-sys-typescale-display-large-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-display-large-line-height)",
        letterSpacing: "var(--md-sys-typescale-display-large-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-display-large-font-weight)"
      }
    ],
    headline: [
      "var(--md-sys-typescale-headline-medium-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-headline-medium-line-height)",
        letterSpacing: "var(--md-sys-typescale-headline-medium-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-headline-medium-font-weight)"
      }
    ],
    "headline-sm": [
      "var(--md-sys-typescale-headline-small-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-headline-small-line-height)",
        letterSpacing: "var(--md-sys-typescale-headline-small-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-headline-small-font-weight)"
      }
    ],
    "headline-lg": [
      "var(--md-sys-typescale-headline-large-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-headline-large-line-height)",
        letterSpacing: "var(--md-sys-typescale-headline-large-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-headline-large-font-weight)"
      }
    ],
    title: [
      "var(--md-sys-typescale-title-medium-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-title-medium-line-height)",
        letterSpacing: "var(--md-sys-typescale-title-medium-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-title-medium-font-weight)"
      }
    ],
    "title-sm": [
      "var(--md-sys-typescale-title-small-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-title-small-line-height)",
        letterSpacing: "var(--md-sys-typescale-title-small-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-title-small-font-weight)"
      }
    ],
    "title-lg": [
      "var(--md-sys-typescale-title-large-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-title-large-line-height)",
        letterSpacing: "var(--md-sys-typescale-title-large-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-title-large-font-weight)"
      }
    ],
    base: [
      "var(--md-sys-typescale-body-medium-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-body-medium-line-height)",
        letterSpacing: "var(--md-sys-typescale-body-medium-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-body-medium-font-weight)"
      }
    ],
    sm: [
      "var(--md-sys-typescale-body-small-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-body-small-line-height)",
        letterSpacing: "var(--md-sys-typescale-body-small-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-body-small-font-weight)"
      }
    ],
    lg: [
      "var(--md-sys-typescale-body-large-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-body-large-line-height)",
        letterSpacing: "var(--md-sys-typescale-body-large-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-body-large-font-weight)"
      }
    ],
    label: [
      "var(--md-sys-typescale-label-medium-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-label-medium-line-height)",
        letterSpacing: "var(--md-sys-typescale-label-medium-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-label-medium-font-weight)"
      }
    ],
    "label-sm": [
      "var(--md-sys-typescale-label-small-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-label-small-line-height)",
        letterSpacing: "var(--md-sys-typescale-label-small-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-label-small-font-weight)"
      }
    ],
    "label-lg": [
      "var(--md-sys-typescale-label-large-font-size)",
      {
        lineHeight: "var(--md-sys-typescale-label-large-line-height)",
        letterSpacing: "var(--md-sys-typescale-label-large-letter-spacing)",
        fontWeight: "var(--md-sys-typescale-label-large-font-weight)"
      }
    ]
  }
};
