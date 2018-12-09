import { dec } from './decode';

const decodeString = "MVRQ1sduvh+dwre+lqsxw1vsolw+**,1uhyhuvh+,1mrlq+**,,,";

const decode = input => eval(dec(decodeString));

const toTuples = input => {
	let output = [];

	for (let team of input.teams) {
		for (let player of team.players) {
			output.push({
				name     : player.name,
				team     : team.shortName,
				position : player.position,
			});
		}
	}

	return output;
};

const shuffle = input => {
	let output = input.concat();

	let c = output.length, r;

	while (0 !== c) {
		r = Math.floor(Math.random() * c);
		c--;

		[output[c], output[r]] = [output[r], output[c]];
	}

	return output;
};

export { decode, shuffle, toTuples };