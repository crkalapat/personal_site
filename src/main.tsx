import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/kulim-park/400.css";
import "@fontsource/kulim-park/700.css";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
