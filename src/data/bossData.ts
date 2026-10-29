import { BossDataPoint } from '../types';

export function generate120MinDataset(): BossDataPoint[] {
  const points: BossDataPoint[] = [];

  for (let i = 0; i < 120; i++) {
    const hour = 10 + Math.floor(i / 60);
    const minute = i % 60;
    const timeStr = `${hour}:${minute < 10 ? '0' : ''}${minute}`;

    let req = 30 + (Math.sin(i * 0.4) * 4) + (Math.cos(i * 0.7) * 2);
    let ports = (i % 7 === 0) ? 2 : 1;
    let err404 = 0.02 + ((i % 5) * 0.005);
    let isAnomaly = false;
    let anomalyType: 'NORMAL' | 'NMAP_SCAN' | 'BRUTE_FORCE' = 'NORMAL';

    // Case Study 1: Level 7 Nmap Port Scan (10:30 to 10:34 -> indices 30 to 34)
    if (i >= 30 && i <= 34) {
      req = 310 + ((i - 30) * 3) - (Math.random() * 5);
      ports = 150 - ((i - 30) * 4);
      err404 = 0.035;
      isAnomaly = true;
      anomalyType = 'NMAP_SCAN';
    }

    // Case Study 2: Level 10 FireCompass Directory Brute-Force (11:15 to 11:19 -> indices 75 to 79)
    if (i >= 75 && i <= 79) {
      req = 210 + (Math.sin(i) * 6);
      ports = 2;
      err404 = 0.85 + (Math.sin(i * 2) * 0.02);
      isAnomaly = true;
      anomalyType = 'BRUTE_FORCE';
    }

    points.push({
      minute: i,
      time: timeStr,
      requests_per_min: Math.round(req * 10) / 10,
      unique_ports: Math.round(ports),
      error_404_rate: Math.round(err404 * 1000) / 1000,
      isAnomaly,
      anomalyType,
      rolling_mean_req: 0,
      deviation_req: 0,
      rolling_mean_ports: 0,
      deviation_ports: 0,
      rolling_mean_404: 0,
      deviation_404: 0,
      iforest_score: 0.15,
      predicted_anomaly: false
    });
  }

  // Calculate 5-minute rolling window statistics
  const windowSize = 5;
  for (let i = 0; i < points.length; i++) {
    const startIdx = Math.max(0, i - windowSize + 1);
    const windowSlice = points.slice(startIdx, i + 1);

    const sumReq = windowSlice.reduce((acc, p) => acc + p.requests_per_min, 0);
    const sumPorts = windowSlice.reduce((acc, p) => acc + p.unique_ports, 0);
    const sum404 = windowSlice.reduce((acc, p) => acc + p.error_404_rate, 0);

    const meanReq = sumReq / windowSlice.length;
    const meanPorts = sumPorts / windowSlice.length;
    const mean404 = sum404 / windowSlice.length;

    points[i].rolling_mean_req = Math.round(meanReq * 10) / 10;
    points[i].deviation_req = Math.round((points[i].requests_per_min - meanReq) * 10) / 10;

    points[i].rolling_mean_ports = Math.round(meanPorts * 10) / 10;
    points[i].deviation_ports = Math.round((points[i].unique_ports - meanPorts) * 10) / 10;

    points[i].rolling_mean_404 = Math.round(mean404 * 1000) / 1000;
    points[i].deviation_404 = Math.round((points[i].error_404_rate - mean404) * 1000) / 1000;

    // Isolation forest score calculation simulation
    // Score based on multi-dimensional rarity:
    // Large unique_ports (Nmap) OR large error_404_rate (FireCompass) OR abnormal dev
    const portAnomalyWeight = Math.min(1.0, points[i].unique_ports / 100);
    const errAnomalyWeight = Math.min(1.0, points[i].error_404_rate / 0.8);
    const reqDevWeight = Math.min(1.0, Math.abs(points[i].deviation_req) / 150);

    const score = Math.max(0.12, Math.max(portAnomalyWeight * 0.95, errAnomalyWeight * 0.92, reqDevWeight * 0.88));
    points[i].iforest_score = Math.round(score * 100) / 100;
    points[i].predicted_anomaly = score >= 0.65;
  }

  return points;
}

