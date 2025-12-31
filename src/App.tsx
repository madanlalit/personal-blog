import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Commander from "./features/terminal/Commander";
import BootScreen from "./features/system/BootScreen";
import CommandLine from "./features/terminal/CommandLine";
import SystemAlert from "./features/system/SystemAlert";
import NewYearModal from "./features/system/NewYearModal";
import { triggerAlert } from "./utils/systemEvents";
import Screensaver from "./features/system/Screensaver";
import StatusBar from "./components/ui/StatusBar";
import SnakeGame from "./features/terminal/SnakeGame";
import AudioPlayer from "./features/terminal/AudioPlayer"; // Import
import useSound from "./hooks/useSound";
import useKonamiCode from "./hooks/useKonamiCode";
import { useTheme } from "./hooks/useTheme";
import { usePosts } from "./hooks/usePosts";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Archive = lazy(() => import("./pages/Archive"));
const Post = lazy(() => import("./pages/Post"));
const TagArchive = lazy(() => import("./pages/TagArchive"));
const Projects = lazy(() => import("./pages/Projects"));
const Experience = lazy(() => import("./pages/Experience"));

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: 'var(--text-secondary)'
  }}>
    Loading...
  </div>
);

function App() {
  const [booted, setBooted] = useState(() => {
    return !!sessionStorage.getItem("hasBooted");
  });
  const [commanderOpen, setCommanderOpen] = useState(false); // Modal state
  const [snakeGameOpen, setSnakeGameOpen] = useState(false);
  const [ampOpen, setAmpOpen] = useState(false); // Amp state
  const [newYearOpen, setNewYearOpen] = useState(() => {
    // Show modal only in January and only once per year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 = January
    const lastShown = localStorage.getItem("newYearModalShown");

    // Show if it's January (month 0) and we haven't shown it for this year
    return currentMonth === 0 && lastShown !== String(currentYear);
  });

  const handleCloseNewYear = () => {
    setNewYearOpen(false);
    localStorage.setItem("newYearModalShown", String(new Date().getFullYear()));
  };

  const { playHoverSound, playKeySound, toggleMute, muted } = useSound();
  const { setTheme, availableThemes } = useTheme();
  const { searchPosts, getAllPosts } = usePosts();

  useKonamiCode(() => {
    setTheme("matrix");
    triggerAlert("GOD MODE ACTIVATED: SYSTEM COMPROMISED", "warning");
  });

  useEffect(() => {
    // Add global hover sound to all interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest(".cli-tab")
      ) {
        playHoverSound();
      }
    };
    document.addEventListener("mouseover", handleMouseOver);
    return () => document.removeEventListener("mouseover", handleMouseOver);
  }, [playHoverSound]);

  useEffect(() => {
    // Toggle Commander with Shift + M (Global Override)
    const handleKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.code === "KeyM") {
        e.preventDefault(); // Stop 'M' from being typed if focused
        setCommanderOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleBootComplete = () => {
    setBooted(true);
    sessionStorage.setItem("hasBooted", "true");
  };

  if (!booted) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <HelmetProvider>
      <Router>
        <div
          className="app tui-window fade-in"
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <SystemAlert />
          <Screensaver />

          {/* Happy New Year Modal */}
          {newYearOpen && <NewYearModal onClose={handleCloseNewYear} />}

          {snakeGameOpen && (
            <SnakeGame onExit={() => setSnakeGameOpen(false)} />
          )}
          {ampOpen && <AudioPlayer onExit={() => setAmpOpen(false)} />}

          {/* Modal Navigation */}
          <Commander
            isOpen={commanderOpen}
            onClose={() => setCommanderOpen(false)}
            setTheme={setTheme}
            availableThemes={availableThemes}
            searchPosts={searchPosts}
            getAllPosts={getAllPosts}
          />

          {/* TUI Top Bar */}
          <StatusBar muted={muted} onToggleMute={toggleMute} />

          {/* Main Content - No Sidebar here! */}
          <div
            className="main-layout"
            style={{ flex: 1, display: "flex" }}
          >
            <main
              className="content-area"
              style={{ flex: 1, padding: "20px" }}
            >
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/experience" element={<Experience />} />
                  <Route path="/archive" element={<Archive />} />

                  <Route path="/projects" element={<Projects />} />
                  <Route path="/post/:id" element={<Post />} />
                  <Route path="/tags/:tag" element={<TagArchive />} />
                </Routes>
              </Suspense>
            </main>
          </div>

          {/* TUI Bottom Bar with Tabs */}
          <CommandLine
            onKey={playKeySound}
            setTheme={setTheme}
            searchPosts={searchPosts}
            availableThemes={availableThemes}
            onCommand={(cmd) => {
              if (cmd === "snake") {
                setSnakeGameOpen(true);
              }
              if (cmd === "amp") {
                setAmpOpen(true);
              }
            }}
          />
          <Analytics />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
