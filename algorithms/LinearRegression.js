// Imports
const tf = require('@tensorflow/tfjs');

class LinearRegression {

	constructor(trainingInputs, trainingOutputs, options) {

		// Declaring Tensors
		this.trainingInputs = this.processTensor(trainingInputs);
		this.trainingOutputs = tf.tensor(trainingOutputs);
		this.weights = tf.zeros([this.trainingInputs.shape[1], 1]);

		// Compile Options
		this.options = Object.assign({
			learningRate: 0.1,
			iterations: 100,
			batch: false
		}, options);

		// MSE Archive
		this.mseHistory = [];
	}

	standardise(dataset) {

		// Compute mean and variance
		const { mean, variance } = tf.moments(dataset, 0);

		// Check if Mean and Variance exists
		if(!this.mean && !this.variance) {
			this.mean = mean;
			this.variance = variance;
		}

		return dataset
			.sub(this.mean)
			.div(this.variance.pow(0.5));
	}

	processTensor(dataset) {

		// Convert to Tensor
		dataset = tf.tensor(dataset);

		// Standardise or Normalise
		dataset = this.standardise(dataset);

		// Add Arbitrary Column of 1's to the begining
		dataset = tf.ones([dataset.shape[0], 1]).concat(dataset, 1);

		return dataset;
	}

	gradientDescent(trainingInputs, trainingOutputs) {
		const guess = this.trainingInputs.matMul(this.weights);										// Operation 1
		const difference = guess.sub(this.trainingOutputs);											// Operation 2
		const slopes = this.trainingInputs
			.transpose()
			.matMul(difference)
			.div(this.trainingInputs.shape[0]);														// Operation 3
		this.weights = this.weights.sub(slopes.mul(this.options.learningRate));						// Operation 4
	}

	train() {
		const batches = Math.floor(this.trainingInputs.shape[0]/this.options.batch);
		for (let i=0 ; i<this.options.iterations ; i++) {
			if (this.options.batch) {
				for(let j=0 ; j<batches ; j++) {
					const inputs = this.trainingInputs.slice([j*this.options.batch, 0], [this.options.batch, -1]);
					const outputs = this.trainingOutputs.slice([j*this.options.batch, 0], [this.options.batch, -1]);
					this.gradientDescent(inputs, outputs);
				}
			}
			else {
				this.gradientDescent(this.trainingInputs, this.trainingOutputs);
			}
			this.recordMSE();
			this.optimiseLearning();
		}
	}

	recordMSE() {
		this.mseHistory
			.push(this.trainingInputs
				.matMul(this.weights)
				.sub(this.trainingOutputs)
				.pow(2)
				.sum()
				.div(this.trainingOutputs
					.shape[0])
				.dataSync()[0]);																	// Operation 5
	}

	predict(inputs) {
		return this.processTensor(inputs).matMul(this.weights);
	}

	test(testInputs, testOutputs) {

		// Declaring Tensors
		testInputs = this.processTensor(testInputs);
		testOutputs = tf.tensor(testOutputs);

		// Generate Predictions
		const predictions = testInputs.matMul(this.weights);

		// Sum of Squares
		const ssTOT = testOutputs.sub(testOutputs.mean()).pow(2).sum().dataSync();
		const ssRES = testOutputs.sub(predictions).pow(2).sum().dataSync();
		return 1-(ssRES/ssTOT);
	}

	optimiseLearning() {

		// Not enough MSE Histories
		if (this.mseHistory.length < 2) {
			return;
		}

		// MSE is Increasing
		if (this.mseHistory[this.mseHistory.length] > this.mseHistory[this.mseHistory.length-1]) {
			this.options.learningRate /= 2;
		}

		// MSE is Decreasing
		else {
			this.options.learningRate *= 1.05;
		}
	}
}

module.exports = LinearRegression;