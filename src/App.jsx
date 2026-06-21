import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Leaf, 
  Car, 
  Zap, 
  Utensils, 
  ShoppingBag, 
  Flame, 
  Sparkles, 
  Target, 
  Upload, 
  Info, 
  Check, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  ShieldAlert, 
  Globe, 
  Award, 
  TrendingDown, 
  Plus, 
  X,
  Plane,
  Bike,
  Activity,
  Heart,
  Droplets,
  HelpCircle,
  QrCode,
  Compass
} from 'lucide-react';
import './App.css';

function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('dashboard');

  /* ==========================================
     AI MODEL TRAINING LAB STATE
     ========================================== */
  const [learningRate, setLearningRate] = useState(0.05);
  const [epochs, setEpochs] = useState(50);
  const [hiddenNeurons, setHiddenNeurons] = useState(8);
  const [datasetSize, setDatasetSize] = useState(200);
  
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [lossHistory, setLossHistory] = useState([]);
  const [weights, setWeights] = useState([0.15, 0.28, 0.42, 0.12]); 
  const [bias, setBias] = useState(0.05);
  const [consoleLogs, setConsoleLogs] = useState([
    '[INFO] System ready. Configure parameters and click "Train Model" to start fitting the neural net.'
  ]);
  const [modelTrained, setModelTrained] = useState(false);

  // Test Inference state
  const [testCarKm, setTestCarKm] = useState(450);
  const [testElectricity, setTestElectricity] = useState(250);
  const [testDiet, setTestDiet] = useState('mixed');
  const [testShopping, setTestShopping] = useState(3);
  
  const [predictedCarbon, setPredictedCarbon] = useState(null);
  const [actualCarbon, setActualCarbon] = useState(null);
  const [alignmentError, setAlignmentError] = useState(null);

  const runModelTraining = () => {
    if (isTraining) return;
    setIsTraining(true);
    setCurrentEpoch(0);
    setLossHistory([]);
    setModelTrained(false);
    
    // Generate dataset
    const dataset = [];
    for (let i = 0; i < datasetSize; i++) {
      const car = Math.random() * 1000;
      const flight = Math.random() * 2000;
      const transit = Math.random() * 800;
      
      const electricity = Math.random() * 800;
      const gas = Math.random() * 120;
      const water = Math.random() * 3000;
      
      const dietTypes = ['vegan', 'vegetarian', 'mixed', 'meat-heavy'];
      const dietType = dietTypes[Math.floor(Math.random() * dietTypes.length)];
      let foodCo2 = 220;
      if (dietType === 'vegan') foodCo2 = 75;
      else if (dietType === 'vegetarian') foodCo2 = 120;
      else if (dietType === 'meat-heavy') foodCo2 = 380;
      
      const clothes = Math.random() * 8;
      const gadgets = Math.random() * 3;
      const deliveries = Math.random() * 15;
      
      const transportTotal = car * 0.18 + flight * 0.11 + transit * 0.04;
      const energyTotal = electricity * 0.38 + gas * 5.3 + water * 0.002;
      const shoppingTotal = clothes * 12 + gadgets * 75 + deliveries * 2.2;
      const totalKg = transportTotal + energyTotal + foodCo2 + shoppingTotal;
      const targetTons = totalKg / 1000;
      
      const u1 = transportTotal / 1000; 
      const u2 = energyTotal / 1000;    
      const u3 = foodCo2 / 1000;       
      const u4 = shoppingTotal / 1000;   
      
      dataset.push({
        inputs: [u1, u2, u3, u4],
        target: targetTons
      });
    }

    let w = [Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3];
    let b = Math.random() * 0.2;
    setWeights(w);
    setBias(b);

    setConsoleLogs(prev => [
      `[INIT] Generated dataset of ${datasetSize} samples.`,
      `[INIT] Initialized weights: w=[${w.map(n => n.toFixed(3)).join(', ')}], b=${b.toFixed(3)}`,
      `[INIT] Starting backpropagation solver...`,
      ...prev
    ]);

    let epochCount = 0;
    const history = [];
    
    const interval = setInterval(() => {
      epochCount++;
      if (epochCount > epochs) {
        clearInterval(interval);
        setIsTraining(false);
        setModelTrained(true);
        setConsoleLogs(prev => [
          `[SUCCESS] Training complete after ${epochs} epochs!`,
          `[MODEL] Final weights: w=[${w.map(n => n.toFixed(3)).join(', ')}], b=${b.toFixed(3)}`,
          `[MODEL] Deployed model. Verified target alignment.`,
          ...prev
        ]);
        return;
      }

      const shuffled = [...dataset].sort(() => Math.random() - 0.5);
      let sumSquaredError = 0;
      
      for (let s = 0; s < shuffled.length; s++) {
        const { inputs, target } = shuffled[s];
        const [u1, u2, u3, u4] = inputs;
        
        const prediction = w[0] * u1 + w[1] * u2 + w[2] * u3 + w[3] * u4 + b;
        const error = target - prediction;
        sumSquaredError += error * error;
        
        w[0] += learningRate * error * u1;
        w[1] += learningRate * error * u2;
        w[2] += learningRate * error * u3;
        w[3] += learningRate * error * u4;
        b += learningRate * error;
      }
      
      const meanSquaredError = sumSquaredError / shuffled.length;
      history.push(meanSquaredError);
      
      setCurrentEpoch(epochCount);
      setLossHistory([...history]);
      setWeights([...w]);
      setBias(b);
      
      if (epochCount === 1 || epochCount % Math.max(1, Math.round(epochs / 8)) === 0 || epochCount === epochs) {
        setConsoleLogs(prev => [
          `[EPOCH ${epochCount}/${epochs}] Average MSE Loss: ${meanSquaredError.toFixed(6)}`,
          ...prev
        ]);
      }
    }, 40); 
  };

  const runModelPrediction = (e) => {
    if (e) e.preventDefault();
    
    const transportTotal = (testCarKm * 0.18 + 800 * 0.11 + 250 * 0.04); 
    const energyTotal = testElectricity * 0.38 + 30 * 5.3 + 1500 * 0.002;
    let foodCo2 = 220;
    if (testDiet === 'vegan') foodCo2 = 75;
    else if (testDiet === 'vegetarian') foodCo2 = 120;
    else if (testDiet === 'meat-heavy') foodCo2 = 380;
    const shoppingTotal = testShopping * 12 + 1 * 75 + 6 * 2.2;
    
    const actualKg = transportTotal + energyTotal + foodCo2 + shoppingTotal;
    const actualTonsVal = actualKg / 1000;
    
    const u1 = transportTotal / 1000;
    const u2 = energyTotal / 1000;
    const u3 = foodCo2 / 1000;
    const u4 = shoppingTotal / 1000;
    
    const predictedTonsVal = weights[0] * u1 + weights[1] * u2 + weights[2] * u3 + weights[3] * u4 + bias;
    
    setPredictedCarbon(predictedTonsVal);
    setActualCarbon(actualTonsVal);
    
    const errorVal = Math.abs(actualTonsVal - predictedTonsVal);
    setAlignmentError(errorVal);
  };

  /* ==========================================
     CARBON CALCULATOR STATE (Monthly Habits)
     ========================================== */
  const [carKm, setCarKm] = useState(450);
  const [flightKm, setFlightKm] = useState(800);
  const [bikeKm, setBikeKm] = useState(60);
  const [transitKm, setTransitKm] = useState(250);
  
  const [electricityKwh, setElectricityKwh] = useState(280);
  const [gasTherms, setGasTherms] = useState(30);
  const [waterGallons, setWaterGallons] = useState(1500);

  const [diet, setDiet] = useState('mixed'); // vegan, vegetarian, mixed, meat-heavy
  
  const [clothesItems, setClothesItems] = useState(2);
  const [electronicsItems, setElectronicsItems] = useState(1);
  const [deliveriesCount, setDeliveriesCount] = useState(6);

  /* ==========================================
     CARBON EMISSION CALCULATIONS
     ========================================== */
  const emissions = useMemo(() => {
    // Transportation emissions (kg CO2 / month)
    const carCo2 = carKm * 0.18; // 180g per km
    const flightCo2 = flightKm * 0.11; // 110g per km
    const transitCo2 = transitKm * 0.04; // 40g per km
    const transportTotal = carCo2 + flightCo2 + transitCo2;

    // Home energy emissions (kg CO2 / month)
    const electricityCo2 = electricityKwh * 0.38; // 380g per kWh
    const gasCo2 = gasTherms * 5.3; // 5.3kg per therm
    const waterCo2 = waterGallons * 0.002; // 2g per gallon
    const energyTotal = electricityCo2 + gasCo2 + waterCo2;

    // Food emissions (kg CO2 / month)
    let foodCo2 = 220; // default mixed
    if (diet === 'vegan') foodCo2 = 75;
    else if (diet === 'vegetarian') foodCo2 = 120;
    else if (diet === 'meat-heavy') foodCo2 = 380;

    // Shopping emissions (kg CO2 / month)
    const clothesCo2 = clothesItems * 12; // 12kg per clothing item
    const electronicsCo2 = electronicsItems * 75; // 75kg per gadget
    const deliveriesCo2 = deliveriesCount * 2.2; // 2.2kg per delivery
    const shoppingTotal = clothesCo2 + electronicsCo2 + deliveriesCo2;

    const grossTotalKg = transportTotal + energyTotal + foodCo2 + shoppingTotal;
    const grossTotalTons = grossTotalKg / 1000;

    const transportPct = grossTotalKg > 0 ? Math.round((transportTotal / grossTotalKg) * 100) : 0;
    const energyPct = grossTotalKg > 0 ? Math.round((energyTotal / grossTotalKg) * 100) : 0;
    const foodPct = grossTotalKg > 0 ? Math.round((foodCo2 / grossTotalKg) * 100) : 0;
    const shoppingPct = grossTotalKg > 0 ? Math.round((shoppingTotal / grossTotalKg) * 100) : 0;

    return {
      carCo2, flightCo2, transitCo2, transportTotal,
      electricityCo2, gasCo2, waterCo2, energyTotal,
      foodCo2,
      clothesCo2, electronicsCo2, deliveriesCo2, shoppingTotal,
      grossTotalKg, grossTotalTons,
      transportPct, energyPct, foodPct, shoppingPct
    };
  }, [carKm, flightKm, transitKm, electricityKwh, gasTherms, waterGallons, diet, clothesItems, electronicsItems, deliveriesCount]);

  /* ==========================================
     CARBON OFFSET & GOALS STATE
     ========================================== */
  const [offsetTons, setOffsetTons] = useState(0.4);
  const [offsetProjects, setOffsetProjects] = useState([
    { id: 'tree', name: 'Reforestation in Western Ghats', priceRate: 450, offsetVal: 0.5, active: false },
    { id: 'solar', name: 'Sahara Solar Project', priceRate: 350, offsetVal: 0.4, active: true },
    { id: 'ocean', name: 'Pacific Ocean Cleanup Initiative', priceRate: 600, offsetVal: 0.6, active: false }
  ]);
  const [goals, setGoals] = useState([
    { id: 'g1', title: 'Reduce emissions by 15%', progress: 68, target: '15% reduction', category: 'General' },
    { id: 'g2', title: 'Use public transport 5x / week', progress: 80, target: '5 trips', category: 'Transportation' },
    { id: 'g3', title: 'Cut electricity usage by 10%', progress: 30, target: '250 kWh limit', category: 'Energy' }
  ]);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCat, setNewGoalCat] = useState('General');

  // Sync Offset Projects with OffsetTons state
  useEffect(() => {
    const activeOffsets = offsetProjects
      .filter(p => p.active)
      .reduce((sum, p) => sum + p.offsetVal, 0);
    setOffsetTons(activeOffsets);
  }, [offsetProjects]);

  const toggleOffsetProject = (id) => {
    setOffsetProjects(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, active: !p.active };
      }
      return p;
    }));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    const newGoal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      progress: 0,
      target: 'Action item',
      category: newGoalCat
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
  };

  const incrementGoalProgress = (id) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const nextProgress = Math.min(100, g.progress + 10);
        return { ...g, progress: nextProgress };
      }
      return g;
    }));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  /* ==========================================
     DAILY ECO HABITS TRACKER STATE
     ========================================== */
  const [streak, setStreak] = useState(18);
  const [ecoScore, setEcoScore] = useState(820);
  const [habits, setHabits] = useState([
    { id: 'h1', name: 'Walked/cycled instead of driving', co2Saved: 4.5, points: 15, checked: false },
    { id: 'h2', name: 'Used reusable water bottles/bags', co2Saved: 1.2, points: 10, checked: false },
    { id: 'h3', name: 'Turned off AC/appliances when away', co2Saved: 3.0, points: 12, checked: false },
    { id: 'h4', name: 'Recycled household plastics & paper', co2Saved: 1.8, points: 10, checked: false },
    { id: 'h5', name: 'Ate a fully plant-based meal today', co2Saved: 5.2, points: 20, checked: false },
    { id: 'h6', name: 'Composted kitchen food scraps', co2Saved: 1.5, points: 10, checked: false }
  ]);

  const handleHabitToggle = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const nextChecked = !h.checked;
        if (nextChecked) {
          setEcoScore(prevScore => prevScore + h.points);
          // Set random streak increment chance for fun gamification
          if (Math.random() > 0.6) setStreak(prevStreak => prevStreak + 1);
        } else {
          setEcoScore(prevScore => Math.max(0, prevScore - h.points));
        }
        return { ...h, checked: nextChecked };
      }
      return h;
    }));
  };

  /* ==========================================
     DIGITAL TWIN SIMULATOR STATE
     ========================================== */
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
      simFood = 120; // set vegetarian diet level
    }
    if (dtSecondHand) {
      simShopping = Math.max(0, simShopping - (emissions.clothesCo2 * 0.75));
    }

    const simTotalKg = simTransport + simEnergy + simFood + simShopping;
    const simTotalTons = simTotalKg / 1000;
    const reductionPercent = Math.max(0, Math.round(((emissions.grossTotalKg - simTotalKg) / emissions.grossTotalKg) * 100));

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

  /* ==========================================
     RECEIPT SCANNER STATE & METADATA
     ========================================== */
  const [isScanning, setIsScanning] = useState(false);
  const [scanText, setScanText] = useState('');
  const [scannedResult, setScannedResult] = useState(null);

  const sampleReceipts = [
    {
      name: 'Zara & Meat Express Invoice',
      rawText: 'STORE #204: ZARA RETAIL\n1x Slim Fit Trench Coat - ₹4,499\nSTORE #402: THE GOURMET BUTCHER\n1x Prime Ribeye Beef Steak 800g - ₹1,850\nTOTAL AMOUNT: ₹6,349\nDATE: 2026-06-20',
      items: [
        { name: 'Synthetic Trench Coat (Zara)', cat: 'Shopping', co2: 24, alt: 'Organic Cotton Thrift Coat', altCo2: 3, saving: 21 },
        { name: 'Prime Beef Steak (Butcher)', cat: 'Food', co2: 29.5, alt: 'Beyond Plant-Based Steak', altCo2: 2.1, saving: 27.4 }
      ]
    },
    {
      name: 'Electronics & QuickDelivery Bill',
      rawText: 'AMAZON ONLINE RETAIL\n1x LED Smart TV 42" - ₹28,999\n2x Rapid Home Shipping Deliveries - ₹150\nTOTAL AMOUNT: ₹29,149\nDATE: 2026-06-21',
      items: [
        { name: '42" LED Smart TV (Amazon)', cat: 'Shopping', co2: 85, alt: 'Certified EnergyStar Reconditioned TV', altCo2: 35, saving: 50 },
        { name: 'Expedited Home Delivery (Amazon)', cat: 'Shopping', co2: 4.8, alt: 'Consolidated Standard Delivery', altCo2: 1.2, saving: 3.6 }
      ]
    }
  ];

  const handleScanReceipt = (receipt) => {
    setIsScanning(true);
    setScanText('Initializing camera OCR...');
    setScannedResult(null);

    setTimeout(() => {
      setScanText('Reading receipt items & prices...');
    }, 800);

    setTimeout(() => {
      setScanText('Matching purchases with carbon impact model...');
    }, 1600);

    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(receipt);
    }, 2400);
  };

  const handleApplyReceiptSaving = (saving, points) => {
    setEcoScore(prev => prev + points);
    // Add temporary banner or notification
    alert(`Logged to EcoTrack! Saved ${saving}kg CO₂ and earned +${points} Eco points.`);
    setScannedResult(null);
  };

  /* ==========================================
     AI SUSTAINABILITY COACH STATE
     ========================================== */
  const [messages, setMessages] = useState([
    { sender: 'coach', text: "Hello! I am Coach Green, your AI Sustainability Guide. I've analyzed your monthly emissions (currently at " + emissions.grossTotalTons.toFixed(2) + " tons CO₂). Tell me: what aspect of your lifestyle would you like to optimize today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCoachSendMessage = (e) => {
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
    }, 1000);
  };

  /* ==========================================
     GAMIFICATION BADGES META
     ========================================== */
  const badges = useMemo(() => {
    return [
      { id: 'b1', name: 'Eco Beginner', emoji: '🌱', desc: 'Welcome! Complete your lifestyle calculator', unlocked: true },
      { id: 'b2', name: 'Green Warrior', emoji: '🥬', desc: 'Keep your monthly emissions below 3.0 tons CO₂', unlocked: emissions.grossTotalTons < 3.0 },
      { id: 'b3', name: 'Carbon Hero', emoji: '🌳', desc: 'Achieve carbon neutrality or offset >0.8 tons', unlocked: offsetTons >= 0.8 || emissions.grossTotalTons - offsetTons <= 0 },
      { id: 'b4', name: 'Planet Protector', emoji: '🌎', desc: 'Maintain an eco-streak of 15+ days', unlocked: streak >= 15 }
    ];
  }, [emissions.grossTotalTons, offsetTons, streak]);

  const [activeChallenges, setActiveChallenges] = useState([
    { id: 'c1', title: '7-Day No-Car Challenge', desc: 'Swap all car commutes with biking or public transit.', participants: 1840, joined: false },
    { id: 'c2', title: 'Plastic-Free Week', desc: 'Avoid single-use plastic cups, containers, and packaging.', participants: 3205, joined: true },
    { id: 'c3', title: 'Zero Waste Weekend', desc: 'Ensure all food scrap waste is composted and zero landfill trash produced.', participants: 852, joined: false }
  ]);

  const toggleChallengeJoin = (id) => {
    setActiveChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const nextJoined = !c.joined;
        if (nextJoined) setEcoScore(prevScore => prevScore + 50); // reward points for joining
        return { ...c, joined: nextJoined };
      }
      return c;
    }));
  };

  // Safe Math Net Footprint
  const netFootprint = Math.max(0, emissions.grossTotalTons - offsetTons);

  return (
    <>
      {/* Floating Header */}
      <header className="app-header">
        <div className="container header-container">
          <a href="#" className="app-logo" onClick={() => setActiveTab('dashboard')}>
            <span className="logo-icon"><Leaf size={24} fill="currentColor" /></span>
            <span>EcoTrack <span style={{ color: 'var(--primary)' }}>AI</span></span>
          </a>
          <nav className="header-nav">
            <a 
              href="#dashboard" 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </a>
            <a 
              href="#calculator" 
              className={`nav-link ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              Calculator
            </a>
            <a 
              href="#coach" 
              className={`nav-link ${activeTab === 'coach' ? 'active' : ''}`}
              onClick={() => setActiveTab('coach')}
            >
              AI Coach
            </a>
            <a 
              href="#twin" 
              className={`nav-link ${activeTab === 'twin' ? 'active' : ''}`}
              onClick={() => setActiveTab('twin')}
            >
              Digital Twin
            </a>
            <a 
              href="#scanner" 
              className={`nav-link ${activeTab === 'scanner' ? 'active' : ''}`}
              onClick={() => setActiveTab('scanner')}
            >
              Receipt Scanner
            </a>
            <a 
              href="#marketplace" 
              className={`nav-link ${activeTab === 'marketplace' ? 'active' : ''}`}
              onClick={() => setActiveTab('marketplace')}
            >
              Offsets & Community
            </a>
            <a 
              href="#lab" 
              className={`nav-link ${activeTab === 'lab' ? 'active' : ''}`}
              onClick={() => setActiveTab('lab')}
            >
              AI Lab
            </a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right', display: 'none' /* toggle desktop-only view */ }} className="desktop-score">
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Eco Score</div>
              <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{ecoScore} pts</div>
            </div>
            <div className="streak-display">
              <span className="streak-fire">🔥</span>
              <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{streak}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* ==========================================
           TAB 1: CARBON DASHBOARD
           ========================================== */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            {/* Header intro */}
            <div style={{ marginTop: '32px', marginBottom: '24px' }}>
              <h1 style={{ fontWeight: '800' }}>Your Sustainability Hub</h1>
              <p>Real-time telemetry of your ecological footprint and reduction goals.</p>
            </div>

            {/* Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--primary-glow)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
                  <TrendingDown size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CO₂ SAVED THIS YEAR</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>1.95 Tons</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-text)' }}>↓ 14% from baseline</div>
                </div>
              </div>
              <div className="glass-card" style={{ borderLeft: '4px solid var(--transport)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--transport-glow)', padding: '12px', borderRadius: '12px', color: 'var(--transport)' }}>
                  <Leaf size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>EQUIVALENT TREES PLANTED</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>82 Trees</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated offset capacity</div>
                </div>
              </div>
              <div className="glass-card" style={{ borderLeft: '4px solid var(--energy)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--energy-glow)', padding: '12px', borderRadius: '12px', color: 'var(--energy)' }}>
                  <Car size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>DRIVING AVOIDED</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>4,870 km</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Using alternative transits</div>
                </div>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="dashboard-grid">
              
              {/* Left Column: Gauge and Category Breakdown */}
              <div className="col-4 summary-panel glass-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Monthly Carbon Footprint</h3>
                <p style={{ fontSize: '0.85rem' }}>Calculated from active inputs</p>
                
                <div className="summary-gauge">
                  <svg className="gauge-svg" viewBox="0 0 100 100">
                    <circle className="gauge-bg" cx="50" cy="50" r="40" />
                    <circle 
                      className={`gauge-val ${emissions.grossTotalTons < 2.5 ? 'optimal' : emissions.grossTotalTons < 4.0 ? 'medium' : 'high'}`} 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      strokeDasharray={`${Math.min(251, (emissions.grossTotalTons / 6) * 251)} 251`} 
                    />
                  </svg>
                  <div className="gauge-text">
                    <span className="gauge-value">{emissions.grossTotalTons.toFixed(1)}</span>
                    <span className="gauge-unit">Tons CO₂</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Offsets Purchased:</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>-{offsetTons.toFixed(2)} Tons</div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', fontSize: '0.85rem', marginTop: '8px' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>Net Footprint:</div>
                  <div style={{ fontWeight: 800, color: netFootprint === 0 ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {netFootprint === 0 ? '🎉 Carbon Neutral' : `${netFootprint.toFixed(2)} Tons`}
                  </div>
                </div>

                {/* Category Bars */}
                <div className="cat-breakdown">
                  <div className="cat-item">
                    <div className="cat-header">
                      <div className="cat-name-icon">
                        <span className="cat-icon-dot" style={{ backgroundColor: 'var(--transport)' }}></span>
                        <span>Transportation</span>
                      </div>
                      <span>{emissions.transportPct}%</span>
                    </div>
                    <div className="cat-bar-bg">
                      <div className="cat-bar-fill" style={{ width: `${emissions.transportPct}%`, backgroundColor: 'var(--transport)' }}></div>
                    </div>
                  </div>

                  <div className="cat-item">
                    <div className="cat-header">
                      <div className="cat-name-icon">
                        <span className="cat-icon-dot" style={{ backgroundColor: 'var(--energy)' }}></span>
                        <span>Home Energy</span>
                      </div>
                      <span>{emissions.energyPct}%</span>
                    </div>
                    <div className="cat-bar-bg">
                      <div className="cat-bar-fill" style={{ width: `${emissions.energyPct}%`, backgroundColor: 'var(--energy)' }}></div>
                    </div>
                  </div>

                  <div className="cat-item">
                    <div className="cat-header">
                      <div className="cat-name-icon">
                        <span className="cat-icon-dot" style={{ backgroundColor: 'var(--food)' }}></span>
                        <span>Food Habits</span>
                      </div>
                      <span>{emissions.foodPct}%</span>
                    </div>
                    <div className="cat-bar-bg">
                      <div className="cat-bar-fill" style={{ width: `${emissions.foodPct}%`, backgroundColor: 'var(--food)' }}></div>
                    </div>
                  </div>

                  <div className="cat-item">
                    <div className="cat-header">
                      <div className="cat-name-icon">
                        <span className="cat-icon-dot" style={{ backgroundColor: 'var(--shopping)' }}></span>
                        <span>Retail & Shopping</span>
                      </div>
                      <span>{emissions.shoppingPct}%</span>
                    </div>
                    <div className="cat-bar-bg">
                      <div className="cat-bar-fill" style={{ width: `${emissions.shoppingPct}%`, backgroundColor: 'var(--shopping)' }}></div>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn-secondary" 
                  style={{ width: '100%', marginTop: '20px', fontSize: '0.85rem' }}
                  onClick={() => setActiveTab('calculator')}
                >
                  Adjust Calculator
                </button>
              </div>

              {/* Middle/Right Column: Trend Graph & Tracker */}
              <div className="col-8 glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>Carbon Intensity Trend</h3>
                    <p style={{ fontSize: '0.85rem' }}>Comparing your monthly metrics to 2026 targets</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span> Actuals
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></span> Projection
                    </span>
                  </div>
                </div>

                {/* SVG Trend Line Graph */}
                <div className="chart-container">
                  <svg className="chart-svg" viewBox="0 0 500 200">
                    <defs>
                      <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Gridlines */}
                    <line x1="40" y1="30" x2="480" y2="30" className="chart-gridline" />
                    <line x1="40" y1="80" x2="480" y2="80" className="chart-gridline" />
                    <line x1="40" y1="130" x2="480" y2="130" className="chart-gridline" />
                    <line x1="40" y1="180" x2="480" y2="180" className="chart-gridline" />

                    {/* Axis Labels */}
                    <text x="35" y="183" textAnchor="end" className="chart-axis-text">0t</text>
                    <text x="35" y="133" textAnchor="end" className="chart-axis-text">2t</text>
                    <text x="35" y="83" textAnchor="end" className="chart-axis-text">4t</text>
                    <text x="35" y="33" textAnchor="end" className="chart-axis-text">6t</text>

                    {/* Months */}
                    <text x="60" y="195" textAnchor="middle" className="chart-axis-text">Jan</text>
                    <text x="140" y="195" textAnchor="middle" className="chart-axis-text">Feb</text>
                    <text x="220" y="195" textAnchor="middle" className="chart-axis-text">Mar</text>
                    <text x="300" y="195" textAnchor="middle" className="chart-axis-text">Apr</text>
                    <text x="380" y="195" textAnchor="middle" className="chart-axis-text">May</text>
                    <text x="460" y="195" textAnchor="middle" className="chart-axis-text">Jun (Now)</text>

                    {/* Area path */}
                    <path 
                      d={`M 60 100 L 140 108 L 220 115 L 300 120 L 380 128 L 460 ${180 - Math.min(150, (emissions.grossTotalTons / 6) * 150)} L 460 180 L 60 180 Z`} 
                      className="chart-area-path" 
                    />

                    {/* Target line */}
                    <line x1="60" y1="140" x2="460" y2="140" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="465" y="137" textAnchor="end" fill="rgba(239, 68, 68, 0.6)" fontSize="9px" fontFamily="var(--font-sans)">Kyoto Target Line</text>

                    {/* Actual trend line */}
                    <path 
                      d={`M 60 100 L 140 108 L 220 115 L 300 120 L 380 128 L 460 ${180 - Math.min(150, (emissions.grossTotalTons / 6) * 150)}`} 
                      className="chart-line-path" 
                    />

                    {/* Interactive dots */}
                    <circle cx="60" cy="100" r="4.5" className="chart-dot" />
                    <circle cx="140" cy="108" r="4.5" className="chart-dot" />
                    <circle cx="220" cy="115" r="4.5" className="chart-dot" />
                    <circle cx="300" cy="120" r="4.5" className="chart-dot" />
                    <circle cx="380" cy="128" r="4.5" className="chart-dot" />
                    <circle cx="460" cy={180 - Math.min(150, (emissions.grossTotalTons / 6) * 150)} r="5.5" className="chart-dot" style={{ stroke: 'var(--primary-text)' }} />
                  </svg>
                </div>

                {/* Sub row: Quick habit tracker checklist */}
                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Daily Green Log</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select actions completed today</span>
                  </div>
                  <div className="habit-list">
                    {habits.slice(0, 3).map((h) => (
                      <div 
                        key={h.id} 
                        className={`habit-row ${h.checked ? 'checked' : ''}`}
                        onClick={() => handleHabitToggle(h.id)}
                      >
                        <div className="habit-left">
                          <div className="checkbox-custom">
                            {h.checked && <Check size={14} strokeWidth={3} />}
                          </div>
                          <span className="habit-name">{h.name}</span>
                        </div>
                        <span className="habit-impact">-{h.co2Saved.toFixed(1)} kg CO₂</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="btn-secondary" 
                    style={{ width: '100%', marginTop: '12px', fontSize: '0.85rem' }}
                    onClick={() => setActiveTab('coach')}
                  >
                    View All Habits & Chat with Coach
                  </button>
                </div>
              </div>

              {/* Bottom Row: Goals Section & Gamification */}
              <div className="col-6 glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem' }}><Target size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} /> Smart Goals</h3>
                  <button className="btn-icon" onClick={() => setActiveTab('twin')} style={{ width: 'auto', padding: '0 8px', fontSize: '0.75rem', height: '28px' }}>
                    Setup in Twin Sandbox
                  </button>
                </div>
                <div className="goal-list">
                  {goals.map((g) => (
                    <div key={g.id} className="goal-card">
                      <div className="goal-header">
                        <span className="goal-title">{g.title}</span>
                        <span className={`goal-status-badge ${g.progress === 100 ? 'completed' : 'active'}`}>
                          {g.progress === 100 ? 'Completed' : `${g.progress}%`}
                        </span>
                      </div>
                      <div className="goal-progress-box">
                        <div className="goal-progress-bar-bg">
                          <div className="goal-progress-bar-fill" style={{ width: `${g.progress}%` }}></div>
                        </div>
                        <div className="goal-progress-stats">
                          <span>Target: {g.target}</span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {g.progress < 100 && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); incrementGoalProgress(g.id); }}
                                style={{ background: 'transparent', color: 'var(--primary)', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.78rem' }}
                              >
                                Progress
                              </button>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteGoal(g.id); }}
                              style={{ background: 'transparent', color: 'var(--danger)', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.78rem' }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <input 
                    type="text" 
                    placeholder="E.g. Cut electricity by 15%..."
                    className="chat-input"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                  />
                  <select 
                    className="chat-input" 
                    style={{ maxWidth: '120px' }}
                    value={newGoalCat}
                    onChange={(e) => setNewGoalCat(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Transportation">Transport</option>
                    <option value="Energy">Energy</option>
                    <option value="Food">Food</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                  <button type="submit" className="btn-primary" style={{ padding: '0 16px' }}>
                    <Plus size={18} />
                  </button>
                </form>
              </div>

              {/* Right Column: Achievements & Rewards */}
              <div className="col-6 glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}><Award size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--energy)' }} /> Gamification & Achievements</h3>
                
                <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Carbon reductions unlock verified ecological badges.</p>
                
                <div className="rewards-grid">
                  {badges.map((b) => (
                    <div key={b.id} className={`badge-wrapper ${b.unlocked ? 'unlocked' : ''}`} title={b.desc}>
                      <div className="badge-icon-box">
                        {b.unlocked ? b.emoji : '🔒'}
                      </div>
                      <span className="badge-name">{b.name}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px', flexGrow: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px' }}>Active Community Challenges</h4>
                  <div className="challenges-list">
                    {activeChallenges.map((c) => (
                      <div key={c.id} className="challenge-row" style={{ borderLeft: c.joined ? '3px solid var(--primary)' : '1px solid var(--border-color)' }}>
                        <div className="challenge-left">
                          <span className="challenge-title">{c.title}</span>
                          <span className="challenge-meta">{c.participants.toLocaleString()} players • {c.desc.slice(0, 45)}...</span>
                        </div>
                        <button 
                          className={c.joined ? "btn-secondary" : "btn-primary"}
                          style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                          onClick={() => toggleChallengeJoin(c.id)}
                        >
                          {c.joined ? 'Joined' : 'Join'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
           TAB 2: FOOTPRINT CALCULATOR
           ========================================== */}
        {activeTab === 'calculator' && (
          <div className="animate-fade-in" style={{ marginTop: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontWeight: '800' }}>Carbon Footprint Calculator</h1>
              <p>Fine-tune details of your lifestyle to measure precise carbon sub-components.</p>
            </div>

            <div className="dashboard-grid">
              
              {/* Sliders Area */}
              <div className="col-8 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Section: Transit */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--transport)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Car size={18} /> Transportation Habits
                  </h3>
                  <div className="form-group">
                    <label className="form-label">
                      <span>Weekly Car Distance</span>
                      <span>{carKm} km ({Math.round(carKm * 0.18 * 4)} kg CO₂/mo)</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="1000" step="50"
                      className="range-slider transport"
                      value={carKm}
                      onChange={(e) => setCarKm(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Annual Flights (Approx. Dist per Month)</span>
                      <span>{flightKm} km ({Math.round(flightKm * 0.11)} kg CO₂/mo)</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="3000" step="100"
                      className="range-slider transport"
                      value={flightKm}
                      onChange={(e) => setFlightKm(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Public Transit Usage</span>
                      <span>{transitKm} km ({Math.round(transitKm * 0.04)} kg CO₂/mo)</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="800" step="20"
                      className="range-slider transport"
                      value={transitKm}
                      onChange={(e) => setTransitKm(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Section: Energy */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--energy)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={18} /> Household Energy Usage
                  </h3>
                  <div className="form-group">
                    <label className="form-label">
                      <span>Electricity Consumption</span>
                      <span>{electricityKwh} kWh ({Math.round(electricityKwh * 0.38)} kg CO₂/mo)</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="800" step="20"
                      className="range-slider energy"
                      value={electricityKwh}
                      onChange={(e) => setElectricityKwh(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Natural Gas Consumption</span>
                      <span>{gasTherms} therms ({Math.round(gasTherms * 5.3)} kg CO₂/mo)</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="150" step="5"
                      className="range-slider energy"
                      value={gasTherms}
                      onChange={(e) => setGasTherms(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Water Usage</span>
                      <span>{waterGallons} gallons ({Math.round(waterGallons * 0.002)} kg CO₂/mo)</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="4000" step="100"
                      className="range-slider energy"
                      value={waterGallons}
                      onChange={(e) => setWaterGallons(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Section: Food */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--food)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Utensils size={18} /> Diet & Food Habits
                  </h3>
                  <div className="choice-grid">
                    <div 
                      className={`choice-card food ${diet === 'vegan' ? 'active' : ''}`}
                      onClick={() => setDiet('vegan')}
                    >
                      <span className="icon">🥬</span>
                      <span className="label">Vegan</span>
                      <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-secondary)', marginTop: '4px' }}>~75kg CO₂/mo</span>
                    </div>

                    <div 
                      className={`choice-card food ${diet === 'vegetarian' ? 'active' : ''}`}
                      onClick={() => setDiet('vegetarian')}
                    >
                      <span className="icon">🥚</span>
                      <span className="label">Vegetarian</span>
                      <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-secondary)', marginTop: '4px' }}>~120kg CO₂/mo</span>
                    </div>

                    <div 
                      className={`choice-card food ${diet === 'mixed' ? 'active' : ''}`}
                      onClick={() => setDiet('mixed')}
                    >
                      <span className="icon">🥪</span>
                      <span className="label">Mixed Diet</span>
                      <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-secondary)', marginTop: '4px' }}>~220kg CO₂/mo</span>
                    </div>

                    <div 
                      className={`choice-card food ${diet === 'meat-heavy' ? 'active' : ''}`}
                      onClick={() => setDiet('meat-heavy')}
                    >
                      <span className="icon">🥩</span>
                      <span className="label">High Meat</span>
                      <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-secondary)', marginTop: '4px' }}>~380kg CO₂/mo</span>
                    </div>
                  </div>
                </div>

                {/* Section: Shopping */}
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--shopping)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingBag size={18} /> Shopping & Retail Behavior
                  </h3>
                  <div className="form-group">
                    <label className="form-label">
                      <span>New Apparel Items / Month</span>
                      <span>{clothesItems} items ({Math.round(clothesItems * 12)} kg CO₂/mo)</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="10" step="1"
                      className="range-slider shopping"
                      value={clothesItems}
                      onChange={(e) => setClothesItems(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Gadgets/Electronics Purchased / Month</span>
                      <span>{electronicsItems} items ({Math.round(electronicsItems * 75)} kg CO₂/mo)</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="4" step="1"
                      className="range-slider shopping"
                      value={electronicsItems}
                      onChange={(e) => setElectronicsItems(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span>Online Delivery Packages</span>
                      <span>{deliveriesCount} packages ({Math.round(deliveriesCount * 2.2)} kg CO₂/mo)</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" max="20" step="1"
                      className="range-slider shopping"
                      value={deliveriesCount}
                      onChange={(e) => setDeliveriesCount(Number(e.target.value))}
                    />
                  </div>
                </div>

              </div>

              {/* Sidebar breakdown of current emissions */}
              <div className="col-4 glass-card" style={{ height: 'fit-content', position: 'sticky', top: '90px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Current Footprint Live-Feed</h3>
                
                <div style={{ padding: '20px 0', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {emissions.grossTotalTons.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TONS CO₂ PER MONTH</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--transport)', fontWeight: 600 }}>Transit Subtotal:</span>
                    <span>{emissions.transportTotal.toFixed(1)} kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--energy)', fontWeight: 600 }}>Energy Subtotal:</span>
                    <span>{emissions.energyTotal.toFixed(1)} kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--food)', fontWeight: 600 }}>Food Subtotal:</span>
                    <span>{emissions.foodCo2.toFixed(1)} kg</span>
                  </div>
                  <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--shopping)', fontWeight: 600 }}>Shopping Subtotal:</span>
                    <span>{emissions.shoppingTotal.toFixed(1)} kg</span>
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', marginTop: '24px' }}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Confirm & Sync Dashboard
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
           TAB 3: AI SUSTAINABILITY COACH
           ========================================== */}
        {activeTab === 'coach' && (
          <div className="animate-fade-in" style={{ marginTop: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontWeight: '800' }}>AI Sustainability Coach</h1>
              <p>Get personalized, high-impact recommendations driven by your carbon telemetry.</p>
            </div>

            <div className="dashboard-grid">
              
              {/* Left Column: Personalized Suggestions */}
              <div className="col-6 glass-card ai-coach-section">
                <div className="coach-header">
                  <div className="coach-avatar">🤖</div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem' }}>Coach Green</h3>
                    <div className="coach-status">
                      <span className="status-dot"></span>
                      <span>Telemetry Sync Active</span>
                    </div>
                  </div>
                </div>

                <div className="tips-container">
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Top Impact Recommendations</h4>
                  
                  {emissions.transportTotal > 150 && (
                    <div className="tip-card transport">
                      <span className="tip-icon">🚗</span>
                      <div className="tip-content">
                        <span className="tip-title">Commute Consolidation</span>
                        <span className="tip-desc">Switching 3 car trips per week to transit/biking can reduce your carbon footprint significantly.</span>
                        <span className="tip-saving">Approx Saving: 120kg CO₂ / month</span>
                      </div>
                    </div>
                  )}

                  {emissions.energyTotal > 100 && (
                    <div className="tip-card energy">
                      <span className="tip-icon">💡</span>
                      <div className="tip-content">
                        <span className="tip-title">Transition to Smart LED Lighting</span>
                        <span className="tip-desc">Using LED bulbs cuts lighting energy. Washing clothes at 30°C saves additional water heating energy.</span>
                        <span className="tip-saving">Approx Saving: 35kg CO₂ / month</span>
                      </div>
                    </div>
                  )}

                  {diet !== 'vegan' && (
                    <div className="tip-card food">
                      <span className="tip-icon">🥬</span>
                      <div className="tip-content">
                        <span className="tip-title">Swap Beef for Plant-Based</span>
                        <span className="tip-desc">Reducing beef consumption by 2 meals/week and opting for legumes/veggies saves land use emissions.</span>
                        <span className="tip-saving">Approx Saving: 80kg CO₂ / month</span>
                      </div>
                    </div>
                  )}

                  {emissions.shoppingTotal > 50 && (
                    <div className="tip-card shopping">
                      <span className="tip-icon">🛍️</span>
                      <div className="tip-content">
                        <span className="tip-title">Apparel & Online Order Bundling</span>
                        <span className="tip-desc">Opting for vintage clothing and consolidating weekly deliveries reduces courier transit fuel.</span>
                        <span className="tip-saving">Approx Saving: 25kg CO₂ / month</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Conversational Simulator */}
              <div className="col-6 glass-card" style={{ display: 'flex', flexDirection: 'column', height: '540px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Ask Coach Green</h3>
                
                {/* Chat window */}
                <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {messages.map((m, idx) => (
                    <div key={idx} className={`chat-bubble ${m.sender}`}>
                      {m.text}
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleCoachSendMessage} className="chat-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Ask about reducing food emissions, solar projects..." 
                    className="chat-input"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="btn-primary">Ask AI</button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
           TAB 4: HACKATHON FEATURE: DIGITAL TWIN SIMULATOR
           ========================================== */}
        {activeTab === 'twin' && (
          <div className="animate-fade-in" style={{ marginTop: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontWeight: '800' }}>Carbon Digital Twin Sandbox</h1>
              <p>Simulate the hypothetical impact of major lifestyle adjustments. Watch your twin evolve.</p>
            </div>

            <div className="glass-card" style={{ padding: '32px' }}>
              <div className="twin-simulation-box">
                
                {/* Left Panel: Virtual Avatar Evolvement */}
                <div className="twin-visualizer" style={{ background: `radial-gradient(circle, ${twinStats.avatarColor} 0%, transparent 70%)` }}>
                  <div className="twin-avatar-glow">
                    <span className="twin-avatar">{twinStats.avatarEmoji}</span>
                  </div>
                  
                  <div className="twin-impact-metric">
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SIMULATED ANNUAL EMISSIONS</div>
                    <div className="twin-impact-num">{(twinStats.simTotalTons * 12).toFixed(1)} Tons</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ fontSize: '0.9rem', background: 'rgba(255,255,255,0.06)', padding: '4px 12px', borderRadius: '12px', fontWeight: 700 }}>
                        Twin Rating: {twinStats.avatarName}
                      </span>
                      {twinStats.reductionPercent > 0 && (
                        <span style={{ fontSize: '0.9rem', background: 'var(--primary-glow)', color: 'var(--primary-text)', padding: '4px 12px', borderRadius: '12px', fontWeight: 800 }}>
                          ↓ {twinStats.reductionPercent}% Saving
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Panel: Simulated Adjustments */}
                <div className="twin-controls">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Toggle Sandbox Changes</h3>
                  <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Turn lifestyle decisions on or off to inspect the immediate telemetry shift.</p>

                  <div className="toggle-switch-wrapper">
                    <div className="toggle-label-box">
                      <span className="toggle-title">Zero Car Travel</span>
                      <span className="toggle-saving">Saves ~{Math.round(emissions.carCo2)} kg CO₂/mo</span>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={dtNoCar} 
                        onChange={() => setDtNoCar(!dtNoCar)} 
                      />
                      <span className="slider-round"></span>
                    </label>
                  </div>

                  <div className="toggle-switch-wrapper">
                    <div className="toggle-label-box">
                      <span className="toggle-title">100% Home Solar Panels</span>
                      <span className="toggle-saving">Saves ~{Math.round(emissions.electricityCo2)} kg CO₂/mo</span>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={dtSolar} 
                        onChange={() => setDtSolar(!dtSolar)} 
                      />
                      <span className="slider-round"></span>
                    </label>
                  </div>

                  <div className="toggle-switch-wrapper">
                    <div className="toggle-label-box">
                      <span className="toggle-title">Transition to Vegetarian Diet</span>
                      <span className="toggle-saving">
                        Saves ~{Math.max(0, Math.round(emissions.foodCo2 - 120))} kg CO₂/mo
                      </span>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={dtVegetarian} 
                        onChange={() => setDtVegetarian(!dtVegetarian)} 
                      />
                      <span className="slider-round"></span>
                    </label>
                  </div>

                  <div className="toggle-switch-wrapper">
                    <div className="toggle-label-box">
                      <span className="toggle-title">Apparel Thrifting Only</span>
                      <span className="toggle-saving">Saves ~{Math.round(emissions.clothesCo2 * 0.75)} kg CO₂/mo</span>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={dtSecondHand} 
                        onChange={() => setDtSecondHand(!dtSecondHand)} 
                      />
                      <span className="slider-round"></span>
                    </label>
                  </div>

                  <div style={{ marginTop: '12px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '0.85rem' }}>
                    <Info size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />
                    These simulations demonstrate that switching to domestic solar power and adopting public transit or bicycling yields the highest single-source carbon reductions.
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ==========================================
           TAB 5: RECEIPT SCANNER
           ========================================== */}
        {activeTab === 'scanner' && (
          <div className="animate-fade-in" style={{ marginTop: '32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontWeight: '800' }}>AI Carbon Receipt Scanner</h1>
              <p>Upload shopping receipt text or click sample templates to extract emissions and view sustainable swaps.</p>
            </div>

            <div className="dashboard-grid">
              
              {/* Left Column: Dropzone Simulator */}
              <div className="col-7 glass-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Mock Receipt Upload</h3>
                
                <div className={`scanner-dropzone ${isScanning ? 'scanning' : ''}`}>
                  <div className="scanner-scanline"></div>
                  <div className="scanner-icon">📸</div>
                  {isScanning ? (
                    <div>
                      <h4 style={{ color: 'var(--primary)' }}>Scanning Receipt...</h4>
                      <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>{scanText}</p>
                    </div>
                  ) : (
                    <div>
                      <h4>Select a Sample Receipt below to simulate scanning</h4>
                      <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Simulates optical character recognition (OCR) and carbon model ingestion.</p>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-secondary)' }}>Pre-loaded Sample Receipts:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sampleReceipts.map((r, idx) => (
                      <div 
                        key={idx} 
                        className="glass-card" 
                        style={{ cursor: 'pointer', padding: '16px', background: 'rgba(255,255,255,0.02)' }}
                        onClick={() => !isScanning && handleScanReceipt(r)}
                      >
                        <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700 }}>{r.name}</span>
                          <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>Scan</button>
                        </div>
                        <pre style={{ fontSize: '0.72rem', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', marginTop: '10px', overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>
                          {r.rawText}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Ingested Metadata Analysis */}
              <div className="col-5 glass-card" style={{ height: 'fit-content' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>OCR Analysis Output</h3>
                
                {!scannedResult && !isScanning && (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                    <QrCode size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p>No active receipt scanned. Select one of the sample invoices on the left to begin.</p>
                  </div>
                )}

                {isScanning && (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'rotateDashed 1s linear infinite', margin: '0 auto 16px' }}></div>
                    <p>Running OCR model extraction...</p>
                  </div>
                )}

                {scannedResult && !isScanning && (
                  <div className="receipt-results animate-fade-in">
                    <div className="receipt-result-header">
                      <span>Ingested Item</span>
                      <span>Estimated Impact</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {scannedResult.items.map((item, idx) => (
                        <div key={idx} style={{ paddingBottom: '12px', borderBottom: idx < scannedResult.items.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem' }}>
                            <span>{item.name}</span>
                            <span style={{ color: 'var(--danger)' }}>{item.co2} kg CO₂</span>
                          </div>
                          
                          {/* Alternative Recommendation Card */}
                          <div className="alternative-card" style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SUSTAINABLE ALTERNATIVE:</span>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{item.alt}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary-text)' }}>Alternative impact: {item.altCo2} kg</span>
                            </div>
                            <button 
                              className="btn-primary" 
                              style={{ padding: '6px 12px', fontSize: '0.72rem', borderRadius: '6px' }}
                              onClick={() => handleApplyReceiptSaving(item.saving, Math.round(item.saving * 2))}
                            >
                              Swap & Log (-{item.saving}kg)
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
           TAB 6: OFFSETS & COMMUNITY
           ========================================== */}
        {activeTab === 'marketplace' && (
          <div className="animate-fade-in" style={{ marginTop: '32px' }}>
            
            {/* Title section */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontWeight: '800' }}>Carbon Offset Marketplace</h1>
              <p>Offset remaining footprint by funding verified, certified climate actions.</p>
            </div>

            {/* Marketplace Grid */}
            <div className="offset-grid" style={{ marginBottom: '40px' }}>
              {offsetProjects.map((p) => (
                <div key={p.id} className="offset-card">
                  {/* Mock Cover illustration using dynamic styling */}
                  <div className="offset-image-placeholder" style={{ backgroundColor: p.id === 'tree' ? '#0d3224' : p.id === 'solar' ? '#3d250d' : '#0d223a' }}>
                    <span className="offset-badge">{p.id === 'tree' ? 'GOLD STANDARD' : p.id === 'solar' ? 'UN CDM' : 'VERIFIED CARBON STANDARD'}</span>
                  </div>
                  
                  <div className="offset-content">
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>{p.name}</h3>
                    <p style={{ fontSize: '0.85rem' }}>Offsets {p.offsetVal} Tons CO₂ per month. Verified project tracking coordinates.</p>
                    
                    <div className="offset-pricing">
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>MONTHLY CONTRIBUTION</div>
                        <div className="offset-price">₹{p.priceRate}/mo</div>
                      </div>
                      
                      <button 
                        className={p.active ? "btn-secondary" : "btn-primary"}
                        onClick={() => toggleOffsetProject(p.id)}
                      >
                        {p.active ? 'Offsetting Active' : 'Support Project'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Community Section split */}
            <div className="dashboard-grid">
              
              {/* Local chapters */}
              <div className="col-6 glass-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}><Users size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} /> Local Sustainability Groups</h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Join local chapters near you to coordinate community trash cleanups and carpools.</p>
                
                <div className="community-box">
                  <div className="group-row">
                    <div className="group-info">
                      <div className="group-avatar">🍃</div>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Green Bangalore Chapter</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>4,810 members Chapter</span>
                      </div>
                    </div>
                    <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Active</button>
                  </div>

                  <div className="group-row">
                    <div className="group-info">
                      <div className="group-avatar">🌬️</div>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Delhi Clean Air Coalition</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>2,450 members Chapter</span>
                      </div>
                    </div>
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Join</button>
                  </div>

                  <div className="group-row">
                    <div className="group-info">
                      <div className="group-avatar">♻️</div>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>Mumbai Zero Waste Network</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1,980 members Chapter</span>
                      </div>
                    </div>
                    <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Join</button>
                  </div>
                </div>
              </div>

              {/* Leaderboard chapter */}
              <div className="col-6 glass-card">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}><Award size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--energy)' }} /> Friends Leaderboard</h3>
                <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Compare your monthly net emissions with other users anonymously.</p>

                <div className="leaderboard-list">
                  <div className="leader-row">
                    <div className="leader-rank-name">
                      <span className="leader-rank">1</span>
                      <span style={{ fontWeight: 600 }}>Aarav S.</span>
                    </div>
                    <span style={{ color: 'var(--primary-text)', fontWeight: 700 }}>1.1 Tons</span>
                  </div>

                  <div className="leader-row me">
                    <div className="leader-rank-name">
                      <span className="leader-rank">2</span>
                      <span style={{ fontWeight: 700 }}>Tipparam B. (Me)</span>
                    </div>
                    <span style={{ color: 'var(--primary-text)', fontWeight: 800 }}>{netFootprint.toFixed(1)} Tons</span>
                  </div>

                  <div className="leader-row">
                    <div className="leader-rank-name">
                      <span className="leader-rank">3</span>
                      <span style={{ fontWeight: 600 }}>Rohan K.</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>2.3 Tons</span>
                  </div>

                  <div className="leader-row">
                    <div className="leader-rank-name">
                      <span className="leader-rank">4</span>
                      <span style={{ fontWeight: 600 }}>Priya M.</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>2.9 Tons</span>
                  </div>

                  <div className="leader-row">
                    <div className="leader-rank-name">
                      <span className="leader-rank">5</span>
                      <span style={{ fontWeight: 600 }}>Sneha R.</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>3.4 Tons</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
           TAB 7: AI LAB (ML MODEL TRAINING)
           ========================================== */}
        {activeTab === 'lab' && (
          <div className="animate-fade-in" style={{ marginTop: '32px' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontWeight: '800' }}>AI Model Training Lab</h1>
                <p>Configure hyperparameters, train a predictive regression network on habit data, and deploy the solution.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className={`status-badge ${modelTrained ? 'success' : 'warning'}`} style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                  {modelTrained ? '🟢 Model State: Trained & Active' : '🟡 Model State: Untrained'}
                </span>
              </div>
            </div>

            <div className="dashboard-grid">
              
              {/* Left Column: Hyperparameters & Setup */}
              <div className="col-4 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} className="text-primary" /> Training Hyperparameters
                </h3>

                <div className="form-group">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Learning Rate (η)</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{learningRate.toFixed(3)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.005" max="0.2" step="0.005"
                    className="range-slider energy"
                    disabled={isTraining}
                    value={learningRate}
                    onChange={(e) => setLearningRate(Number(e.target.value))}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Controls step size in gradient descent weights adjustments.</span>
                </div>

                <div className="form-group">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Training Epochs</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{epochs}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="150" step="5"
                    className="range-slider transport"
                    disabled={isTraining}
                    value={epochs}
                    onChange={(e) => setEpochs(Number(e.target.value))}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Number of complete passes over the training dataset.</span>
                </div>

                <div className="form-group">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Synthetic Dataset Samples</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{datasetSize}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" max="500" step="25"
                    className="range-slider shopping"
                    disabled={isTraining}
                    value={datasetSize}
                    onChange={(e) => setDatasetSize(Number(e.target.value))}
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Size of normalized habits dataset generated to fit model.</span>
                </div>

                <div className="form-group">
                  <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Hidden Layers Representation</span>
                    <span>Single-Layer Perceptron</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                    <div className="lab-metric-card" style={{ padding: '8px 12px' }}>
                      <span className="title">Inputs</span>
                      <span style={{ fontSize: '1rem', fontWeight: 800 }}>4 Habit Pcts</span>
                    </div>
                    <div className="lab-metric-card" style={{ padding: '8px 12px' }}>
                      <span className="title">Outputs</span>
                      <span style={{ fontSize: '1rem', fontWeight: 800 }}>1 Net Tons</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                  disabled={isTraining}
                  onClick={runModelTraining}
                >
                  {isTraining ? `Training (Epoch ${currentEpoch}/${epochs})...` : '🚀 Train Carbon Predictor'}
                </button>
              </div>

              {/* Middle Column: Live Telemetry & Loss Curves */}
              <div className="col-5 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  Live Training Visualization
                </h3>

                {/* SVG Neural Network Visualization */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span>Model Architecture Diagram</span>
                    {isTraining && <span style={{ color: 'var(--primary-text)' }}>⚡ Backpropagation active...</span>}
                  </div>
                  <svg className="neural-network-svg" viewBox="0 0 400 220">
                    {/* Connections / Synapses */}
                    {/* Inputs to Hidden Nodes */}
                    {[40, 90, 140, 190].map((iy, idx) => (
                      [30, 75, 120, 165, 210].map((hy, hIdx) => {
                        const isActive = isTraining;
                        const opacity = weights[idx] ? Math.min(1, Math.max(0.1, weights[idx])) : 0.2;
                        return (
                          <line 
                            key={`c1-${idx}-${hIdx}`}
                            x1="60" y1={iy} x2="200" y2={hy}
                            stroke={isActive ? 'var(--primary)' : 'rgba(255,255,255,0.06)'}
                            strokeWidth={isActive ? 1.5 : 1}
                            strokeOpacity={opacity}
                            className={`network-edge ${isActive ? 'active' : ''}`}
                            style={{ animationDelay: `${(idx + hIdx) * 0.1}s`, strokeDasharray: isActive ? '4 4' : 'none' }}
                          />
                        );
                      })
                    ))}
                    {/* Hidden Nodes to Output */}
                    {[30, 75, 120, 165, 210].map((hy, hIdx) => {
                      const isActive = isTraining;
                      return (
                        <line 
                          key={`c2-${hIdx}`}
                          x1="200" y1={hy} x2="340" y2="120"
                          stroke={isActive ? 'var(--primary)' : 'rgba(255,255,255,0.06)'}
                          strokeWidth={isActive ? 1.5 : 1}
                          className={`network-edge ${isActive ? 'active' : ''}`}
                          style={{ animationDelay: `${hIdx * 0.15}s`, strokeDasharray: isActive ? '4 4' : 'none' }}
                        />
                      );
                    })}

                    {/* Input Nodes */}
                    <circle cx="60" cy="40" r="10" fill="var(--transport)" className={`network-node ${isTraining ? 'active' : ''}`} />
                    <text x="45" y="44" fill="var(--text-primary)" fontSize="8px" textAnchor="end">Transit</text>
                    
                    <circle cx="60" cy="90" r="10" fill="var(--energy)" className={`network-node ${isTraining ? 'active' : ''}`} />
                    <text x="45" y="94" fill="var(--text-primary)" fontSize="8px" textAnchor="end">Energy</text>
                    
                    <circle cx="60" cy="140" r="10" fill="var(--food)" className={`network-node ${isTraining ? 'active' : ''}`} />
                    <text x="45" y="144" fill="var(--text-primary)" fontSize="8px" textAnchor="end">Food</text>
                    
                    <circle cx="60" cy="190" r="10" fill="var(--shopping)" className={`network-node ${isTraining ? 'active' : ''}`} />
                    <text x="45" y="194" fill="var(--text-primary)" fontSize="8px" textAnchor="end">Shopping</text>

                    {/* Hidden Layer Nodes */}
                    {[30, 75, 120, 165, 210].map((hy, idx) => (
                      <circle 
                        key={`h-${idx}`}
                        cx="200" cy={hy} r="8" 
                        fill="rgba(255, 255, 255, 0.15)" 
                        stroke="var(--border-color)"
                        className={`network-node ${isTraining ? 'active' : ''}`} 
                      />
                    ))}
                    <text x="200" y="15" fill="var(--text-secondary)" fontSize="8px" textAnchor="middle">Hidden Layer</text>

                    {/* Output Node */}
                    <circle cx="340" cy="120" r="12" fill="var(--primary)" className={`network-node ${isTraining ? 'active' : ''}`} />
                    <text x="358" y="124" fill="var(--text-primary)" fontSize="8px" textAnchor="start">Predicted CO₂</text>
                  </svg>
                </div>

                {/* SVG Loss Curve Plotting */}
                <div>
                  <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span>Loss Curve (Mean Squared Error)</span>
                    {lossHistory.length > 0 && (
                      <span style={{ color: 'var(--primary-text)', fontFamily: 'var(--font-mono)' }}>
                        Current Loss: {lossHistory[lossHistory.length - 1].toFixed(6)}
                      </span>
                    )}
                  </div>
                  <div className="chart-container" style={{ height: '120px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '6px' }}>
                    {lossHistory.length < 2 ? (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        Awaiting training sequence initialization...
                      </div>
                    ) : (
                      <svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%' }}>
                        <defs>
                          <linearGradient id="loss-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines */}
                        <line x1="20" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="20" y1="60" x2="280" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <line x1="20" y1="100" x2="280" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                        {/* Path plotting */}
                        <path 
                          d={`M ${lossHistory.map((loss, idx) => {
                            const x = 20 + (idx / (lossHistory.length - 1)) * 260;
                            const maxLoss = Math.max(...lossHistory);
                            const y = 100 - (loss / (maxLoss || 1)) * 80;
                            return `${x} ${y}`;
                          }).join(' L ')}`}
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="2.5"
                        />

                        {/* Shaded Area */}
                        <path 
                          d={`M 20 100 L ${lossHistory.map((loss, idx) => {
                            const x = 20 + (idx / (lossHistory.length - 1)) * 260;
                            const maxLoss = Math.max(...lossHistory);
                            const y = 100 - (loss / (maxLoss || 1)) * 80;
                            return `${x} ${y}`;
                          }).join(' L ')} L ${20 + 260} 100 Z`}
                          fill="url(#loss-gradient)"
                        />
                        
                        <text x="25" y="15" fill="var(--text-muted)" fontSize="7px">Loss Rate</text>
                        <text x="275" y="112" textAnchor="end" fill="var(--text-muted)" fontSize="7px">Epoch {currentEpoch}</text>
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Console Log & Inference Playground */}
              <div className="col-3 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  Model Logs & Testbed
                </h3>
                
                {/* Scrolling Console */}
                <div className="console-box">
                  {consoleLogs.map((log, idx) => {
                    let className = "console-line";
                    if (log.startsWith('[SUCCESS]')) className += " success";
                    else if (log.startsWith('[INIT]')) className += " info";
                    else if (log.startsWith('[MODEL]')) className += " warning";
                    return (
                      <div key={idx} className={className}>
                        {log}
                      </div>
                    );
                  })}
                </div>

                {/* Inference test block */}
                <form onSubmit={runModelPrediction} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Predictive Inference Sandbox</h4>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>Car Commute</span>
                      <span>{testCarKm} km/wk</span>
                    </div>
                    <input 
                      type="range" min="0" max="1000" step="50"
                      className="range-slider transport"
                      value={testCarKm}
                      onChange={(e) => setTestCarKm(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span>Electricity Consumption</span>
                      <span>{testElectricity} kWh</span>
                    </div>
                    <input 
                      type="range" min="0" max="800" step="20"
                      className="range-slider energy"
                      value={testElectricity}
                      onChange={(e) => setTestElectricity(Number(e.target.value))}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Diet</label>
                      <select 
                        className="chat-input" 
                        style={{ height: '34px', fontSize: '0.75rem', padding: '0 8px' }}
                        value={testDiet}
                        onChange={(e) => setTestDiet(e.target.value)}
                      >
                        <option value="vegan">Vegan</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="mixed">Mixed</option>
                        <option value="meat-heavy">Meat Heavy</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Shopping</label>
                      <select 
                        className="chat-input"
                        style={{ height: '34px', fontSize: '0.75rem', padding: '0 8px' }}
                        value={testShopping}
                        onChange={(e) => setTestShopping(Number(e.target.value))}
                      >
                        <option value="0">0 Items</option>
                        <option value="2">2 Items</option>
                        <option value="4">4 Items</option>
                        <option value="8">8 Items</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-secondary" 
                    style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}
                  >
                    Run Model Prediction
                  </button>
                </form>

                {/* Prediction Results block */}
                {predictedCarbon !== null && (
                  <div className="animate-fade-in" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Neural Net Prediction:</span>
                      <span style={{ fontWeight: 800, color: 'var(--primary-text)' }}>{predictedCarbon.toFixed(3)} Tons</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Mathematical Actual:</span>
                      <span style={{ fontWeight: 700 }}>{actualCarbon.toFixed(3)} Tons</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Variance Delta:</span>
                      <span style={{ fontWeight: 700, color: alignmentError < 0.1 ? 'var(--primary)' : 'var(--warning)' }}>
                        {alignmentError.toFixed(4)} Tons ({Math.round((alignmentError / (actualCarbon || 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'flex', justifyStyle: 'space-between', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>EcoTrack AI Platform</div>
              <div>Helping individuals measure, understand, and offset their carbon footprint.</div>
            </div>
            <div>
              &copy; {new Date().getFullYear()} EcoTrack AI. Certified Green Partner.
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
