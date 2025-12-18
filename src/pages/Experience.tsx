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
        role: "AI Engineer",
        company: "Building the Future",
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
        period: "2022 — 2024",
        role: "Full Stack Developer",
        company: "Tech Ventures",
        location: "Bangalore, India",
        type: "Full-time",
        description:
            "Built and maintained scalable web applications serving millions of users. Led frontend architecture decisions and implemented CI/CD pipelines.",
        achievements: [
            "Shipped v1.0 of core product used by 50K+ monthly active users",
            "Reduced page load time by 60% through performance optimization",
            "Implemented real-time collaboration features using WebSockets",
        ],
        tech: ["React", "TypeScript", "Node.js", "AWS", "Docker"],
    },
    {
        id: 3,
        period: "2020 — 2022",
        role: "Software Engineer",
        company: "StartUp Inc",
        location: "Delhi, India",
        type: "Full-time",
        description:
            "Developed core product features and contributed to agile development processes. Worked across the full stack from database design to frontend.",
        achievements: [
            "Built REST APIs serving 1M+ requests per day",
            "Designed database schemas for high-throughput applications",
            "Implemented automated testing reducing bug rate by 35%",
        ],
        tech: ["JavaScript", "Python", "PostgreSQL", "Express"],
    },
    {
        id: 4,
        period: "2019 — 2020",
        role: "Software Engineering Intern",
        company: "Tech Corp",
        location: "Remote",
        type: "Internship",
        description:
            "Gained hands-on experience in software development. Worked on internal tools and contributed to production codebases.",
        achievements: [
            "Developed internal dashboard used by 100+ employees",
            "Automated manual processes saving 10+ hours weekly",
        ],
        tech: ["JavaScript", "Python", "Git"],
    },
];

const EDUCATION = [
    {
        period: "2016 — 2020",
        degree: "B.Tech in Computer Science",
        institution: "Your University",
        location: "India",
        gpa: "8.5/10",
        highlights: ["University Hackathon Winner", "ML Research Paper Published"],
    },
];

const CERTIFICATIONS = [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", year: "2023" },
    { name: "Deep Learning Specialization", issuer: "DeepLearning.AI", year: "2022" },
    { name: "Professional Scrum Master I", issuer: "Scrum.org", year: "2021" },
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
                                        <span className="job-type">GPA: {edu.gpa}</span>
                                    </div>

                                    <h3 className="job-title">{edu.degree}</h3>

                                    <div className="job-location">
                                        <MapPin size={12} /> {edu.institution}, {edu.location}
                                    </div>

                                    <div className="job-tags" style={{ marginTop: "1rem" }}>
                                        {edu.highlights.map((h) => (
                                            <span key={h} className="tech-tag">
                                                {h}
                                            </span>
                                        ))}
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
