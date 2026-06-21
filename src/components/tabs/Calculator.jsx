import { Car, Zap, Utensils, ShoppingBag } from 'lucide-react';

/**
 * Calculator Tab Component.
 * Users adjust sliders for transport, energy, food, shopping.
 * Integrates an active switch to swap calculations to the trained Neural Network weights.
 */
export function Calculator({
  carKm, setCarKm,
  flightKm, setFlightKm,
  transitKm, setTransitKm,
  electricityKwh, setElectricityKwh,
  gasTherms, setGasTherms,
  waterGallons, setWaterGallons,
  diet, setDiet,
  clothesItems, setClothesItems,
  electronicsItems, setElectronicsItems,
  deliveriesCount, setDeliveriesCount,
  emissions,
  modelTrained,
  useAiModel,
  setUseAiModel,
  setActiveTab
}) {
  return (
    <div className="animate-fade-in" role="tabpanel" id="tabpanel-calculator" aria-labelledby="tab-calculator" style={{ marginTop: '32px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontWeight: '800' }}>Carbon Footprint Calculator</h1>
          <p>Fine-tune details of your lifestyle to measure precise carbon sub-components.</p>
        </div>
        
        {/* Connection parameter: Connect AI lab with calculator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="glass-card" style={{ padding: '8px 16px', borderRadius: '12px' }}>
          <label className="switch" style={{ margin: 0 }} aria-label="Use Trained Neural Network model to calculate carbon emissions">
            <input 
              type="checkbox" 
              checked={useAiModel}
              disabled={!modelTrained}
              onChange={() => setUseAiModel(!useAiModel)}
            />
            <span className="slider-round"></span>
          </label>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              Use AI Model Calculator
            </div>
            <div style={{ fontSize: '0.7rem', color: modelTrained ? 'var(--primary-text)' : 'var(--text-muted)' }}>
              {modelTrained ? 'Active Neural Net model deployed' : 'Lab model untrained (Train first)'}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        
        {/* Sliders Area */}
        <div className="col-8 glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Section: Transit */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--transport)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car size={18} aria-hidden="true" /> Transportation Habits
            </h3>
            
            <div className="form-group">
              <label htmlFor="slider-car" className="form-label">
                <span>Weekly Car Distance</span>
                <span>{carKm} km ({Math.round(carKm * 0.18 * 4)} kg CO₂/mo)</span>
              </label>
              <input 
                id="slider-car"
                type="range" 
                min="0" max="1000" step="50"
                className="range-slider transport"
                value={carKm}
                onChange={(e) => setCarKm(Number(e.target.value))}
                aria-valuemin="0"
                aria-valuemax="1000"
                aria-valuenow={carKm}
              />
            </div>

            <div className="form-group">
              <label htmlFor="slider-flight" className="form-label">
                <span>Annual Flights (Approx. Dist per Month)</span>
                <span>{flightKm} km ({Math.round(flightKm * 0.11)} kg CO₂/mo)</span>
              </label>
              <input 
                id="slider-flight"
                type="range" 
                min="0" max="3000" step="100"
                className="range-slider transport"
                value={flightKm}
                onChange={(e) => setFlightKm(Number(e.target.value))}
                aria-valuemin="0"
                aria-valuemax="3000"
                aria-valuenow={flightKm}
              />
            </div>

            <div className="form-group">
              <label htmlFor="slider-transit" className="form-label">
                <span>Public Transit Usage</span>
                <span>{transitKm} km ({Math.round(transitKm * 0.04)} kg CO₂/mo)</span>
              </label>
              <input 
                id="slider-transit"
                type="range" 
                min="0" max="800" step="20"
                className="range-slider transport"
                value={transitKm}
                onChange={(e) => setTransitKm(Number(e.target.value))}
                aria-valuemin="0"
                aria-valuemax="800"
                aria-valuenow={transitKm}
              />
            </div>
          </div>

          {/* Section: Energy */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--energy)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} aria-hidden="true" /> Household Energy Usage
            </h3>
            
            <div className="form-group">
              <label htmlFor="slider-electricity" className="form-label">
                <span>Electricity Consumption</span>
                <span>{electricityKwh} kWh ({Math.round(electricityKwh * 0.38)} kg CO₂/mo)</span>
              </label>
              <input 
                id="slider-electricity"
                type="range" 
                min="0" max="800" step="20"
                className="range-slider energy"
                value={electricityKwh}
                onChange={(e) => setElectricityKwh(Number(e.target.value))}
                aria-valuemin="0"
                aria-valuemax="800"
                aria-valuenow={electricityKwh}
              />
            </div>

            <div className="form-group">
              <label htmlFor="slider-gas" className="form-label">
                <span>Natural Gas Consumption</span>
                <span>{gasTherms} therms ({Math.round(gasTherms * 5.3)} kg CO₂/mo)</span>
              </label>
              <input 
                id="slider-gas"
                type="range" 
                min="0" max="150" step="5"
                className="range-slider energy"
                value={gasTherms}
                onChange={(e) => setGasTherms(Number(e.target.value))}
                aria-valuemin="0"
                aria-valuemax="150"
                aria-valuenow={gasTherms}
              />
            </div>

            <div className="form-group">
              <label htmlFor="slider-water" className="form-label">
                <span>Water Usage</span>
                <span>{waterGallons} gallons ({Math.round(waterGallons * 0.002)} kg CO₂/mo)</span>
              </label>
              <input 
                id="slider-water"
                type="range" 
                min="0" max="4000" step="100"
                className="range-slider energy"
                value={waterGallons}
                onChange={(e) => setWaterGallons(Number(e.target.value))}
                aria-valuemin="0"
                aria-valuemax="4000"
                aria-valuenow={waterGallons}
              />
            </div>
          </div>

          {/* Section: Food */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--food)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Utensils size={18} aria-hidden="true" /> Diet & Food Habits
            </h3>
            
            <div className="choice-grid" role="radiogroup" aria-label="Select diet type">
              {[
                { id: 'vegan', icon: '🥬', label: 'Vegan', co2: '75' },
                { id: 'vegetarian', icon: '🥚', label: 'Vegetarian', co2: '120' },
                { id: 'mixed', icon: '🥪', label: 'Mixed Diet', co2: '220' },
                { id: 'meat-heavy', icon: '🥩', label: 'High Meat', co2: '380' }
              ].map((d) => {
                const handleKeyDown = (e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    setDiet(d.id);
                  }
                };

                return (
                  <div 
                    key={d.id} 
                    className={`choice-card food ${diet === d.id ? 'active' : ''}`}
                    onClick={() => setDiet(d.id)}
                    onKeyDown={handleKeyDown}
                    role="radio"
                    aria-checked={diet === d.id}
                    tabIndex={0}
                    aria-label={`${d.label} diet: estimated impact ${d.co2} kilograms of carbon dioxide per month`}
                  >
                    <span className="icon" aria-hidden="true">{d.icon}</span>
                    <span className="label">{d.label}</span>
                    <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-secondary)', marginTop: '4px' }}>~{d.co2}kg CO₂/mo</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Shopping */}
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--shopping)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} aria-hidden="true" /> Shopping & Retail Behavior
            </h3>
            
            <div className="form-group">
              <label htmlFor="slider-clothes" className="form-label">
                <span>New Apparel Items / Month</span>
                <span>{clothesItems} items ({Math.round(clothesItems * 12)} kg CO₂/mo)</span>
              </label>
              <input 
                id="slider-clothes"
                type="range" 
                min="0" max="10" step="1"
                className="range-slider shopping"
                value={clothesItems}
                onChange={(e) => setClothesItems(Number(e.target.value))}
                aria-valuemin="0"
                aria-valuemax="10"
                aria-valuenow={clothesItems}
              />
            </div>

            <div className="form-group">
              <label htmlFor="slider-electronics" className="form-label">
                <span>Gadgets/Electronics Purchased / Month</span>
                <span>{electronicsItems} items ({Math.round(electronicsItems * 75)} kg CO₂/mo)</span>
              </label>
              <input 
                id="slider-electronics"
                type="range" 
                min="0" max="4" step="1"
                className="range-slider shopping"
                value={electronicsItems}
                onChange={(e) => setElectronicsItems(Number(e.target.value))}
                aria-valuemin="0"
                aria-valuemax="4"
                aria-valuenow={electronicsItems}
              />
            </div>

            <div className="form-group">
              <label htmlFor="slider-deliveries" className="form-label">
                <span>Online Delivery Packages</span>
                <span>{deliveriesCount} packages ({Math.round(deliveriesCount * 2.2)} kg CO₂/mo)</span>
              </label>
              <input 
                id="slider-deliveries"
                type="range" 
                min="0" max="20" step="1"
                className="range-slider shopping"
                value={deliveriesCount}
                onChange={(e) => setDeliveriesCount(Number(e.target.value))}
                aria-valuemin="0"
                aria-valuemax="20"
                aria-valuenow={deliveriesCount}
              />
            </div>
          </div>

        </div>

        {/* Sidebar breakdown of current emissions */}
        <div className="col-4 glass-card" style={{ height: 'fit-content', position: 'sticky', top: '90px' }} tabIndex={0}>
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
  );
}
