// Imports
require('@tensorflow/tfjs-node');
const ParseCSV = require('./tools/ParseCSV.js');
const plot = require('node-remote-plot');
const LinearRegression = require('./algorithms/LinearRegression.js');

const { trainingInputs, trainingOutputs, testInputs, testOutputs } = new ParseCSV('./datasets/housing.csv', {
	inputs: ['sqft_lot', 'condition', 'bathrooms', 'bedrooms', 'sqft_living', 'floors'],
	outputs: ['price'],
	mappers: {
		// passed: value => value === 'TRUE'
	},
	shuffle: true,
	splitTest: true,
});

// Initialize
const regression = new LinearRegression(trainingInputs, trainingOutputs, {
	learningRate: 0.1,
	iterations: 50,
	batch: 500
});

// Train the Model
regression.train();

// regression.weights.print()

// Predict for an Observation
// regression.predict([
// 	[7242]
// ]).print();

// Accuracy Metrics
console.log("R2: ", regression.test(testInputs, testOutputs));

plot({
	x: regression.mseHistory,
	xLabel: 'Iterations',
	yLabel: 'Mean Squared Error'
});