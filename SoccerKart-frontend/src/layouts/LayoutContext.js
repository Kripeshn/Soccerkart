import { createContext } from "react";

/**
 * Tells components which layout shell they are rendered inside.
 *   shell: "public" | "admin" | null
 *
 * Used as a temporary compatibility guard while pages are migrated:
 * legacy pages that still render <Nav /> or <AdminMenu /> themselves
 * render nothing when a layout already provides them.
 */
export const LayoutContext = createContext({ shell: null });
