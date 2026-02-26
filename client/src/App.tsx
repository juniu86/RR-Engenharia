import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SEOHead } from "./components/SEO";
import Home from "./pages/Home";
import SASC from "./pages/SASC";
import TEPS from "./pages/TEPS";
import Obras from "./pages/Obras";
import Manutencao from "./pages/Manutencao";
import Automacao from "./pages/Automacao";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/sasc"} component={SASC} />
      <Route path={"/teps"} component={TEPS} />
      <Route path={"/obras"} component={Obras} />
      <Route path={"/manutencao"} component={Manutencao} />
      <Route path={"/automacao"} component={Automacao} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogPost} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <SEOHead />
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
// Build timestamp: Wed Feb 25 14:58:12 EST 2026
// deployment fix: sync all changes including header with logo
// FTP root fix
// Retry deployment with IP address
// Clean rebuild
