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
