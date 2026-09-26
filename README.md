# SprintGenius AI — Next-Gen Frontend UI/UX

A modern, high-aesthetic autonomous sprint copilot frontend built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**, integrated with the SprintGenius Express + IBM Bob multi-agent backend.

---

## Features

- **Autonomous 6-Agent Pipeline Stepper**:
  - **Agent 1: Requirement Analyzer** — Ingests PRDs (PDF, DOCX, TXT) and decomposes them into granular user stories with dependencies.
  - **Agents 2 & 3: Priority & Effort Estimator** — Evaluates business impact, complexity matrices, and assigns effort points (Small, Medium, Large).
  - **Agent 4: Sprint Planner** — Formulates balanced 2-week sprints respecting topological prerequisite order.
  - **Agent 5: Risk Detection Agent** — Scans architectural blockers, dependency collisions, and delivery delays with suggested AI mitigations.
  - **Agent 6: Agile Coach & Progress Tracker** — Synthesizes burndown velocity and crafts natural-language executive standup briefings.
- **Interactive Sprint Kanban Board**:
  - Filter by Sprint (All, Sprint 1, Sprint 2, Backlog) and Priority.
  - Interactive status transitions (`Pending` ➔ `In Progress` ➔ `Completed`) with celebratory confetti!
  - Search bar across all user stories.
  - Full story creation and edit modal.
- **Visual Sprint Roadmap & Timeline**:
  - 2-week execution cycles with dependency maps and progress meters.
- **AI Forensic Risk Matrix**:
  - Categorized risk cards (Critical Blockers, High Impact, Quality Risks) with actionable AI mitigations.
- **Agile Coach & Executive Insights**:
  - Real-time burndown velocity index, story counts, and 1-click "Copy for Standup/Slack" briefing.
- **Instant Demo Templates**:
  - Pre-loaded enterprise PRDs (*Autonomous AI Voice Agent*, *Global Multi-Currency Payment Router*, *Clinical Patient Companion*) for 1-click instant live demonstrations!

---

## Quick Start

### 1. Install Dependencies (already done)
```bash
npm install
```

### 2. Run the Frontend
```bash
npm run dev
```
Runs at `http://localhost:3000` (or `http://localhost:5173`).

### 3. Run the Backend (`../sprintgenius-backend`)
In another terminal:
```bash
cd ../sprintgenius-backend
npm run dev
# or
npm start
```
Runs at `http://localhost:5000`.
