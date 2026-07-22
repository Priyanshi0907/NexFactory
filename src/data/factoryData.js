// Factory Data Baseline and Configuration for PredictIQ

export const INITIAL_MACHINES = [
  {
    id: "CM-03",
    name: "Line C — Conveyor Motor",
    type: "Conveyor Belt Drive",
    location: "Bay 2 - Packaging",
    healthScore: 31,
    riskScore: 91,
    status: "Critical", // Critical, Watch, Healthy
    rulDays: 2.4,
    failureProbability: 81,
    estDowntimeAvoidedRupees: 184000,
    hourlyDowntimeCostRupees: 42000,
    metrics: {
      vibration: 7.2, // mm/s
      vibrationBaseline: 2.1,
      vibrationUnit: "mm/s",
      temperature: 78.4, // °C
      tempBaseline: 52.0,
      tempUnit: "°C",
      current: 24.5, // Amps
      currentBaseline: 15.0,
      currentUnit: "A",
      rpm: 1380, // RPM
      rpmBaseline: 1450,
      rpmUnit: "RPM"
    },
    powerKW: 18.5,
    excessPowerKW: 4.8,
    efficiencyScore: 68,
    primaryReason: "Vibration 3.4x above baseline + Bearing inner-race failure signature detected",
    recommendation: "Schedule drive bearing replacement within 24 hours. Check lubrication line."
  },
  {
    id: "SC-02",
    name: "Line B — Screw Compressor",
    type: "Air Compressor",
    location: "Compressor Utility Room",
    healthScore: 62,
    riskScore: 38,
    status: "Watch",
    rulDays: 14.5,
    failureProbability: 29,
    estDowntimeAvoidedRupees: 45000,
    hourlyDowntimeCostRupees: 28000,
    metrics: {
      vibration: 3.8,
      vibrationBaseline: 1.9,
      vibrationUnit: "mm/s",
      temperature: 64.1,
      tempBaseline: 55.0,
      tempUnit: "°C",
      current: 19.8,
      currentBaseline: 16.5,
      currentUnit: "A",
      rpm: 2850,
      rpmBaseline: 2900,
      rpmUnit: "RPM"
    },
    powerKW: 22.0,
    excessPowerKW: 2.3,
    efficiencyScore: 81,
    primaryReason: "Air intake filter restricted causing elevated suction pressure differential",
    recommendation: "Inspect & clean intake filter element. Verify oil separator differential."
  },
  {
    id: "HP-02",
    name: "Line A — Hydraulic Press 2",
    type: "Hydraulic Stamping Press",
    location: "Heavy Stamping Cell",
    healthScore: 68,
    riskScore: 42,
    status: "Watch",
    rulDays: 11.2,
    failureProbability: 35,
    estDowntimeAvoidedRupees: 62000,
    hourlyDowntimeCostRupees: 55000,
    metrics: {
      vibration: 4.1,
      vibrationBaseline: 2.2,
      vibrationUnit: "mm/s",
      temperature: 59.8,
      tempBaseline: 48.0,
      tempUnit: "°C",
      current: 21.0,
      currentBaseline: 17.0,
      currentUnit: "A",
      rpm: 1120,
      rpmBaseline: 1150,
      rpmUnit: "RPM"
    },
    powerKW: 35.0,
    excessPowerKW: 3.1,
    efficiencyScore: 79,
    primaryReason: "Proportional relief valve cavitation & hydraulic fluid thermal breakdown",
    recommendation: "Check hydraulic fluid viscosity and valve spool clearance during next shift gap."
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
    metrics: {
      vibration: 1.8,
      vibrationBaseline: 1.7,
      vibrationUnit: "mm/s",
      temperature: 48.2,
      tempBaseline: 47.0,
      tempUnit: "°C",
      current: 14.2,
      currentBaseline: 14.0,
      currentUnit: "A",
      rpm: 3200,
      rpmBaseline: 3200,
      rpmUnit: "RPM"
    },
    powerKW: 28.0,
    excessPowerKW: 0.2,
    efficiencyScore: 96,
    primaryReason: "Operating within optimal parameters. Zero anomaly flags.",
    recommendation: "Routine inspection scheduled in 21 days."
  },
  {
    id: "RWA-03",
    name: "Line D — Robotic Welding Arm 3",
    type: "6-Axis Welding Robot",
    location: "Automated Assembly Line",
    healthScore: 85,
    riskScore: 18,
    status: "Healthy",
    rulDays: 32.0,
    failureProbability: 9,
    estDowntimeAvoidedRupees: 85000,
    hourlyDowntimeCostRupees: 38000,
    metrics: {
      vibration: 2.1,
      vibrationBaseline: 2.0,
      vibrationUnit: "mm/s",
      temperature: 45.0,
      tempBaseline: 44.0,
      tempUnit: "°C",
      current: 11.5,
      currentBaseline: 11.2,
      currentUnit: "A",
      rpm: 950,
      rpmBaseline: 950,
      rpmUnit: "RPM"
    },
    powerKW: 12.5,
    excessPowerKW: 0.4,
    efficiencyScore: 92,
    primaryReason: "Normal thermal equilibrium across joint 3 gearbox.",
    recommendation: "Maintain standard PM schedule."
  },
  {
    id: "SM-04",
    name: "Line E — Stamping Machine 4",
    type: "High-Speed Blanking Press",
    location: "Sheet Metal Hub",
    healthScore: 91,
    riskScore: 14,
    status: "Healthy",
    rulDays: 41.5,
    failureProbability: 6,
    estDowntimeAvoidedRupees: 94000,
    hourlyDowntimeCostRupees: 48000,
    metrics: {
      vibration: 2.0,
      vibrationBaseline: 1.9,
      vibrationUnit: "mm/s",
      temperature: 51.0,
      tempBaseline: 50.0,
      tempUnit: "°C",
      current: 16.2,
      currentBaseline: 16.0,
      currentUnit: "A",
      rpm: 1600,
      rpmBaseline: 1600,
      rpmUnit: "RPM"
    },
    powerKW: 24.0,
    excessPowerKW: 0.3,
    efficiencyScore: 94,
    primaryReason: "Normal stroke counter & flywheel dynamic balance.",
    recommendation: "Next lubrication check in 14 days."
  }
];

