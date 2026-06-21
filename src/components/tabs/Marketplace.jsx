import { Info, ShieldCheck, Heart } from 'lucide-react';
import { useState } from 'react';

/**
 * Marketplace Tab Component.
 * Enables offset purchase, showcases carbon offsets projects, and displays leaderboards.
 */
export function Marketplace({
  offsetTons,
  handlePurchaseOffset,
  ecoScore
}) {
  const [offsetInputs, setOffsetInputs] = useState({
    ghats: 1,
    solar: 1,
    kelp: 1
  });

  const handleInputChange = (projKey, value) => {
    // Input validation: ensure positive integers
    const numValue = Math.max(1, Math.min(100, Math.floor(Number(value)) || 1));
    setOffsetInputs(prev => ({
      ...prev,
      [projKey]: numValue
    }));
  };

  const projectRates = {
    ghats: { name: 'Western Ghats Reforestation', rate: 350, id: 'ghats' },
    solar: { name: 'Sahara Solar Farms Initiative', rate: 280, id: 'solar' },
    kelp: { name: 'Pacific Ocean Kelp Forests', rate: 420, id: 'kelp' }
  };

  return (
    <div className="animate-fade-in" role="tabpanel" id="tabpanel-marketplace" aria-labelledby="tab-marketplace" style={{ marginTop: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: '800' }}>Carbon Offsets Marketplace</h1>
        <p>Fund verified carbon reduction projects worldwide. Zero-out your net footprint.</p>
      </div>

      <div className="dashboard-grid">
        
        {/* Left Column: Projects Grid */}
        <div className="col-8" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Western Ghats Project */}
          <div className="glass-card offset-project-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }} tabIndex={0} aria-label="Western Ghats Reforestation Project">
            <div className="project-banner" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.8) 100%)', width: '80px', height: '80px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }} aria-hidden="true">
              🌳
            </div>
            <div style={{ flexGrow: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Western Ghats Reforestation</h3>
                <span className="badge-unlocked" style={{ fontSize: '0.65rem', background: 'var(--primary-glow)', color: 'var(--primary-text)' }}>Gold Standard</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Restoring degraded forest patches in Southern India. Promotes native biodiversity and offsets carbon in soil and trunk biomass.
              </p>
              <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Rate: <strong>₹350 / Ton</strong></span>
                <span>Type: <strong>Afforestation</strong></span>
                <span>Registry: <strong>Verra (VCS)</strong></span>
              </div>
            </div>
            <div className="purchase-controls" style={{ minWidth: '120px' }}>
              <label htmlFor="input-ghats" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tons to Offset</label>
              <input 
                id="input-ghats"
                type="number" 
                min="1" max="100" 
                className="chat-input" 
                style={{ width: '100%', marginBottom: '8px', padding: '6px' }}
                value={offsetInputs.ghats}
                onChange={(e) => handleInputChange('ghats', e.target.value)}
                aria-label="Tons of carbon to offset with Western Ghats project"
              />
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '8px' }}
                onClick={() => handlePurchaseOffset(projectRates.ghats.name, offsetInputs.ghats, projectRates.ghats.rate)}
                aria-label={`Buy ${offsetInputs.ghats} tons of Western Ghats offsets`}
              >
                Buy Offset
              </button>
            </div>
          </div>

          {/* Sahara Solar Farms Initiative */}
          <div className="glass-card offset-project-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }} tabIndex={0} aria-label="Sahara Solar Farms Project">
            <div className="project-banner" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(217,119,6,0.8) 100%)', width: '80px', height: '80px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }} aria-hidden="true">
              ☀️
            </div>
            <div style={{ flexGrow: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Sahara Solar Farms Initiative</h3>
                <span className="badge-unlocked" style={{ fontSize: '0.65rem', background: 'rgba(245,158,11,0.15)', color: 'rgb(245,158,11)' }}>Verra VCS</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Displacing fossil fuels in North African grids by funding concentrated solar arrays. Zero-emission energy generation.
              </p>
              <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Rate: <strong>₹280 / Ton</strong></span>
                <span>Type: <strong>Renewable</strong></span>
                <span>Registry: <strong>Gold Standard</strong></span>
              </div>
            </div>
            <div className="purchase-controls" style={{ minWidth: '120px' }}>
              <label htmlFor="input-solar" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tons to Offset</label>
              <input 
                id="input-solar"
                type="number" 
                min="1" max="100" 
                className="chat-input" 
                style={{ width: '100%', marginBottom: '8px', padding: '6px' }}
                value={offsetInputs.solar}
                onChange={(e) => handleInputChange('solar', e.target.value)}
                aria-label="Tons of carbon to offset with Sahara Solar project"
              />
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '8px' }}
                onClick={() => handlePurchaseOffset(projectRates.solar.name, offsetInputs.solar, projectRates.solar.rate)}
                aria-label={`Buy ${offsetInputs.solar} tons of Sahara Solar offsets`}
              >
                Buy Offset
              </button>
            </div>
          </div>

          {/* Pacific Ocean Kelp Forests */}
          <div className="glass-card offset-project-card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }} tabIndex={0} aria-label="Pacific Ocean Kelp Forests Project">
            <div className="project-banner" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(8,145,178,0.8) 100%)', width: '80px', height: '80px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }} aria-hidden="true">
              🌊
            </div>
            <div style={{ flexGrow: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Pacific Ocean Kelp Forests</h3>
                <span className="badge-unlocked" style={{ fontSize: '0.65rem', background: 'rgba(6,182,212,0.15)', color: 'rgb(6,182,212)' }}>Blue Carbon</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Cultivating giant kelp along California coasts. Kelp pulls dissolved carbon from water column and sequestering it in deep benthic sediment.
              </p>
              <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Rate: <strong>₹420 / Ton</strong></span>
                <span>Type: <strong>Sequestration</strong></span>
                <span>Registry: <strong>Climate Action Reserve</strong></span>
              </div>
            </div>
            <div className="purchase-controls" style={{ minWidth: '120px' }}>
              <label htmlFor="input-kelp" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Tons to Offset</label>
              <input 
                id="input-kelp"
                type="number" 
                min="1" max="100" 
                className="chat-input" 
                style={{ width: '100%', marginBottom: '8px', padding: '6px' }}
                value={offsetInputs.kelp}
                onChange={(e) => handleInputChange('kelp', e.target.value)}
                aria-label="Tons of carbon to offset with Pacific Ocean Kelp project"
              />
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '8px' }}
                onClick={() => handlePurchaseOffset(projectRates.kelp.name, offsetInputs.kelp, projectRates.kelp.rate)}
                aria-label={`Buy ${offsetInputs.kelp} tons of Pacific Ocean Kelp offsets`}
              >
                Buy Offset
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Leaderboards & Certifications */}
        <div className="col-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Portfolio metrics */}
          <div className="glass-card" tabIndex={0}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Offset Portfolio</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Offsets:</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{offsetTons.toFixed(2)} Tons</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Offset Status:</span>
              <span style={{ fontWeight: 700 }}>
                {offsetTons > 0 ? '🟢 Verified Active' : '⚪ Pending Carbon Zero'}
              </span>
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
              <ShieldCheck size={16} className="text-primary" aria-hidden="true" />
              <span>All offsets come with VCS Serial Keys signed in the green registry database.</span>
            </div>
          </div>

          {/* Community Leaderboard */}
          <div className="glass-card" tabIndex={0} aria-label="Community Leaderboard rankings">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Eco Leaderboard</h3>
            <div className="leaderboard-list">
              {[
                { rank: 1, name: 'Ananya S.', score: 940, label: '🏆 Climate Champion' },
                { rank: 2, name: 'Rohan M.', score: 890, label: '🥈 Carbon Hero' },
                { rank: 3, name: 'You', score: ecoScore, label: '🥉 Active Ecologist', isSelf: true },
                { rank: 4, name: 'Priya K.', score: 790, label: 'Standard Member' },
                { rank: 5, name: 'Amit G.', score: 740, label: 'Standard Member' }
              ].map((user) => (
                <div key={user.rank} className={`leaderboard-row ${user.isSelf ? 'self' : ''}`} style={{ padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 800, width: '20px', color: user.rank === 1 ? 'gold' : user.rank === 2 ? 'silver' : 'var(--text-secondary)' }}>
                      #{user.rank}
                    </span>
                    <div>
                      <span style={{ fontWeight: 700 }}>{user.name}</span>
                      <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{user.label}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{user.score} pts</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', fontSize: '0.8rem', display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={14} style={{ color: 'var(--danger)' }} aria-hidden="true" />
              <span>Share progress to earn +50 eco-points.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
