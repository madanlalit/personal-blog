import React, { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Wifi,
  MapPin,
  Clock,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  Copy,
  Terminal,
  BatteryCharging,
} from "lucide-react";
import "./Contact.css";
import "./About.css";

// Helper Component for Status Items
const StatusItem: React.FC<{ icon: React.ReactNode; text: string }> = ({
  icon,
  text,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    {icon} {text}
  </div>
);

const Contact: React.FC = () => {
  const [status, setStatus] = useState<"IDLE" | "SENDING" | "SENT">("IDLE");
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", { hour12: false }),
  );
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});

  // Replace with your info
  const EMAIL = "hello@madanlalit.com";

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; message?: string } = {};

    // Validate email
    if (!email) {
      newErrors.email = "ERROR_0x01: SENDER_IDENTITY_REQUIRED";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "ERROR_0x02: INVALID_SENDER_FORMAT";
    }

    // Validate message
    if (!message) {
      newErrors.message = "ERROR_0x03: MESSAGE_PAYLOAD_EMPTY";
    } else if (message.length < 10) {
      newErrors.message = "ERROR_0x04: PAYLOAD_TOO_SHORT (MIN: 10 BYTES)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus("SENDING");
    // Fake delay
    setTimeout(() => setStatus("SENT"), 1500);
  };

  return (
    <div className="sys-container">
      <div className="grid-bg"></div>

      <header className="sys-header">
        <div className="sys-title">
          <Terminal size={18} />
          <span>COMMS_MOD // V.4.0</span>
        </div>
        <div className="sys-meta">
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Wifi size={14} className="blink" /> SIGNAL_STRONG
          </span>
        </div>
      </header>

      <main
        className="sys-content"
        style={{ overflowY: "auto" }}
      >
        <div className="comms-wrapper">
          {/* Main Interface Box */}
          <div className="comms-interface">
            {/* LEFT: Operator / Info Sidebar */}
            <aside className="sidebar-info">
              <div>
                <div className="operator-card">
                  <div className="op-avatar">LM</div>
                  <div className="op-name">LALIT_MADAN</div>
                  <div className="op-role">SYS_ADMIN // DEV</div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <div className="field-label">DIRECT_CONNECT</div>
                  <button
                    onClick={handleCopy}
                    className="conn-link"
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      background: "transparent",
                    }}
                  >
                    <Mail size={16} />
                    <span
                      style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {EMAIL}
                    </span>
                    {copied ? (
                      <CheckCircle size={14} color="var(--arch-accent)" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>

                <div className="conn-list">
                  <div className="field-label">SOCIAL_LINKS</div>
                  <a
                    href="https://github.com/madanlalit"
                    target="_blank"
                    rel="noreferrer"
                    className="conn-link"
                  >
                    <Github size={16} /> GITHUB
                  </a>
                  <a
                    href="https://linkedin.com/in/madanlalit"
                    target="_blank"
                    rel="noreferrer"
                    className="conn-link"
                  >
                    <Linkedin size={16} /> LINKEDIN
                  </a>
                  <a
                    href="https://x.com/lalitmadan"
                    target="_blank"
                    rel="noreferrer"
                    className="conn-link"
                  >
                    <Twitter size={16} /> TWITTER_X
                  </a>
                </div>
              </div>

              {/* Bottom System Stats */}
              <div
                style={{
                  marginTop: "30px",
                  fontSize: "0.75rem",
                  color: "var(--arch-muted)",
                  display: "grid",
                  gap: "8px",
                }}
              >
                <StatusItem icon={<Clock size={14} />} text={`${time} UTC+05:30`} />
                <StatusItem icon={<MapPin size={14} />} text="SECTOR: INDIA" />
                <StatusItem icon={<BatteryCharging size={14} />} text="SYS_POWER: 100%" />
              </div>
            </aside>

            {/* RIGHT: Input Form */}
            <div className="form-area">
              {status === "SENT" ? (
                <div className="success-display">
                  <CheckCircle
                    size={48}
                    color="var(--arch-accent)"
                    style={{ marginBottom: 20 }}
                  />
                  <h3>TRANSMISSION_ESTABLISHED</h3>
                  <p style={{ color: "var(--arch-muted)", margin: "15px 0" }}>
                    Packet successfully routed to the administrator.
                  </p>
                  <button
                    onClick={() => setStatus("IDLE")}
                    className="execute-btn"
                    style={{ margin: "0 auto" }}
                  >
                    NEW_TRANSMISSION
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="input-field-group">
                    <label className="field-label">01 // SENDER_IDENTITY</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                      className={`tech-input ${errors.email ? 'input-error' : ''}`}
                      placeholder="Enter your email frequency..."
                    />
                    {errors.email && <div className="validation-error">{errors.email}</div>}
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">02 // MESSAGE_PAYLOAD</label>
                    <textarea
                      value={message}
                      onChange={(e) => { setMessage(e.target.value); setErrors({}); }}
                      rows={5}
                      className={`tech-input ${errors.message ? 'input-error' : ''}`}
                      placeholder="Initialize message sequence..."
                      style={{ resize: "vertical" }}
                    ></textarea>
                    {errors.message && <div className="validation-error">{errors.message}</div>}
                  </div>

                  {status === "SENDING" ? (
                    <div className="transmit-state">
                      <div className="transmit-text">TRANSMITTING_ENCRYPTED_PACKET...</div>
                      <div className="transmission-bar">
                        <div className="transmission-fill"></div>
                      </div>
                    </div>
                  ) : (
                    <button type="submit" className="execute-btn">
                      INITIATE_SEND <Send size={16} />
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
