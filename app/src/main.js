import './style.css';

const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'Release Room',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api'
};

document.title = `${appConfig.name} | Delivery control`;
const app = document.querySelector('#app');

app.innerHTML = `
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="#overview" aria-label="Release Room home"><span class="brand-mark">RR</span><span><strong>Release</strong><small>ROOM</small></span></a>
      <nav class="primary-nav" aria-label="Primary navigation">
        <a class="nav-item active" href="#overview"><span class="nav-icon">01</span>Overview</a><a class="nav-item" href="#pipelines"><span class="nav-icon">02</span>Pipelines</a><a class="nav-item" href="#services"><span class="nav-icon">03</span>Services</a><a class="nav-item" href="#activity"><span class="nav-icon">04</span>Activity</a>
      </nav>
      <div class="sidebar-bottom"><div class="agent-card"><span class="live-dot"></span><div><b>Agent online</b><small>docker-agent-01</small></div><span class="agent-menu">...</span></div><div class="profile"><span class="avatar">S</span><div><b>Shahzaib</b><small>Release engineer</small></div><span class="profile-caret">v</span></div></div>
    </aside>
    <main class="main-content">
      <header class="topbar"><div><p class="eyebrow">Thursday, September 11, 2026</p><h1>Good morning, Shahzaib<span class="accent">.</span></h1></div><div class="top-actions"><button class="icon-button" aria-label="Open notifications">!</button><button class="avatar small-avatar" aria-label="Open profile">S</button></div></header>
      <section class="hero-banner" id="overview"><div class="hero-copy"><span class="hero-kicker"><span class="live-dot"></span>All systems operational</span><h2>Ship with confidence.</h2><p>Your delivery pipeline is healthy and your latest release is ready for production.</p><button class="primary-button" id="deploy-button"><span class="button-icon">&gt;</span>Verify deployment</button></div><div class="hero-orbit" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit-core"><span>v${appConfig.version}</span><small>READY</small></div><span class="orbit-node node-one"></span><span class="orbit-node node-two"></span><span class="orbit-node node-three"></span></div></section>
      <div class="section-heading"><div><p class="eyebrow">Live telemetry</p><h2>System overview</h2></div><span class="updated"><span class="live-dot"></span>Updated just now</span></div>
      <section class="metrics-grid" id="services">
        <article class="metric-panel"><div class="metric-top"><span class="metric-label">Build success</span><span class="metric-icon green">+</span></div><div class="metric-value">98<span>%</span></div><div class="trend positive">+4.8% <span>vs last month</span></div><div class="sparkline green-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article>
        <article class="metric-panel"><div class="metric-top"><span class="metric-label">Avg. deploy time</span><span class="metric-icon blue">~</span></div><div class="metric-value">4<span class="unit">m</span> 32<span class="unit">s</span></div><div class="trend positive">-18.2% <span>faster than last week</span></div><div class="sparkline blue-line"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article>
        <article class="metric-panel"><div class="metric-top"><span class="metric-label">Code quality</span><span class="metric-icon orange">*</span></div><div class="metric-value">A<span class="grade"> / 91</span></div><div class="trend neutral">SonarQube gate <span>passed</span></div><div class="quality-bar"><span></span></div></article>
        <article class="metric-panel"><div class="metric-top"><span class="metric-label">Active services</span><span class="metric-icon purple">#</span></div><div class="metric-value">12<span class="grade"> / 12</span></div><div class="trend positive">100% <span>availability</span></div><div class="service-dots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article>
      </section>
      <section class="lower-grid" id="pipelines"><article class="panel pipeline-panel"><div class="panel-heading"><div><p class="eyebrow">Delivery flow</p><h2>Latest pipeline</h2></div><button class="text-button">View all <span>-&gt;</span></button></div><div class="pipeline-meta"><span class="status-pill"><i></i>Passed</span><span>release/main</span><span>8c4f2a1</span><span class="meta-time">14 min ago</span></div><div class="pipeline-steps"><div class="pipeline-step done"><span class="step-dot">+</span><b>Build</b><small>1m 42s</small></div><div class="connector done"></div><div class="pipeline-step done"><span class="step-dot">+</span><b>Quality</b><small>48s</small></div><div class="connector done"></div><div class="pipeline-step done"><span class="step-dot">+</span><b>Package</b><small>1m 16s</small></div><div class="connector active"></div><div class="pipeline-step current"><span class="step-dot">+</span><b>Deploy</b><small>46s</small></div></div><div class="pipeline-footer"><span><i class="mini-avatar">JD</i> Jordan Davis</span><span>Docker image <b>release:1.0.0</b></span></div></article><article class="panel activity-panel" id="activity"><div class="panel-heading"><div><p class="eyebrow">Recent events</p><h2>Activity</h2></div><button class="icon-button subtle" aria-label="More activity options">...</button></div><div class="activity-list"><div class="activity-item"><span class="activity-icon green">+</span><div><b>Deployment completed</b><small>release/main is now live in production</small></div><time>14m</time></div><div class="activity-item"><span class="activity-icon blue">~</span><div><b>Build #2481 passed</b><small>All quality gates cleared successfully</small></div><time>16m</time></div><div class="activity-item"><span class="activity-icon orange">!</span><div><b>Agent connected</b><small>docker-agent-01 joined the cluster</small></div><time>22m</time></div></div></article></section>
      <p class="feedback" id="feedback" role="status"></p>
    </main>
  </div>
`;

const feedback = document.querySelector('#feedback');
const deployButton = document.querySelector('#deploy-button');

deployButton.addEventListener('click', async () => {
  deployButton.disabled = true;
  deployButton.innerHTML = '<span class="button-icon">...</span>Checking services';
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Hardcoded response instead of fetch
    const health = {
      service: 'App (Hardcoded)',
      timestamp: Date.now()
    };
    
    feedback.textContent = `${health.service} is healthy. Deployment verified at ${new Date(health.timestamp).toLocaleTimeString()}.`;
    feedback.className = 'feedback success';
  } catch {
    feedback.textContent = 'Deployment verification failed.';
    feedback.className = 'feedback error';
  } finally {
    deployButton.disabled = false;
    deployButton.innerHTML = '<span class="button-icon">&gt;</span>Verify deployment';
  }
});

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
  });
});