import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayouts from "@/layouts/UserLayouts";
import MapDashboard from "./pages/MapDashboard";
import { LandingPage } from "./pages/LandingPage";

// Dummy Pages (Nanti pindahkan ke file terpisah di folder /pages)
const Inventory = () => (
  <h2 className="text-2xl font-semibold">Inventory Management</h2>
);
const Settings = () => (
  <h2 className="text-2xl font-semibold">Configuration</h2>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/app",
    element: <UserLayouts />,
    children: [
      {
        index: true,
        element: <MapDashboard />,
      },
      {
        path: "inventory",
        element: <Inventory />,
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
