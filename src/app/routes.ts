import { createBrowserRouter } from "react-router";
import { LandingPage } from "./App";
import { DashboardLayout, DashboardHome } from "./pages/dashboard/DashboardLayout";
import { ForumPage } from "./pages/dashboard/ForumPage";
import { PlantaDashboard } from "./pages/dashboard/PlantaDashboard";
import { SobrePage } from "./pages/dashboard/SobrePage";
import { MakingOfDashboard } from "./pages/dashboard/MakingOfDashboard";
import { ProfilePage } from "./pages/dashboard/ProfilePage";
import { SettingsPage } from "./pages/dashboard/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "forum", Component: ForumPage },
      { path: "planta", Component: PlantaDashboard },
      { path: "making-of", Component: MakingOfDashboard },
      { path: "sobre", Component: SobrePage },
      { path: "perfil", Component: ProfilePage },
      { path: "configuracoes", Component: SettingsPage },
    ],
  },
]);
