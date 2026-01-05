import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
};

const DEFAULT_STORAGE_KEY = "vite-ui-theme";

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = DEFAULT_STORAGE_KEY,
  enableSystem = true,
}: ThemeProviderProps) {
  // Inicializar desde localStorage (lazy init)
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const found = localStorage.getItem(storageKey);
      return (found as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(() =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );

  const resolvedTheme: "dark" | "light" =
    theme === "system" ? systemTheme : (theme as "dark" | "light");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const matches = "matches" in e ? e.matches : (e as MediaQueryList).matches;
      setSystemTheme(matches ? "dark" : "light");
    };


    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler as EventListener);
      return () => mq.removeEventListener("change", handler as EventListener);
    }

    // biome-ignore lint/suspicious/noExplicitAny: <>
    const mqAny = mq as any;
    if (typeof mqAny.addListener === "function") {
      mqAny.addListener(handler);
      return () => mqAny.removeListener(handler);
    }

    return;
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (t: Theme) => {
      try {
        localStorage.setItem(storageKey, t);
      } catch {
        // ignore (p. ej. storage disabled)
      }
      setThemeState(t);
    },
    [storageKey]
  );

  const value = useMemo(
    (): ThemeProviderState => ({
      theme: enableSystem ? theme : theme === "system" ? theme : theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme, enableSystem]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme(): ThemeProviderState {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
