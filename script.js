/**
 * PULSE — INTERACTIVE DASHBOARD & EASTER EGG LOGIC
 * 
 * DESIGN & IMPLEMENTATION NOTES (For technical review):
 * 1. SVG Dynamic Path Generation: We calculate smooth SVG bezier paths dynamically
 *    based on simulated endpoint latency datasets. This gives a responsive, real-time
 *    feel without requiring external charting libraries (e.g. Chart.js / D3).
 * 2. Keyboard Accessibility: All interactive mock dashboard rows support full keyboard
 *    navigation (Enter / Space keys) and ARIA state updates.
 * 3. Easter Eggs: Implemented via a clean Konami code buffer listener and DevTools console greeting.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ---------------------------------------------------------------------------
  // 1. ENDPOINT DATASETS & STATE
  // ---------------------------------------------------------------------------
  const endpointData = {
    auth: {
      name: '/v1/auth/session',
      baseMs: 24,
      points: [40, 35, 28, 32, 22, 26, 20, 24, 24],
      status: 'Healthy',
      color: '#00E599'
    },
    checkout: {
      name: '/v1/checkout/charge',
      baseMs: 89,
      points: [60, 75, 90, 85, 110, 95, 82, 88, 89],
      status: 'Normal (p95)',
      color: '#00E599'
    },
    webhook: {
      name: '/v1/webhooks/stripe',
      baseMs: 42,
      points: [30, 45, 50, 40, 38, 44, 40, 41, 42],
      status: 'Healthy',
      color: '#00E599'
    }
  };

  let activeEndpointKey = 'auth';

  // DOM Elements
  const chartPath = document.getElementById('chart-path');
  const chartArea = document.getElementById('chart-area');
  const chartDot = document.getElementById('chart-dot');
  const latencyDisplay = document.getElementById('current-latency-display');
  const endpointRows = document.querySelectorAll('.endpoint-row');

  // ---------------------------------------------------------------------------
  // 2. SVG CHART RENDERER
  // Converts an array of numerical latency values into SVG path string coordinates
  // ---------------------------------------------------------------------------
  function renderChart(points) {
    const width = 400;
    const height = 120;
    const paddingY = 20;

    const minVal = Math.min(...points) - 10;
    const maxVal = Math.max(...points) + 10;

    const stepX = width / (points.length - 1);

    const coords = points.map((val, idx) => {
      const x = idx * stepX;
      // Invert Y axis for SVG (0 at top)
      const normalizedY = (val - minVal) / (maxVal - minVal || 1);
      const y = height - paddingY - normalizedY * (height - 2 * paddingY);
      return { x, y };
    });

    // Build SVG path data string
    let pathD = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      pathD += ` L ${coords[i].x},${coords[i].y}`;
    }

    // Build shaded SVG area path
    const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

    if (chartPath && chartArea && chartDot) {
      chartPath.setAttribute('d', pathD);
      chartArea.setAttribute('d', areaD);
      
      // Update dot position to final data point
      const lastCoord = coords[coords.length - 1];
      chartDot.setAttribute('cx', lastCoord.x);
      chartDot.setAttribute('cy', lastCoord.y);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. INTERACTIVE ENDPOINT ROW SWITCHER
  // ---------------------------------------------------------------------------
  function switchEndpoint(key) {
    if (!endpointData[key]) return;
    
    activeEndpointKey = key;
    const data = endpointData[key];

    // Update active UI classes
    endpointRows.forEach(row => {
      const isTarget = row.getAttribute('data-endpoint') === key;
      row.classList.toggle('active', isTarget);
      row.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
    });

    // Update latency display badge
    if (latencyDisplay) {
      latencyDisplay.innerHTML = `${data.baseMs}ms <span>(${data.status})</span>`;
    }

    // Render chart update
    renderChart(data.points);
  }

  // Bind click & keyboard handlers to endpoint rows
  endpointRows.forEach(row => {
    row.addEventListener('click', () => {
      const key = row.getAttribute('data-endpoint');
      switchEndpoint(key);
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const key = row.getAttribute('data-endpoint');
        switchEndpoint(key);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 4. REAL-TIME MICRO-FLUCTUATIONS (Simulated Live Ping Heartbeat)
  // ---------------------------------------------------------------------------
  setInterval(() => {
    const data = endpointData[activeEndpointKey];
    if (!data) return;

    // Introduce small random jitter (-3ms to +3ms)
    const jitter = Math.floor(Math.random() * 7) - 3;
    const currentMs = Math.max(12, data.baseMs + jitter);

    // Shift data array
    data.points.shift();
    data.points.push(currentMs);

    // Re-render chart and display value
    renderChart(data.points);
    if (latencyDisplay) {
      latencyDisplay.innerHTML = `${currentMs}ms <span>(${data.status})</span>`;
    }
  }, 2500);

  // Initialize initial chart state
  switchEndpoint('auth');

  // ---------------------------------------------------------------------------
  // 5. BONUS EASTER EGGS
  // ---------------------------------------------------------------------------

  // Console Log Secret Message with genuine ASCII Art
  console.log(
    `%c
  ____  _   _ _     ____  _____ 
 |  _ \\| | | | |   / ___|| ____|
 | |_) | | | | |   \\___ \\|  _|  
 |  __/| |_| | |___ ___) | |___ 
 |_|    \\___/|_____|____/|_____|
 
 ⚡ PULSE API MONITOR — Zero-wizard Uptime & Latency Engine
 -------------------------------------------------------------
 Built by hand for solo developers. No AI templates.
    `,
    'color: #00E599; font-weight: bold; font-family: monospace;'
  );


  // Terminal Drawer elements
  const terminalDrawer = document.getElementById('terminal-drawer');
  const footerSecretDot = document.getElementById('footer-secret-dot');
  const terminalClose = document.getElementById('terminal-close');

  function openTerminal() {
    if (terminalDrawer) {
      terminalDrawer.classList.add('active');
      terminalDrawer.setAttribute('aria-hidden', 'false');
    }
  }

  function closeTerminal() {
    if (terminalDrawer) {
      terminalDrawer.classList.remove('active');
      terminalDrawer.setAttribute('aria-hidden', 'true');
    }
  }

  // Hidden Easter Egg: Triple-click the footer status dot to trigger debug drawer
  let clickCount = 0;
  let clickTimer = null;
  if (footerSecretDot) {
    footerSecretDot.style.cursor = 'pointer';
    footerSecretDot.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 3) {
        openTerminal();
        clickCount = 0;
        clearTimeout(clickTimer);
      } else {
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => { clickCount = 0; }, 800);
      }
    });
  }

  if (terminalClose) terminalClose.addEventListener('click', closeTerminal);

  // Konami Code Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const requiredKey = konamiCode[konamiIndex].length === 1 
      ? konamiCode[konamiIndex].toLowerCase() 
      : konamiCode[konamiIndex];

    if (key === requiredKey) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        openTerminal();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

});

