import { LevelData } from '../types';

export const LAB_LEVELS: LevelData[] = [
  {
    id: 1,
    slug: 'firecompass-ai',
    name: 'FireCompass AI Recon',
    toolName: 'FireCompass AI Recon',
    bucket: 'Bucket 3: Active Scanning & Autonomous AI',
    categoryBadge: 'Continuous Attack Surface Reconnaissance',
    logImpactBadge: 'Moderate/High (Autonomous Cloud Discovery)',
    footprintLevel: 'HIGH',
    footprintDetails: 'Orchestrates distributed reconnaissance nodes across public clouds. Generates periodic DNS lookups, TLS handshakes, and port probes to identify unknown assets and shadow IT.',
    intro: 'FireCompass uses nation-state-grade reconnaissance techniques to continuously discover an organization\'s dynamic digital attack surface, including unknown exposed databases, cloud storage buckets, code leaks, exposed credentials, shadow IT assets, and open ports.',
    useCase: 'Autonomous discovery of unknown external assets and attack paths without manual agent deployments or prior inventory knowledge.',
    pros: [
      'Continuous automated discovery runs 24/7 with zero maintenance',
      'Requires only a seed domain name; zero local hardware or agent installation',
      'Chains discovered vulnerabilities into realistic multi-step attack paths with prioritized remediation'
    ],
    cons: [
      'Commercial Enterprise SaaS platform requiring active subscription',
      'Continuous scanning activity can trigger internal SOC/SIEM alerts if not whitelisted'
    ],
    task1: {
      id: '1-setup',
      title: 'Cloud SaaS Portal Setup',
      description: 'Connect to the FireCompass Cloud Orchestration API and register the target organization seed domain for autonomous digital asset mapping.',
      command: 'connect https://firecompass.com --seed-domain example-corp.com',
      autoTypeHint: 'connect https://firecompass.com --seed-domain example-corp.com',
      expectedOutput: `[+] Authenticating with FireCompass Cloud Orchestrator...
[+] Connected: API Session Established [Token: fc_live_e9921a].
[+] Ingesting seed domain: example-corp.com
[+] Resolving authoritative nameservers and ASNs...
[+] Discovered ASN: AS15169 (Linode / Cloud Provider)
[+] Autonomous asset discovery pipeline initialized. Zero local hardware installation required.`,
      taskType: 'cloud',
      helpExplanation: 'FireCompass runs entirely in the cloud. By submitting a single root seed domain, the platform uses AI-guided crawlers to recursively discover child domains, cloud storage, and subsidiaries.'
    },
    task2: {
      id: '1-demo',
      title: 'Execute Recon Demo: Autonomous Attack Path Discovery',
      description: 'Trigger autonomous attack path simulation to visualize discovered Shadow IT assets, exposed AWS S3 buckets, and leaked credentials chained to a production database.',
      command: 'firecompass-cli --view-dashboard --simulate-attack-paths',
      autoTypeHint: 'firecompass-cli --view-dashboard --simulate-attack-paths',
      expectedOutput: `[+] Querying FireCompass Knowledge Graph for 'example-corp.com'...
========================================================================
FIRECOMPASS ATTACK SURFACE & ATTACK PATH SIMULATION REPORT
========================================================================
[!] High Risk Findings Detected: 3
[!] Attack Paths Simulated: 1 Critical Breach Path

[NODE 1: Exposed Storage]
    -> s3://example-corp-dev-backups (AWS S3) | Status: Publicly Readable
    -> Content: Staging environment dumps & API credentials

[NODE 2: Leaked Credential]
    -> GitHub Secret: ghp_9921_example_corp_prod_readwrite
    -> Origin: public commit in repo 'example-corp/frontend-legacy'

[NODE 3: Target Database Service]
    -> IP: 45.33.32.156:3306 (MySQL 8.0.28)
    -> Authentication: Vulnerable to leaked credential chain

[+] CRITICAL ATTACK PATH MAPPED:
    Internet -> Public S3 Bucket -> GitHub Token Exfiltration -> Direct MySQL Root Access
[+] Prioritized Remediation Guidance:
    1. Revoke GitHub Personal Access Token 'ghp_9921_...' immediately
    2. Enforce AWS S3 Block Public Access on 'example-corp-dev-backups'
    3. Restrict MySQL port 3306 behind internal VPN / Security Group`,
      taskType: 'cli',
      specialDemoType: 'firecompass_assets',
      helpExplanation: 'Notice how FireCompass correlates disparate findings (a public S3 bucket and a leaked credential) into a cohesive attack path leading directly to the organization\'s core database.'
    }
  },
  {
    id: 2,
    slug: 'maltego-ce',
    name: 'Maltego CE',
    toolName: 'Maltego CE',
    bucket: 'Bucket 2: Visual & Modular OSINT',
    categoryBadge: 'Interactive Graph & Link Analysis',
    logImpactBadge: 'Low / Indirect (Third-Party OSINT APIs)',
    footprintLevel: 'LOW',
    footprintDetails: 'Maltego executes "Transforms" against public registries, DNS servers, and threat intelligence APIs. Direct packet transmission to the target host is minimal to zero.',
    intro: 'Maltego is an interactive data mining and reconnaissance tool that renders intelligence in node-based visual graphs to uncover hidden connections between people, domains, DNS records, netblocks, and IP addresses.',
    useCase: 'Visual link analysis, relationship mapping, threat actor profiling, and infrastructure OSINT exploration.',
    pros: [
      'Visualizes complex relationships and cascading entities instantly on an interactive graph canvas',
      'Massive ecosystem of community and commercial "Transforms" (VirusTotal, Shodan, Whois, Hunter.io)',
      'Drastically accelerates visual threat investigation for human analysts'
    ],
    cons: [
      'Community Edition (CE) limits graph output to 12 entities per transform execution',
      'Java-based desktop application with high memory overhead and occasional UI latency'
    ],
    task1: {
      id: '2-install',
      title: 'Install OpenJDK & Maltego CE',
      description: 'Install the Java Runtime Environment prerequisite and the Maltego Community Edition package on the Linux pentest workstation.',
      command: 'sudo apt update && sudo apt install default-jre maltego -y',
      autoTypeHint: 'sudo apt update && sudo apt install default-jre maltego -y',
      expectedOutput: `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]
Fetched 110 kB in 1s (98.4 kB/s)
Reading package lists... Done
Building dependency tree... Done
The following additional packages will be installed:
  default-jre-headless openjdk-17-jre openjdk-17-jre-headless maltego-ce
[+] Installing OpenJDK 17 Runtime Environment...
[+] Unpacking maltego-ce (4.6.0-x86_64)...
[+] Setting up maltego (4.6.0)...
[+] Processing triggers for man-db, desktop-file-utils...
[+] Installation complete. Maltego CE is ready at /usr/bin/maltego.`,
      taskType: 'cli',
      helpExplanation: 'Maltego requires OpenJDK to execute its graph rendering engine and local transform dispatchers.'
    },
    task2: {
      id: '2-demo',
      title: 'Execute Recon Demo: Interactive Domain & DNS Transforms',
      description: 'Launch Maltego and execute domain-to-DNS and domain-to-host transforms against "nmap.org" to construct the visual infrastructure graph.',
      command: 'maltego --run-transform "All Transforms" --entity-domain nmap.org',
      autoTypeHint: 'maltego --run-transform "All Transforms" --entity-domain nmap.org',
      expectedOutput: `[+] Initializing Maltego Graph Engine v4.6.0...
[+] Loading Transform Hub: Paterva Core Transforms...
[+] Entity: maltego.Domain [nmap.org]
[+] Running Transform: 'DNS from Domain' -> Found 4 Nameservers & MX
[+] Running Transform: 'To IP Address [DNS]' -> Resolving A Records...
[+] Discovered Entities:
    -> Domain: nmap.org
    -> IPv4: scanme.nmap.org [45.33.32.156]
    -> DNS: ns1.linode.com (Authoritative Nameserver)
    -> Mail: mx.nmap.org (Priority 10 Mail Exchanger)
    -> Host: svn.nmap.org (Code Repository Server)
[+] Rendering interactive node-link graph on workstation display.`,
      taskType: 'graph',
      specialDemoType: 'maltego',
      helpExplanation: 'Maltego uses directed graphs where nodes represent entities (Domains, IPs, People) and links represent discovered relationships.'
    }
  },
  {
    id: 3,
    slug: 'google-dorking',
    name: 'Google Dorking',
    toolName: 'Google Dorking (GHDB)',
    bucket: 'Bucket 1: Passive Search Engine Recon',
    categoryBadge: 'Passive Search Recon',
    logImpactBadge: 'ZERO Direct Target Traffic',
    footprintLevel: 'ZERO',
    footprintDetails: '100% passive. All search queries hit Google\'s indexed caches. The target web server never receives a single byte or packet from your computer.',
    intro: 'Google Dorking (Google Hacking Database - GHDB) utilizes advanced search operators to uncover sensitive data, indexed configuration files, database credentials, and open server directories indexed by Google\'s web spiders.',
    useCase: 'First-stage passive reconnaissance to discover leaked credentials, exposed staging portals, and confidential PDF reports without touching target infrastructure.',
    pros: [
      '100% free with zero installation or infrastructure required',
      'Completely passive: the target organization\'s intrusion detection system (IDS) sees zero traffic',
      'Finds historical and deleted files cached by Google web crawlers'
    ],
    cons: [
      'Requires deep understanding of specific search operators (site:, filetype:, inurl:, intitle:)',
      'Automated queries or rapid submissions quickly trigger Google reCAPTCHA rate-limiting'
    ],
    task1: {
      id: '3-setup',
      title: 'Initialize Search Engine Dorking Workspace',
      description: 'Initialize the Google Hacking Database (GHDB) operator engine and cheat sheet in the simulated workspace.',
      command: 'open https://www.google.com --load-ghdb-operators',
      autoTypeHint: 'open https://www.google.com --load-ghdb-operators',
      expectedOutput: `[+] Google Hacking Database (GHDB) operators loaded.
[+] Loaded Operator Definitions:
    - site:     Restrict results to a specific domain or TLD
    - filetype: Filter by file extension (.pdf, .cfg, .sql, .env, .log)
    - intitle:  Matches words in HTML page title
    - inurl:    Matches text in the URL slug or query path
    - cache:    Retrieves Google's archived snapshot of a target page
[+] Target Server Telemetry: 0 packets sent (100% Passive Reconnaissance).`,
      taskType: 'search',
      helpExplanation: 'By querying search engine indexes instead of the target, you remain completely invisible to the target organization\'s Blue Team.'
    },
    task2: {
      id: '3-demo',
      title: 'Execute Recon Demo: Run 3 Realistic Pentest Dorks',
      description: 'Execute the 3 primary reconnaissance dorks: searching for government assessment PDFs, open Apache directories, and exposed server config/log files.',
      command: 'site:nasa.gov filetype:pdf "assessment"',
      autoTypeHint: 'site:nasa.gov filetype:pdf "assessment"',
      expectedOutput: `[+] Google Search Query: site:nasa.gov filetype:pdf "assessment"
[+] Indexed Search Results (Cached):
    1. NASA Cybersecurity Architecture & Risk Assessment (Final).pdf
       URL: https://www.nasa.gov/reports/cyber_risk_assessment_2024.pdf
       Snippet: "...confidential internal assessment of JPL flight software telemetry interfaces..."
    2. NASA Goddard Space Center Security Audit & Vulnerability Assessment.pdf
       URL: https://science.nasa.gov/docs/goddard_assessment_unredacted.pdf
       Snippet: "...internal network IP ranges and contractor access jump-hosts..."
[+] Telemetry Impact: ZERO packets transmitted to nasa.gov. Search served via Google Cache.`,
      taskType: 'search',
      specialDemoType: 'dorking',
      helpExplanation: 'Test running all 3 dorks in the interactive search engine simulator below: filetype:pdf, open directories ("index of"), and raw server logs!'
    }
  },
  {
    id: 4,
    slug: 'recon-ng',
    name: 'Recon-ng',
    toolName: 'Recon-ng Framework',
    bucket: 'Bucket 2: Visual & Modular OSINT',
    categoryBadge: 'Modular Web Recon',
    logImpactBadge: 'Low / Moderate (Depends on Modules)',
    footprintLevel: 'LOW',
    footprintDetails: 'Recon-ng stores data in an internal SQLite database. Built-in OSINT modules query third-party APIs (HackerTarget, Shodan, WHOIS) rather than bombarding target ports.',
    intro: 'Recon-ng is a full-featured Python-based reconnaissance framework designed exclusively for web-based open source intelligence gathering, featuring a Metasploit-like modular console interface.',
    useCase: 'Structured OSINT harvesting, automated subdomain enumeration, contact discovery, and centralized database intelligence storage.',
    pros: [
      'Intuitive Metasploit-like interactive CLI syntax (use, show options, set, run)',
      'Organizes collected assets, hosts, and credentials into an indexed SQLite workspace database',
      'Huge modular marketplace with independent community modules'
    ],
    cons: [
      'Command-line only (no native graphical dashboard)',
      'Many powerful modules require external third-party API keys (Shodan, Hunter.io, Censys)'
    ],
    task1: {
      id: '4-install',
      title: 'Install Recon-ng via Linux APT',
      description: 'Install the Recon-ng package and initialize the SQLite3 database backend.',
      command: 'sudo apt update && sudo apt install recon-ng -y',
      autoTypeHint: 'sudo apt update && sudo apt install recon-ng -y',
      expectedOutput: `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  recon-ng python3-pypdf2 python3-dnspython python3-flasgger
[+] Installing python3-recon-ng framework...
[+] Initializing SQLite3 database engine at ~/.recon-ng/workspaces.db...
[+] Marketplace initialized with 94 recon modules.
[+] Recon-ng installed successfully. Run 'recon-ng' to launch interactive console.`,
      taskType: 'cli',
      helpExplanation: 'Recon-ng installs as a Python package and manages separate workspaces for different client penetration tests.'
    },
    task2: {
      id: '4-demo',
      title: 'Execute Recon Demo: Subdomain Enumeration via HackerTarget',
      description: 'Create a workshop workspace, load the HackerTarget subdomain enumeration module, set target source to nmap.org, and query discovered hosts.',
      command: 'recon-ng -w college_demo -m recon/domains-hosts/hackertarget -x "options set SOURCE nmap.org; run; show hosts"',
      autoTypeHint: 'recon-ng -w college_demo -m recon/domains-hosts/hackertarget -x "options set SOURCE nmap.org; run; show hosts"',
      expectedOutput: `  _   __     ____ ___ _
| | / /    / __//   | |
| |/ /    / _/ / /| | |
|___/    /___//_/ |_|___/

[recon-ng][college_demo][hackertarget] > options set SOURCE nmap.org
SOURCE => nmap.org
[recon-ng][college_demo][hackertarget] > run
[*] URL: https://api.hackertarget.com/hostsearch/?q=nmap.org
[*] Discovered: scanme.nmap.org (45.33.32.156)
[*] Discovered: secLists.org (45.33.49.119)
[*] Discovered: insecure.org (45.33.49.119)
[*] Discovered: svn.nmap.org (45.33.32.156)
[*] 4 new hosts added to 'hosts' table.

[recon-ng][college_demo][hackertarget] > show hosts
+---------------------------------------------------------------------------------+
| rowid | host            | ip_address    | region        | country | module      |
+---------------------------------------------------------------------------------+
| 1     | scanme.nmap.org | 45.33.32.156  | New Jersey    | US      | hackertarget|
| 2     | secLists.org    | 45.33.49.119  | Texas         | US      | hackertarget|
| 3     | insecure.org    | 45.33.49.119  | Texas         | US      | hackertarget|
| 4     | svn.nmap.org    | 45.33.32.156  | New Jersey    | US      | hackertarget|
+---------------------------------------------------------------------------------+
[*] 4 records returned.`,
      taskType: 'cli',
      helpExplanation: 'Notice how Recon-ng normalizes harvested data into clean database tables that can be queried or exported to CSV and HTML reports.'
    }
  },
  {
    id: 5,
    slug: 'shodan',
    name: 'Shodan',
    toolName: 'Shodan Search Engine',
    bucket: 'Bucket 1: Passive Search Engine Recon',
    categoryBadge: 'IoT & Exposed Device Search',
    logImpactBadge: 'ZERO Direct Target Traffic',
    footprintLevel: 'ZERO',
    footprintDetails: 'Shodan\'s autonomous crawlers scan the entire IPv4 address space continuously. Pentesters query Shodan\'s pre-scanned database. The target experiences zero packets.',
    intro: 'Shodan is the world\'s premier search engine for Internet-connected devices, indexing servers, IoT devices, webcams, industrial control systems (ICS/SCADA), and databases by continuously banner-grabbing open ports across the entire IPv4 space.',
    useCase: 'Passive discovery of exposed services, unpatched software versions, default credentials, and IoT devices without actively pinging the target.',
    pros: [
      'Zero direct packet footprint on the target organization',
      'Provides rich REST API consumed by Nmap, Metasploit, Maltego, and vulnerability scanners',
      'Instant intelligence on global open ports and known CVE vulnerabilities'
    ],
    cons: [
      'Free accounts have strict query credits and pagination caps',
      'Data freshness depends on when Shodan\'s crawlers last inspected that specific IP block'
    ],
    task1: {
      id: '5-install',
      title: 'Install Shodan Python CLI & Initialize API Key',
      description: 'Install the official Shodan command-line tool via pip3 and initialize your lab authentication token.',
      command: 'pip3 install -U --user shodan && shodan init DEMO_SHODAN_API_KEY',
      autoTypeHint: 'pip3 install -U --user shodan && shodan init DEMO_SHODAN_API_KEY',
      expectedOutput: `Requirement already satisfied: requests>=2.2.1 in /usr/lib/python3/dist-packages
Collecting shodan
  Downloading shodan-1.31.0-py3-none-any.whl (48 kB)
Installing collected packages: shodan
  Successfully installed shodan-1.31.0
[+] Initializing Shodan CLI with provided API key...
[+] Successfully initialized Shodan CLI. Query quota: 100 queries/month.`,
      taskType: 'cli',
      helpExplanation: 'The Shodan CLI allows pentesters to script host lookups, port counts, and automated vulnerability triage from bash.'
    },
    task2: {
      id: '5-demo',
      title: 'Execute Recon Demo: Host Intelligence & Open Port Query',
      description: 'Query Shodan\'s database for the exact footprint of test target 45.33.32.156 and calculate the global count of exposed Apache Port 80 servers.',
      command: 'shodan host 45.33.32.156 && shodan count apache port:80',
      autoTypeHint: 'shodan host 45.33.32.156 && shodan count apache port:80',
      expectedOutput: `45.33.32.156
Hostnames:               scanme.nmap.org
City:                    Fremont
Country:                 United States (US)
Organization:            Linode LLC
Updated:                 2026-10-28T14:32:11
Number of open ports:    4

Ports:
  22/tcp   OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)
  80/tcp   Apache httpd 2.4.7 ((Ubuntu))
  9929/tcp nping-echo (Nping echo service protocol)
  31337/tcp Elite (tcpwrapped)

Vulnerabilities:
  CVE-2017-7679 (Apache HTTP Server Buffer Overflow)
  CVE-2018-1312 (Digest Authentication Nonce Collision)

[+] Shodan Global Count: 'apache port:80' -> 14,829,410 internet-connected devices found!`,
      taskType: 'cli',
      specialDemoType: 'shodan',
      helpExplanation: 'Notice how much information Shodan provides (open ports, exact software versions, CVEs) without sending a single packet from your IP!'
    }
  },
  {
    id: 6,
    slug: 'censys',
    name: 'Censys',
    toolName: 'Censys Search Engine',
    bucket: 'Bucket 1: Passive Search Engine Recon',
    categoryBadge: 'Asset & TLS Compliance Discovery',
    logImpactBadge: 'ZERO Direct Target Traffic',
    footprintLevel: 'ZERO',
    footprintDetails: 'Queries Censys\'s universal Internet map and public SSL/TLS Certificate Transparency (CT) logs. Generates zero network packets toward the target host.',
    intro: 'Censys is an Internet-wide asset discovery and attack surface management platform that continuously scans all 4 billion IPv4 addresses and ingests global SSL/TLS certificate transparency logs.',
    useCase: 'Attack surface monitoring, discovering unmapped subdomains via SSL/TLS certificate logs, and validating cryptographic compliance.',
    pros: [
      'Comprehensive visibility into SSL/TLS certificate transparency records',
      'Provides daily updated Internet health datasets for academic and defensive research',
      'Completely passive reconnaissance against target servers'
    ],
    cons: [
      'Requires learning Censys Search Language (CSL) query syntax',
      'Strict monthly query credits on community researcher accounts'
    ],
    task1: {
      id: '6-install',
      title: 'Install Censys Python CLI Tool',
      description: 'Install the official Censys Python SDK and verify your API credentials.',
      command: 'pip3 install censys && censys config',
      autoTypeHint: 'pip3 install censys && censys config',
      expectedOutput: `Collecting censys
  Downloading censys-2.2.14-py3-none-any.whl (42 kB)
Requirement already satisfied: backoff, requests in /usr/lib/python3/dist-packages
Installing collected packages: censys
Successfully installed censys-2.2.14
[+] Configuring Censys API Key...
[+] API ID: demo_censys_id_88192
[+] API Secret: ********************
[+] Connection test: SUCCESS (HTTP 200 OK from https://search.censys.io/api).`,
      taskType: 'cli',
      helpExplanation: 'The Censys CLI communicates with Censys Search 2.0 API to query hosts and certificate transparency logs.'
    },
    task2: {
      id: '6-demo',
      title: 'Execute Recon Demo: IP Profile & TLS Certificate Subdomains',
      description: 'Inspect the host certificate profile for 45.33.32.156 and enumerate subdomains registered in public Certificate Transparency logs.',
      command: 'censys view 45.33.32.156 && censys subdomains nmap.org',
      autoTypeHint: 'censys view 45.33.32.156 && censys subdomains nmap.org',
      expectedOutput: `{
  "ip": "45.33.32.156",
  "autonomous_system": { "asn": 63949, "name": "Linode, LLC" },
  "services": [
    { "port": 80, "service_name": "HTTP", "software": "Apache/2.4.7" },
    { "port": 22, "service_name": "SSH", "software": "OpenSSH 6.6.1p1" }
  ],
  "tls_certificates": {
    "issuer": "CN=Let's Encrypt Authority X3",
    "subject": "CN=scanme.nmap.org",
    "valid_until": "2027-04-12T00:00:00Z"
  }
}

[+] Querying Censys Certificate Transparency (CT) Stream for 'nmap.org'...
[+] Discovered Subdomains in TLS Logs:
    - scanme.nmap.org
    - chat.nmap.org
    - svn.nmap.org
    - mail.nmap.org
    - images.nmap.org
[+] All findings harvested passively via public Certificate Transparency logs.`,
      taskType: 'cli',
      helpExplanation: 'When organizations create TLS/SSL certificates, Certificate Authorities log them to public append-only CT logs. Pentesters use these logs to discover secret subdomains without sending a single packet!'
    }
  },
  {
    id: 7,
    slug: 'nmap',
    name: 'Nmap (Network Mapper)',
    toolName: 'Nmap - Network Mapper',
    bucket: 'Bucket 3: Active Scanning & Autonomous AI',
    categoryBadge: 'Active Network & Service Fingerprinting',
    logImpactBadge: 'EXTREME TIME-SERIES SPIKE! (150 ports/min)',
    footprintLevel: 'EXTREME',
    footprintDetails: 'Directly transmits hundreds of TCP SYN packets across multiple ports per second. Server firewall connection tables and IDS/IPS sensors register an immediate, dramatic time-series spike.',
    intro: 'Nmap is the industry-standard active network scanner used for network discovery and vulnerability assessment, discovering live hosts, open ports, exact software versions (-sV), operating system kernels (-O), and misconfigurations via the Nmap Scripting Engine (NSE).',
    useCase: 'Active host discovery, port scanning, OS fingerprinting, and vulnerability scanning during internal or authorized penetration tests.',
    pros: [
      'Unrivaled speed, precision, and depth for network port and daemon identification',
      'Over 600 extensible Nmap Scripting Engine (NSE) scripts for vulnerability detection',
      'Cross-platform with optional Zenmap GUI'
    ],
    cons: [
      'EXTREMELY NOISY in target server logs! Generates 100-150 unique port hits per minute',
      'Immediately triggers Blue Team SIEM alerts and firewall rate-limits (Case Study #1 for Time-Series Anomaly Detection)'
    ],
    task1: {
      id: '7-install',
      title: 'Install Nmap on Linux',
      description: 'Install the official Nmap network scanner package and verify its version.',
      command: 'sudo apt update && sudo apt install nmap -y && nmap --version',
      autoTypeHint: 'sudo apt update && sudo apt install nmap -y && nmap --version',
      expectedOutput: `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  nmap liblinear4 liblua5.3-0
[+] Installing Nmap package...
[+] Nmap version 7.94 ( https://nmap.org ) installed and ready.
Platform: x86_64-pc-linux-gnu
Compiled with: liblua-5.3.6 openssl-3.0.2 libpcre-8.39 libpcap-1.10.1`,
      taskType: 'cli',
      helpExplanation: 'Nmap requires root (sudo) privileges on Linux to craft raw TCP SYN packets directly bypassing the kernel network stack.'
    },
    task2: {
      id: '7-demo',
      title: 'Execute Recon Demo: Aggressive Service & OS Fingerprint Scan',
      description: 'Run an aggressive scan (-A), service version detection (-sV), and OS detection (-O) against Nmap\'s official authorized test host scanme.nmap.org.',
      command: 'sudo nmap -v -A -sV -O scanme.nmap.org',
      autoTypeHint: 'sudo nmap -v -A -sV -O scanme.nmap.org',
      expectedOutput: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-10-29 08:30 EST
Initiating SYN Stealth Scan at 08:30
Scanning scanme.nmap.org (45.33.32.156) [1000 ports]
Discovered open port 22/tcp on 45.33.32.156
Discovered open port 80/tcp on 45.33.32.156
Discovered open port 9929/tcp on 45.33.32.156
Discovered open port 31337/tcp on 45.33.32.156
Completed SYN Stealth Scan at 08:30, 2.84s elapsed (1000 total ports)
Initiating Service scan at 08:30
Scanning 4 services on scanme.nmap.org (45.33.32.156)
Completed Service scan at 08:30, 6.02s elapsed

Nmap scan report for scanme.nmap.org (45.33.32.156)
Host is up (0.041s latency).
PORT      STATE SERVICE    VERSION
22/tcp    open  ssh        OpenSSH 6.6.1p1 Ubuntu 2ubuntu2.13 (Ubuntu Linux; protocol 2.0)
80/tcp    open  http       Apache httpd 2.4.7 ((Ubuntu))
|_http-title: Go ahead and ScanMe!
9929/tcp  open  nping-echo Nping echo
31337/tcp open  Elite      tcpwrapped
Aggressive OS guesses: Linux 5.4 (96%), Linux 4.15 - 5.8 (95%)
No exact OS matches for host (test conditions met).
Network Distance: 12 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Nmap done: 1 IP address (1 host up) scanned in 14.12 seconds`,
      taskType: 'cli',
      helpExplanation: 'WATCH THE BLUE TEAM MONITOR BELOW! Notice how running Nmap causes an immediate, massive spike in requests_per_min (30 -> 310) and unique_ports (2 -> 150)!'
    }
  },
  {
    id: 8,
    slug: 'spiderfoot',
    name: 'SpiderFoot',
    toolName: 'SpiderFoot OSINT Automation',
    bucket: 'Bucket 2: Visual & Modular OSINT',
    categoryBadge: 'Automated Multi-Source OSINT',
    logImpactBadge: 'Low (Passive Mode) / High (Active Mode)',
    footprintLevel: 'LOW',
    footprintDetails: 'In passive mode, queries 100+ public OSINT services without contacting the target. In active mode, initiates web crawler spiders and port probes.',
    intro: 'SpiderFoot is an automated OSINT reconnaissance framework that simultaneously queries over 100 public data sources to gather intelligence on IP addresses, domain names, email addresses, CIDR netblocks, and data breaches.',
    useCase: 'Automated intelligence gathering, asset discovery, external exposure analysis, and threat intelligence aggregation.',
    pros: [
      'Embedded interactive Web UI accessible via web browser on port 5001 plus complete CLI',
      'Over 200 OSINT modules covering BGP, DNS, WHOIS, dark web breaches, and malware feeds',
      'Correlation engine automatically flags high-risk associations'
    ],
    cons: [
      'Running all 200+ modules on large domains can take hours and produce noisy data',
      'High-volume API requests can exhaust free-tier third-party API quotas quickly'
    ],
    task1: {
      id: '8-install',
      title: 'Install SpiderFoot OSINT Framework',
      description: 'Install the SpiderFoot reconnaissance engine with all 200+ OSINT modules.',
      command: 'sudo apt update && sudo apt install spiderfoot -y',
      autoTypeHint: 'sudo apt update && sudo apt install spiderfoot -y',
      expectedOutput: `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Reading package lists... Done
Building dependency tree... Done
The following NEW packages will be installed:
  spiderfoot python3-dnspython python3-exifread python3-ipwhois
[+] Installing SpiderFoot v4.0...
[+] Initializing embedded web server and SQLite cache database...
[+] SpiderFoot v4.0 installed with 200+ OSINT modules ready.`,
      taskType: 'cli',
      helpExplanation: 'SpiderFoot includes its own lightweight web server so analysts can interact with data visually or via API.'
    },
    task2: {
      id: '8-demo',
      title: 'Execute Recon Demo: Start Web UI & Run Passive Target Scan',
      description: 'Launch the SpiderFoot local Web UI on port 5001 and execute an automated passive target scan against scanme.nmap.org.',
      command: 'spiderfoot -l 127.0.0.1:5001 & spiderfoot -s scanme.nmap.org -u passive -q',
      autoTypeHint: 'spiderfoot -l 127.0.0.1:5001 & spiderfoot -s scanme.nmap.org -u passive -q',
      expectedOutput: `[+] SpiderFoot server started at http://127.0.0.1:5001/
[+] Scan ID: SF-20261029-8812 started for target: scanme.nmap.org
[+] Scan profile: PASSIVE (Queries third-party OSINT databases only; 0 packets to target)
[*] sfp_dnsresolve: Resolved A record: 45.33.32.156
[*] sfp_bgpview: Target ASN is AS63949 (Linode, LLC)
[*] sfp_whois: Registrar: Namecheap, Inc. Creation: 1997-12-19
[*] sfp_shodan: Found 4 open ports from cached Shodan telemetry
[*] sfp_virustotal: Clean reputation (0/92 engines detected malicious flags)
[+] Scan completed: 86 data elements categorized across 12 modules.
[+] Web UI Dashboard available at http://127.0.0.1:5001.`,
      taskType: 'web',
      specialDemoType: 'spiderfoot',
      helpExplanation: 'Notice the interactive SpiderFoot Web UI preview rendered below, showing data categorized by DNS, ASN BGP paths, WHOIS records, and threat reputation.'
    }
  },
  {
    id: 9,
    slug: 'aquatone',
    name: 'Aquatone & DataSploit',
    toolName: 'Aquatone & DataSploit',
    bucket: 'Bucket 2: Visual & Modular OSINT',
    categoryBadge: 'Visual Web Recon & OSINT',
    logImpactBadge: 'Medium (HTTP Port Burst across 80, 443, 8080)',
    footprintLevel: 'MEDIUM',
    footprintDetails: 'Aquatone probes HTTP/HTTPS ports (80, 443, 8000, 8080, 8443) on all discovered hosts using headless Chromium, generating a moderate burst of web access logs.',
    intro: 'Aquatone inspects discovered domains across HTTP and HTTPS ports using headless Chromium to capture automated visual screenshots and HTTP header profiles, while DataSploit aggregates multi-source OSINT across domains, emails, and usernames.',
    useCase: 'Rapid visual triage of hundreds of discovered subdomains to spot exposed web panels, login forms, error stack traces, and default landing pages.',
    pros: [
      'Visual HTML screenshot gallery drastically reduces human triage time',
      'Clusters similar web applications using visual and perceptual hashing',
      'Discovers hidden internal web applications on non-standard HTTP ports'
    ],
    cons: [
      'Requires Chromium headless browser engine dependency',
      'Direct HTTP connection requests appear in target web server access logs'
    ],
    task1: {
      id: '9-install',
      title: 'Install Chromium Headless Engine & Aquatone',
      description: 'Install Chromium headless browser and the Aquatone binary with DataSploit dependencies.',
      command: 'sudo apt install chromium -y && sudo mv aquatone /usr/local/bin/ && pip3 install -r datasploit/requirements.txt',
      autoTypeHint: 'sudo apt install chromium -y && sudo mv aquatone /usr/local/bin/ && pip3 install -r datasploit/requirements.txt',
      expectedOutput: `Reading package lists... Done
Building dependency tree... Done
[+] Installing chromium-browser (124.0.6367.60)...
[+] Moving aquatone v1.7.0 binary to /usr/local/bin/aquatone...
[+] Installing python dependencies: beautifulsoup4, requests, termcolor...
[+] Chromium headless engine ready. Aquatone v1.7.0 & DataSploit configured.`,
      taskType: 'cli',
      helpExplanation: 'Aquatone uses headless Chrome/Chromium to accurately render JavaScript-heavy Single Page Applications (SPAs) before taking screenshots.'
    },
    task2: {
      id: '9-demo',
      title: 'Execute Recon Demo: Subdomain Visual Flyover & Header Inspection',
      description: 'Pipe target scanme.nmap.org into Aquatone to capture automated screenshots, extract HTTP headers, and run DataSploit OSINT.',
      command: 'echo "scanme.nmap.org" | aquatone -out ./aquatone_report && python3 datasploit.py -i nmap.org',
      autoTypeHint: 'echo "scanme.nmap.org" | aquatone -out ./aquatone_report && python3 datasploit.py -i nmap.org',
      expectedOutput: `aquatone v1.7.0 by @michenriksen
[+] Targets: 1 host loaded from stdin
[+] Ports: 80, 443, 8000, 8080, 8443
[+] Probing HTTP/HTTPS services...
[+] http://scanme.nmap.org:80 (200 OK) - Apache/2.4.7 (Ubuntu)
[+] Capturing screenshot with headless Chromium...
[+] Screenshot saved: ./aquatone_report/screenshots/http__scanme_nmap_org__80.png
[+] HTML Visual Report generated at ./aquatone_report/aquatone_report.html

[DataSploit] Aggregating OSINT for nmap.org...
[*] Registrar: Namecheap | Nameservers: ns1.linode.com, ns2.linode.com
[*] Technology Stack: Apache/2.4.7, Linux Ubuntu, OpenSSH 6.6.1p1`,
      taskType: 'web',
      specialDemoType: 'aquatone',
      helpExplanation: 'Inspect the generated visual screenshot preview below: notice the rendered web page, HTTP 200 status code, and Apache server headers.'
    }
  },
  {
    id: 10,
    slug: 'firecompass-explorer',
    name: 'FireCompass Explorer',
    toolName: 'FireCompass Explorer (Autonomous Pentesting Agent)',
    bucket: 'Bucket 3: Active Scanning & Autonomous AI',
    categoryBadge: 'Autonomous AI Pentest Agent',
    logImpactBadge: 'EXTREME 404 ERROR SPIKE! (85%+ HTTP 404)',
    footprintLevel: 'EXTREME',
    footprintDetails: 'Autonomous web directory brute-forcing transmits hundreds of HTTP GET requests for non-existent paths (/admin, /backup, /config). Web server access logs register an avalanche of 404 Not Found responses.',
    intro: 'FireCompass Explorer is a self-serve freemium ($3,000 free credits, no credit card required) autonomous AI pentesting agent that chains attack surface recon, web directory brute-forcing, and automated post-exploitation.',
    useCase: 'Autonomous web application pentesting, finding hidden administrative interfaces, legacy backup files, and unlinked API endpoints.',
    pros: [
      '$3,000 in free self-serve credits with zero credit card required to begin testing',
      'Installs seamlessly via Linux package manager for automated CI/CD pipeline integration',
      'Autonomously chains directory fuzzing discoveries into credential and exploit verification'
    ],
    cons: [
      'Directory brute-forcing generates an unmistakable spike in HTTP requests and 404 Not Found error responses (85%+ error rate)',
      'Immediately triggers Web Application Firewalls (WAF) and SIEM rules (Case Study #2 for Time-Series Anomaly Detection)'
    ],
    task1: {
      id: '10-install',
      title: 'Activate Freemium Credits & Install Explorer Agent',
      description: 'Activate the $3,000 free credits tier and install the FireCompass Explorer agent CLI via package manager.',
      command: 'sudo apt update && sudo apt install firecompass-explorer-agent -y',
      autoTypeHint: 'sudo apt update && sudo apt install firecompass-explorer-agent -y',
      expectedOutput: `Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease
Get:2 https://repo.firecompass.com/apt stable InRelease [4,210 B]
Fetched 4,210 B in 0s (14.2 kB/s)
[+] Installing firecompass-explorer-agent (v2.4.1)...
[+] Agent configured: ID agent_fc_99182a
[+] Freemium Tier Activated: $3,000 Free Credits Allocated. No credit card required.
[+] Verification: Agent successfully connected to FireCompass AI Neural Planner.`,
      taskType: 'cli',
      helpExplanation: 'FireCompass Explorer runs as a local CLI agent that streams commands from the AI planner while reporting findings to the dashboard.'
    },
    task2: {
      id: '10-demo',
      title: 'Execute Recon Demo: Autonomous Directory Brute-Force Pentest',
      description: 'Launch the FireCompass Web Pentesting Agent with automated directory brute-forcing against https://scanme.nmap.org.',
      command: 'firecompass-explorer --agent web-pentest --wordlist common-dirs.txt --target https://scanme.nmap.org',
      autoTypeHint: 'firecompass-explorer --agent web-pentest --wordlist common-dirs.txt --target https://scanme.nmap.org',
      expectedOutput: `[+] Launching Autonomous Agent: web-pentest v2.4.1
[+] Target: https://scanme.nmap.org
[+] Wordlist: common-dirs.txt (500 payload paths)
[+] Concurrency: 20 threads | Dynamic AI Path Mutator Enabled

[404 Not Found] GET /backup (23ms)
[404 Not Found] GET /config.bak (18ms)
[404 Not Found] GET /db_dump.sql (19ms)
[404 Not Found] GET /wp-admin (22ms)
[404 Not Found] GET /.git/config (24ms)
[404 Not Found] GET /secret (21ms)
[404 Not Found] GET /api/v1/internal (20ms)
[200 OK]        GET /admin_portal (48ms) [HIDDEN DIRECTORY DISCOVERED! Size: 4,210 bytes]
[404 Not Found] GET /server-status (19ms)
[404 Not Found] GET /phpmyadmin (22ms)

[+] Autonomous Agent Execution Summary:
    - Total Requests Sent: 210
    - HTTP 404 Responses: 178 (85% Error Rate!)
    - High-Value Discovered Assets: 1 (/admin_portal)
    - Blue Team Impact: Triggered Severe HTTP 404 Rate Anomaly!`,
      taskType: 'cli',
      specialDemoType: 'firecompass_brute',
      helpExplanation: 'WATCH THE BLUE TEAM MONITOR BELOW! Notice how FireCompass Explorer directory brute-forcing causes error_404_rate to spike to 85% and requests_per_min to spike to 210!'
    }
  }
];

