// Imports
require('@tensorflow/tfjs-node');
const _ = require('lodash');
const ParseCSV = require('./tools/ParseCSV.js');
const plot = require('node-remote-plot');
const LinearRegression = require('./algorithms/LinearRegression.js');
const LogisticRegression = require('./algorithms/LogisticRegression.js');



// ------------------------ Linear Regression ------------------------ //

/*
// CSV Parsing
const { trainingInputs, trainingOutputs, testInputs, testOutputs } = new ParseCSV('./datasets/housing.csv', {
	inputs: ['sqft_lot', 'condition', 'bathrooms', 'bedrooms', 'sqft_living', 'floors'],
	outputs: ['price'],
	mappers: {
		// passed: value => value === 'TRUE'
	},
	shuffle: true,
	splitTest: 100,
});

// Initialize
const regression = new LinearRegression(trainingInputs, trainingOutputs, {
	learningRate: 0.1,
	iterations: 50,
	batch: 500
});

// Train the Model
regression.train();

// Predict for an Observation
regression.predict([
	[7242]
]).print();

// Accuracy Metrics
console.log("R2: ", regression.test(testInputs, testOutputs));

// Plot MSE
plot({
	x: regression.costHistory,
	xLabel: 'Iterations',
	yLabel: 'Mean Squared Error'
});
*/



// ------------------------ Logistic Regression ------------------------ //
/*
// CSV Parsing
const { trainingInputs, trainingOutputs, testInputs, testOutputs } = new ParseCSV('./datasets/cars.csv', {
	inputs: ['horsepower', 'displacement', 'weight'],
	outputs: ['passedemissions'],
	mappers: {
		passedemissions: value => value === 'TRUE'
	},
	shuffle: true,
	//shuffleString: 'phrase',
	splitTest: true,
});

// Initialize
const regression = new LogisticRegression(trainingInputs, trainingOutputs, {
	learningRate: 0.5,
	iterations: 20,
	batch: 1,
	decisionBoundary: 0.5,
});

// Train the Model
regression.train();

// Test Accuracy
console.log("Accuracy: ", regression.test(testInputs, testOutputs), "%");

// Predict for an Observation
// regression.predict([
// 	[130, 307, 1.75],
// 	[95, 113, 1.18],
// 	[88, 97, 1.065]
// ]).print();

// Plot MSE
plot({
	x: regression.costHistory,
	xLabel: 'Iterations',
	yLabel: 'Cross Entropy'
});
*/



// ------------------------ Multinominal Logistic Regression ------------------------ //

// CSV Parsing
const { trainingInputs, trainingOutputs, testInputs, testOutputs } = new ParseCSV('./datasets/cars.csv', {
	inputs: ['horsepower', 'displacement', 'weight'],
	outputs: ['mpg'],
	mappers: {
		mpg: value => {
			const mpg = parseFloat(value);
			if (mpg<15) {
				return [1, 0, 0];
			}
			else if (mpg<30) {
				return [0, 1, 0];
			}
			else {
				return [0, 0, 1];
			}
		}
	},
	shuffle: true,
	//shuffleString: 'phrase',
	splitTest: true,
});

// Initialize
const regression = new LogisticRegression(trainingInputs, _.flatMap(trainingOutputs), {
	learningRate: 0.1,
	iterations: 200,
	batch: 1,
	decisionBoundary: 0.5,
});

// Train the Model
regression.train();

// Test Accuracy
console.log("Accuracy: ", regression.test(testInputs, _.flatMap(testOutputs)), "%");

// Predict for an Observation
// [150, 150, 2.223] for [1, 1, 0]
// regression.predict([
// 	[215, 440, 2.16],
// 	[150, 150, 2.223]
// ]).print();

// Plot MSE
plot({
	x: regression.costHistory,
	xLabel: 'Iterations',
	yLabel: 'Cross Entropy'
});
