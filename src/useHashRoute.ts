import { useEffect, useState } from "react";

export const ROUTES = ["about", "projects"] as const;
export type Route = (typeof ROUTES)[number];

function read(): Route {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return (ROUTES as readonly string[]).includes(hash) ? (hash as Route) : "about";
}

/** Tiny hash router: #about / #projects. Works on any static host. */
export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(read);
  useEffect(() => {
    const onChange = () => setRoute(read());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
