import { Play, Sparkles, BrainCircuit, RefreshCw, Cpu, Activity, Award } from 'lucide-react';
import { useMemo } from 'react';

/**
 * AILab Tab Component.
 * Contains hyperparameters sliders, loss graph visualization, output weight matrix, and test prediction forms.
 */
export function AILab({
  datasetSize, setDatasetSize,
  epochs, setEpochs,
  learningRate, setLearningRate,
  isTraining,
  currentEpoch,
  lossHistory,
  weights,
  bias,
  consoleLogs,
  runModelTraining,
  runModelPrediction,
  testCarKm, setTestCarKm,
  testElectricity, setTestElectricity,
  testDiet, setTestDiet,
  testShopping, setTestShopping,
  predictedCarbon,
  actualCarbon,
  alignmentError,
  modelTrained,
  useAiModel,
  setUseAiModel
}) {
  // Memoized SVG path for loss history
  const lossPath = useMemo(() => {
    if (lossHistory.length < 2) return '';
    const maxLoss = Math.max(...lossHistory, 0.05);
    const minLoss = Math.min(...lossHistory);
    const range = maxLoss - minLoss || 0.01;
    
    return lossHistory.map((val, idx) => {
      const x = 50 + (idx / (lossHistory.length - 1)) * 400;
      // Map loss to y: 30 to 150
      const y = 150 - ((val - minLoss) / range) * 110;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }, [lossHistory]);

  return (
    <div className="animate-fade-in" role="tabpanel" id="tabpanel-ailab" aria-labelledby="tab-ailab" style={{ marginTop: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: '800' }}>AI Carbon Perceptron Training Lab</h1>
        <p>Train a single-layer perceptron neural network locally on synthetic carbon datasets using stochastic gradient descent.</p>
      </div>

      <div className="dashboard-grid">
        
        {/* Left Column: Hyperparameters Tuning & Controls */}
        <div className="col-4 glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BrainCircuit size={18} className="text-primary" aria-hidden="true" />
            Model Hyperparameters
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            <div className="form-group">
              <label htmlFor="param-dataset" className="form-label">
                <span>Dataset Size</span>
                <span>{datasetSize} samples</span>
              </label>
              <input 
                id="param-dataset"
                type="range" 
                min="50" max="500" step="50"
                className="range-slider"
                disabled={isTraining}
                value={datasetSize}
                onChange={(e) => setDatasetSize(Number(e.target.value))}
                aria-valuemin="50"
                aria-valuemax="500"
                aria-valuenow={datasetSize}
              />
            </div>

            <div className="form-group">
              <label htmlFor="param-epochs" className="form-label">
                <span>Training Epochs</span>
                <span>{epochs} epochs</span>
              </label>
              <input 
                id="param-epochs"
                type="range" 
                min="20" max="200" step="10"
                className="range-slider"
                disabled={isTraining}
                value={epochs}
                onChange={(e) => setEpochs(Number(e.target.value))}
                aria-valuemin="20"
                aria-valuemax="200"
                aria-valuenow={epochs}
              />
            </div>

            <div className="form-group">
              <label htmlFor="param-lr" className="form-label">
                <span>Learning Rate (η)</span>
                <span>{learningRate.toFixed(4)}</span>
              </label>
              <input 
                id="param-lr"
                type="range" 
                min="0.0001" max="0.01" step="0.0005"
                className="range-slider"
                disabled={isTraining}
                value={learningRate}
                onChange={(e) => setLearningRate(Number(e.target.value))}
                aria-valuemin="0.0001"
                aria-valuemax="0.01"
                aria-valuenow={learningRate}
              />
            </div>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={runModelTraining}
            disabled={isTraining}
            aria-label="Start model fitting process"
          >
            {isTraining ? <RefreshCw size={18} className="spin" aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
            {isTraining ? `Training Epoch ${currentEpoch}/${epochs}...` : 'Train Neural Perceptron'}
          </button>
          
          {modelTrained && (
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }} className="glass-card" style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.06)' }}>
              <label className="switch" style={{ margin: 0 }} aria-label="Use Trained Model in Calculator">
                <input 
                  type="checkbox" 
                  checked={useAiModel}
                  onChange={() => setUseAiModel(!useAiModel)}
                />
                <span className="slider-round"></span>
              </label>
              <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Deploy Model to Calculator</span>
            </div>
          )}
        </div>

        {/* Middle/Right Column: Training Graphs & Real-time Loss */}
        <div className="col-8 glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Model Convergence (Mean Squared Error)</h3>
              <p style={{ fontSize: '0.85rem' }}>Visualizes loss reduction epoch-by-epoch.</p>
            </div>
            {isTraining && (
              <span className="badge-unlocked" style={{ background: 'var(--primary-glow)', color: 'var(--primary-text)' }}>
                <Cpu size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} className="spin" aria-hidden="true" /> Fitting...
              </span>
            )}
          </div>

          {/* Loss graph */}
          <div className="chart-container" style={{ minHeight: '180px' }}>
            {lossHistory.length < 2 ? (
              <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No training convergence data active. Start training above.
              </div>
            ) : (
              <svg className="chart-svg" viewBox="0 0 500 180" role="img" aria-label="Mean Squared Error Loss Chart">
                <line x1="50" y1="30" x2="450" y2="30" className="chart-gridline" />
                <line x1="50" y1="85" x2="450" y2="85" className="chart-gridline" />
                <line x1="50" y1="140" x2="450" y2="140" className="chart-gridline" />

                <text x="45" y="33" textAnchor="end" className="chart-axis-text">{Math.max(...lossHistory).toFixed(4)}</text>
                <text x="45" y="88" textAnchor="end" className="chart-axis-text">{((Math.max(...lossHistory) + Math.min(...lossHistory))/2).toFixed(4)}</text>
                <text x="45" y="143" textAnchor="end" className="chart-axis-text">{Math.min(...lossHistory).toFixed(4)}</text>

                <path d={lossPath} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
          </div>

          {/* Weights matrix details */}
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Model Parameter States</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              {[
                { name: 'w₁ (Transport)', val: weights[0], color: 'var(--transport)' },
                { name: 'w₂ (Energy)', val: weights[1], color: 'var(--energy)' },
                { name: 'w₃ (Food)', val: weights[2], color: 'var(--food)' },
                { name: 'w₄ (Shopping)', val: weights[3], color: 'var(--shopping)' },
                { name: 'Bias (b)', val: bias, color: 'var(--text-muted)' }
              ].map((p, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.01)', borderLeft: `3px solid ${p.color}` }} tabIndex={0}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{p.name}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px', fontFamily: 'monospace' }}>
                    {p.val.toFixed(4)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="dashboard-grid" style={{ marginTop: '20px' }}>
        
        {/* Left Column: Console logs console log output */}
        <div className="col-6 glass-card" style={{ display: 'flex', flexDirection: 'column', height: '360px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Training Log Output</h3>
          <div 
            style={{ 
              flexGrow: 1, 
              background: '#040710', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '12px 16px', 
              fontFamily: 'monospace', 
              fontSize: '0.75rem', 
              color: '#34d399', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column',
              gap: '6px'
            }}
            tabIndex={0}
            aria-label="System training console logs"
          >
            {consoleLogs.map((log, index) => (
              <div key={index} style={{ wordBreak: 'break-all' }}>{log}</div>
            ))}
          </div>
        </div>

        {/* Right Column: Model validation & prediction verification */}
        <div className="col-6 glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
            <Activity size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} aria-hidden="true" />
            Model Prediction Verification
          </h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Run a manual forward prediction using current weights to compare model output to calculated values.</p>

          <form onSubmit={runModelPrediction} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="test-car" className="form-label" style={{ fontSize: '0.75rem' }}>Test Car Dist (km)</label>
              <input 
                id="test-car"
                type="number" 
                className="chat-input"
                style={{ width: '100%' }}
                value={testCarKm}
                onChange={(e) => setTestCarKm(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="test-elec" className="form-label" style={{ fontSize: '0.75rem' }}>Test Elec Usage (kWh)</label>
              <input 
                id="test-elec"
                type="number" 
                className="chat-input"
                style={{ width: '100%' }}
                value={testElectricity}
                onChange={(e) => setTestElectricity(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="test-diet" className="form-label" style={{ fontSize: '0.75rem' }}>Test Diet</label>
              <select 
                id="test-diet"
                className="chat-input"
                style={{ width: '100%' }}
                value={testDiet}
                onChange={(e) => setTestDiet(e.target.value)}
              >
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="mixed">Mixed</option>
                <option value="meat-heavy">Meat Heavy</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="test-shop" className="form-label" style={{ fontSize: '0.75rem' }}>Test Apparel items/mo</label>
              <input 
                id="test-shop"
                type="number" 
                className="chat-input"
                style={{ width: '100%' }}
                value={testShopping}
                onChange={(e) => setTestShopping(Number(e.target.value))}
                required
              />
            </div>

            <button type="submit" className="btn-secondary" style={{ gridColumn: 'span 2', padding: '10px' }}>
              Run Inference Prediction
            </button>
          </form>

          {predictedCarbon !== null && (
            <div style={{ marginTop: 'auto', padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px' }} tabIndex={0}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', marginBottom: '8px' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Calculated Target:</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{actualCarbon.toFixed(4)} t</div>
                </div>
                <div>
                  <span style={{ color: 'var(--primary)' }}>Model Prediction:</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{predictedCarbon.toFixed(4)} t</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span>Absolute Error (ε):</span>
                <strong style={{ color: alignmentError < 0.05 ? 'var(--primary)' : 'var(--danger)' }}>
                  {alignmentError.toFixed(6)} tons
                </strong>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
