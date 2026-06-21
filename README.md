# EcoTrack AI — Personal Carbon Footprint Reduction Platform

EcoTrack AI is a premium, highly interactive web application designed to help individuals calculate, monitor, and reduce their daily carbon footprint. Using sleek glassmorphism design tokens, micro-animations, and AI-driven simulators, it turns personal sustainability into an engaging, actionable decision-making experience.

---

## 🌟 Core Features

### 1. Carbon Footprint Calculator
- Custom input controls (sliders and card grids) to capture monthly habits across:
  - **Transportation**: Car, flights, public transit, and biking distance.
  - **Home Energy**: Electricity (kWh), natural gas (therms), and water consumption.
  - **Diet**: Vegan, vegetarian, mixed, and meat-heavy habits.
  - **Shopping**: Clothing items, gadgets, and home deliveries.
- Calculates subtotals dynamically using verified carbon conversion factors (expressed in tons of CO₂/month).

### 2. Carbon Dashboard
- **Carbon Gauge**: A circular telemetry ring showing total carbon tons, color-coded by category levels (Optimal < 2.5t, Medium < 4.0t, High).
- **Category Breakdown**: Dynamic percentage bars showcasing the sub-elements (Transit, Energy, Food, Shopping).
- **Carbon Trend Curve**: An interactive SVG line graph showing actual emissions versus Kyoto targets.
- **Equivalent Metrics**: Real-time cards showing equivalents (trees planted, driving avoided).

### 3. AI Sustainability Coach (Coach Green)
- **Top Impact Cards**: Dynamic suggestions matching the highest emissions source.
- **Conversational Chat**: Interactive chatbot simulator using keyword triggers to offer targeted suggestions (e.g. food swaps, solar panels, and clothing rentals).

### 4. Carbon Footprint Digital Twin (Hackathon Winner Feature)
- A virtual lifestyle avatar sandbox.
- Users toggle hypothetical choices (e.g. "Zero Car Travel", "100% Home Solar", "Go Vegetarian", "Apparel Thrifting") and watch their Twin Avatar react (e.g. transitioning from tired planet 🥵 to blooming forest 🌳✨) and update simulated footprint tons in real time.

### 5. AI Receipt Scanner
- Simulate scanning retail invoices with OCR analysis.
- Extracts items, estimates carbon impacts, offers sustainable swap alternatives, and logs carbon savings directly to the user score.

### 6. Gamification & Smart Goals
- **Habit Checklist**: Earn Eco Points and build daily streaks.
- **Achievements Grid**: Unlock verified ecological badges (Eco Beginner, Green Warrior, Carbon Hero, Planet Protector).
- **Community Impact**: Join regional chapters and view friends' carbon offset leaderboards.
- **Marketplace**: Support verified carbon offset programs (reforestation, solar, ocean cleanup) to drive your net footprint to absolute zero.

---

## 🎨 Design System & Aesthetics

- **Theme**: Dark glassmorphism with high-contrast slate surfaces, backing blur filters, and glowing hover states.
- **Harmony Scheme**: Color-coded category values for easy scannability:
  - 🚗 Transportation: **Sky Blue** (`#0ea5e9`)
  - ⚡ Energy: **Amber/Gold** (`#eab308`)
  - 🥬 Food: **Purple** (`#a855f7`)
  - 🛍️ Retail/Shopping: **Rose/Pink** (`#ec4899`)
  - 🌱 Success & Primary: **Emerald Green** (`#10b981`)
- **Typography**: Premium typography using Google Fonts ('Outfit' and 'Plus Jakarta Sans').

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, Vite
- **Styling**: Vanilla CSS Variables, Backdrop Blur Filters, Transitions
- **Icons**: Lucide React
- **Data Rendering**: Dynamic SVGs for gauges and trend curves

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18+ recommended)
- npm

### Installation
1. Change directory to the app:
   ```bash
   cd ecotrack-ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser:
   [http://localhost:5173/](http://localhost:5173/)
