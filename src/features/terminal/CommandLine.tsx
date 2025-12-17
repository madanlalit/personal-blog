import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation for better active state check
import { triggerAlert } from "../../utils/systemEvents";
import type { Post } from "../../types";
import type { Theme } from "../../hooks/useTheme";
import "./CommandLine.css";

interface CommandLineProps {
  onKey?: () => void;
  onCommand?: (cmd: string) => void;
  setTheme: (theme: Theme) => void;
  availableThemes: readonly Theme[];
  searchPosts: (query: string) => Post[];
}

const CommandLine: React.FC<CommandLineProps> = ({
  onKey,
  onCommand,
  setTheme,
  availableThemes,
  searchPosts,
}) => {
  const [input, setInput] = useState("");
  const [displayHistory, setDisplayHistory] = useState<
    (string | React.ReactNode)[]
  >([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path

  // Focus on '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // History Navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      if (historyIndex === -1) {
        setTempInput(input);
        setHistoryIndex(commandHistory.length - 1);
        setInput(commandHistory[commandHistory.length - 1]);
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setInput(tempInput);
        }
      }
    }

    // Autocomplete
    else if (e.key === "Tab") {
      e.preventDefault();
      const commands = [
        "help",
        "cd",
        "ls",
        "theme",
        "clear",
        "reboot",
        "snake",
        "grep",
        "neofetch",
        "amp",
      ];
      // UPDATED: Added 'projects' and 'contact' to arguments
      const args = [
        "home",
        "about",
        "archive",
        "projects",
        "contact",
        ...availableThemes,
      ];
      const allOptions = [...commands, ...args];

      const match = allOptions.find((opt) =>
        opt.startsWith(input.toLowerCase()),
      );
      if (match) {
        setInput(match + " ");
      }
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
    setTempInput("");

    const parts = trimmed.split(" ");
    const command = parts[0];
    const arg = parts.slice(1).join(" ");

    setDisplayHistory((prev) => [...prev.slice(-4), `> ${cmd}`]);

    switch (command) {
      case "help": {
        setDisplayHistory((prev) => [
          ...prev,
          "Available commands:",
          "  cd [page]   - Navigate (home, about, archive, projects, contact)",
          "  grep [term] - Search blog posts",
          `  theme [opt] - Set theme (${availableThemes.join(" | ")})`,
          "  amp         - Launch Audio Player",
          "  neofetch    - System Information",
          "  snake       - Play Snake",
          "  ls          - List directories",
          "  reboot      - Reboot system",
          "  clear       - Clear screen",
        ]);
        break;
      }
      case "clear": {
        setDisplayHistory([]);
        break;
      }
      case "reboot": {
        sessionStorage.removeItem("hasBooted");
        window.location.reload();
        break;
      }
      case "neofetch": {
        // ... (Neofetch code remains same) ...
        const info = (
          <div
            className="neofetch-output"
            style={{
              display: "flex",
              gap: "20px",
              margin: "10px 0",
              color: "var(--accent)",
            }}
          >
            <pre style={{ margin: 0, lineHeight: 1.2, fontWeight: "bold" }}>
              {`
    __________
   |  ______  |
   | |      | |
   | |______| |
   |__________|
   /__________\\
  (____________)
`}
            </pre>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div>
                <strong style={{ color: "var(--text-primary)" }}>OS:</strong>{" "}
                RetroReactOS v1.0
              </div>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>Host:</strong>{" "}
                {navigator.userAgent.split(")")[0] + ")"}
              </div>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>Theme:</strong>{" "}
                {localStorage.getItem("app-theme") || "sage"}
              </div>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>
                  Uptime:
                </strong>{" "}
                Forever
              </div>
              <div>
                <strong style={{ color: "var(--text-primary)" }}>Shell:</strong>{" "}
                ReactCLI
              </div>
            </div>
          </div>
        );
        setDisplayHistory((prev) => [...prev, info]);
        break;
      }
      case "grep": {
        if (!arg) {
          setDisplayHistory((prev) => [...prev, "Usage: grep [search term]"]);
          break;
        }
        const results = searchPosts(arg);
        if (results.length === 0) {
          setDisplayHistory((prev) => [
            ...prev,
            `grep: ${arg}: No matches found`,
          ]);
        } else {
          const resultNodes = results.map((p) => (
            <div key={p.id} style={{ margin: "4px 0" }}>
              <span style={{ color: "var(--accent)" }}>
                ./archive/{p.date}:
              </span>{" "}
              <button
                onClick={() => navigate(`/post/${p.id}`)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "inherit",
                }}
              >
                {p.title}
              </button>
            </div>
          ));
          setDisplayHistory((prev) => [...prev, ...resultNodes]);
        }
        break;
      }
      case "cd": {
        if (!arg || arg === "home") navigate("/");
        // UPDATED: Added projects and contact to allowed navigation
        else if (["about", "archive", "contact", "projects"].includes(arg))
          navigate(`/${arg}`);
        else {
          setDisplayHistory((prev) => [
            ...prev,
            `Error: Directory '${arg}' not found`,
          ]);
          triggerAlert(`Directory '${arg}' not found`, "warning");
        }
        break;
      }
      case "ls": {
        // UPDATED: Added projects/ to listing
        setDisplayHistory((prev) => [
          ...prev,
          "home/  about/  archive/  projects/  contact/",
        ]);
        break;
      }
      case "theme": {
        if (availableThemes.includes(arg as Theme)) {
          setTheme(arg as Theme);
          setDisplayHistory((prev) => [...prev, `Theme set to ${arg}`]);
          triggerAlert(`Theme updated to ${arg}`, "success");
        } else {
          setDisplayHistory((prev) => [
            ...prev,
            `Usage: theme [${availableThemes.join(" | ")}]`,
          ]);
        }
        break;
      }
      case "snake": {
        if (onCommand) onCommand("snake");
        break;
      }
      case "amp": {
        if (onCommand) onCommand("amp");
        else
          setDisplayHistory((prev) => [
            ...prev,
            "Amp Audio Player starting...",
          ]);
        break;
      }
      default: {
        if (onCommand) onCommand(command);
        if (command !== "snake" && command !== "amp") {
          if (trimmed !== "")
            setDisplayHistory((prev) => [
              ...prev,
              `Command not found: ${command}`,
            ]);
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(input);
    setInput("");
  };

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [displayHistory]);

  return (
    <div className="cli-wrapper">
      <div
        className={`command-line-container ${input ? "focused" : ""}`}
        onClick={() => inputRef.current?.focus()}
      >
        {displayHistory.length > 0 && (
          <div className="cli-history" ref={historyRef}>
            {displayHistory.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="cli-form">
          <span className="prompt">user@blog:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="cli-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (onKey) onKey();
            }}
            onKeyDown={handleInputKeyDown}
            autoFocus
            spellCheck="false"
            autoComplete="off"
          />
          <div className="status-right">[ CMD ]</div>
        </form>
      </div>

      {/* UPDATED: Added Projects and Contact Tabs */}
      <div className="cli-tabs">
        <button
          className={`cli-tab ${location.pathname === "/" ? "active" : ""}`}
          onClick={() => navigate("/")}
        >
          [1: HOME]
        </button>
        <button
          className={`cli-tab ${location.pathname === "/archive" ? "active" : ""}`}
          onClick={() => navigate("/archive")}
        >
          [2: ARCHIVE]
        </button>
        <button
          className={`cli-tab ${location.pathname === "/about" ? "active" : ""}`}
          onClick={() => navigate("/about")}
        >
          [3: ABOUT]
        </button>
        <button
          className={`cli-tab ${location.pathname === "/projects" ? "active" : ""}`}
          onClick={() => navigate("/projects")}
        >
          [4: PROJECTS]
        </button>
        <button
          className={`cli-tab ${location.pathname === "/contact" ? "active" : ""}`}
          onClick={() => navigate("/contact")}
        >
          [5: CONTACT]
        </button>

        <div style={{ flex: 1 }}></div>

        <button
          className="cli-tab action-tab"
          onClick={() => window.open("https://github.com/madanlalit", "_blank")}
        >
          GITHUB
        </button>
        <button
          className="cli-tab action-tab"
          onClick={() =>
            window.open("https://linkedin.com/in/madanlalit", "_blank")
          }
        >
          LINKEDIN
        </button>
        <button
          className="cli-tab action-tab"
          style={{ borderRight: "none" }}
          onClick={() => window.open("https://x.com/lalitmadan", "_blank")}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default CommandLine;
