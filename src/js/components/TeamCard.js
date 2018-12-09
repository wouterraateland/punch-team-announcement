class TeamCard {
	constructor(team) {
		this.name = team.name;
		this.shortName = team.shortName;
		this.trainer = team.coach;
		this.players = [];

		this.setElement(TeamCard.createElement(team));
	}

	setElement(element) {
		this.element = element;
	}

	hasQuery(query) {
		// Check if query matches name
		if (name.toLowerCase()
			.indexOf(query.toLowerCase()) !== -1) {
			return true;
		}

		// Check if query matches any player
		for (let player of players) {
			// Player name
			if (player.name.toLowerCase()
				.indexOf(query.toLowerCase()) !== -1) {
				return true;
			}

			// Player position
			if (player.position.toLowerCase()
				.indexOf(query.toLowerCase()) !== -1) {
				return true;
			}
		}

		return false;
	}

	hasName(name) {
		return this.name == name || this.shortName == name;
	}

	insert({ name, position }) {
		const element = document.createElement('li');
		element.classList.add('player');
		element.dataset.position = position;
		element.innerText = name;

		this.players.push({ element, name, position });

		this.sort();
	}

	sort() {
		this.players.sort((a, b) => (
			TeamCard.positionOrder[a.position] -
			TeamCard.positionOrder[b.position]
		));

		const playerList = this.element.querySelector('.player-list');

		for (let player of this.players) {
			playerList.appendChild(player.element);
		}
	}

	show() {
		TeamCard.container.appendChild(this.element);
	}

	hide() {
		TeamCard.container.removeChild(this.element);
	}
}

TeamCard.container = document.querySelector('.team-container');

TeamCard.positionOrder = {
	"Spelverdeler" : 0,
	"Buiten"       : 1,
	"Midden"       : 2,
	"Diagonaal"    : 3,
	"Libero"       : 4,
};

TeamCard.createElement = (team) => {
	const element = document.createElement('div');
	element.classList.add('team-card');

	element.appendChild(
		TeamCard.createTitle(team.name));
	element.appendChild(
		TeamCard.createTrainer(team.coach));
	element.appendChild(
		TeamCard.createPlayerList(team.positions));

	return element;
};

TeamCard.createTitle = (name) => {
	const title = document.createElement('h2');
	title.classList.add('title');
	title.innerText = name;
	return title;
};

TeamCard.createTrainer = (name) => {
	const trainer = document.createElement('p');
	trainer.classList.add('trainer');
	trainer.innerText = name;
	return trainer;
}

TeamCard.createPlayerList = (positions) => {
	const list = document.createElement('ol');
	list.classList.add('player-list');

	return list;
};

export default TeamCard;