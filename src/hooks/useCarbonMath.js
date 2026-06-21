import { useMemo } from 'react';

// Co2 Coefficients (kg Co2 / unit)
export const CO2_COEFFICIENTS = {
  carKm: 0.18,        // 180g per km
  flightKm: 0.11,     // 110g per km
  transitKm: 0.04,     // 40g per km
  electricityKwh: 0.38, // 380g per kWh
  gasTherms: 5.3,      // 5.3kg per therm
  waterGallons: 0.002, // 2g per gallon
  diet: {
    vegan: 75,
    vegetarian: 120,
    mixed: 220,
    'meat-heavy': 380
  },
  clothesItems: 12,    // 12kg per item
  electronicsItems: 75, // 75kg per item
  deliveriesCount: 2.2  // 2.2kg per package
};

/**
 * Pure calculation function for carbon emissions.
 * Enables clean testing in Node environments without rendering components.
 */
export function calculateCarbonEmissions({
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
  useAiModel = false,
  modelWeights = [0.15, 0.28, 0.42, 0.12],
  modelBias = 0.05
}) {
  // 1. Math actuals
  const carCo2 = carKm * CO2_COEFFICIENTS.carKm;
  const flightCo2 = flightKm * CO2_COEFFICIENTS.flightKm;
  const transitCo2 = transitKm * CO2_COEFFICIENTS.transitKm;
  const transportTotal = carCo2 + flightCo2 + transitCo2;

  const electricityCo2 = electricityKwh * CO2_COEFFICIENTS.electricityKwh;
  const gasCo2 = gasTherms * CO2_COEFFICIENTS.gasTherms;
  const waterCo2 = waterGallons * CO2_COEFFICIENTS.waterGallons;
  const energyTotal = electricityCo2 + gasCo2 + waterCo2;

  const foodCo2 = CO2_COEFFICIENTS.diet[diet] || CO2_COEFFICIENTS.diet.mixed;

  const clothesCo2 = clothesItems * CO2_COEFFICIENTS.clothesItems;
  const electronicsCo2 = electronicsItems * CO2_COEFFICIENTS.electronicsItems;
  const deliveriesCo2 = deliveriesCount * CO2_COEFFICIENTS.deliveriesCount;
  const shoppingTotal = clothesCo2 + electronicsCo2 + deliveriesCo2;

  const grossTotalKg = transportTotal + energyTotal + foodCo2 + shoppingTotal;
  
  // Default actual tons
  let grossTotalTons = grossTotalKg / 1000;

  // 2. Optional AI Model Prediction Override
  if (useAiModel && Array.isArray(modelWeights) && modelWeights.length === 4) {
    const u1 = transportTotal / 1000;
    const u2 = energyTotal / 1000;
    const u3 = foodCo2 / 1000;
    const u4 = shoppingTotal / 1000;
    
    const predictedTons = 
      modelWeights[0] * u1 + 
      modelWeights[1] * u2 + 
      modelWeights[2] * u3 + 
      modelWeights[3] * u4 + 
      modelBias;
    
    // Ensure positive values
    grossTotalTons = Math.max(0.01, predictedTons);
  }

  // 3. Category percentages based on the active tons or kg
  const totalRepresented = useAiModel ? (grossTotalTons * 1000) : grossTotalKg;
  const transportPct = totalRepresented > 0 ? Math.round((transportTotal / totalRepresented) * 100) : 0;
  const energyPct = totalRepresented > 0 ? Math.round((energyTotal / totalRepresented) * 100) : 0;
  const foodPct = totalRepresented > 0 ? Math.round((foodCo2 / totalRepresented) * 100) : 0;
  const shoppingPct = totalRepresented > 0 ? Math.round((shoppingTotal / totalRepresented) * 100) : 0;

  return {
    carCo2,
    flightCo2,
    transitCo2,
    transportTotal,
    electricityCo2,
    gasCo2,
    waterCo2,
    energyTotal,
    foodCo2,
    clothesCo2,
    electronicsCo2,
    deliveriesCo2,
    shoppingTotal,
    grossTotalKg,
    grossTotalTons,
    transportPct,
    energyPct,
    foodPct,
    shoppingPct
  };
}

/**
 * Custom Hook for carbon emissions math.
 * Standardizes calculation logic and provides memoized carbon telemetry.
 */
export function useCarbonMath(params) {
  const {
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
    modelWeights,
    modelBias
  } = params;

  return useMemo(() => calculateCarbonEmissions({
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
    modelWeights,
    modelBias
  }), [
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
    modelWeights,
    modelBias
  ]);
}
