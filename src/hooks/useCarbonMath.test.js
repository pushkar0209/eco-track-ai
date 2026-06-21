import { describe, it, expect } from 'vitest';
import { calculateCarbonEmissions } from './useCarbonMath';

describe('Carbon Calculation Engine', () => {
  it('correctly calculates baseline carbon emissions from sliders', () => {
    const emissions = calculateCarbonEmissions({
      carKm: 100, // 100 * 0.18 = 18kg
      flightKm: 0,
      transitKm: 0,
      electricityKwh: 0,
      gasTherms: 0,
      waterGallons: 0,
      diet: 'vegan', // 75kg
      clothesItems: 0,
      electronicsItems: 0,
      deliveriesCount: 0,
      useAiModel: false
    });

    expect(emissions.carCo2).toBe(18);
    expect(emissions.transportTotal).toBe(18);
    expect(emissions.foodCo2).toBe(75);
    expect(emissions.grossTotalKg).toBe(93);
    expect(emissions.grossTotalTons).toBe(0.093);
    expect(emissions.transportPct).toBe(19); // 18 / 93 = 19.35% -> 19
    expect(emissions.foodPct).toBe(81);      // 75 / 93 = 80.64% -> 81
  });

  it('correctly handles high meat diet level and utilities', () => {
    const emissions = calculateCarbonEmissions({
      carKm: 0,
      flightKm: 0,
      transitKm: 0,
      electricityKwh: 100, // 100 * 0.38 = 38kg
      gasTherms: 10,       // 10 * 5.3 = 53kg
      waterGallons: 500,   // 500 * 0.002 = 1kg
      diet: 'meat-heavy',  // 380kg
      clothesItems: 0,
      electronicsItems: 0,
      deliveriesCount: 0,
      useAiModel: false
    });

    expect(emissions.energyTotal).toBe(92); // 38 + 53 + 1 = 92kg
    expect(emissions.foodCo2).toBe(380);
    expect(emissions.grossTotalKg).toBe(472); // 92 + 380 = 472kg
    expect(emissions.energyPct).toBe(19); // 92 / 472 = 19.49% -> 19
    expect(emissions.foodPct).toBe(81);   // 380 / 472 = 80.5% -> 81
  });

  it('overrides calculation using trained AI weights when useAiModel is active', () => {
    const customWeights = [0.10, 0.20, 0.30, 0.40];
    const customBias = 0.02;

    const emissions = calculateCarbonEmissions({
      carKm: 100, // 18kg -> 0.018t
      flightKm: 0,
      transitKm: 0,
      electricityKwh: 100, // 38kg -> 0.038t
      gasTherms: 0,
      waterGallons: 0,
      diet: 'vegan', // 75kg -> 0.075t
      clothesItems: 2, // 24kg
      electronicsItems: 1, // 75kg
      deliveriesCount: 0, // 0
      // Shopping subtotal = 99kg -> 0.099t
      useAiModel: true,
      modelWeights: customWeights,
      modelBias: customBias
    });

    const expectedTransport = 18 / 1000;
    const expectedEnergy = 38 / 1000;
    const expectedFood = 75 / 1000;
    const expectedShopping = 99 / 1000;

    const expectedAiValue = 
      customWeights[0] * expectedTransport +
      customWeights[1] * expectedEnergy +
      customWeights[2] * expectedFood +
      customWeights[3] * expectedShopping +
      customBias;

    expect(emissions.grossTotalTons).toBeCloseTo(expectedAiValue, 5);
  });
});
