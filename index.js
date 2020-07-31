// Imports
const ParseCSV = require('./ParseCSV.js');

const { trainingInputs, trainingOutputs, testInputs, testOutputs } = new ParseCSV('./data.csv', {
	inputs: ['sqft_lot'],
	outputs: ['price'],
	mappers: {
		// passed: value => value === 'TRUE'
	},
	shuffle: true,
	splitTest: true
});

console.log("Training Inputs: ", trainingInputs);
console.log("Training Outputs: ", trainingOutputs);
console.log("Test Inputs: ", testInputs);
console.log("Test Outputs: ", testOutputs);