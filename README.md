# Voice Vision Assist - Frontend Mobile Client

The official cross-platform mobile client for the Voice Vision Assist ecosystem, designed for the Smart-Verse Hackathon. This application serves as an accessible, voice-directed spatial guide for the visually impaired and blind.

---

## 📱 The Core Architecture

This mobile client acts as the primary user interface, capturing real-time user intent and environment data:

1. **The Client (Phone):** Captures voice commands and live camera frames, bundling them into a multi-part payload.
2. **The Gateway:** Transmits the payload seamlessly to our dedicated [Python Flask Backend Core](https://github.com/DragonFly-Forge/Smartverse_hackathon_app_V0.2).
3. **The Feedback:** Receives safety-first spatial reasoning instructions from the AI cloud and speaks them back to the user hands-free.

### Tech Stack & Dependencies
* **Frontend Framework:** React Native / Expo (Cross-Platform iOS & Android)
* **Design Priority:** Screen-reader optimization and accessibility-first UI workflows

---

## ⬇️ Quickstart Installation & Local Setup

Make sure you have Node.js and Git installed on your system.

### 1. Clone the Repository & Navigate
```bash
git clone [https://github.com/avirupbanerjee2025-afk/Apna-College--YT-Series.git](https://github.com/avirupbanerjee2025-afk/Apna-College--YT-Series.git)
cd Apna-College--YT-Series
```

### 2. Install Package Requirement
```bash
npm install
```

### 3. Fire Up the Mobile Client
```bash
npx expo start
```
Scan the generated terminal QR code using the Expo Go app on your physical device to begin navigating.

---

## 📄 Full Project Specifications & Documentation

### 1. Project Title
Voice Vision Assist — Voice-Activated Spatial Guide for the Visually Impaired

### 2. Abstract
Voice Vision Assist is an accessibility-focused mobile client and backend ecosystem engineered to grant greater environmental independence to visually impaired individuals. By streaming voice prompts and real-time camera frames from a React Native mobile application to a Python Flask gateway, the system leverages multimodal AI to map physical rooms, identify immediate navigational hazards, and stream clear, spoken spatial reasoning instructions back to the user completely hands-free.

### 3. Selected Track
Accessibility / Healthcare / Open Innovation

### 4. Objectives
* **Low-Latency Spatial Auditing:** Deliver real-time, safety-first environment mapping to identify obstacles, table boundaries, or loose wires.
* **Intelligent Hazard Flagging:** Go beyond simple object labeling by explaining where an object is in 3D space relative to the user.

### 5. Proposed Solution
The application splits heavy computational workloads away from the edge device:
* **The Client (Frontend):** Built with React Native (Expo) to ensure native device camera and audio recording capabilities while preserving battery life.
* **The Server (Backend Core):** Built with Python Flask to handle raw multi-part payloads, manage environment security keys, and directly interface with Google's GenAI SDK (Gemini 1.5) to return safety instructions.
