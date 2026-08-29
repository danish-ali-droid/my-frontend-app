import React, { useState, useEffect } from "react";
import {
  Rocket,
  Activity,
  Layers,
  ShieldCheck,
  Server,
  Terminal,
  Play,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  GitBranch,
  Cpu,
  Globe,
  Sparkles,
} from "lucide-react";
import "./index.css";

export default function App() {
  const [repoUrl, setRepoUrl] = useState(
    "https://github.com/danish-ali/frontend-app-deployment",
  );
  const [branch, setBranch] = useState("main");
  const [isDeploying, setIsDeploying] = useState(false);
  const [logs, setLogs] = useState([
    {
      text: "System ready. Listening for deployment triggers...",
      type: "info",
    },
    { text: "GitHub Actions workflow sync: Active", type: "info" },
    { text: "Edge CDN distribution: 24 nodes operational", type: "success" },
  ]);

  const [deployments, setDeployments] = useState([
    {
      id: "dep-9042",
      name: "Production Release v2.4.0",
      branch: "main",
      commit: "e81a029",
      status: "Live",
      time: "2 mins ago",
      environment: "Production",
      latency: "32ms",
    },
    {
      id: "dep-9041",
      name: "Staging UI Refresh",
      branch: "feature/dark-mode",
      commit: "b72c918",
      status: "Live",
      time: "45 mins ago",
      environment: "Staging",
      latency: "28ms",
    },
    {
      id: "dep-9040",
      name: "Hotfix Auth Token Expiry",
      branch: "hotfix/patch-auth",
      commit: "a10b49f",
      status: "Live",
      time: "3 hours ago",
      environment: "Production",
      latency: "34ms",
    },
  ]);

  const handleTriggerDeploy = (e) => {
    e.preventDefault();
    if (isDeploying) return;

    setIsDeploying(true);
    const newId = `dep-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCommit = Math.random().toString(36).substring(2, 9);

    const newDep = {
      id: newId,
      name: `Manual Deployment (${branch})`,
      branch: branch,
      commit: newCommit,
      status: "Building",
      time: "Just now",
      environment: branch === "main" ? "Production" : "Preview",
      latency: "--",
    };

    setDeployments((prev) => [newDep, ...prev]);

    setLogs((prev) => [
      {
        text: `[${new Date().toLocaleTimeString()}] Triggering manual deployment for ${branch} (#${newCommit})...`,
        type: "info",
      },
      ...prev,
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        {
          text: `[${new Date().toLocaleTimeString()}] Running build & unit tests on runner ubuntu-latest...`,
          type: "info",
        },
        ...prev,
      ]);
    }, 1200);

    setTimeout(() => {
      setLogs((prev) => [
        {
          text: `[${new Date().toLocaleTimeString()}] Uploading static assets to Edge CDN...`,
          type: "info",
        },
        ...prev,
      ]);
    }, 2400);

    setTimeout(() => {
      setDeployments((prev) =>
        prev.map((d) =>
          d.id === newId ? { ...d, status: "Live", latency: "29ms" } : d,
        ),
      );
      setLogs((prev) => [
        {
          text: `[${new Date().toLocaleTimeString()}] Deployment #${newId} successfully deployed to global CDN! 🚀`,
          type: "success",
        },
        ...prev,
      ]);
      setIsDeploying(false);
    }, 3800);
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <Rocket size={20} />
          </div>
          <span>CloudDeploy</span>
        </div>

        <nav className="nav-links">
          <a href="#overview" className="nav-link active">
            Dashboard
          </a>
          <a href="#pipelines" className="nav-link">
            Pipelines
          </a>
          <a href="#metrics" className="nav-link">
            Metrics
          </a>
          <a href="#docs" className="nav-link">
            Documentation
          </a>
        </nav>

        <div className="nav-actions">
          <button
            className="btn btn-secondary"
            onClick={() => window.open("https://github.com", "_blank")}
          >
            <GitBranch size={16} />
            <span>GitHub</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Hero Banner */}
        <section className="hero">
          <div className="badge">
            <span className="badge-dot"></span>
            <span>Automated CI/CD Platform</span>
          </div>
          <h1 className="hero-title">
            Deploy your Frontend <br />
            <span className="gradient-text">with Zero Downtime</span>
          </h1>
          <p className="hero-subtitle">
            Seamlessly build, preview, and deploy modern React web applications
            to global edge networks with real-time pipeline monitoring.
          </p>
          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={handleTriggerDeploy}
              disabled={isDeploying}
            >
              <Play size={16} />
              <span>
                {isDeploying ? "Deploying..." : "Trigger Quick Deploy"}
              </span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const el = document.getElementById("pipeline-console");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Terminal size={16} />
              <span>View Logs</span>
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <span>Total Deployments</span>
              <div
                className="stat-icon"
                style={{
                  background: "rgba(99, 102, 241, 0.12)",
                  color: "#818cf8",
                }}
              >
                <Rocket size={18} />
              </div>
            </div>
            <div className="stat-value">1,482</div>
            <div className="stat-sub positive">
              <ArrowUpRight size={14} /> +18.4% from last month
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>Avg. Build Time</span>
              <div
                className="stat-icon"
                style={{
                  background: "rgba(6, 182, 212, 0.12)",
                  color: "#22d3ee",
                }}
              >
                <Clock size={18} />
              </div>
            </div>
            <div className="stat-value">42s</div>
            <div className="stat-sub positive">
              <CheckCircle2 size={14} /> 99.8% Success rate
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>Global Edge Latency</span>
              <div
                className="stat-icon"
                style={{
                  background: "rgba(16, 185, 129, 0.12)",
                  color: "#34d399",
                }}
              >
                <Globe size={18} />
              </div>
            </div>
            <div className="stat-value">28ms</div>
            <div className="stat-sub positive">
              <Activity size={14} /> 24 Global regions active
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>SSL & Security</span>
              <div
                className="stat-icon"
                style={{
                  background: "rgba(245, 158, 11, 0.12)",
                  color: "#fbbf24",
                }}
              >
                <ShieldCheck size={18} />
              </div>
            </div>
            <div className="stat-value">A+ Grade</div>
            <div className="stat-sub neutral">Auto-renewing TLS 1.3</div>
          </div>
        </section>

        {/* Deploy Trigger & Live Status Panel */}
        <section className="panel" id="pipeline-console">
          <div className="panel-header">
            <div className="panel-title">
              <Terminal size={20} color="#6366f1" />
              <span>Deployment Console & Pipeline</span>
            </div>
            <div className="badge">
              <span className="badge-dot"></span>
              <span>Workflow Active</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTriggerDeploy} className="deploy-controls">
            <div className="input-group">
              <GitBranch size={18} color="#94a3b8" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Repository URL"
                aria-label="Repository URL"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isDeploying}
            >
              <Play size={16} />
              <span>
                {isDeploying ? "Processing Build..." : "Deploy Branch"}
              </span>
            </button>
          </form>

          {/* Live Terminal Output */}
          <div className="terminal-box">
            <div className="terminal-header">
              <div className="terminal-dots">
                <div className="dot dot-red"></div>
                <div className="dot dot-yellow"></div>
                <div className="dot dot-green"></div>
              </div>
              <span>build-runner-output.log</span>
            </div>
            {logs.map((log, index) => (
              <div key={index} className="log-line">
                <span className="log-prefix">&gt;</span>
                <span
                  className={
                    log.type === "success" ? "log-success" : "log-info"
                  }
                >
                  {log.text}
                </span>
              </div>
            ))}
          </div>

          {/* Recent Deployments Table/List */}
          <div style={{ marginTop: "1rem" }}>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "0.85rem",
                color: "#cbd5e1",
              }}
            >
              Recent Deployments
            </h3>
            <div className="pipeline-list">
              {deployments.map((dep) => (
                <div key={dep.id} className="pipeline-item">
                  <div className="pipeline-info">
                    <div
                      className={`pipeline-status-indicator ${
                        dep.status === "Live"
                          ? "status-deployed"
                          : "status-building"
                      }`}
                    />
                    <div>
                      <div className="pipeline-name">{dep.name}</div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                          marginTop: "0.2rem",
                        }}
                      >
                        <span className="pipeline-commit">{dep.commit}</span>
                        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          • branch: {dep.branch}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                      {dep.time}
                    </span>
                    <span
                      className={`status-tag ${
                        dep.status === "Live" ? "tag-success" : "tag-warning"
                      }`}
                    >
                      {dep.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Sparkles size={24} />
            </div>
            <h3 className="feature-title">Instant Edge Previews</h3>
            <p className="feature-desc">
              Every pull request and commit automatically receives its own
              isolated URL for testing and stakeholder review.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Cpu size={24} />
            </div>
            <h3 className="feature-title">Optimized Builds</h3>
            <p className="feature-desc">
              Harness Vite and Rollup multi-core bundling to package code in
              sub-seconds with aggressive tree-shaking.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Server size={24} />
            </div>
            <h3 className="feature-title">Multi-Cloud Ready</h3>
            <p className="feature-desc">
              Deploy targets span AWS S3 + CloudFront, Vercel, Netlify,
              Kubernetes, or custom Docker container environments.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} CloudDeploy Frontend Deployment Platform
          • Built with React & Vite
        </p>
      </footer>
    </div>
  );
}