export const INITIAL_ANOMALY_ALERTS = [
  {
    id: "ALT-9041",
    timestamp: "12 mins ago",
    machineId: "CM-03",
    machineName: "Line C — Conveyor Motor",
    severity: "Critical",
    title: "Vibration & Thermal Surge Detected",
    description: "Vibration 3.4x baseline (7.2 mm/s). Bearing outer-race fatigue pattern recognized by Isolation Forest model.",
    estAvoidedDowntimeCostRupees: 18400,
    recommendedAction: "Schedule emergency bearing replacement before shift 2.",
    status: "Active"
  },
  {
    id: "ALT-9038",
    timestamp: "1 hour ago",
    machineId: "HP-02",
    machineName: "Line A — Hydraulic Press 2",
    severity: "Warning",
    title: "Fluid Cavitation & Power Spike",
    description: "Current draw 1.25x nominal baseline (21.0 A). Estimated 3.1 kW power loss.",
    estAvoidedDowntimeCostRupees: 12500,
    recommendedAction: "Inspect hydraulic oil viscosity and valve chatter.",
    status: "Active"
  },
  {
    id: "ALT-9029",
    timestamp: "4 hours ago",
    machineId: "SC-02",
    machineName: "Line B — Screw Compressor",
    severity: "Warning",
    title: "Filter Restriction Pressure Differential",
    description: "Suction thermal rise (+9.1°C). Minor efficiency drop.",
    estAvoidedDowntimeCostRupees: 8200,
    recommendedAction: "Clean suction filter screen.",
    status: "Acknowledged"
  }
];

