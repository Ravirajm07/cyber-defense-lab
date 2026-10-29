# 🛡️ CYBER DEFENSE LAB: Top 10 Pentest Reconnaissance Tools & Time-Series Ensemble Detection

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-Isolation%20Forest-F7931E?logo=scikit-learn)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive, gamified cybersecurity training web application engineered for hands-on college workshops and red/blue team simulations. Students progress through **10 Offensive Reconnaissance Tools** and defend against stealth scans in a **Final Boss Machine Learning Detection Lab** powered by a 100-Tree Isolation Forest ensemble.

---

## 🚀 Live Demo & Quick Start

### Option 1: Standalone Single-File (Zero Setup)
Simply open `bundle.html` in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave). All styles, scripts, sound synthesizers, and assets are 100% inlined (580 KB).

### Option 2: Local Development
```bash
# Clone the repository
git clone https://github.com/Ravirajm07/cyber-defense-lab.git
cd cyber-defense-lab

# Install dependencies
pnpm install
# or: npm install

# Start Vite live development server
pnpm dev

# Build production bundle
pnpm build
```

---

## 🎯 Architecture & Features

### 1. Offensive Reconnaissance (Levels 1–10)
Each level features:
- **Intel Briefing**: Operational use cases, pros & cons, and target server log footprint ratings.
- **Task 1: Install & Setup**: Interactive bash terminal / cloud CLI with command auto-typing, quick fill, and syntax validation.
- **Task 2: Execute Recon Demo**: Real tool simulations with specialized visual inspectors.

| Level | Tool Name | Bucket | Key Focus | Footprint |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **FireCompass AI** | Bucket 3: Autonomous Discovery | Continuous Attack Surface & S3/GitHub $\to$ MySQL Path | Moderate |
| **2** | **Maltego CE** | Bucket 2: Visual Link & Graph | Interactive Node Graph (scanme, ns1, mx, svn) | Low / Indirect |
| **3** | **Google Dorking** | Bucket 1: Passive Search | Simulated Google Search with 3 Pentest Dorks | **ZERO** |
| **4** | **Recon-ng** | Bucket 2: Modular OSINT | Metasploit-style CLI, HackerTarget module, SQLite | Low / Moderate |
| **5** | **Shodan** | Bucket 1: Device Search Engine | Host Intelligence for 45.33.32.156, 14.8M Apache hosts | **ZERO** |
| **6** | **Censys** | Bucket 1: Universal Asset Map | Certificate Transparency logs, TLS subdomains | **ZERO** |
| **7** | **Nmap** | Bucket 3: Active Network Scanner | Aggressive scan (`-A -sV -O`), **triggers red spike** | **EXTREME SPIKE** |
| **8** | **SpiderFoot** | Bucket 2: Automated OSINT | Web UI on port 5001, BGP ASN, WHOIS, threat scoring | Low (Passive) |
| **9** | **Aquatone & DataSploit** | Bucket 2: Visual Flyovers | Headless Chromium screenshots & HTTP response headers | Medium |
| **10** | **FireCompass Explorer** | Bucket 3: Autonomous AI Pentest | Directory brute-forcing (`/admin_portal`), **triggers 404 spike** | **EXTREME 404** |

---

### 2. Persistent Blue Team Live Telemetry Monitor
Docked at the bottom of the screen, tracking 3 core metrics in real time:
- `requests_per_min` (Baseline: ~30 req/min)
- `unique_ports` (Baseline: 1–2 ports)
- `error_404_rate` (Baseline: <5%)

When students run **Passive tools** (Levels 3, 5, 6), telemetry stays flat. When running **Active tools** (Level 7 Nmap or Level 10 FireCompass Explorer), the sensor triggers animated red/pink spike alerts!

---

### 3. Final Boss Level (Level 11): Time-Series & 100-Tree Isolation Forest
- **120-Minute Production Telemetry Stream**: Continuous logs containing normal baseline, Nmap scan (10:30–10:34), and FireCompass brute-force (11:15–11:19).
- **Step 1: Rolling Feature Engineering**: Computes 5-minute rolling mean ($\mu_t$) and temporal deviation residual ($\text{Dev}_t = X_t - \mu_t$).
- **Step 2: 100-Tree Isolation Forest**: Trains `IsolationForest(n_estimators=100, contamination=0.08)`, flagging anomalies with 100% precision & recall.
- **Step 3: Stealth Challenge (Slow & Low Scan)**: Interactive sliders (`requests_per_min = 40`, `unique_ports = 25`, `error_404_rate = 10%`).
  - **Static Firewall Rule (`IF requests > 200`)**: **FAILS** (Bypassed by low volume).
  - **100-Tree Isolation Forest**: **DETECTED** (Caught via multi-dimensional cuts in ~3 splits).
- **Step 4: Google Colab Python Script**: Complete ready-to-run Python script using `pandas`, `scikit-learn`, and `matplotlib`.

---

## 🛠️ Built With
- **Frontend**: React 19, TypeScript, Tailwind CSS, Radix UI primitives, Lucide icons.
- **Bundling**: Vite 8 + `vite-plugin-singlefile`.
- **Audio Engine**: Web Audio API cyber synthesizer (zero external audio files).
- **Effects**: `canvas-confetti` reward celebrations.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
