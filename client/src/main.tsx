import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SettingsProvider } from "./context/SettingsContext";
import { HeadingsProvider } from "./context/HeadingsContext";

createRoot(document.getElementById("root")!).render(
  <SettingsProvider>
    <HeadingsProvider>
      <App />
    </HeadingsProvider>
  </SettingsProvider>
);
