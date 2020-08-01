// Imports
const fs = require('fs');
const papa = require('papaparse');
const _ = require('lodash');
const shuffle = require('shuffle-seed');

class ParseCSV {

	// Constructor performs all operations and returns the result
	constructor(filename, options) {

		// Compile options
		this.options = Object.assign({
			mappers: {},
			inputs: [],
			outputs: [],
			shuffle: true,
			shuffleString: Date.now().toString(),
			splitTest: false
		}, options)

		// Result Object
		this.result = {};

		// Parse data from target file
		this.parseTarget(filename);

		// Process data conversions
		this.processData();

		// Shuffle dataset rows
		if (this.options.shuffle) {
			this.shuffleData();
		}

		// Crop columns
		this.result.inputs = this.cropColumns(this.options.inputs);
		this.result.outputs = this.cropColumns(this.options.outputs);

		// Split dataset
		if (this.options.splitTest) {
			this.splitData();
		}

		// Return variables
		return this.result;
	}

	// Parse and sanitize the data
	parseTarget(filename) {
		
		// Parse from target
		let data = papa.parse(fs.readFileSync(filename, { encoding: 'utf-8' })).data;
		
		// Sanitize data
		data = _.map(data, row => _.dropRightWhile(row, column => column === '')); // Drops empty last columns
		data = _.filter(data, row => row.length); // Drops empty rows

		// Assign to scope
		this.headers = _.first(data);
		this.data = _.drop(data, 1); // Drops the first row (headers)
	}

	// Process data and look for numbers and mapped variables
	processData() {

		// Loop through rows
		this.data = _.map(this.data, (row, rowIndex) => {

			// Loop through columns
			return _.map(row, (column, columnIndex) => {

				// Check for mappers, otherwise attempt to parse float
				const converted = this.options.mappers[this.headers[columnIndex]] ? this.options.mappers[this.headers[columnIndex]](column) : parseFloat(column);
				
				// Return original if NaN, otherwise return converted
				return _.isNaN(converted) ? column : converted;
			});
		});
	}

	// Shuffle rows
	shuffleData() {
		this.data = shuffle.shuffle(this.data, this.options.shuffleString);
	}

	// Returns dataset with only the requested columns
	cropColumns(columns) {

		// Records indexes of the columns
		const indexes = _.map(columns, column => this.headers.indexOf(column));

		// Pulls and returns requested columns
		return _.map(_.cloneDeep(this.data), row => _.pullAt(row, indexes));
	}

	// Splits dataset into training and test sets
	splitData() {

		// If 'true', divide 50/50
		const testSetSize = _.isNumber(this.options.splitTest) ? this.options.splitTest : Math.floor(this.data.length/2);
		
		// Splits
		this.result.trainingInputs = this.result.inputs.slice(testSetSize);
		this.result.trainingOutputs = this.result.outputs.slice(testSetSize);
		this.result.testInputs = this.result.inputs.slice(0, testSetSize);
		this.result.testOutputs = this.result.outputs.slice(0, testSetSize);
	}
}

// Export class
module.exports = ParseCSV;