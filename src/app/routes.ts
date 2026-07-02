import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { AboutPage } from "./pages/AboutPage";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogDetailsPage } from "./pages/BlogDetailsPage";
import { ContactPage } from "./pages/ContactPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfUsePage } from "./pages/TermsOfUsePage";
import { AdminPage } from "./pages/AdminPage";
import { BriefPage } from "./pages/BriefPage";

function NotFound() {
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/admin",
    Component: AdminPage,
  },
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "services", Component: ServicesPage },
      { path: "portfolio", Component: PortfolioPage },
      { path: "portfolio/:projectId", Component: ProjectDetailsPage },
      { path: "about", Component: AboutPage },
      { path: "blog", Component: BlogPage },
      { path: "blog/:postId", Component: BlogDetailsPage },
      { path: "contact", Component: ContactPage },
      { path: "brief", Component: BriefPage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "terms-of-use", Component: TermsOfUsePage },
      { path: "*", Component: NotFound },
    ],
  },
]);