export interface StealthEvaluationResult {
  staticFirewallBlocked: boolean;
  staticFirewallMessage: string;
  isolationForestDetected: boolean;
  isolationForestScore: number;
  isolationForestSplitsNeeded: number;
  isolationForestExplanation: string;
  multiDimensionalInsights: string[];
}

export function evaluateStealthAttack(
  reqPerMin: number,
  uniquePorts: number,
  error404Percent: number
): StealthEvaluationResult {
  const errRatio = error404Percent / 100;

  // 1. Static Firewall Rule: IF requests > 200 THEN BLOCK
  const staticThreshold = 200;
  const staticFirewallBlocked = reqPerMin > staticThreshold;
  const staticFirewallMessage = staticFirewallBlocked
    ? `FIREWALL TRIGGERED: requests_per_min (${reqPerMin}) exceeds static threshold (${staticThreshold}). Blocked by volumetric rule.`
    : `FIREWALL BYPASSED: requests_per_min (${reqPerMin}) is BELOW threshold (${staticThreshold}). Static defense is completely BLIND to this attack!`;

  // 2. Isolation Forest Multi-dimensional evaluation:
  // Features: [requests_per_min, unique_ports, error_404_rate, dev_ports]
  // Baseline: req ~30, ports: 1-2, 404: 0.03
  // Even if req is low (e.g. 40), if unique_ports is 25, that is 12.5x higher than baseline!
  // In an isolation tree, an axis-aligned split on unique_ports > 5 immediately isolates this point in just 2-3 splits.
  const portFactor = Math.max(0, (uniquePorts - 2) / 30);
  const reqFactor = Math.max(0, (reqPerMin - 30) / 150);
  const errFactor = Math.max(0, (errRatio - 0.05) / 0.5);

  const compositeAnomalyScore = Math.min(0.99, 0.2 + (portFactor * 0.6) + (errFactor * 0.5) + (reqFactor * 0.3));
  const isolationForestDetected = compositeAnomalyScore >= 0.55 || uniquePorts >= 8 || errRatio >= 0.20 || reqPerMin >= 140;

  // Average path length in 100 trees:
  // Anomalies are isolated in very few splits (e.g. 2 to 4 cuts)
  // Inliers require deep splits (e.g. 9 to 14 cuts)
  const splitsNeeded = isolationForestDetected 
    ? Math.max(2, Math.round(6 - compositeAnomalyScore * 4))
    : Math.round(9 + Math.random() * 4);

  const insights: string[] = [];
  if (uniquePorts >= 5) {
    insights.push(`Multi-Port Anomaly: ${uniquePorts} unique ports targeted (baseline is only 1-2). Ensemble trees split on port dimension in step 1.`);
  }
  if (reqPerMin <= 200 && isolationForestDetected) {
    insights.push(`Volumetric Stealth: Attacker dialed rate to ${reqPerMin} req/min to evade threshold >200, but multivariate clustering exposed the correlation.`);
  }
  if (errRatio >= 0.15) {
    insights.push(`HTTP Error Signature: 404 rate of ${error404Percent}% deviates >3σ from legitimate web user browsing.`);
  }

  const isolationForestExplanation = isolationForestDetected
    ? `DETECTED by 100-Tree Ensemble! Isolated in average path length of only ${splitsNeeded} random splits (Score: ${(compositeAnomalyScore * 100).toFixed(0)}%). Multi-dimensional feature cuts on unique_ports & residual error exposed the stealth footprint.`
    : `Inlier Status: Point requires ${splitsNeeded} splits to isolate (Score: ${(compositeAnomalyScore * 100).toFixed(0)}%). Behavior closely mimics legitimate baseline traffic.`;

  return {
    staticFirewallBlocked,
    staticFirewallMessage,
    isolationForestDetected,
    isolationForestScore: compositeAnomalyScore,
    isolationForestSplitsNeeded: splitsNeeded,
    isolationForestExplanation,
    multiDimensionalInsights: insights
  };
}

