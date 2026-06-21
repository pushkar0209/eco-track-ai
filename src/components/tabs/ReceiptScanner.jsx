import { Check, Info, FileText } from 'lucide-react';

/**
 * ReceiptScanner Tab Component.
 * Simulates optical character recognition (OCR) parsing of itemized invoices.
 * Matches line items to low-carbon alternative carbon swaps.
 */
export function ReceiptScanner({
  ocrState,
  selectedReceiptKey,
  setSelectedReceiptKey,
  runReceiptOcr,
  applyOcrSwaps,
  receiptOptions
}) {
  return (
    <div className="animate-fade-in" role="tabpanel" id="tabpanel-scanner" aria-labelledby="tab-scanner" style={{ marginTop: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: '800' }}>AI Receipt OCR Scanner</h1>
        <p>Upload purchase invoices to parse itemized listings and identify immediate carbon-saving swaps.</p>
      </div>

      <div className="dashboard-grid">
        
        {/* Left Column: Upload and Parsing controls */}
        <div className="col-5 glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Scan Preloaded Invoice</h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>Select an invoice template to simulate parsing.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {Object.keys(receiptOptions).map((k) => {
              const r = receiptOptions[k];
              const handleKeyDown = (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setSelectedReceiptKey(k);
                }
              };

              return (
                <div 
                  key={k} 
                  className={`receipt-card ${selectedReceiptKey === k ? 'active' : ''}`}
                  onClick={() => setSelectedReceiptKey(k)}
                  onKeyDown={handleKeyDown}
                  role="radio"
                  aria-checked={selectedReceiptKey === k}
                  tabIndex={0}
                  aria-label={`Select invoice template: ${r.title}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="receipt-icon" aria-hidden="true">🧾</div>
                    <div>
                      <div className="receipt-title">{r.title}</div>
                      <div className="receipt-subtitle">{r.lines.length} items parsed</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={runReceiptOcr}
            disabled={ocrState.status === 'processing'}
            aria-label="Scan selected receipt using OCR"
          >
            <FileText size={18} aria-hidden="true" />
            {ocrState.status === 'processing' ? 'Processing OCR Matrix...' : 'Start Scanner'}
          </button>

          {ocrState.status === 'processing' && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span>Scanning document matrix...</span>
                <span>{ocrState.progress}%</span>
              </div>
              <div className="goal-progress-bar-bg" aria-hidden="true">
                <div className="goal-progress-bar-fill" style={{ width: `${ocrState.progress}%`, background: 'var(--primary)' }}></div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', fontSize: '0.8rem' }}>
            <Info size={16} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} aria-hidden="true" />
            Scanner works by mapping common items to public emissions coefficients datasets to identify the carbon footprint of your purchases.
          </div>
        </div>

        {/* Right Column: OCR Results & Recommended carbon swaps */}
        <div className="col-7 glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>OCR Parsing Swaps</h3>

          {ocrState.status === 'idle' && (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '40px 0' }} tabIndex={0}>
              <span style={{ fontSize: '3rem', marginBottom: '16px' }}>🖨️</span>
              <p style={{ margin: 0 }}>Select an invoice template and click "Start Scanner" to review item breakdown.</p>
            </div>
          )}

          {ocrState.status === 'processing' && (
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '40px 0' }} tabIndex={0}>
              <span className="spinner" style={{ fontSize: '3rem', marginBottom: '16px', animation: 'spin 1.5s linear infinite' }}>♻️</span>
              <p style={{ margin: 0 }}>Parsing itemized line listings and compiling low-carbon suggestions...</p>
            </div>
          )}

          {ocrState.status === 'complete' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              <div className="ocr-meta-info" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.85rem' }} tabIndex={0}>
                <span>Invoice Type: <strong>{receiptOptions[selectedReceiptKey]?.title}</strong></span>
                <span>Total Items: <strong>{ocrState.resultItems?.length || 0}</strong></span>
              </div>

              <div className="ocr-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ocrState.resultItems?.map((item) => (
                  <div key={item.id} className="ocr-item-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px' }} tabIndex={0}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 600 }}>{item.co2.toFixed(1)} kg CO₂</span>
                    </div>

                    <div className="swap-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <div>
                        <span style={{ color: 'var(--primary-text)', fontWeight: 700, display: 'block' }}>Swap suggestion: {item.swapName}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Reduces item emission to {item.swapCo2.toFixed(1)} kg CO₂</span>
                      </div>
                      <span style={{ fontWeight: 800, color: 'var(--primary)' }}>-{item.saving.toFixed(1)} kg</span>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', marginTop: 'auto', background: 'var(--primary)', borderColor: 'var(--primary)' }}
                onClick={applyOcrSwaps}
                aria-label="Accept all carbon swap suggestions and claim eco points"
              >
                Accept Swaps & Log Eco Points (+45 pts)
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
