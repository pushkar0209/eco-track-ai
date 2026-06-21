import { useEffect, useRef } from 'react';

/**
 * AICoach Tab Component.
 * Contains conversational coach simulator and tailored sustainability tips.
 */
export function AICoach({
  emissions,
  diet,
  messages,
  chatInput,
  setChatInput,
  handleCoachSendMessage
}) {
  const chatBottomRef = useRef(null);

  // Auto-scroll chat window
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="animate-fade-in" role="tabpanel" id="tabpanel-coach" aria-labelledby="tab-coach" style={{ marginTop: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: '800' }}>AI Sustainability Coach</h1>
        <p>Get personalized, high-impact recommendations driven by your carbon telemetry.</p>
      </div>

      <div className="dashboard-grid">
        
        {/* Left Column: Personalized Suggestions */}
        <div className="col-6 glass-card ai-coach-section">
          <div className="coach-header" tabIndex={0}>
            <div className="coach-avatar" role="img" aria-label="Robot face icon for Coach Green">🤖</div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Coach Green</h3>
              <div className="coach-status">
                <span className="status-dot"></span>
                <span>Telemetry Sync Active</span>
              </div>
            </div>
          </div>

          <div className="tips-container" tabIndex={0}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Top Impact Recommendations</h4>
            
            {emissions.transportTotal > 150 && (
              <div className="tip-card transport" tabIndex={0}>
                <span className="tip-icon" role="img" aria-label="Car emoji">🚗</span>
                <div className="tip-content">
                  <span className="tip-title">Commute Consolidation</span>
                  <span className="tip-desc">Switching 3 car trips per week to transit/biking can reduce your carbon footprint significantly.</span>
                  <span className="tip-saving">Approx Saving: 120kg CO₂ / month</span>
                </div>
              </div>
            )}

            {emissions.energyTotal > 100 && (
              <div className="tip-card energy" tabIndex={0}>
                <span className="tip-icon" role="img" aria-label="Lightbulb emoji">💡</span>
                <div className="tip-content">
                  <span className="tip-title">Transition to Smart LED Lighting</span>
                  <span className="tip-desc">Using LED bulbs cuts lighting energy. Washing clothes at 30°C saves additional water heating energy.</span>
                  <span className="tip-saving">Approx Saving: 35kg CO₂ / month</span>
                </div>
              </div>
            )}

            {diet !== 'vegan' && (
              <div className="tip-card food" tabIndex={0}>
                <span className="tip-icon" role="img" aria-label="Leafy vegetable emoji">🥬</span>
                <div className="tip-content">
                  <span className="tip-title">Swap Beef for Plant-Based</span>
                  <span className="tip-desc">Reducing beef consumption by 2 meals/week and opting for legumes/veggies saves land use emissions.</span>
                  <span className="tip-saving">Approx Saving: 80kg CO₂ / month</span>
                </div>
              </div>
            )}

            {emissions.shoppingTotal > 50 && (
              <div className="tip-card shopping" tabIndex={0}>
                <span className="tip-icon" role="img" aria-label="Shopping bag emoji">🛍️</span>
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
        <div className="col-6 glass-card" style={{ display: 'flex', flexDirection: 'column', height: '540px' }} tabIndex={0} aria-label="Interactive Sustainability Chat">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Ask Coach Green</h3>
          
          {/* Chat window */}
          <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }} role="log">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`chat-bubble ${m.sender}`}
                tabIndex={0}
                aria-label={`${m.sender === 'coach' ? 'Coach Green says' : 'You say'}: ${m.text}`}
              >
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
              required
              aria-label="Ask Coach Green a question"
            />
            <button type="submit" className="btn-primary">Ask AI</button>
          </form>
        </div>

      </div>
    </div>
  );
}
