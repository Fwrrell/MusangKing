import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayouts from "@/layouts/UserLayouts";
import MapDashboard from "./pages/MapDashboard";
import { LandingPage } from "./pages/LandingPage";
import { NotFound } from "./pages/NotFound";

// Dummy Pages (Nanti pindahkan ke file terpisah di folder /pages)
const Notification = () => (
  <h2 className="text-2xl text-black font-semibold">Notification</h2>
);
const Settings = () => (
  <h2 className="text-2xl text-black font-semibold">Configuration</h2>
);
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
        path: "notifikasi",
        element: <Notification />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
