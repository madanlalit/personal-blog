import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Commander from './features/terminal/Commander';
import BootScreen from './features/system/BootScreen';
import CommandLine from './features/terminal/CommandLine';
import SystemAlert, { triggerAlert } from './features/system/SystemAlert';
import Screensaver from './features/system/Screensaver';
import StatusBar from './components/ui/StatusBar';
import SnakeGame from './features/terminal/SnakeGame';
import AudioPlayer from './features/terminal/AudioPlayer'; // Import
import useSound from './hooks/useSound';
import useKonamiCode from './hooks/useKonamiCode';
import { HelmetProvider } from 'react-helmet-async';

import Home from './pages/Home';
import About from './pages/About';
import Archive from './pages/Archive';
import Contact from './pages/Contact';
import Post from './pages/Post';
import TagArchive from './pages/TagArchive';
import './App.css';

function App() {
  const [booted, setBooted] = useState(false);
  const [commanderOpen, setCommanderOpen] = useState(false); // Modal state
  const [snakeGameOpen, setSnakeGameOpen] = useState(false);
  const [ampOpen, setAmpOpen] = useState(false); // Amp state

  const { playHoverSound, playKeySound, toggleMute, muted } = useSound();

  useKonamiCode(() => {
    document.documentElement.setAttribute('data-theme', 'matrix');
    localStorage.setItem('theme', 'matrix');
    triggerAlert('GOD MODE ACTIVATED: SYSTEM COMPROMISED', 'warning');
  });

  useEffect(() => {
    // Add global hover sound to all interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('.cli-tab')) {
        playHoverSound();
      }
    };
    document.addEventListener('mouseover', handleMouseOver);
    return () => document.removeEventListener('mouseover', handleMouseOver);
  }, [playHoverSound]);

  useEffect(() => {
    // Check if we've already booted this session
    // Check if we've already booted this session
    const hasBooted = sessionStorage.getItem('hasBooted');
    if (hasBooted) {
      setBooted(true);
    }

    // Initialize Theme (Default to Light)
    const savedTheme = localStorage.getItem('theme') || 'openai';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Toggle Commander with Shift + M (Global Override)
    const handleKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.code === 'KeyM') {
        e.preventDefault(); // Stop 'M' from being typed if focused
        setCommanderOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleBootComplete = () => {
    setBooted(true);
    sessionStorage.setItem('hasBooted', 'true');
  };

  if (!booted) {
    return <BootScreen onComplete={handleBootComplete} />;
  }

  return (
    <HelmetProvider>
      <Router>
        <div className="app tui-window fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <SystemAlert />
          <Screensaver />

          {snakeGameOpen && <SnakeGame onExit={() => setSnakeGameOpen(false)} />}
          {ampOpen && <AudioPlayer onExit={() => setAmpOpen(false)} />}

          {/* Modal Navigation */}
          <Commander isOpen={commanderOpen} onClose={() => setCommanderOpen(false)} />

          {/* TUI Top Bar */}
          <StatusBar muted={muted} onToggleMute={toggleMute} />

          {/* Main Content - No Sidebar here! */}
          <div className="main-layout" style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            <main className="content-area" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="/tags/:tag" element={<TagArchive />} />
              </Routes>
            </main>
          </div>

          {/* TUI Bottom Bar with Tabs */}
          <CommandLine
            onKey={playKeySound}
            onCommand={(cmd) => {
              if (cmd === 'snake') {
                setSnakeGameOpen(true);
              }
              if (cmd === 'amp') {
                setAmpOpen(true);
              }
            }}
          />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
