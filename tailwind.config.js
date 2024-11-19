import colors from "./material/tailwind.colors.js";
import { fontFamily, fontSize } from "./material/tailwind.typography.js";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-mode="dark"]'],
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  future: {
    hoverOnlyWhenSupported: true
  },
  theme: {
    fontFamily,
    fontSize,
    // see https://m3.material.io/foundations/layout/applying-layout/window-size-classes#2bb70e22-d09b-4b73-9c9f-9ef60311ccc8
    screens: {
      sm: "600px",
      md: "840px",
      ex: "1200px",
      lg: "1600px"
    },
    extend: {
      // see https://tailwindcss.com/blog/tailwindcss-v3-2#aria-attribute-variants
      aria: {
        current: 'current="true"'
      },
      colors,
      // see https://github.com/material-components/material-web/blob/main/elevation/lib/_elevation.scss
      boxShadow: {
        1: "0px 1px 2px 0px rgb(var(--md-sys-color-shadow) / 0.3), 0px 1px 3px 1px rgb(var(--md-sys-color-shadow) / 0.15)",
        2: "0px 1px 2px 0px rgb(var(--md-sys-color-shadow) / 0.3), 0px 2px 6px 2px rgb(var(--md-sys-color-shadow) / 0.15)",
        3: "0px 1px 3px 0px rgb(var(--md-sys-color-shadow) / 0.3), 0px 4px 8px 3px rgb(var(--md-sys-color-shadow) / 0.15)",
        4: "0px 2px 3px 0px rgb(var(--md-sys-color-shadow) / 0.3), 0px 6px 10px 4px rgb(var(--md-sys-color-shadow) / 0.15)",
        5: "0px 4px 4px 0px rgb(var(--md-sys-color-shadow) / 0.3), 0px 8px 12px 6px rgb(var(--md-sys-color-shadow) / 0.15)"
      },
      // see https://m3.material.io/foundations/interaction/states/state-layers#ec68aa40-c1aa-410a-b677-e83f6f2ba021
      opacity: {
        hover: ".08",
        focus: ".12",
        press: ".12",
        drag: ".16"
      },
      backgroundImage: {
        "gradient-ripple":
          "radial-gradient(closest-side, var(--tw-gradient-from) max(100% - 70px, 65%), transparent 100%)",
        "gradient-ripple-debug":
          "radial-gradient(closest-side, var(--tw-gradient-from) max(100% - 70px, 65%), violet max(100% - 70px, 65%))"
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
            visibility: "invisible"
          },
          "75%": {
            opacity: "0",
            visibility: "visible"
          },
          "100%": {
            opacity: "1",
            visibility: "visible"
          }
        },
        "fade-in-quick": {
          "0%": {
            opacity: "0"
          },
          "100%": {
            opacity: "1"
          }
        },
        "fade-out-quick": {
          "0%": {
            opacity: "1"
          },
          "100%": {
            opacity: "0"
          }
        },
        enter: {
          "0%": {
            opacity: "0",
            transform: "scale(.9)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        },
        "child-enter": {
          "0%": {
            opacity: "0",
            "max-height": "0"
          },
          "50%": {
            opacity: "1"
          },
          "100%": {
            opacity: "1",
            "max-height": "400px"
          }
        },
        "child-leave": {
          "0%": {
            opacity: "1",
            "max-height": "400px"
          },
          "50%": {
            opacity: "1"
          },
          "100%": {
            "max-height": "0",
            opacity: "0"
          }
        },
        "slide-in": {
          "0%": {
            transform: "translateX(-100%)"
          },
          "100%": {
            transform: "translateX(0)"
          }
        },
        "slide-out": {
          "0%": {
            transform: "translateX(0)"
          },
          "100%": {
            transform: "translateX(-100%)"
          }
        },
        leave: {
          "0%": {
            opacity: "1",
            transform: "scale(1)"
          },
          "100%": {
            opacity: "0",
            transform: "scale(.9)"
          }
        },
        "circular-progress-indicator": {
          "0%": {
            "stroke-dasharray": "1px, 200px",
            "stroke-dashoffset": 0
          },
          "50%": {
            "stroke-dasharray": "100px, 200px",
            "stroke-dashoffset": "-15px"
          },
          "100%": {
            "stroke-dasharray": "100px, 200px",
            "stroke-dashoffset": "-125px"
          }
        },
        ripple: {
          "0%": {
            transform: "scale(0)",
            opacity: 0.8
          },
          "50%": {
            transform: "scale(1)",
            opacity: 1
          },
          "100%": {
            transform: "scale(1)",
            opacity: 0
          }
        }
      },
      animation: {
        "circular-progress": "spin 1.2s linear infinite",
        "circular-progress-indicator":
          "circular-progress-indicator 1.2s ease-in-out infinite",
        ripple: "ripple 600ms linear",
        enter: "enter .2s ease-out",
        leave: "leave .15s ease-in forwards",
        "fade-in": "fade-in .8s ease-in forwards",
        "fade-in-quick": "fade-in-quick .2s ease-in forwards",
        "fade-out-quick": "fade-out-quick .2s ease-in forwards",
        "slide-in": "slide-in .2s ease-out forwards",
        "slide-out": "slide-out .2s ease-in forwards",
        "child-enter": "child-enter .3s ease-out forwards",
        "child-leave": "child-leave .3s ease-in forwards",
        delay: "0s linear 300ms"
      }
    }
  },
  plugins: []
};
