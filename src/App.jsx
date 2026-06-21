import { useState, useEffect, useMemo, useCallback } from 'react';
import { Leaf } from 'lucide-react';

// Hooks & Utilities
import { useCarbonMath } from './hooks/useCarbonMath';
import { useNeuralNetwork } from './hooks/useNeuralNetwork';
import { loadState, saveState } from './utils/localStorage';

// Components
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Notification } from './components/common/Notification';

// Tabs Components
import { Dashboard } from './components/tabs/Dashboard';
import { Calculator } from './components/tabs/Calculator';
import { AICoach } from './components/tabs/AICoach';
import { DigitalTwin } from './components/tabs/DigitalTwin';
import { ReceiptScanner } from './components/tabs/ReceiptScanner';
import { Marketplace } from './components/tabs/Marketplace';
import { AILab } from './components/tabs/AILab';

import './App.css';

// Receipt Templates
const RECEIPT_OPTIONS = {
  zara: {
    title: 'Zara & Gourmet Meat Express Invoice',
    lines: [
      { id: 'z1', name: 'Synthetic Trench Coat (Zara)', co2: 24.0, swapName: 'Organic Cotton Thrift Coat', swapCo2: 3.0, saving: 21.0 },
      { id: 'z2', name: 'Prime Beef Steak 800g (Butcher)', co2: 29.5, swapName: 'Beyond Plant-Based Steak', swapCo2: 2.1, saving: 27.4 }
    ]
  },
  amazon: {
    title: 'Amazon Online Electronics Bill',
    lines: [
      { id: 'a1', name: '42" LED Smart TV', co2: 85.0, swapName: 'Certified Reconditioned EnergyStar TV', swapCo2: 35.0, saving: 50.0 },
      { id: 'a2', name: 'Expedited Express Delivery', co2: 4.8, swapName: 'Consolidated Ground Delivery', swapCo2: 1.2, saving: 3.6 }
    ]
  }
};

