import { cx } from "class-variance-authority";
import { type Component } from "solid-js";

import { type Theme } from "~/lib/theme";

import { DarkMode, LightMode } from "./Material";

export interface ThemeToggleProps {
  theme: Theme;
}

export const ThemeToggle: Component<ThemeToggleProps> = (props) => {
  return (
    <div class="h-6 w-6 overflow-hidden">
      <div
        class={cx(
          "flex h-12 w-6 flex-col [transition:transform_280ms_ease_0s]",
          props.theme === "light"
            ? "[transform:translateY(-24px)]"
            : "[transform:translateY(0px)]"
        )}
      >
        <LightMode class="h-6 w-6" />
        <DarkMode class="h-6 w-6" />
      </div>
    </div>
  );
};
