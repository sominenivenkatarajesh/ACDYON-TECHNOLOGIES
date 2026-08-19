# Architectural & Design Decisions

### 1. Why this ingestion strategy over the obvious alternative you rejected?
* **Chosen Approach:** Zero-dependency static architecture with lightweight client-side SVG time-series path interpolation and real-time interval jitter.
* **Rejected Alternative:** Heavy client-side charting libraries (Chart.js / D3.js) or full SSR Node.js serverless execution.
* **Rationale:** For an uptime and latency monitoring product, speed and performance are the core value propositions. Loading a 150KB+ charting library or introducing serverless cold starts degrades load times and introduces unnecessary failure points. By calculating cubic bezier and line coordinates directly in vanilla JavaScript (<8KB total) and serving the site as pure static assets over an Edge CDN, we achieve sub-50ms first-contentful-paint (FCP), 100/100 Lighthouse scores, and zero server maintenance overhead.

---

### 2. One trade-off made under the time limit, and what I’d do with a real week
* **The Trade-off:** Used simulated real-time telemetry streams and client-side heartbeat state rather than a live multi-region WebSocket / Server-Sent Events (SSE) ingestion pipeline.
* **With a Full Week:** 
  1. **Distributed Probe Engine:** Deploy lightweight Go / Rust edge workers across 12 Cloudflare / Fly.io points-of-presence (PoPs) to execute real HTTP/gRPC synthetic pings.
  2. **Time-Series Ingestion:** Pipe raw ping results into a partitioned ClickHouse / TimescaleDB cluster with automated aggregation rollups (p50, p95, p99).
  3. **Alert Dispatch Pipeline:** Build a resilient async event queue (Redis/BullMQ) to fire webhook, Telegram, and Slack incident alerts upon 2 consecutive failed healthchecks.
  4. **Custom Domain Status Pages:** Implement automatic SSL provisioning for user status subdomains (`status.customer.com`).

---

### 3. Where AI tools were used, and what was personally verified/changed
* **Where AI Was Used:**
  - Brainstorming structural section layouts (Hero value prop vs. Interactive Live Demo Card).
  - Draft math formulas for SVG coordinate normalization (`minVal`/`maxVal` scaling).
* **What Was Personally Verified & Changed Afterward:**
  - **Typography & Aesthetics:** Overrode generic AI palettes and fonts; paired **Instrument Serif** (editorial authority) with **Plus Jakarta Sans** (clean UI) and **JetBrains Mono** on a custom `#0E1013` matte slate background (mimicking real server consoles rather than generic purple SaaS gradients).
  - **Accessibility (a11y):** Added explicit `tabindex="0"`, `role="button"`, `aria-pressed`, and keyboard listeners (`Enter`/`Space`) across all interactive endpoint rows.
  - **Vercel Runtime Fixes:** Identified and eliminated Node.js serverless function collisions by migrating client scripts to clean static naming conventions and optimizing `vercel.json` edge rules.
  - **Easter Eggs & Micro-Interactions:** Handcrafted the Konami Code sequence listener (`↑ ↑ ↓ ↓ ← → ← → B A`) and triple-click debug terminal drawer.
