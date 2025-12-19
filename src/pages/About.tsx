import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Linkedin,
  X,
  ArrowRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Download,
} from "lucide-react";
import "./About.css";

// --- Animated Counter Hook ---
const useCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, target, duration]);

  // Callback ref to set element reference
  const setRef = (node: HTMLDivElement | null) => {
    elementRef.current = node;
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  };

  return { count, setRef };
};

// --- Typing Effect Component ---
const TypingText: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 0,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, index + 1));
        index++;
        if (index >= text.length) {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="typing-text">
      {displayText}
      {showCursor && <span className="cursor">|</span>}
    </span>
  );
};

// --- Frame Component (Reusable) ---
const Frame: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className = "",
}) => (
  <section className={`about-frame ${className}`}>
    <div className="frame-corner topleft" />
    <div className="frame-corner topright" />
    <div className="frame-corner bottomleft" />
    <div className="frame-corner bottomright" />
    <div className="frame-label">{label}</div>
    {children}
  </section>
);

// --- Data ---
const EXPERIENCE_PREVIEW = [
  {
    year: "2024",
    month: "April",
    role: "Software Engineer I",
    company: "Cisco Systems",
    tech: ["Python", "Langchain", "Langgraph", "Langsmith", "Cypress", "Playwright"],
  },
  {
    year: "2022",
    month: "Dec",
    role: "Software Engineer Apprenticeship",
    company: "Cisco Systems",
    tech: ["Python", "Pytest", "Selenium"],
  },
];

const SKILLS = [
  { name: "Python", level: "expert" },
  { name: "AI", level: "expert" },
  { name: "LangChain", level: "advanced" },
  { name: "LangGraph", level: "advanced" },
  { name: "React", level: "advanced" },
  { name: "JavaScript", level: "intermediate" },
  { name: "AWS", level: "intermediate" },
  { name: "Docker", level: "learning" },
];

const CURRENT_STATUS = [
  { prefix: ">", text: "learning about llms and context engineering" },
  { prefix: ">", text: "building reliable ai agents" },
  { prefix: ">", text: "learning how to create systems with agents as core" },
];

