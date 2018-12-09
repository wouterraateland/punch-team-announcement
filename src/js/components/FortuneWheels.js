import FortuneWheel from './FortuneWheel';

const nameWheel = new FortuneWheel(
	document.querySelector('#nameWheel .inner'), ['De teams']);
const teamWheel = new FortuneWheel(
	document.querySelector('#teamWheel .inner'), ['zijn']);
const positionWheel = new FortuneWheel(
	document.querySelector('#positionWheel .inner'), ['bekend']);

let instance = null;

class FortuneWheels {
	constructor() {
		this.options = [];
		this.timeouts = [];
	}

	addOptions(options = []) {
		if (!(options instanceof Array) ||
			options.length == 0) { return; }

		this.options = [...this.options, ...options];

		nameWheel.addOptions(
			options.map(option => option.name));
		teamWheel.addOptions(
			options.map(option => option.team));
		positionWheel.addOptions(
			options.map(option => option.position));
	}

	getNextResult() {
		if (this.options.length) {
			return this.options.shift();
		} else {
			return {
				name     : 'De teams',
				team     : 'zijn',
				position : 'bekend',
			};
		} 
	}

	simulate() {
		return new Promise((resolve, reject) => {
			resolve(this.getNextResult());
		});
	}

	spin() {
		const result = this.getNextResult();

		return new Promise((resolve, reject) => {
			const checkProgress = () => {
				if (!this.isSpinning()) {
					resolve(result);
				}
			};

			nameWheel.spin(result.name).then(checkProgress);
			
			this.timeouts.push(setTimeout(() => {
				teamWheel.spin(result.team).then(checkProgress);
			}, 1000));

			this.timeouts.push(setTimeout(() => {
				positionWheel.spin(result.position).then(checkProgress);
			}, 2000));
		});
	}

	finish() {
		if (!this.isSpinning()) { return; }

		let timeout;
		while (timeout = this.timeouts.shift()) {
			clearTimeout(timeout);
		}

		nameWheel.finish();
		teamWheel.finish();
		positionWheel.finish();
	}

	isSpinning() {
		return (
			nameWheel.isSpinning() ||
			teamWheel.isSpinning() ||
			positionWheel.isSpinning()
		);
	}
}

FortuneWheels.getInstance = () => {
	if (instance == null) {
		instance = new FortuneWheels();
	}
	
	return instance;
};

export default FortuneWheels;