function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  // Load initial state from localStorage
  const savedState = useMemo(() => loadState() || {}, []);

  // 1. Calculator Sliders State
  const [carKm, setCarKm] = useState(savedState.sliders?.carKm ?? 450);
  const [flightKm, setFlightKm] = useState(savedState.sliders?.flightKm ?? 800);
  const [transitKm, setTransitKm] = useState(savedState.sliders?.transitKm ?? 250);
  const [electricityKwh, setElectricityKwh] = useState(savedState.sliders?.electricityKwh ?? 280);
  const [gasTherms, setGasTherms] = useState(savedState.sliders?.gasTherms ?? 30);
  const [waterGallons, setWaterGallons] = useState(savedState.sliders?.waterGallons ?? 1500);
  const [diet, setDiet] = useState(savedState.sliders?.diet ?? 'mixed');
  const [clothesItems, setClothesItems] = useState(savedState.sliders?.clothesItems ?? 2);
  const [electronicsItems, setElectronicsItems] = useState(savedState.sliders?.electronicsItems ?? 1);
  const [deliveriesCount, setDeliveriesCount] = useState(savedState.sliders?.deliveriesCount ?? 6);

  // 2. Interactive AI model use in Calculator
  const [useAiModel, setUseAiModel] = useState(false);

  // 3. AI Lab Hyperparameter State (persisted here to retain during navigation)
  const [datasetSize, setDatasetSize] = useState(200);
  const [epochs, setEpochs] = useState(50);
  const [learningRate, setLearningRate] = useState(0.05);

  // Neural network training hook
  const {
    isTraining,
    currentEpoch,
    lossHistory,
    weights,
    bias,
    consoleLogs,
    modelTrained,
    runModelTraining,
    runModelPrediction,
    testCarKm, setTestCarKm,
    testElectricity, setTestElectricity,
    testDiet, setTestDiet,
    testShopping, setTestShopping,
    predictedCarbon,
    actualCarbon,
    alignmentError
  } = useNeuralNetwork({ learningRate, epochs, datasetSize });

  // 4. Carbon Math Integration
  const emissions = useCarbonMath({
    carKm,
    flightKm,
    transitKm,
    electricityKwh,
    gasTherms,
    waterGallons,
    diet,
    clothesItems,
    electronicsItems,
    deliveriesCount,
    useAiModel,
    modelWeights: weights,
    modelBias: bias
  });

  // 5. Goals & Gamification State
  const [offsetTons, setOffsetTons] = useState(0.4);
  const [ecoScore, setEcoScore] = useState(savedState.ecoScore ?? 820);
  const [streak, setStreak] = useState(savedState.streak ?? 18);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCat, setNewGoalCat] = useState('General');

  const [goals, setGoals] = useState(savedState.goals ?? [
    { id: 'g1', title: 'Reduce emissions by 15%', progress: 68, target: '15% reduction', category: 'General' },
    { id: 'g2', title: 'Use public transport 5x / week', progress: 80, target: '5 trips', category: 'Transportation' },
    { id: 'g3', title: 'Cut electricity usage by 10%', progress: 30, target: '250 kWh limit', category: 'Energy' }
  ]);

  const [habits, setHabits] = useState(savedState.habits ?? [
    { id: 'h1', name: 'Walked/cycled instead of driving', co2Saved: 4.5, points: 15, checked: false },
    { id: 'h2', name: 'Used reusable water bottles/bags', co2Saved: 1.2, points: 10, checked: false },
    { id: 'h3', name: 'Turned off AC/appliances when away', co2Saved: 3.0, points: 12, checked: false },
    { id: 'h4', name: 'Recycled household plastics & paper', co2Saved: 1.8, points: 10, checked: false },
    { id: 'h5', name: 'Ate a fully plant-based meal today', co2Saved: 5.2, points: 20, checked: false },
    { id: 'h6', name: 'Composted kitchen food scraps', co2Saved: 1.5, points: 10, checked: false }
  ]);

  const [activeChallenges, setActiveChallenges] = useState([
    { id: 'c1', title: '7-Day No-Car Challenge', desc: 'Swap all car commutes with biking or public transit.', participants: 1840, joined: false },
    { id: 'c2', title: 'Plastic-Free Week', desc: 'Avoid single-use plastic cups, containers, and packaging.', participants: 3205, joined: true },
    { id: 'c3', title: 'Zero Waste Weekend', desc: 'Ensure all food scrap waste is composted and zero landfill trash produced.', participants: 852, joined: false }
  ]);

  // 6. OCR Receipt State
  const [selectedReceiptKey, setSelectedReceiptKey] = useState('zara');
  const [ocrState, setOcrState] = useState({
    status: 'idle',
    progress: 0,
    resultItems: null
  });

  // 7. AI Sustainability Coach Conversation History
  const [messages, setMessages] = useState([
    { sender: 'coach', text: `Hello! I am Coach Green, your AI Sustainability Guide. I've analyzed your monthly emissions (currently at ${emissions.grossTotalTons.toFixed(2)} tons CO₂). What aspect of your lifestyle would you like to optimize today?` }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Save state to localStorage whenever state changes
  useEffect(() => {
    saveState({
      ecoScore,
      streak,
      goals,
      habits,
      sliders: {
        carKm,
        flightKm,
        transitKm,
        electricityKwh,
        gasTherms,
        waterGallons,
        diet,
        clothesItems,
        electronicsItems,
        deliveriesCount
      }
    });
  }, [
    ecoScore,
    streak,
    goals,
    habits,
    carKm,
    flightKm,
    transitKm,
    electricityKwh,
    gasTherms,
    waterGallons,
    diet,
    clothesItems,
    electronicsItems,
    deliveriesCount
  ]);

  // Handlers
  const handleHabitToggle = useCallback((id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextChecked = !h.checked;
        if (nextChecked) {
          setEcoScore(s => s + h.points);
          if (Math.random() > 0.6) setStreak(st => st + 1);
          setToast({ message: `Logged habit! Earned +${h.points} pts.`, type: 'success' });
        } else {
          setEcoScore(s => Math.max(0, s - h.points));
        }
        return { ...h, checked: nextChecked };
      }
      return h;
    }));
  }, []);

  const handleAddGoal = useCallback((e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;

    const newGoal = {
      id: Date.now().toString(),
      title: newGoalTitle.substring(0, 60),
      progress: 0,
      target: 'Action item',
      category: newGoalCat
    };

    setGoals(prev => [...prev, newGoal]);
    setNewGoalTitle('');
    setToast({ message: 'Goal added successfully!', type: 'success' });
  }, [newGoalTitle, newGoalCat]);

  const incrementGoalProgress = useCallback((id) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextProgress = Math.min(100, g.progress + 10);
        if (nextProgress === 100) {
          setEcoScore(s => s + 50);
          setToast({ message: `Goal Completed! Earned +50 pts!`, type: 'success' });
        }
        return { ...g, progress: nextProgress };
      }
      return g;
    }));
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setToast({ message: 'Goal removed.', type: 'info' });
  }, []);

  const toggleChallengeJoin = useCallback((id) => {
    setActiveChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const nextJoined = !c.joined;
        if (nextJoined) {
          setEcoScore(s => s + 50);
          setToast({ message: `Joined challenge! Earned +50 pts.`, type: 'success' });
        }
        return { ...c, joined: nextJoined };
      }
      return c;
    }));
  }, []);

  const handlePurchaseOffset = useCallback((projectName, tons, rate) => {
    const cost = tons * rate;
    setOffsetTons(prev => prev + tons);
    setEcoScore(prev => prev + tons * 80);
    setToast({ message: `Successfully purchased ${tons} Tons offset from ${projectName} for ₹${cost}! (+${tons * 80} pts)`, type: 'success' });
  }, []);

  // OCR Simulator
  const runReceiptOcr = useCallback(() => {
    setOcrState({ status: 'processing', progress: 0, resultItems: null });

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setOcrState(prev => ({ ...prev, progress: currentProgress }));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setOcrState({
          status: 'complete',
          progress: 100,
          resultItems: RECEIPT_OPTIONS[selectedReceiptKey]?.lines || []
        });
      }
    }, 300);
  }, [selectedReceiptKey]);

  const applyOcrSwaps = useCallback(() => {
    setEcoScore(prev => prev + 45);
    setOcrState({ status: 'idle', progress: 0, resultItems: null });
    setToast({ message: 'Accepted carbon swaps! Logged +45 eco points.', type: 'success' });
  }, []);

  // AI Sustainability Coach
  const handleCoachSendMessage = useCallback((e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    const prompt = chatInput.toLowerCase();
    setChatInput('');

    setTimeout(() => {
      let responseText = "";
      if (prompt.includes('transport') || prompt.includes('car') || prompt.includes('flight') || prompt.includes('fly')) {
        responseText = `🚗 Your transit accounts for ${emissions.transportPct}% of your emissions. Try reducing single-occupancy driving. Switch 3 car trips a week to cycling/transit to save ~120kg CO₂/month. When booking flights, fly economy and purchase offsets directly in our Marketplace tab!`;
      } else if (prompt.includes('food') || prompt.includes('meat') || prompt.includes('vegan') || prompt.includes('vegetarian') || prompt.includes('eat')) {
        responseText = `🥬 Diet accounts for ${emissions.foodPct}% of your footprint. Did you know that beef generates nearly 27kg CO₂ per kg, while lentils generate only 0.9kg? Swapping beef for a plant-based meal 2 times a week will shave ~45kg CO₂ off your monthly average. Try the 'Ate a plant-based meal' habit!`;
      } else if (prompt.includes('energy') || prompt.includes('electricity') || prompt.includes('solar') || prompt.includes('gas') || prompt.includes('ac')) {
        responseText = `⚡ Utilities contribute ${emissions.energyPct}% of your emissions. Consider setting your smart thermostat to 24°C in summer. Replacing old halogen bulbs with energy-efficient LEDs reduces lighting energy by 80%. In the Digital Twin Sandbox tab, you can simulate installing solar panels to see the dramatic drops!`;
      } else if (prompt.includes('shopping') || prompt.includes('clothes') || prompt.includes('buy') || prompt.includes('online')) {
        responseText = `🛍️ Shopping habits contribute ${emissions.shoppingPct}% of your footprint. Opting for vintage or thrift apparel instead of fast fashion avoids 90% of the manufacturing and shipping footprint. Try combining online orders to reduce delivery vehicle trips!`;
      } else {
        responseText = `🌱 I recommend starting with our Daily Eco Habit Tracker. Logging simple actions like using a reusable bottle or composting food waste creates consistent momentum. Currently, your streak is ${streak} days—let's push it past 20 to unlock your Carbon Hero Badge!`;
      }

      setMessages(prev => [...prev, { sender: 'coach', text: responseText }]);
    }, 600);
  }, [emissions, streak]);

  // Digital Twin state calculations
  const [dtSolar, setDtSolar] = useState(false);
  const [dtVegetarian, setDtVegetarian] = useState(false);
  const [dtNoCar, setDtNoCar] = useState(false);
  const [dtSecondHand, setDtSecondHand] = useState(false);

  const twinStats = useMemo(() => {
    let simTransport = emissions.transportTotal;
    let simEnergy = emissions.energyTotal;
    let simFood = emissions.foodCo2;
    let simShopping = emissions.shoppingTotal;

    if (dtNoCar) {
      simTransport = Math.max(0, simTransport - emissions.carCo2);
    }
    if (dtSolar) {
      simEnergy = Math.max(0, simEnergy - emissions.electricityCo2);
    }
    if (dtVegetarian) {
      simFood = 120;
    }
    if (dtSecondHand) {
      simShopping = Math.max(0, simShopping - (emissions.clothesCo2 * 0.75));
    }

    const simTotalKg = simTransport + simEnergy + simFood + simShopping;
    const simTotalTons = simTotalKg / 1000;
    const reductionPercent = emissions.grossTotalKg > 0 
      ? Math.max(0, Math.round(((emissions.grossTotalKg - simTotalKg) / emissions.grossTotalKg) * 100))
      : 0;

    let avatarEmoji = '🥵';
    let avatarName = 'Carbon Intensive';
    let avatarColor = 'rgba(239, 68, 68, 0.4)';
    
    if (reductionPercent >= 45) {
      avatarEmoji = '🌳✨';
      avatarName = 'Planet Protector';
      avatarColor = 'rgba(16, 185, 129, 0.4)';
    } else if (reductionPercent >= 25) {
      avatarEmoji = '🥬';
      avatarName = 'Green Warrior';
      avatarColor = 'rgba(52, 211, 153, 0.25)';
    } else if (reductionPercent > 0) {
      avatarEmoji = '🌱';
      avatarName = 'Eco Beginner';
      avatarColor = 'rgba(234, 179, 8, 0.25)';
    }

    return {
      simTotalTons,
      reductionPercent,
      avatarEmoji,
      avatarName,
      avatarColor
    };
  }, [emissions, dtSolar, dtVegetarian, dtNoCar, dtSecondHand]);

  // Gamification Badges Meta
  const badges = useMemo(() => {
    return [
      { id: 'b1', name: 'Eco Beginner', emoji: '🌱', desc: 'Welcome! Complete your lifestyle calculator', unlocked: true },
      { id: 'b2', name: 'Green Warrior', emoji: '🥬', desc: 'Keep your monthly emissions below 3.0 tons CO₂', unlocked: emissions.grossTotalTons < 3.0 },
      { id: 'b3', name: 'Carbon Hero', emoji: '🌳', desc: 'Achieve carbon neutrality or offset >0.8 tons', unlocked: offsetTons >= 0.8 || emissions.grossTotalTons - offsetTons <= 0 },
      { id: 'b4', name: 'Planet Protector', emoji: '🌎', desc: 'Maintain an eco-streak of 15+ days', unlocked: streak >= 15 }
    ];
  }, [emissions.grossTotalTons, offsetTons, streak]);

  const netFootprint = Math.max(0, emissions.grossTotalTons - offsetTons);

  return (
    <ErrorBoundary>
      {/* Floating Header */}
      <header className="app-header" role="banner">
        <div className="container header-container">
          <button 
            className="app-logo" 
            onClick={() => setActiveTab('dashboard')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
            aria-label="EcoTrack AI logo, click to return to Dashboard"
          >
            <span className="logo-icon" aria-hidden="true"><Leaf size={24} fill="currentColor" /></span>
            <span style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>EcoTrack <span style={{ color: 'var(--primary)' }}>AI</span></span>
          </button>
          
          <nav className="header-nav" role="navigation" aria-label="Main Navigation">
            <ul style={{ display: 'flex', gap: '8px', listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'calculator', label: 'Calculator' },
                { id: 'coach', label: 'AI Coach' },
                { id: 'twin', label: 'Digital Twin' },
                { id: 'scanner', label: 'Receipt Scanner' },
                { id: 'marketplace', label: 'Offsets & Community' },
                { id: 'lab', label: 'AI Lab' }
              ].map(tab => (
                <li key={tab.id}>
                  <button 
                    className={`nav-link-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tabpanel-${tab.id}`}
                    id={`tab-${tab.id}`}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} tabIndex={0} aria-label={`Score status: ${ecoScore} points, streak is ${streak} days`}>
            <div className="desktop-score" style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Eco Score</div>
              <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{ecoScore} pts</div>
            </div>
            <div className="streak-display">
              <span className="streak-fire" aria-hidden="true">🔥</span>
              <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{streak}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }} id="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            emissions={emissions}
            offsetTons={offsetTons}
            netFootprint={netFootprint}
            ecoScore={ecoScore}
            streak={streak}
            habits={habits}
            goals={goals}
            newGoalTitle={newGoalTitle}
            newGoalCat={newGoalCat}
            activeChallenges={activeChallenges}
            badges={badges}
            setActiveTab={setActiveTab}
            setNewGoalTitle={setNewGoalTitle}
            setNewGoalCat={setNewGoalCat}
            handleHabitToggle={handleHabitToggle}
            handleAddGoal={handleAddGoal}
            incrementGoalProgress={incrementGoalProgress}
            deleteGoal={deleteGoal}
            toggleChallengeJoin={toggleChallengeJoin}
          />
        )}

        {activeTab === 'calculator' && (
          <Calculator
            carKm={carKm} setCarKm={setCarKm}
            flightKm={flightKm} setFlightKm={setFlightKm}
            transitKm={transitKm} setTransitKm={setTransitKm}
            electricityKwh={electricityKwh} setElectricityKwh={setElectricityKwh}
            gasTherms={gasTherms} setGasTherms={setGasTherms}
            waterGallons={waterGallons} setWaterGallons={setWaterGallons}
            diet={diet} setDiet={setDiet}
            clothesItems={clothesItems} setClothesItems={setClothesItems}
            electronicsItems={electronicsItems} setElectronicsItems={setElectronicsItems}
            deliveriesCount={deliveriesCount} setDeliveriesCount={setDeliveriesCount}
            emissions={emissions}
            modelTrained={modelTrained}
            useAiModel={useAiModel}
            setUseAiModel={setUseAiModel}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'coach' && (
          <AICoach
            emissions={emissions}
            diet={diet}
            streak={streak}
            messages={messages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleCoachSendMessage={handleCoachSendMessage}
          />
        )}

        {activeTab === 'twin' && (
          <DigitalTwin
            emissions={emissions}
            dtSolar={dtSolar} setDtSolar={setDtSolar}
            dtVegetarian={dtVegetarian} setDtVegetarian={setDtVegetarian}
            dtNoCar={dtNoCar} setDtNoCar={setDtNoCar}
            dtSecondHand={dtSecondHand} setDtSecondHand={setDtSecondHand}
            twinStats={twinStats}
            offsetTons={offsetTons}
          />
        )}

        {activeTab === 'scanner' && (
          <ReceiptScanner
            ocrState={ocrState}
            selectedReceiptKey={selectedReceiptKey}
            setSelectedReceiptKey={setSelectedReceiptKey}
            runReceiptOcr={runReceiptOcr}
            applyOcrSwaps={applyOcrSwaps}
            receiptOptions={RECEIPT_OPTIONS}
          />
        )}

        {activeTab === 'marketplace' && (
          <Marketplace
            offsetTons={offsetTons}
            handlePurchaseOffset={handlePurchaseOffset}
            ecoScore={ecoScore}
          />
        )}

        {activeTab === 'lab' && (
          <AILab
            datasetSize={datasetSize} setDatasetSize={setDatasetSize}
            epochs={epochs} setEpochs={setEpochs}
            learningRate={learningRate} setLearningRate={setLearningRate}
            isTraining={isTraining}
            currentEpoch={currentEpoch}
            lossHistory={lossHistory}
            weights={weights}
            bias={bias}
            consoleLogs={consoleLogs}
            runModelTraining={runModelTraining}
            runModelPrediction={runModelPrediction}
            testCarKm={testCarKm} setTestCarKm={setTestCarKm}
            testElectricity={testElectricity} setTestElectricity={setTestElectricity}
            testDiet={testDiet} setTestDiet={setTestDiet}
            testShopping={testShopping} setTestShopping={setTestShopping}
            predictedCarbon={predictedCarbon}
            actualCarbon={actualCarbon}
            alignmentError={alignmentError}
            modelTrained={modelTrained}
            useAiModel={useAiModel}
            setUseAiModel={setUseAiModel}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', padding: '24px 0', borderTop: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        <p>© 2026 EcoTrack AI. Empowering decentralized carbon footprint monitoring.</p>
      </footer>

      {/* Accessible Non-blocking Toast Alerts */}
      {toast && (
        <Notification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ErrorBoundary>
  );
}

export default App;
