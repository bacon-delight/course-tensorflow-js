// Imports
const tf = require('@tensorflow/tfjs');

class LogisticRegression {

	constructor(trainingInputs, trainingOutputs, options) {

		// Declaring Tensors
		this.trainingInputs = this.processTensor(trainingInputs);
		this.trainingOutputs = tf.tensor(trainingOutputs);
		this.weights = tf.zeros([this.trainingInputs.shape[1], this.trainingOutputs.shape[1]]);

		// Compile Options
		this.options = Object.assign({
			learningRate: 0.1,
			iterations: 100,
			batch: false,
			decisionBoundary: 0.5
		}, options);

		// Cost Archive
		this.costHistory = [];
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
		const guess = this.trainingInputs.matMul(this.weights).softmax();							// Operation 1
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
			this.recordCost();
			// this.optimiseLearning();
		}
	}

	recordCost() {
		const guess = this.trainingInputs.matMul(this.weights).softmax();
		const term1 = this.trainingOutputs
			.transpose()
			.matMul(guess.log());
		const term2 = this.trainingOutputs
			.mul(-1)
			.add(1)
			.transpose()
			.matMul(guess
				.mul(-1)
				.add(1)
				.log());
		this.costHistory
			.push(term1
				.add(term2)
				.div(this.trainingInputs.shape[0])
				.mul(-1)
				.dataSync()[0]);
	}

	predict(inputs) {
		// round() - Decision Boundary of 0.5
		// greater() - Returns boolean (needs to be casted to float)
		return this.processTensor(inputs)
			.matMul(this.weights)
			.softmax()
			.argMax(1);			// Along horizontal axis
	}

	test(testInputs, testOutputs) {

		// Predict
		const predictions = this.predict(testInputs);

		// Convert to tensor
		testOutputs = tf.tensor(testOutputs).argMax(1);

		// Total Incorrect Predictions
		const incorrectPredictions = predictions.notEqual(testOutputs).sum().dataSync()[0];

		return ((predictions.shape[0] - incorrectPredictions) / predictions.shape[0]) * 100;
	}

	optimiseLearning() {

		// Not enough Cost Archives
		if (this.costHistory.length < 2) {
			return;
		}

		// Cost is Increasing
		if (this.costHistory[this.costHistory.length] > this.costHistory[this.costHistory.length-1]) {
			this.options.learningRate /= 2;
		}

		// Cost is Decreasing
		else {
			this.options.learningRate *= 1.05;
		}
	}
}

module.exports = LogisticRegression;