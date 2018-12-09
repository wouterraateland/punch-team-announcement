import FortuneWheels from './components/FortuneWheels';
import TeamCards from './components/TeamCards';

const times = {
	second : 1000,
	minute : 1000*60,
	hour   : 1000*60*60,
	day    : 1000*60*60*24,
	week   : 1000*60*60*24*7,
};

let interval, notStartedOverlay, h1;

let startTime = new Date(2016, 9-1, 15, 11).getTime();
let endTime   = startTime + 4*times.hour;

const fortuneWheels = FortuneWheels.getInstance();
const teamCards     = TeamCards.getInstance();

let currentOption = 0, optionInterval, counting = false;

const Timer = {
	init: (amountOfOptions) => {
		notStartedOverlay = document.querySelector('#notStartedOverlay');
		h1 = document.querySelector('h1');

		optionInterval = (endTime - startTime) / amountOfOptions;

		Timer.update();
		interval = setInterval(Timer.update, 1000);
	},

	update: () => {
		while (Timer.isBehind()) {
			currentOption++;

			fortuneWheels.simulate().then(result => {
				teamCards.insert(result);
			});
		}

		if (Timer.isStarted()) {
			if (Timer.isEnded()) {
				// It's over...
				if (document.title != 'De teams zijn bekend.') {
					fortuneWheels.spin().then(() => {
						h1.innerText = 'Team-bekendmaking';
						document.title = 'De teams zijn bekend.';
					});
				}
			} else {
				// We are rolling!
				let time = Timer.timeTilNext();

				if (!fortuneWheels.isSpinning()) {
					h1.innerText = `${time} tot volgende`;
				}

				if (Timer.timeToSpin()) {
					h1.innerText = 'Team-bekendmaking';
					document.title = 'De wielen draaien...';
					Timer.spin();
				} else if (counting) {
					document.title = `${time} tot volgende`;
				}
			}
		} else {
			// Wait for the start...
			let time = Timer.timeTilNext();
			document.title = `${time} tot start`;

			notStartedOverlay.querySelector('p')
				.innerText = `Nog ${time} tot start team-bekendmaking...`;
		}

		Timer.toggleOverlay(!Timer.isStarted());
	},

	isBusy: () => (Timer.isStarted() && !Timer.isEnded()),
	isStarted: () => (Date.now() >= startTime),
	isEnded: () => (Date.now() > endTime),

	timeTilNext: () => {
		let time,
			dt = Math.max(0, startTime + optionInterval*currentOption - Date.now());

		if (dt >= 2*times.day) {
			// At least 2 days until start
			time = `${Math.floor(dt / times.day)} dagen`;
		} else if (dt >= times.day) {
			// Only one day until start
			time = '1 dag';
		} else {
			// Less than a day until start
			const hours   = Math.floor(dt / times.hour);
			dt -= hours*times.hour;
			const minutes = Math.floor(dt / times.minute);
			dt -= minutes*times.minute;
			const seconds = Math.floor(dt / times.second);

			time = `${hours}:${minutes}:${seconds}`;
		}

		return time;
	},

	spin: () => {
		currentOption++;
		counting = false;

		fortuneWheels.spin().then(result => {
			document.title = `${result.name} zit in ${result.team}`;
			teamCards.insert(result);

			setTimeout(Timer.startCountdown, 10000);
		});
	},

	startCountdown: () => {
		counting = true;
	},

	timeToSpin: () => (
		Date.now() - startTime >= optionInterval*currentOption
	),

	isBehind: () => (
		Date.now() - startTime >= optionInterval*(currentOption + 1)
	),

	toggleOverlay: (visibility) => {
		notStartedOverlay.classList.toggle('visible', visibility);
	},
};

export default Timer;