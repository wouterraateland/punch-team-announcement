import { shuffle } from '../dataManipulation.js';

function angleDifference(a1, a2) {
	return (((a2 - a1) % 360) + 540) % 360 - 180;
}

class FortuneWheel {
	constructor(element, options) {
		this.element = element;
		this.options = [];
		this.accelerating = false;
		this.currentOption = -1;
		this.target = 0;
		this.angle = 0;
		this.speed = 0;
		this.resolve = () => {};
		this.addOptions(options);
		this.lastTime = Date.now();
		setInterval(this.update.bind(this), 1000/60);
	}

	setSize() {
		this.size = 48*this.options.length/(2*Math.PI);
	}

	addOptions(names = []) {
		if (!(names instanceof Array) ||
			names.length == 0) { return; }

		const newOptions = names.map(FortuneWheel.createOption);

		// Add newly generated options to current options
		// and shuffle them.
		this.options = shuffle([...this.options, ...newOptions]);

		// Resize wheel
		this.setSize();

		// Place option elements
		let a, option;
		for (let i = 0; i < this.options.length; i++) {
			option = this.options[i];

			this.element.appendChild(option.element);

			a = 360*i/this.options.length;
			option.element.style.transform =
				`rotateX(${a}deg) translateZ(${this.size}px)`;
		}
	}

	accelerate() {
		this.accelerating = true;
	}

	decelerate() {
		this.accelerating = false;
	}

	update() {
		const dt = (Date.now() - this.lastTime)/1000;
		this.lastTime = Date.now();

		if (this.accelerating) {
			// Accelerating
			this.speed += 4.5*dt;
		} else {
			// Decelerating
			this.speed += 0.060*dt*angleDifference(this.angle, this.target);
			this.speed -= 3*dt*this.speed;
			
			if (dt > 0.5 ||
				(
					Math.abs(this.speed)*this.size < 50 &&
					Math.abs(angleDifference(this.angle, this.target))*this.size < 50
				)
			) {
				this.speed = 0;
				this.angle = this.target;
			}
		}

		this.angle = (this.angle + this.speed + 360) % 360;

		this.element.style.transform =
			`translateZ(${-this.size}px) rotateX(${this.angle}deg)`;
		
		if (this.speed == 0 && this.angle == this.target) {
			// Resolve the promise
			this.resolve(this.options[this.currentOption]);
			this.resolve = () => {};
		}
	}

	spin(name) {
		let option;
		for (let i = 0; i < this.options.length; i++) {
			option = this.options[i];

			if (option.name == name) {
				this.currentOption = i;
				this.target = (720 - 360*i/this.options.length) % 360;
				break;
			}
		}

		this.accelerate();
		setTimeout(this.decelerate.bind(this), 2000);

		return new Promise((resolve, reject) => {
			this.resolve = resolve;
		});
	}

	finish() {
		this.accelerating = false;
		this.speed = 0;
		this.angle = this.target;
	}

	isSpinning() {
		return this.accelerating || this.speed != 0;
	}
}

FortuneWheel.createOption = (name) => {
	const element = document.createElement('span');
	element.innerText = name;

	return { name, element };
};

export default FortuneWheel;