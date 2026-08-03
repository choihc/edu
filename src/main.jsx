import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import StudyPage from "./pages/StudyPage.jsx";
import PracticeTypesPage from "./pages/PracticeTypesPage.jsx";
import PracticePage from "./pages/PracticePage.jsx";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/study", element: <StudyPage /> },
  { path: "/practice", element: <PracticeTypesPage /> },
  { path: "/practice/:typeId", element: <PracticePage /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
