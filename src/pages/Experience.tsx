import React from "react";
import { Link } from "react-router-dom";
import {
    Calendar,
    MapPin,
    ExternalLink,
    Award,
    GraduationCap,
} from "lucide-react";
import "./Experience.css";

// --- Data ---
const EXPERIENCE = [
    {
        id: 1,
        period: "2024 — Present",
        role: "Software Engineer",
        company: "Cisco Systems",
        location: "Remote",
        type: "Full-time",
        description:
            "Leading the development of AI-powered applications and agent frameworks. Working extensively with LLMs, prompt engineering, and production ML systems.",
        achievements: [
            "Designed and shipped an AI agent platform handling 10K+ daily requests",
            "Reduced LLM inference costs by 40% through context optimization",
            "Built custom RAG pipelines for enterprise document processing",
        ],
        tech: ["Python", "LangGraph", "LangChain", "OpenAI", "FastAPI"],
    },
    {
        id: 2,
        period: "Dec 2022 — Mar 2024",
        role: "Software Test Engineer",
        company: "Cisco Systems",
        location: "Bangalore, Karnataka",
        type: "Apprenticeship",
        description:
            "Sole quality owner for Rogue and aWIPS in Catalyst Center (formerly DNA Center). Owned the entire QA lifecycle from test design to automation and release validation.",
        achievements: [
            "Built and maintained Python automation scripts for regression testing",
            "Set up and managed CI/CD pipelines for automated test execution",
            "Established code quality standards and coverage metrics (30% to 80% increase in code coverage) for the test suite",
            "Configured testbeds and simulated network devices for comprehensive testing",
        ],
        tech: ["Python", "Pytest", "Selenium", "Playwright", "Jenkins", "Git", "SonarQube", "Golang", "Postman", "ESXi",],
    },
];

const EDUCATION = [
    {
        period: "2017 — 2021",
        degree: "B.Tech in Electronics Engineering",
        institution: "RCOEM",
        location: "Nagpur",
    },
];

const CERTIFICATIONS = [
    { name: "AWS Cloud Practioner (CLF-C02)", issuer: "Amazon Web Services", year: "2024" },
    { name: "CCNA", issuer: "Cisco Systems", year: "2023" },
];

const Experience: React.FC = () => {
    return (
        <div className="experience-page fade-in">
            {/* Header */}
            <header className="exp-page-header">
                <Link to="/about" className="back-link">
                    ← Back to About
                </Link>
                <h1 className="page-title">
                    EXPERIENCE<span className="accent">_</span>LOG
                </h1>
                <p className="page-subtitle">
                    A detailed timeline of my professional journey and achievements.
                </p>
            </header>

            {/* Work Experience Section */}
            <section className="exp-section">
                <div className="section-header">
                    <span>/// WORK_EXPERIENCE</span>
                    <span className="section-meta">[{EXPERIENCE.length}]</span>
                </div>

                <div className="logs-timeline">
                    {EXPERIENCE.map((job) => (
                        <div key={job.id} className="timeline-entry">
                            <div className="timeline-marker">
                                <div className="t-dot"></div>
                                <div className="t-line"></div>
                            </div>
                            <div className="timeline-content">
                                <article className="job-card">
                                    {/* Meta Row */}
                                    <div className="job-meta-row">
                                        <span className="job-date">
                                            <Calendar size={12} /> {job.period}
                                        </span>
                                        <span className="job-type">{job.type}</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="job-title">
                                        {job.role} <span className="at">@</span> {job.company}
                                    </h3>

                                    {/* Location */}
                                    <div className="job-location">
                                        <MapPin size={12} /> {job.location}
                                    </div>

                                    {/* Description */}
                                    <p className="job-excerpt">{job.description}</p>

                                    {/* Achievements */}
                                    <div className="job-achievements">
                                        <span className="achievements-label">KEY_ACHIEVEMENTS:</span>
                                        <ul>
                                            {job.achievements.map((a, i) => (
                                                <li key={i}>{a}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Tech Tags */}
                                    <div className="job-tags">
                                        {job.tech.map((t) => (
                                            <span key={t} className="tech-tag">
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                </article>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section className="exp-section">
                <div className="section-header">
                    <span>/// EDUCATION</span>
                </div>

                <div className="logs-timeline">
                    {EDUCATION.map((edu, index) => (
                        <div key={index} className="timeline-entry">
                            <div className="timeline-marker">
                                <div className="t-dot"></div>
                                <div className="t-line"></div>
                            </div>
                            <div className="timeline-content">
                                <article className="job-card">
                                    <div className="job-meta-row">
                                        <span className="job-date">
                                            <GraduationCap size={12} /> {edu.period}
                                        </span>
                                    </div>

                                    <h3 className="job-title">{edu.degree}</h3>

                                    <div className="job-location">
                                        <MapPin size={12} /> {edu.institution}, {edu.location}
                                    </div>

                                </article>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Certifications Section */}
            <section className="exp-section">
                <div className="section-header">
                    <span>/// CERTIFICATIONS</span>
                    <span className="section-meta">[{CERTIFICATIONS.length}]</span>
                </div>

                <div className="certs-grid">
                    {CERTIFICATIONS.map((cert, index) => (
                        <article key={index} className="cert-card">
                            <Award size={20} className="cert-icon" />
                            <div className="cert-content">
                                <span className="cert-name">{cert.name}</span>
                                <span className="cert-issuer">{cert.issuer}</span>
                                <span className="cert-year">{cert.year}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="exp-cta">
                <p>Interested in working together?</p>
                <div className="cta-buttons">
                    <Link to="/contact" className="cta-btn primary">
                        Get in Touch
                    </Link>
                    <a
                        href="https://linkedin.com/in/madanlalit"
                        target="_blank"
                        rel="noreferrer"
                        className="cta-btn secondary"
                    >
                        <ExternalLink size={14} /> LinkedIn
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Experience;
