# Architectural & Design Decisions — Pulse Landing Page (Part 2)

## 1. Why this design/tech approach over the alternative I rejected?

**Chosen approach:** Plain HTML/CSS/vanilla JavaScript, deployed as a 
static site, with a hand-rolled SVG line chart for the mock dashboard.

**Rejected alternative:** A React/Vite build with a charting library 
(Chart.js or Recharts) for the demo dashboard.

**Rationale:** This is a single static marketing page with no routing, 
no real backend, and no state that needs to persist across views. 
Reaching for React would have added a build step and dependency surface 
with no functional benefit — just risk of a broken build the night 
before submission. Hand-rolling the SVG chart (coordinate normalization, 
path generation) instead of pulling in a charting library meant I could 
fully explain every line of that code, which matters more than the 
visual polish a library might add. The trade-off: a library would have 
given me tooltips, animations, and responsive scaling for free — I 
accepted writing more from scratch in exchange for being able to defend 
every part of it.

## 2. One trade-off made under the time limit, and what I'd do with a 
real week

**The trade-off:** The dashboard card uses simulated/mock data (hardcoded 
latency arrays with random jitter) rather than pinging any real endpoint, 
since Part 2 only requires a section that *demonstrates* the product, 
not a working backend.

**With a real week, I would:**
1. Wire the demo card to actually ping 1-2 real public endpoints (e.g. 
   a status.io-style public API) so the chart reflects real data instead 
   of simulated jitter.
2. Build a working (even if minimal) signup flow behind the CTA button, 
   instead of it only scrolling to an anchor — right now it's honestly 
   labeled ("See It In Action") specifically because no real flow exists.
3. Run a full accessibility audit with a screen reader, not just ARIA 
   attribute checks in the DOM.
4. Test on real physical devices instead of only Chrome DevTools' 
   responsive mode.

## 3. Where I used AI tools, and what I personally verified or changed 
afterward

I used AI to scaffold the initial HTML/CSS/JS structure, generate the 
SVG chart math, and draft copy options. I treated all of it as a first 
draft to audit, not a final answer — several real issues came up during 
review that I caught and had corrected before shipping:

- **Caught a fabricated personal detail.** An early draft of the footer 
  bio claimed the product was "built by a solo developer in Chicago" — 
  untrue, and exactly the kind of fabrication this brief explicitly 
  penalizes. I had it rewritten to something true to my actual situation.
- **Caught a dishonest CTA.** The button originally said "Start 
  Monitoring Free" but only scrolled to an anchor — there was no real 
  signup flow behind it. I had the copy changed to "See It In Action" so 
  the label matches what actually happens on click.
- **Found and fixed a real mobile bug.** At 390px, the nav links were 
  overlapping the logo. I caught this by actually testing in Chrome 
  DevTools' responsive mode rather than trusting a text-based "audit" 
  script that only checked for CSS property presence, not rendered 
  behavior.
- **Verified an accessibility claim instead of trusting it.** A stated 
  color-contrast ratio was reported by the AI without me checking it — I 
  flagged this and had the actual hex values verified against WCAG 
  guidelines rather than accepting the number as given.
- **Caught a broken script reference.** After a file was renamed from 
  `app.js` to `script.js`, the `<script>` tag in `index.html` still 
  pointed to the old filename, which would have silently disabled all 
  interactivity (chart animation, endpoint switching, easter eggs) with 
  no visible error. I caught this by checking the actual file list 
  against what the HTML referenced.

The consistent pattern: I did not accept AI output — including this 
document's first draft — at face value. Anything with a specific, 
checkable claim (a contrast ratio, a performance number, a "verified" 
label) I either checked myself or removed if I couldn't verify it.
