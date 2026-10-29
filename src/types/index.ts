export type BucketType = 
  | 'Bucket 1: Passive Search Engine Recon'
  | 'Bucket 2: Visual & Modular OSINT'
  | 'Bucket 3: Active Scanning & Autonomous AI'
  | 'Final Boss: Machine Learning Defense';

export type FootprintLevel = 'ZERO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';

export interface TaskStep {
  id: string;
  title: string;
  description: string;
  command: string;
  autoTypeHint?: string;
  expectedOutput: string;
  taskType: 'cli' | 'cloud' | 'search' | 'graph' | 'web';
  helpExplanation?: string;
  specialDemoType?: 'maltego' | 'dorking' | 'firecompass_assets' | 'shodan' | 'censys' | 'spiderfoot' | 'aquatone' | 'firecompass_brute';
}

export interface LevelData {
  id: number;
  slug: string;
  name: string;
  toolName: string;
  bucket: BucketType;
  categoryBadge: string;
  logImpactBadge: string;
  footprintLevel: FootprintLevel;
  footprintDetails: string;
  intro: string;
  useCase: string;
  pros: string[];
  cons: string[];
  task1: TaskStep;
  task2: TaskStep;
  specialDemoType?: 'maltego' | 'dorking' | 'firecompass_assets' | 'shodan' | 'censys' | 'spiderfoot' | 'aquatone' | 'firecompass_brute';
}

export interface TelemetryPoint {
  time: string;
  minute: number;
  requests_per_min: number;
  unique_ports: number;
  error_404_rate: number;
  isAnomaly?: boolean;
  anomalyType?: 'NMAP_SCAN' | 'BRUTE_FORCE' | 'STEALTH' | 'NORMAL';
}

export interface BossDataPoint extends TelemetryPoint {
  rolling_mean_req: number;
  deviation_req: number;
  rolling_mean_ports: number;
  deviation_ports: number;
  rolling_mean_404: number;
  deviation_404: number;
  iforest_score: number;
  predicted_anomaly: boolean;
}

export interface UserProgress {
  completedLevels: number[];
  completedTasks: Record<string, boolean>; // e.g., '1-briefing': true, '1-task1': true, '1-task2': true
  totalXp: number;
  instructorMode: boolean;
  activeLevelId: number;
  soundEnabled: boolean;
}
