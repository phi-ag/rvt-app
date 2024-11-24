import {
  type Accessor,
  type Component,
  type Context,
  type ParentComponent,
  type Setter,
  createContext,
  createEffect,
  createSignal,
  useContext
} from "solid-js";
import { getRequestEvent } from "solid-js/web";

export type Theme = "dark" | "light";

const setDarkStyle = (): void => {
  document.documentElement.style.colorScheme = "dark";
  document.documentElement.setAttribute("data-mode", "dark");
};

const setLightStyle = (): void => {
  document.documentElement.style.colorScheme = "light";
  document.documentElement.removeAttribute("data-mode");
};

export const setDark = (): void => {
  if (window?.localStorage) {
    window.localStorage.theme = "dark";
  }
  setDarkStyle();
};

export const setLight = (): void => {
  if (window?.localStorage) {
    window.localStorage.theme = "light";
  }
  setLightStyle();
};

export const setSystem = (): void => {
  window?.localStorage.removeItem("theme");

  if (window?.matchMedia("(prefers-color-scheme: dark)")?.matches) {
    setDarkStyle();
  } else {
    setLightStyle();
  }
};

const current = (): Theme => {
  if (typeof window === "undefined") return "dark";

  if (
    window.localStorage?.theme === "dark" ||
    (!window.localStorage?.theme && matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    return "dark";
  } else {
    return "light";
  }
};

const themeHeaderScript = `const d = document.documentElement;
const t = localStorage?.theme;
if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches)) {
  d.style.colorScheme = "dark";
  d.setAttribute("data-mode", "dark");
} else {
  d.style.colorScheme = "light";
  d.removeAttribute("data-mode");
}`;

export const ThemeHeaderScript: Component = () => {
  // @ts-expect-error
  const nonce = getRequestEvent()?.nonce;

  return (
    <script
      nonce={nonce}
      // eslint-disable-next-line solid/no-innerhtml
      innerHTML={themeHeaderScript}
    />
  );
};

interface ThemeContextValue {
  theme: Accessor<Theme>;
  setTheme: Setter<Theme>;
  toggle: () => void;
}

const ThemeContext = createContext() as Context<ThemeContextValue>;

export const ThemeProvider: ParentComponent = (props) => {
  const [theme, setTheme] = createSignal<Theme>(current());

  createEffect(() => (theme() === "dark" ? setDark() : setLight()));

  const toggle = (): string =>
    setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);
