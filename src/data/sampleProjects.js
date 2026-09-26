export const SAMPLE_PRDS = [
  {
    id: "voice-ai",
    name: "NexusVoice — Autonomous Voice Agent Platform",
    tagline: "Sub-500ms multi-turn conversational voice platform for customer support",
    text: `# NexusVoice Platform Requirements

## Objective
Build a low-latency, real-time voice AI platform supporting dual-channel audio streaming, turn detection, and LLM reasoning for automated enterprise workflows.

## Key Requirements & User Stories
1. Real-time Audio Ingestion & WebSocket Gateway: Establish bi-directional WebSocket connection for PCM 16kHz audio chunks with buffer management under 80ms latency.
2. Voice Activity Detection (VAD) & Diarization: Integrate Silero VAD to detect user speech start/stop points and speaker turn handoffs.
3. Speech-to-Text (STT) Streaming Service: Stream audio frames to Deepgram/Whisper real-time API with interim transcript streaming to the client.
4. LLM Dialogue Manager & Function Calling: Ingest partial transcripts, manage conversation context buffer, and trigger tools/APIs dynamically.
5. Text-to-Speech (TTS) Synthesizer Pipeline: Chunk LLM output tokens by punctuation and stream to ElevenLabs/Cartesia synthesis engine.
6. Audio Interruption & Barging Handler: Detect user speech during agent playback, immediately cancel pending TTS chunks, and flush client audio queues.
7. Enterprise Telemetry & Call Analytics Dashboard: Track latency breakdown (VAD + STT + LLM + TTS), sentiment, intent accuracy, and call recordings.
8. Role-Based Access Control & Webhook Dispatcher: Secure enterprise endpoints with JWT tokens, team workspaces, and outbound webhook delivery for CRM sync.`,
  },
  {
    id: "omni-pay",
    name: "OmniPay — Global Multi-Currency Gateway",
    tagline: "PCI-DSS compliant unified payment router with intelligent smart-switch failover",
    text: `# OmniPay Global Payment Infrastructure Requirements

## Objective
A modern, high-throughput payment router handling card payments, digital wallets, crypto settlements, and instant multi-currency FX conversions.

## Key Requirements & User Stories
1. Secure Card Tokenization Vault: Implement PCI-DSS Level 1 compliant tokenization service with zero raw PAN persistence in application memory.
2. Smart Routing & Processor Failover Engine: Dynamically route transactions between Stripe, Adyen, and Checkout.com based on approval rates and lowest transaction fees.
3. Multi-Currency FX Engine & Dynamic Pricing: Fetch live spot rates from Forex provider, lock conversion rates for 15 minutes, and apply automated margin tiers.
4. Fraud Prevention & Risk Scoring ML Pipeline: Score incoming transactions using behavioral metrics, IP velocity checks, and 3D Secure 2.0 conditional step-up authentication.
5. Webhook Reconciler & Idempotent Event Delivery: Process payment callbacks with exponential backoff retries and cryptographic signature verification.
6. Merchant Dashboard & Real-time Analytics: Display gross transaction volume (GTV), dispute rates, refund controls, and CSV exportable tax summaries.
7. Dispute Management & Automated Evidence Submission: Ingest chargeback notices and bundle transaction receipt logs for rapid dispute resolution.`,
  },
  {
    id: "health-ai",
    name: "AuraCare — Clinical Sprint & Patient AI Companion",
    tagline: "HIPAA-ready proactive care monitoring with continuous biomarker telemetry",
    text: `# AuraCare Intelligent Patient Companion Requirements

## Objective
Provide continuous patient health telemetry analysis, automated symptom triaging, and EHR-integrated clinical follow-up planning.

## Key Requirements & User Stories
1. HIPAA Compliant Telemetry Vault: Encrypt patient biomarker metrics at rest and in transit with field-level cryptographic masking.
2. Apple HealthKit & Wearable Sensor Ingestion: Ingest resting heart rate, SpO2, sleep cycle metrics, and blood glucose telemetry via background sync.
3. Anomaly Detection & Clinical Alert Engine: Trigger automated triage alerts when biomarker trends exceed defined clinical safety bounds.
4. AI Symptom Assessment Dialogue: Guide patients through evidence-based questionnaires and generate structured clinical summaries.
5. Doctor Consultation Scheduling & Video Room: WebRTC encrypted video consult room with automated pre-call patient history cards.
6. Prescription Refill & Pharmacy Network API: Validate doctor authorizations and dispatch digital prescription orders to retail pharmacies.
7. Patient Progress Radar & Care Plan Tracking: Gamified visual dashboard tracking daily medication adherence, vitals stability, and scheduled follow-ups.`,
  },
];