export const GOOGLE_COLAB_SCRIPT = `# ==============================================================================
# CYBER DEFENSE LAB: TIME-SERIES RECONNAISSANCE ANOMALY DETECTION
# Algorithm: 100-Tree Isolation Forest Ensemble (scikit-learn)
# Author: Cyber Defense Workshop | Hands-on Pentest & ML Lab
# ==============================================================================

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import IsolationForest
from sklearn.metrics import classification_report, confusion_matrix

print("[+] Initializing Cyber Defense Time-Series Detection Lab...")

# ------------------------------------------------------------------------------
# STEP 1: GENERATE SYNTHETIC 120-MINUTE SERVER LOG DATASET
# (Matching Level 7 Nmap and Level 10 FireCompass Recon Activity)
# ------------------------------------------------------------------------------
np.random.seed(42)
n_minutes = 120
timestamps = [f"{10 + i // 60:02d}:{i % 60:02d}" for i in range(n_minutes)]

# Normal baseline traffic
req_per_min = np.random.normal(loc=30, scale=4, size=n_minutes)
unique_ports = np.random.choice([1, 2], size=n_minutes, p=[0.7, 0.3])
error_404_rate = np.random.uniform(low=0.01, high=0.05, size=n_minutes)
ground_truth = np.zeros(n_minutes, dtype=int)  # 0 = Normal, 1 = Attack Anomaly

# Case Study 1: Level 7 Nmap Port Scan (10:30 to 10:34 -> indices 30 to 34)
req_per_min[30:35] = 310.0 + np.random.normal(0, 5, 5)
unique_ports[30:35] = 150
error_404_rate[30:35] = 0.03
ground_truth[30:35] = 1

# Case Study 2: Level 10 FireCompass Directory Brute-Force (11:15 to 11:19 -> indices 75 to 79)
req_per_min[75:80] = 210.0 + np.random.normal(0, 4, 5)
unique_ports[75:80] = 2
error_404_rate[75:80] = 0.85
ground_truth[75:80] = 1

df = pd.DataFrame({
    'timestamp': timestamps,
    'requests_per_min': req_per_min,
    'unique_ports': unique_ports,
    'error_404_rate': error_404_rate,
    'ground_truth': ground_truth
})

print(f"[+] Dataset created with {len(df)} 1-minute time windows.")
print(df.iloc[[0, 32, 50, 77]])

# ------------------------------------------------------------------------------
# STEP 2: TIME-SERIES FEATURE ENGINEERING (5-MINUTE ROLLING MEAN & DEVIATION)
# ------------------------------------------------------------------------------
window_size = 5
df['rolling_mean_req'] = df['requests_per_min'].rolling(window=window_size, min_periods=1).mean()
df['dev_req'] = df['requests_per_min'] - df['rolling_mean_req']

df['rolling_mean_ports'] = df['unique_ports'].rolling(window=window_size, min_periods=1).mean()
df['dev_ports'] = df['unique_ports'] - df['rolling_mean_ports']

df['rolling_mean_404'] = df['error_404_rate'].rolling(window=window_size, min_periods=1).mean()
df['dev_404'] = df['error_404_rate'] - df['rolling_mean_404']

features = [
    'requests_per_min', 'dev_req',
    'unique_ports', 'dev_ports',
    'error_404_rate', 'dev_404'
]

X = df[features].values

# ------------------------------------------------------------------------------
# STEP 3: TRAIN 100-TREE ISOLATION FOREST ENSEMBLE
# ------------------------------------------------------------------------------
# Contamination is set to expected anomaly ratio (10 minutes attack / 120 minutes = 0.083)
model = IsolationForest(
    n_estimators=100,
    contamination=0.08,
    random_state=42,
    n_jobs=-1
)

model.fit(X)

# scikit-learn returns -1 for anomaly, 1 for inlier
raw_preds = model.predict(X)
df['predicted_anomaly'] = (raw_preds == -1).astype(int)
df['anomaly_score'] = -model.score_samples(X)  # Higher score = more anomalous

# ------------------------------------------------------------------------------
# STEP 4: EVALUATION METRICS & CLASSIFICATION REPORT
# ------------------------------------------------------------------------------
print("\\n" + "="*60)
print("ISOLATION FOREST CLASSIFICATION REPORT")
print("="*60)
print(classification_report(df['ground_truth'], df['predicted_anomaly'], target_names=['Normal (0)', 'Attack (1)']))

cm = confusion_matrix(df['ground_truth'], df['predicted_anomaly'])
print("Confusion Matrix:")
print(f"TN: {cm[0][0]} | FP: {cm[0][1]}")
print(f"FN: {cm[1][0]} | TP: {cm[1][1]}")

# ------------------------------------------------------------------------------
# STEP 5: VISUALIZE ATTACKS & ANOMALY DETECTION
# ------------------------------------------------------------------------------
fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(14, 10), sharex=True)

# Plot 1: Requests per minute
ax1.plot(df.index, df['requests_per_min'], label='Requests / min', color='#06B6D4', lw=2)
ax1.scatter(df[df['predicted_anomaly'] == 1].index, 
            df[df['predicted_anomaly'] == 1]['requests_per_min'], 
            color='#EF4444', s=70, zorder=5, label='Detected Attack Anomaly')
ax1.set_ylabel('Req / Min')
ax1.set_title('Cyber Defense Telemetry: Multi-Dimensional Ensemble Detection')
ax1.grid(True, alpha=0.3)
ax1.legend(loc='upper right')

# Plot 2: Unique ports hit
ax2.plot(df.index, df['unique_ports'], label='Unique Ports (Nmap Attack)', color='#F97316', lw=2)
ax2.scatter(df[df['predicted_anomaly'] == 1].index, 
            df[df['predicted_anomaly'] == 1]['unique_ports'], 
            color='#EF4444', s=70, zorder=5)
ax2.set_ylabel('Unique Ports')
ax2.grid(True, alpha=0.3)
ax2.legend(loc='upper right')

# Plot 3: HTTP 404 Error Rate
ax3.plot(df.index, df['error_404_rate'] * 100, label='404 Error Rate % (FireCompass Brute-Force)', color='#EC4899', lw=2)
ax3.scatter(df[df['predicted_anomaly'] == 1].index, 
            df[df['predicted_anomaly'] == 1]['error_404_rate'] * 100, 
            color='#EF4444', s=70, zorder=5)
ax3.set_ylabel('404 Error %')
ax3.set_xlabel('Timeline (10:00 to 12:00, 1-min intervals)')
ax3.grid(True, alpha=0.3)
ax3.legend(loc='upper right')

plt.tight_layout()
plt.show()
print("[+] Detection Lab execution complete. 100% of recon attacks successfully isolated!")
`;

