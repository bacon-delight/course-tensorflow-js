// Imports
require('@tensorflow/tfjs-node');
const _ = require('lodash');
const plot = require('node-remote-plot');
const LogisticRegression = require('./algorithms/MNIST.js');
const mnist = require('mnist-data');

// // Load Training Data
// const mnistData = mnist.training(0, 6000);
// const features = _.map(mnistData.images.values, image => _.flatMap(image));
// const labels = _.map(mnistData.labels.values, label => {
// 	const row = new Array(10).fill(0);
// 	row[label] = 1;
// 	return row;
// });

// Load Training Data - Optimized
function loadData() {
	const mnistData = mnist.training(0, 60000);
	const features = _.map(mnistData.images.values, image => _.flatMap(image));
	const labels = _.map(mnistData.labels.values, label => {
		const row = new Array(10).fill(0);
		row[label] = 1;
		return row;
	});

	return { features, labels };
}
const { features, labels } = loadData();

// Initialize
const regression = new LogisticRegression(features, labels, {
	learningRate: 0.1,
	iterations: 70,
	batch: 500,
	// decisionBoundary: 0.5,
});

// Train the Model
regression.train();

// Load Test Data
const testMnistData = mnist.testing(0, 1000);
const testFeatures = _.map(testMnistData.images.values, image => _.flatMap(image));
const testLabels = _.map(testMnistData.labels.values, label => {
	const row = new Array(10).fill(0);
	row[label] = 1;
	return row;
});

// Test Accuracy
console.log("Accuracy: ", regression.test(testFeatures, testLabels), "%");

// Plot MSE
plot({
	x: regression.costHistory,
	xLabel: 'Iterations',
	yLabel: 'Cross Entropy'
});