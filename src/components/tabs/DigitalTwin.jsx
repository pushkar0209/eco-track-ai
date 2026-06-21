import { Info, HelpCircle } from 'lucide-react';
import { useMemo } from 'react';

/**
 * Digital Twin Sandbox Tab Component.
 * Enables users to toggle virtual adjustments to inspect telemetry changes.
 * Incorporates a Neutrality Plan Advisor recommending tailored eco plans.
 */
export function DigitalTwin({
  emissions,
  dtSolar, setDtSolar,
  dtVegetarian, setDtVegetarian,
  dtNoCar, setDtNoCar,
  dtSecondHand, setDtSecondHand,
  twinStats,
  offsetTons
}) {
  // Connected Neutrality Plan Advisor calculation
  const neutralityPlan = useMemo(() => {
    const activeReductionsKg = 
      (dtNoCar ? emissions.carCo2 : 0) +
      (dtSolar ? emissions.electricityCo2 : 0) +
      (dtVegetarian ? Math.max(0, emissions.foodCo2 - 120) : 0) +
      (dtSecondHand ? (emissions.clothesCo2 * 0.75) : 0);

    const activeReductionsTons = activeReductionsKg / 1000;
    const currentSimFootprintTons = Math.max(0, emissions.grossTotalTons - activeReductionsTons);
    const neededOffsetsTons = Math.max(0, currentSimFootprintTons - offsetTons);
    
    let advice = '';
    let rating = 'Bronze standard plan';
    if (neededOffsetsTons === 0) {
      advice = 'Excellent! Your simulated lifestyle coupled with current offsets achieves full net Carbon Neutrality! 🎉';
      rating = 'Carbon Neutral Plan';
    } else if (neededOffsetsTons < 0.5) {
      advice = `Almost there! To achieve neutrality under this simulation, purchase an additional ${neededOffsetsTons.toFixed(2)} Tons of offsets (approx ₹150 - ₹200/mo).`;
      rating = 'Gold standard plan';
    } else {
      advice = `Consider active lifestyle shifts like choosing "Zero Car Travel" or "100% Home Solar Panels" to shave off another ${(neededOffsetsTons - 0.5).toFixed(2)} Tons before buying offsets.`;
      rating = 'Silver standard plan';
    }

    return {
      activeReductionsTons,
      currentSimFootprintTons,
      neededOffsetsTons,
      advice,
      rating
    };
  }, [emissions, dtSolar, dtVegetarian, dtNoCar, dtSecondHand, offsetTons]);

  return (
    <div className="animate-fade-in" role="tabpanel" id="tabpanel-twin" aria-labelledby="tab-twin" style={{ marginTop: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: '800' }}>Carbon Digital Twin Sandbox</h1>
        <p>Simulate the hypothetical impact of major lifestyle adjustments. Watch your twin evolve.</p>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        <div className="twin-simulation-box">
          
          {/* Left Panel: Virtual Avatar Evolvement */}
          <div 
            className="twin-visualizer" 
            style={{ 
              background: `radial-gradient(circle, ${twinStats.avatarColor} 0%, transparent 70%)` 
            }}
            tabIndex={0}
            aria-label={`Digital Twin Visual representation. Rating: ${twinStats.avatarName}, Emoji: ${twinStats.avatarEmoji}`}
          >
            <div className="twin-avatar-glow" aria-hidden="true">
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
          <div className="twin-controls" tabIndex={0} aria-label="Toggle Sandbox Decisions">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Toggle Sandbox Changes</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Turn lifestyle decisions on or off to inspect the immediate telemetry shift.</p>

            <div className="toggle-switch-wrapper">
              <div className="toggle-label-box">
                <span className="toggle-title">Zero Car Travel</span>
                <span className="toggle-saving">Saves ~{Math.round(emissions.carCo2)} kg CO₂/mo</span>
              </div>
              <label className="switch" aria-label="Toggle Zero Car Travel simulation">
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
              <label className="switch" aria-label="Toggle Solar Panels simulation">
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
              <label className="switch" aria-label="Toggle Vegetarian Diet simulation">
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
              <label className="switch" aria-label="Toggle Thrifting simulation">
                <input 
                  type="checkbox" 
                  checked={dtSecondHand} 
                  onChange={() => setDtSecondHand(!dtSecondHand)} 
                />
                <span className="slider-round"></span>
              </label>
            </div>

            <div style={{ marginTop: '12px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '0.85rem' }}>
              <Info size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} aria-hidden="true" />
              These simulations demonstrate that switching to domestic solar power and adopting public transit or bicycling yields the highest single-source carbon reductions.
            </div>
          </div>

        </div>

        {/* Problem Statement Connection: Neutrality Plan Advisor */}
        <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} className="text-primary" aria-hidden="true" /> Simulated Net-Zero Plan Advisor
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Analyzes your active sandbox configurations to construct a customized offset strategy.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SIMULATED ACTIVE REDUCTIONS</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-text)', marginTop: '4px' }}>
                -{neutralityPlan.activeReductionsTons.toFixed(2)} Tons CO₂/mo
              </div>
            </div>

            <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>REMAINING OFFSET TARGET</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: neutralityPlan.neededOffsetsTons === 0 ? 'var(--primary)' : 'var(--text-primary)', marginTop: '4px' }}>
                {neutralityPlan.neededOffsetsTons.toFixed(2)} Tons CO₂/mo
              </div>
            </div>

            <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.01)', padding: '16px', gridColumn: 'span 1' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>STRATEGY RATING</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--energy)', marginTop: '4px' }}>
                ⭐ {neutralityPlan.rating}
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '16px',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            borderRadius: '12px',
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            lineHeight: '1.5'
          }}>
            {neutralityPlan.advice}
          </div>
        </div>

      </div>
    </div>
  );
}
