import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayouts from "@/layouts/UserLayouts";

// Dummy Pages (Nanti pindahkan ke file terpisah di folder /pages)
const Dashboard = () => <h2 className="text-2xl font-semibold">Overview</h2>;
const Inventory = () => (
  <h2 className="text-2xl font-semibold">Inventory Management</h2>
);
const Settings = () => (
  <h2 className="text-2xl font-semibold">Configuration</h2>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayouts />,
    children: [
      {
        index: true,
        element: <Dashboard />,
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
