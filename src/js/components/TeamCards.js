import TeamCard from './TeamCard';

let instance = null;

class TeamCards {
	constructor(teams) {
		this.teamCards = [];
		this.query = '';
	}

	addTeams(teams) {
		if (!(teams instanceof Array) ||
			teams.length == 0) { return; }

		this.teamCards = [
			...this.teamCards,
			...teams.map(team => new TeamCard(team))
		];

		this.search();
	}

	search(query) {
		// Update query if necessary
		if (query !== undefined) {
			this.query = query;
		}

		// And search
		for (let team of this.teamCards) {
			if (this.query == '' ||
				team.hasQuery(this.query)) {
				team.show();
			} else {
				team.hide();
			}
		}
	}

	insert({ name, team, position }) {
		for (let teamCard of this.teamCards) {
			if (teamCard.hasName(team)) {
				teamCard.insert({ name, position });
			}
		}
	}
}

TeamCards.getInstance = () => {
	if (instance == null) {
		instance = new TeamCards();
	}
	
	return instance;
};

export default TeamCards;