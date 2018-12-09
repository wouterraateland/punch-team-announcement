import FortuneWheels from './components/FortuneWheels';
import TeamCards from './components/TeamCards';
import Timer from './Timer';
import rawData from './data.json';
import { decode, shuffle, toTuples } from './dataManipulation';
import seedrandom from 'seedrandom';

const fortuneWheels = FortuneWheels.getInstance();
const teamCards     = TeamCards.getInstance();

const load = () => {
	// So that Math.random is equal for everyone
	seedrandom('supermooipunch', { global: true });

	let data = decode(rawData);
	let shuffledTuples = shuffle(toTuples(data));

	fortuneWheels.addOptions(shuffledTuples);
	teamCards.addTeams(data.teams);
	Timer.init(shuffledTuples.length);
};

const scroll = () => {
	const top = document.body.scrollTop;

	document.querySelector('header').classList.toggle('up', top);
};

const confirmUnload = (e) => {
	const msg = '\o/';
	if (Timer.isBusy()) {
		e.returnValue = msg;
		return msg;
	}
};

window.addEventListener('scroll', scroll);

window.addEventListener('load', load);

window.addEventListener('beforeunload', confirmUnload);
