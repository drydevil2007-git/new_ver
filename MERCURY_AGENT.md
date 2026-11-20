# ⚡ DaneshYar Mercury Agent Architecture
> Inspired by and ported from [cosmicstack-labs/mercury-agent](https://github.com/cosmicstack-labs/mercury-agent)

**DaneshYar Mercury Agent** is a soul-driven, permission-hardened autonomous AI agent and persistent "Second Brain" runtime integrated into the DaneshYar academic & engineering platform.

---

## 🌟 Key Architecture Pillars

### 1. Soul & Persona Customizer (`SOUL.md`)
Unlike stateless AI wrappers, Mercury's behavior and moral worldview are governed by editable Markdown files:
- **`SOUL.md`**: Core philosophical compass (prioritizing authentic physical intuition over shallow answers, transparency about estimation error, and engineering ethics).
- **`PERSONA.md`**: Academic, constructive, and encouraging communication tone.
- **`TASTE.md`**: Rigorous standards for code modularity, LaTeX typography, and SI unit compliance.
- **`HEARTBEAT.md`**: Background routine definitions, periodic literature scans, and daily study reminders.

### 2. Second Brain (Persistent Memory & Typed Facts)
- Stores deduplicated, typed facts (`preference`, `academic_goal`, `weakness`, `strength`, `project`) with confidence metrics (0.0 to 1.0).
- Local storage and SQLite-compatible schema with full-text search capability.
- Injects relevant durable facts into subsequent LLM turns so the agent remembers the student across sessions.

### 3. Specialist Bots Fleet
A persistent team of autonomous engineering and science agents:
1. **Archimedes (🔬 Literature Reviewer)**: Crawls open-access repositories (Unpaywall, DOAJ, CORE, LibGen) for references and synthesizes state-of-the-art methodology.
2. **Turing (💻 Code & Verification Bot)**: Implements algorithmic simulations in Python and only reports "done" after unit tests pass.
3. **Euler (📐 Math & Symbolic Derivation Bot)**: Derives step-by-step calculus, Laplace/Fourier transforms, and proofs in beautiful KaTeX notation.
4. **Hypatia (🎯 Exam Readiness Architect)**: Diagnoses academic weaknesses, builds daily schedules, and creates spaced-repetition flashcards from lecture notes.

### 4. Permission-Hardened Sandbox ("Ask Before It Acts")
- **Scoped Folders**: Confines file read/write operations to explicit folders (e.g. `~/Documents/Mercury/`, `~/Danshyar/Notes/`).
- **Shell Blocklist**: Intercepts dangerous terminal commands (`rm -rf /`, `sudo`, `format`, `dd`).
- **Token Budgeting**: Enforces daily token limits and triggers Token Saver mode when thresholds approach.
- **SSRF Guard**: Blocks outbound agent fetch attempts to private IP ranges.

### 5. Multi-Channel & Telegram Bridge
- Single background daemon powers the web dashboard, CLI, and messaging channels.
- Simulated and live Telegram Webhook commands (`/start`, `/bots`, `/memory`, `/budget`, `/code`, `/status`).

---

## 🚀 Running Mercury Locally via CLI
To run Mercury Agent natively on your workstation with direct shell and file access:

```bash
# Node.js 22+ required
npm i -g @cosmicstack/mercury-agent

# Run the agent CLI
mercury

# Attach to local repo in Code Mode
mercury code .

# Configure API keys, models, or Telegram bot token
mercury doctor
```