// Historical Analytics Demo Datasets structured by Time Range
export const ANALYTICS_DATA_BY_TIMERANGE = {
  this_week: {
    label: "This Week (Mon - Sun)",
    avoidedLoss: "₹5,90,000",
    downtimeHrs: "8.3 hrs",
    avgScrapRate: "1.82%",
    production: [
      { day: "Mon", target: 5000, actual: 4850, downtimeHrs: 1.2 },
      { day: "Tue", target: 5000, actual: 5120, downtimeHrs: 0.5 },
      { day: "Wed", target: 5000, actual: 3950, downtimeHrs: 3.8 }, // Down day
      { day: "Thu", target: 5000, actual: 4780, downtimeHrs: 1.5 },
      { day: "Fri", target: 5500, actual: 5620, downtimeHrs: 0.2 },
      { day: "Sat", target: 4500, actual: 4300, downtimeHrs: 1.0 },
      { day: "Sun", target: 3000, actual: 2980, downtimeHrs: 0.1 },
    ],
    reasons: [
      { name: "Bearing / Mechanical Wear", value: 42, color: "#EF4444" },
      { name: "Motor Thermal Overheat", value: 24, color: "#F59E0B" },
      { name: "Power / Electrical Spikes", value: 18, color: "#8B5CF6" },
      { name: "Raw Material Shortage", value: 10, color: "#00F2FE" },
      { name: "Operator Unavailability", value: 6, color: "#10B981" },
    ],
    defects: [
      { day: "Mon", defectRate: 1.8, threshold: 2.5 },
      { day: "Tue", defectRate: 2.4, threshold: 2.5 },
      { day: "Wed", defectRate: 3.9, threshold: 2.5 },
      { day: "Thu", defectRate: 1.9, threshold: 2.5 },
      { day: "Fri", defectRate: 1.2, threshold: 2.5 },
      { day: "Sat", defectRate: 1.5, threshold: 2.5 },
      { day: "Sun", defectRate: 0.9, threshold: 2.5 },
    ]
  },
  this_month: {
    label: "This Month (4 Weeks)",
    avoidedLoss: "₹23,40,000",
    downtimeHrs: "28.3 hrs",
    avgScrapRate: "1.95%",
    production: [
      { day: "Week 1", target: 33000, actual: 31600, downtimeHrs: 8.3 },
      { day: "Week 2", target: 33000, actual: 34200, downtimeHrs: 2.1 },
      { day: "Week 3", target: 33000, actual: 28900, downtimeHrs: 14.5 }, // Down week
      { day: "Week 4", target: 33000, actual: 33800, downtimeHrs: 3.4 },
    ],
    reasons: [
      { name: "Bearing / Mechanical Wear", value: 36, color: "#EF4444" },
      { name: "Power / Grid Tripping", value: 30, color: "#8B5CF6" },
      { name: "Hydraulic Valve Cavitation", value: 18, color: "#F59E0B" },
      { name: "Raw Material Delay", value: 12, color: "#00F2FE" },
      { name: "Scheduled Maintenance", value: 4, color: "#10B981" },
    ],
    defects: [
      { day: "Week 1", defectRate: 1.7, threshold: 2.5 },
      { day: "Week 2", defectRate: 1.4, threshold: 2.5 },
      { day: "Week 3", defectRate: 3.2, threshold: 2.5 },
      { day: "Week 4", defectRate: 1.5, threshold: 2.5 },
    ]
  },
  last_quarter: {
    label: "Last Quarter (Q2 2026)",
    avoidedLoss: "₹68,50,000",
    downtimeHrs: "68.3 hrs",
    avgScrapRate: "2.00%",
    production: [
      { day: "April", target: 140000, actual: 138500, downtimeHrs: 24.5 },
      { day: "May", target: 145000, actual: 141200, downtimeHrs: 31.0 },
      { day: "June", target: 145000, actual: 147800, downtimeHrs: 12.8 },
    ],
    reasons: [
      { name: "Bearing & Shaft Fatigue", value: 45, color: "#EF4444" },
      { name: "Coolant Clogging", value: 25, color: "#F59E0B" },
      { name: "Voltage Sag Outages", value: 15, color: "#8B5CF6" },
      { name: "Tooling Calibration", value: 10, color: "#00F2FE" },
      { name: "Spares Delivery Delay", value: 5, color: "#10B981" },
    ],
    defects: [
      { day: "April", defectRate: 2.1, threshold: 2.5 },
      { day: "May", defectRate: 2.3, threshold: 2.5 },
      { day: "June", defectRate: 1.6, threshold: 2.5 },
    ]
  }
};

export const PRODUCTION_VS_TARGET_DATA = ANALYTICS_DATA_BY_TIMERANGE.this_week.production;
export const DOWNTIME_REASONS_DATA = ANALYTICS_DATA_BY_TIMERANGE.this_week.reasons;
export const DEFECT_RATE_DATA = ANALYTICS_DATA_BY_TIMERANGE.this_week.defects;

// Presets for Scenario Simulator
export const WHAT_IF_SCENARIOS = [
  { id: "machine_down", label: "Unplanned Machine Breakdown" },
  { id: "power_outage", label: "Grid Power Fluctuation / Load Shedding" },
  { id: "spares_delay", label: "Spare Part Delivery Lag" },
  { id: "shift_overtime", label: "Emergency Overtime Reroute" }
];
