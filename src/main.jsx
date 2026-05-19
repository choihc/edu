import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App, { HomePage, VocabularyPage } from "./App.jsx";
import MultiAgentProcess from "./MultiAgentProcess.jsx";
import PlantEnergyLearning from "./PlantEnergyLearning.jsx";
import Presentation from "./Presentation.jsx";
import AiNativePresentation from "./AiNativePresentation.jsx";

const legacyHashRoutes = new Map([
  ["#/", "/"],
  ["#/jp-vocab", "/jp-vocab"],
  ["#/multi-agent", "/multi-agent"],
  ["#/spec-manager", "/spec-manager"],
  ["#/plant-energy", "/plant-energy"],
  ["#/ai-native", "/ai-native"],
]);

function redirectLegacyHashRoute() {
  const { hash, pathname, search } = window.location;
  if (!hash.startsWith("#/")) return;

  const [hashPath, hashSearch = ""] = hash.split("?");
  const specManagerSlideMatch = hashPath.match(/^#\/spec-manager\/(\d+)$/);
  const aiNativeSlideMatch = hashPath.match(/^#\/ai-native\/(\d+)$/);
  const nextPath = specManagerSlideMatch
    ? `/spec-manager/${specManagerSlideMatch[1]}`
    : aiNativeSlideMatch
    ? `/ai-native/${aiNativeSlideMatch[1]}`
    : legacyHashRoutes.get(hashPath);

  if (!nextPath) return;

  const nextSearch = hashSearch ? `?${hashSearch}` : search;
  window.history.replaceState(null, "", `${nextPath}${nextSearch}`);
}

redirectLegacyHashRoute();

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/jp-vocab", element: <VocabularyPage /> },
  { path: "/multi-agent", element: <MultiAgentProcess /> },
  { path: "/spec-manager", element: <Presentation /> },
  { path: "/spec-manager/:slide", element: <Presentation /> },
  { path: "/plant-energy", element: <PlantEnergyLearning /> },
  { path: "/ai-native", element: <AiNativePresentation /> },
  { path: "/ai-native/:slide", element: <AiNativePresentation /> },
  { path: "*", element: <App /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
