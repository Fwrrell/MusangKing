import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayouts from "@/layouts/UserLayouts";
import MapDashboard from "./pages/MapDashboard";
import { LandingPage } from "./pages/LandingPage";
import { NotFound } from "./pages/NotFound";
import ThreadPage from "./pages/ThreadPage";
import { LaporanPage } from "./pages/LaporanPage";
import { StatistikPage } from "./pages/StatistikPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/app",
    element: <UserLayouts />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <MapDashboard />,
      },
      {
        path: "laporanku",
        element: <LaporanPage />,
      },
      {
        path: "statistik",
        element: <StatistikPage />,
      },
    ],
  },
  {
    path: "/report/:slug",
    element: <ThreadPage />,
    errorElement: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
