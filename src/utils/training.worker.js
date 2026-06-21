/**
 * Web Worker for training the Carbon Neural Network.
 * Moves heavy iterations off the main UI thread to ensure 60fps responsiveness.
 */

self.onmessage = function (e) {
  if (e.data.type === 'START_TRAINING') {
    const { datasetSize, epochs, learningRate } = e.data;

    // 1. Generate synthetic dataset
    const dataset = [];
    for (let i = 0; i < datasetSize; i++) {
      const car = Math.random() * 1000;
      const flight = Math.random() * 2000;
      const transit = Math.random() * 800;
      
      const electricity = Math.random() * 800;
      const gas = Math.random() * 120;
      const water = Math.random() * 3000;
      
      const dietTypes = ['vegan', 'vegetarian', 'mixed', 'meat-heavy'];
      const dietType = dietTypes[Math.floor(Math.random() * dietTypes.length)];
      let foodCo2 = 220;
      if (dietType === 'vegan') foodCo2 = 75;
      else if (dietType === 'vegetarian') foodCo2 = 120;
      else if (dietType === 'meat-heavy') foodCo2 = 380;
      
      const clothes = Math.random() * 8;
      const gadgets = Math.random() * 3;
      const deliveries = Math.random() * 15;
      
      const transportTotal = car * 0.18 + flight * 0.11 + transit * 0.04;
      const energyTotal = electricity * 0.38 + gas * 5.3 + water * 0.002;
      const shoppingTotal = clothes * 12 + gadgets * 75 + deliveries * 2.2;
      const totalKg = transportTotal + energyTotal + foodCo2 + shoppingTotal;
      const targetTons = totalKg / 1000;
      
      const u1 = transportTotal / 1000; 
      const u2 = energyTotal / 1000;    
      const u3 = foodCo2 / 1000;       
      const u4 = shoppingTotal / 1000;   
      
      dataset.push({
        inputs: [u1, u2, u3, u4],
        target: targetTons
      });
    }

    // 2. Initialize weights and bias
    let w = [Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3];
    let b = Math.random() * 0.2;

    self.postMessage({
      type: 'INIT',
      weights: [...w],
      bias: b,
      datasetSize
    });

    let epochCount = 0;
    const history = [];

    // 3. Training Loop with simulated delay for UI rendering pacing
    const trainNextEpoch = () => {
      epochCount++;
      if (epochCount > epochs) {
        self.postMessage({
          type: 'COMPLETE',
          weights: [...w],
          bias: b
        });
        return;
      }

      // Shuffle dataset
      const shuffled = [...dataset].sort(() => Math.random() - 0.5);
      let sumSquaredError = 0;
      
      for (let s = 0; s < shuffled.length; s++) {
        const { inputs, target } = shuffled[s];
        const [u1, u2, u3, u4] = inputs;
        
        const prediction = w[0] * u1 + w[1] * u2 + w[2] * u3 + w[3] * u4 + b;
        const error = target - prediction;
        sumSquaredError += error * error;
        
        // Gradient descent updates
        w[0] += learningRate * error * u1;
        w[1] += learningRate * error * u2;
        w[2] += learningRate * error * u3;
        w[3] += learningRate * error * u4;
        b += learningRate * error;
      }
      
      const meanSquaredError = sumSquaredError / shuffled.length;
      history.push(meanSquaredError);

      self.postMessage({
        type: 'EPOCH',
        epoch: epochCount,
        loss: meanSquaredError,
        weights: [...w],
        bias: b
      });

      // Introduce a 20ms delay so the UI can draw the epoch steps smoothly
      setTimeout(trainNextEpoch, 20);
    };

    // Start training
    trainNextEpoch();
  }
};
