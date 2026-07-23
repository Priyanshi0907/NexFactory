import express from 'express';
import cors from 'cors';
import { calculateAnomalyScore } from './aiEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'https://nex-factory.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true
}));
app.use(express.json());

// In-Memory Database for Demo Telemetry
let activeMachines = [
  {
    id: "CM-03",
    name: "Line C — Conveyor Motor",
    type: "Conveyor Belt Drive",
    location: "Bay 2 - Packaging",
    healthScore: 31,
    riskScore: 91,
    status: "Critical",
    rulDays: 2.4,
    failureProbability: 81,
    estDowntimeAvoidedRupees: 184000,
    hourlyDowntimeCostRupees: 42000,
    metrics: { vibration: 7.2, vibrationBaseline: 2.1, temperature: 78.4, tempBaseline: 52.0, current: 24.5, currentBaseline: 15.0, rpm: 1380, rpmBaseline: 1450 },
    powerKW: 18.5,
    excessPowerKW: 4.8,
    efficiencyScore: 68,
    primaryReason: "Vibration 3.4x above baseline + Bearing inner-race failure signature detected",
    recommendation: "Schedule drive bearing replacement within 24 hours."
  },
  {
    id: "CNC-01",
    name: "Line A — CNC Mill 1",
    type: "5-Axis CNC Milling Center",
    location: "Machining Bay 1",
    healthScore: 98,
    riskScore: 12,
    status: "Healthy",
    rulDays: 48.0,
    failureProbability: 4,
    estDowntimeAvoidedRupees: 120000,
    hourlyDowntimeCostRupees: 65000,
    metrics: { vibration: 1.8, vibrationBaseline: 1.7, temperature: 48.2, tempBaseline: 47.0, current: 14.2, currentBaseline: 14.0, rpm: 3200, rpmBaseline: 3200 },
    powerKW: 28.0,
    excessPowerKW: 0.2,
    efficiencyScore: 96,
    primaryReason: "Operating within optimal parameters. Zero anomaly flags.",
    recommendation: "Routine inspection scheduled in 21 days."
  }
];

// GET /api/overview
app.get('/api/overview', (req, res) => {
  res.json({
    status: "OK",
    totalMachines: activeMachines.length,
    totalAvoidedSavingsRupees: activeMachines.reduce((acc, m) => acc + m.estDowntimeAvoidedRupees, 0),
    machines: activeMachines
  });
});

// POST /api/v1/telemetry/ingest (Hardware-agnostic ESP32 Ingestion API)
app.post('/api/v1/telemetry/ingest', (req, res) => {
  const { device_uuid, vibration_rms, temp_celsius, current_amps, rpm } = req.body;
  
  if (!device_uuid) {
    return res.status(400).json({ error: "Missing device_uuid parameter" });
  }

  // Calculate ML score
  const aiResult = calculateAnomalyScore({
    vibration: vibration_rms || 2.0,
    vibrationBaseline: 1.8,
    temperature: temp_celsius || 48.0,
    tempBaseline: 45.0,
    current: current_amps || 14.0,
    currentBaseline: 14.0
  });

  res.json({
    message: "Telemetry ingested successfully",
    device_uuid,
    timestamp: new Date().toISOString(),
    aiResult
  });
});

app.listen(PORT, () => {
  console.log(`PredictIQ Express Server running on port ${PORT}`);
});
