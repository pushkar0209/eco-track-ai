/**
 * EcoTrack AI LocalStorage Utilities
 * Handles secure saving and loading of user state with default fallbacks.
 */

const STORAGE_KEY = 'ecotrack_user_state_v1';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    
    // Simple sanitization & structure validation
    if (typeof state.ecoScore !== 'number') state.ecoScore = 820;
    if (typeof state.streak !== 'number') state.streak = 18;
    if (!Array.isArray(state.goals)) state.goals = [];
    if (!Array.isArray(state.habits)) state.habits = [];
    
    return state;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const sanitizedState = {
      ecoScore: Number(state.ecoScore) || 0,
      streak: Number(state.streak) || 0,
      goals: Array.isArray(state.goals) ? state.goals.map(g => ({
        id: String(g.id),
        title: String(g.title).substring(0, 60), // Limit goal title length for safety
        progress: Math.min(100, Math.max(0, Number(g.progress) || 0)),
        target: String(g.target),
        category: String(g.category)
      })) : [],
      habits: Array.isArray(state.habits) ? state.habits.map(h => ({
        id: String(h.id),
        name: String(h.name),
        co2Saved: Number(h.co2Saved) || 0,
        points: Number(h.points) || 0,
        checked: Boolean(h.checked)
      })) : [],
      // Keep sliders state
      sliders: state.sliders ? {
        carKm: Number(state.sliders.carKm) || 450,
        flightKm: Number(state.sliders.flightKm) || 800,
        transitKm: Number(state.sliders.transitKm) || 250,
        electricityKwh: Number(state.sliders.electricityKwh) || 280,
        gasTherms: Number(state.sliders.gasTherms) || 30,
        waterGallons: Number(state.sliders.waterGallons) || 1500,
        diet: String(state.sliders.diet) || 'mixed',
        clothesItems: Number(state.sliders.clothesItems) || 2,
        electronicsItems: Number(state.sliders.electronicsItems) || 1,
        deliveriesCount: Number(state.sliders.deliveriesCount) || 6
      } : undefined
    };
    
    const serializedState = JSON.stringify(sanitizedState);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};