const SOCIAL_LINKS = [
  { icon: Github, href: "https://github.com/madanlalit", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com/in/madanlalit", label: "LinkedIn" },
  { icon: X, href: "https://x.com/lalitmadan", label: "X" },
];

const INTERESTS = [
  "Open Source",
  "System Design",
  "Dev Tools",
  "Automation",
  "UI/UX"
];

// --- Main Component ---
const About: React.FC = () => {
  const { count: yearsCount, setRef: yearsRef } = useCounter(3, 1500);
  const { count: projectsCount, setRef: projectsRef } = useCounter(5, 1800);
  const { count: linesCount, setRef: linesRef } = useCounter(15000, 2000);
  const [activeExp, setActiveExp] = useState(0);

  return (
    <div className="about-container fade-in">
      {/* Hero Frame */}
      <Frame label="PROFILE" className="hero-frame">
        <div className="hero-grid-bg" />
        <div className="hero-layout">
          <div className="hero-main">
            <div className="hero-badge">ABOUT_ME.md</div>
            <h1 className="hero-name">
              <span className="name-line">LALIT</span>
              <span className="name-line accent">MADAN</span>
            </h1>
            <div className="hero-tagline">
              <TypingText text="Engineer. Builder. AI Enthusiast." delay={500} />
            </div>
            <div className="hero-meta">
              <span className="meta-item">
                <MapPin size={14} /> India
              </span>
              <span className="meta-item">
                <Briefcase size={14} /> Open to Work
              </span>
            </div>
            <div className="hero-actions">
              <Link to="/experience" className="hero-btn primary">
                View Experience <ArrowRight size={14} />
              </Link>
              <a href="#" className="hero-btn secondary">
                <Download size={14} /> Resume
              </a>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-item" ref={yearsRef}>
              <span className="stat-number">{yearsCount}+</span>
              <span className="stat-label">Years</span>
            </div>
            <div className="stat-item" ref={projectsRef}>
              <span className="stat-number">{projectsCount}</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat-item" ref={linesRef}>
              <span className="stat-number small">{linesCount.toLocaleString()}+</span>
              <span className="stat-label">Lines of Code</span>
            </div>
          </div>
        </div>
      </Frame>

      {/* Bio Frame */}
      <Frame label="BIO" className="bio-frame">
        <p className="bio-text">
          I'm a software engineer who builds <strong>AI agents</strong> and tools
          that make them reliable. Currently obsessed with <strong>context engineering</strong>,
          <strong>agentic workflows</strong>, and getting LLMs to actually do useful things.
        </p>
        <p className="bio-text secondary">
          When I'm not shipping code at Cisco, you'll find me tinkering with new
          frameworks, breaking things to understand them, or writing about the
          lessons learned along the way.
        </p>
        <blockquote className="philosophy-quote">
          "Ship it, learn, iterate, Repeat."
        </blockquote>
      </Frame>

      {/* Two-column Grid */}
      <div className="about-grid">
        {/* Left: Skills */}
        <Frame label="TECH_STACK" className="skills-frame">
          <div className="skills-cloud">
            {SKILLS.map((skill, index) => (
              <span
                key={skill.name}
                className={`skill-tag ${skill.level}`}
                style={{ animationDelay: `${index * 0.05}s` }}
                title={skill.level}
              >
                {skill.name}
              </span>
            ))}
          </div>
          <div className="skill-legend">
            <span className="legend-item"><span className="dot expert" /> Expert</span>
            <span className="legend-item"><span className="dot advanced" /> Advanced</span>
            <span className="legend-item"><span className="dot intermediate" /> Intermediate</span>
          </div>
        </Frame>

        {/* Right: Interests */}
        <Frame label="INTERESTS" className="interests-frame">
          <div className="interests-grid">
            {INTERESTS.map((interest) => (
              <span key={interest} className="interest-tag">
                <Heart size={12} className="interest-icon" />
                {interest}
              </span>
            ))}
          </div>
        </Frame>
      </div>

      {/* Experience Preview Frame */}
      <Frame label="EXECUTION_LOG" className="experience-frame">
        <div className="exp-header">
          <span className="exp-count">{EXPERIENCE_PREVIEW.length} of 4 entries</span>
          <Link to="/experience" className="view-all-link">
            View Full History <ArrowRight size={14} />
          </Link>
        </div>
        <div className="exp-timeline">
          {EXPERIENCE_PREVIEW.map((exp, index) => (
            <div
              key={index}
              className={`exp-item ${activeExp === index ? "active" : ""}`}
              onMouseEnter={() => setActiveExp(index)}
            >
              <span className="exp-year">{exp.month} {exp.year}</span>
              <div className="exp-details">
                <span className="exp-role">{exp.role}</span>
                <span className="exp-company">@ {exp.company}</span>
                <div className="exp-tech">
                  {exp.tech.map((t) => (
                    <span key={t} className="tech-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Frame>

      {/* Current Status Frame */}
      <Frame label="CURRENT_FOCUS" className="status-frame">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot red" />
            <span className="terminal-dot yellow" />
            <span className="terminal-dot green" />
            <span className="terminal-title">~/current_focus.sh</span>
          </div>
          <div className="terminal-body">
            {CURRENT_STATUS.map((line, index) => (
              <div key={index} className="terminal-line">
                <span className="terminal-prefix">{line.prefix}</span>
                <span className="terminal-text">{line.text}</span>
              </div>
            ))}
            <div className="terminal-line">
              <span className="terminal-prefix">{">"}</span>
              <span className="terminal-cursor">_</span>
            </div>
          </div>
        </div>
      </Frame>

      {/* Education & Connect Grid */}
      <div className="about-grid">
        <Frame label="EDUCATION" className="education-frame">
          <div className="edu-item">
            <GraduationCap size={24} className="edu-icon" />
            <div className="edu-content">
              <span className="edu-degree">B.Tech in Electronics</span>
              <span className="edu-school">RCOEM</span>
              <span className="edu-year">2017 - 2021</span>
            </div>
          </div>
        </Frame>

        <Frame label="CONNECT" className="connect-frame">
          <div className="social-grid">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                <link.icon size={18} className="social-icon" />
                <span className="social-label">{link.label}</span>
              </a>
            ))}
          </div>
        </Frame>
      </div>
    </div>
  );
};

export default About;
