import { Plus, Target, Check, Award, TrendingDown, Leaf, Car } from 'lucide-react';

/**
 * Dashboard Tab Component.
 * Shows carbon footprint breakdown, trends, smart goals, and achievements.
 */
export function Dashboard({
  emissions,
  offsetTons,
  netFootprint,
  ecoScore,
  streak,
  habits,
  goals,
  newGoalTitle,
  newGoalCat,
  activeChallenges,
  badges,
  setActiveTab,
  setNewGoalTitle,
  setNewGoalCat,
  handleHabitToggle,
  handleAddGoal,
  incrementGoalProgress,
  deleteGoal,
  toggleChallengeJoin
}) {
  return (
    <div className="animate-fade-in" role="tabpanel" id="tabpanel-dashboard" aria-labelledby="tab-dashboard">
      {/* Header intro */}
      <div style={{ marginTop: '32px', marginBottom: '24px' }}>
        <h1 style={{ fontWeight: '800' }}>Your Sustainability Hub</h1>
        <p>Real-time telemetry of your ecological footprint and reduction goals.</p>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '16px' }} tabIndex={0}>
          <div style={{ background: 'var(--primary-glow)', padding: '12px', borderRadius: '12px', color: 'var(--primary)' }}>
            <TrendingDown size={28} aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CO₂ SAVED THIS YEAR</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>1.95 Tons</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-text)' }}>↓ 14% from baseline</div>
          </div>
        </div>
        
        <div className="glass-card" style={{ borderLeft: '4px solid var(--transport)', display: 'flex', alignItems: 'center', gap: '16px' }} tabIndex={0}>
          <div style={{ background: 'var(--transport-glow)', padding: '12px', borderRadius: '12px', color: 'var(--transport)' }}>
            <Leaf size={28} aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>EQUIVALENT TREES PLANTED</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>82 Trees</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated offset capacity</div>
          </div>
        </div>

        <div className="glass-card" style={{ borderLeft: '4px solid var(--energy)', display: 'flex', alignItems: 'center', gap: '16px' }} tabIndex={0}>
          <div style={{ background: 'var(--energy-glow)', padding: '12px', borderRadius: '12px', color: 'var(--energy)' }}>
            <Car size={28} aria-hidden="true" />
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
        <div className="col-4 summary-panel glass-card" tabIndex={0}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Monthly Carbon Footprint</h3>
          <p style={{ fontSize: '0.85rem' }}>Calculated from active inputs</p>
          
          <div className="summary-gauge" role="img" aria-label={`Carbon Gauge showing ${emissions.grossTotalTons.toFixed(1)} Tons CO2`}>
            <svg className="gauge-svg" viewBox="0 0 100 100" aria-hidden="true">
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
            <div className="cat-item" tabIndex={0} aria-label={`Transportation represents ${emissions.transportPct} percent of emissions`}>
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

            <div className="cat-item" tabIndex={0} aria-label={`Home Energy represents ${emissions.energyPct} percent of emissions`}>
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

            <div className="cat-item" tabIndex={0} aria-label={`Food Habits represent ${emissions.foodPct} percent of emissions`}>
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

            <div className="cat-item" tabIndex={0} aria-label={`Retail and shopping represent ${emissions.shoppingPct} percent of emissions`}>
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
            aria-label="Adjust your calculator sliders"
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
            <svg className="chart-svg" viewBox="0 0 500 200" role="img" aria-label="Line chart showing actual carbon emissions vs Kyoto target line">
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
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select actions completed today (keyboard accessible)</span>
            </div>
            <div className="habit-list" role="group" aria-label="Eco habits checklist">
              {habits.slice(0, 3).map((h) => {
                const handleKeyDown = (e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    handleHabitToggle(h.id);
                  }
                };

                return (
                  <div 
                    key={h.id} 
                    className={`habit-row ${h.checked ? 'checked' : ''}`}
                    onClick={() => handleHabitToggle(h.id)}
                    onKeyDown={handleKeyDown}
                    role="checkbox"
                    aria-checked={h.checked}
                    tabIndex={0}
                    aria-label={`${h.name}, saving ${h.co2Saved.toFixed(1)} kilograms of carbon dioxide`}
                  >
                    <div className="habit-left">
                      <div className="checkbox-custom" aria-hidden="true">
                        {h.checked && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span className="habit-name">{h.name}</span>
                    </div>
                    <span className="habit-impact">-{h.co2Saved.toFixed(1)} kg CO₂</span>
                  </div>
                );
              })}
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
            <h3 style={{ fontSize: '1.1rem' }}>
              <Target size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} aria-hidden="true" />
              Smart Goals
            </h3>
            <button 
              className="btn-icon" 
              onClick={() => setActiveTab('twin')} 
              style={{ width: 'auto', padding: '0 12px', fontSize: '0.75rem', height: '28px' }}
              aria-label="Setup smart goals in Sandbox"
            >
              Setup in Twin Sandbox
            </button>
          </div>
          <div className="goal-list">
            {goals.map((g) => (
              <div key={g.id} className="goal-card" tabIndex={0} aria-label={`Goal: ${g.title}, progress ${g.progress} percent`}>
                <div className="goal-header">
                  <span className="goal-title">{g.title}</span>
                  <span className={`goal-status-badge ${g.progress === 100 ? 'completed' : 'active'}`}>
                    {g.progress === 100 ? 'Completed' : `${g.progress}%`}
                  </span>
                </div>
                <div className="goal-progress-box">
                  <div className="goal-progress-bar-bg" aria-hidden="true">
                    <div className="goal-progress-bar-fill" style={{ width: `${g.progress}%` }}></div>
                  </div>
                  <div className="goal-progress-stats">
                    <span>Target: {g.target}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {g.progress < 100 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); incrementGoalProgress(g.id); }}
                          style={{ background: 'transparent', color: 'var(--primary)', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.78rem' }}
                          aria-label={`Increment progress for ${g.title}`}
                        >
                          Progress
                        </button>
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteGoal(g.id); }}
                        style={{ background: 'transparent', color: 'var(--danger)', border: 'none', padding: 0, cursor: 'pointer', fontSize: '0.78rem' }}
                        aria-label={`Delete goal ${g.title}`}
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
              onChange={(e) => setNewGoalTitle(e.target.value.substring(0, 60))}
              required
              aria-label="New Goal Title"
            />
            <select 
              className="chat-input" 
              style={{ maxWidth: '120px' }}
              value={newGoalCat}
              onChange={(e) => setNewGoalCat(e.target.value)}
              aria-label="New Goal Category"
            >
              <option value="General">General</option>
              <option value="Transportation">Transport</option>
              <option value="Energy">Energy</option>
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
            </select>
            <button type="submit" className="btn-primary" style={{ padding: '0 16px' }} aria-label="Add new goal">
              <Plus size={18} aria-hidden="true" />
            </button>
          </form>
        </div>

        {/* Right Column: Achievements & Rewards */}
        <div className="col-6 glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
            <Award size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--energy)' }} aria-hidden="true" />
            Gamification & Achievements
          </h3>
          
          <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Carbon reductions unlock verified ecological badges.</p>
          
          <div className="rewards-grid" role="group" aria-label="Earned badges">
            {badges.map((b) => (
              <div 
                key={b.id} 
                className={`badge-wrapper ${b.unlocked ? 'unlocked' : ''}`} 
                title={b.desc}
                tabIndex={0}
                aria-label={`${b.name} badge: ${b.desc}. Status: ${b.unlocked ? 'Unlocked' : 'Locked'}`}
              >
                <div className="badge-icon-box" aria-hidden="true">
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
                    aria-label={`${c.joined ? 'Leave' : 'Join'} ${c.title}`}
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
  );
}
