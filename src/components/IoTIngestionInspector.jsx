import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { 
  Radio, 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Cpu, 
  Wifi, 
  Layers, 
  Server, 
  Zap,
  Play,
  Pause
} from 'lucide-react';

export default function IoTIngestionInspector() {
  const [copied, setCopied] = useState(false);
  const [packets, setPackets] = useState([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newPacket = {
        uuid: `ESP32-NODE-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString(),
        machine_id: ["CM-03", "SC-02", "HP-02", "CNC-01"][Math.floor(Math.random() * 4)],
        metrics: {
          vibration_rms_mms: parseFloat((2.1 + (Math.random() - 0.5) * 1.5).toFixed(3)),
          temp_celsius: parseFloat((52.4 + (Math.random() - 0.5) * 3.0).toFixed(2)),
          current_amps: parseFloat((16.2 + (Math.random() - 0.5) * 2.0).toFixed(2)),
          rpm: Math.round(1450 + (Math.random() - 0.5) * 35)
        },
        protocol: "MQTT / TLS 1.3"
      };

      setPackets((prev) => [newPacket, ...prev.slice(0, 7)]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isLive]);

  const copyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const esp32Code = `// ESP32 Microcontroller Firmware Snippet for PredictIQ
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "FACTORY_IOT_WIFI";
const char* password = "MSME_SECURE_PASS";
const char* serverUrl = "${API_URL}/api/v1/telemetry/ingest";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); }
}

void loop() {
  StaticJsonDocument<200> doc;
  doc["device_uuid"] = "ESP32-CM-03";
  doc["vibration_rms"] = analogRead(34) * (10.0 / 4095.0);
  doc["temp_celsius"] = analogRead(35) * (100.0 / 4095.0);
  doc["current_amps"] = analogRead(32) * (30.0 / 4095.0);

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-PredictIQ-Key", "pk_live_msme_71940");
  int httpCode = http.POST(jsonPayload);
  http.end();

  delay(1000);
}`;

  return (
    <div className="saas-card p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Hardware-Agnostic Ingestion API</span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded-full">
                ESP32 / Modbus Ready
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Zero-code changes required when swapping simulated IoT data with real sensors.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <Server className="w-4 h-4 text-cyan-500" />
          <span>POST /api/v1/telemetry/ingest</span>
        </div>
      </div>

      {/* Architecture Pipeline */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-3 tracking-wider">
          Unified Telemetry Pipeline Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          
          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Cpu className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
            <span className="font-bold text-slate-900 dark:text-white block">1. Sensors</span>
            <span className="text-[10px] text-slate-400">Vibration / Temp / Amps</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Wifi className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
            <span className="font-bold text-slate-900 dark:text-white block">2. Gateway</span>
            <span className="text-[10px] text-slate-400">ESP32 / MQTT Stream</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Server className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <span className="font-bold text-slate-900 dark:text-white block">3. Ingestion API</span>
            <span className="text-[10px] text-slate-400">Express + WebSockets</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Layers className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <span className="font-bold text-slate-900 dark:text-white block">4. AI Engine</span>
            <span className="text-[10px] text-slate-400">Isolation Forest / Z-Score</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Zap className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <span className="font-bold text-slate-900 dark:text-white block">5. SaaS UI</span>
            <span className="text-[10px] text-slate-400">Live Risk & ROI</span>
          </div>

        </div>
      </div>

      {/* Code Inspector & Live Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Code Snippet Column */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white font-mono">ESP32 Firmware Code</span>
            </div>
            <button
              onClick={() => copyCode(esp32Code)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-all"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-4 font-mono text-[11px] text-cyan-300 leading-relaxed overflow-x-auto max-h-[350px]">
            <pre>{esp32Code}</pre>
          </div>
        </div>

        {/* Live Packet Terminal Column */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono">Live MQTT Payload Log</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px] font-mono flex items-center gap-1"
            >
              {isLive ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isLive ? 'Pause Stream' : 'Resume'}</span>
            </button>
          </div>

          <div className="p-4 font-mono text-[11px] text-slate-300 space-y-2 overflow-y-auto max-h-[350px]">
            {packets.map((pkt, idx) => (
              <div key={idx} className="p-2 rounded bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors">
                <span className="text-cyan-400 font-bold">[{pkt.timestamp.slice(11, 19)}]</span> {' '}
                <span className="text-indigo-400">{pkt.uuid}</span> {'->'} {' '}
                <span className="text-emerald-400">{JSON.stringify(pkt.metrics)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
