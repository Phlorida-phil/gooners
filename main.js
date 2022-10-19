

getStandings = () => {
	fetch('https://v3.football.api-sports.io/standings?season=2022&team=42', options)
		.then(response => response.json())
		.then(response => {

			let data = response.response

			console.log(data[0].league.standings[0])


			let competitions = ""

			data.forEach(competition => {

				let placement = ""
				let form = ""

				competition.league.standings[0].forEach(table => {
					placement = table.rank
					form = table.form.split("")
				})

				console.log(form)

				competitions += `
				<div class="comp-line">
					<img class="comp-logo" src=${competition.league.logo} alt="">
					<h3>${competition.league.name}</h3>
					<h5>${placement}${placement > 3 ? "th" : placement ==3 ? "rd" : placement ==2 ? "nd" : "st"} Place</h5>
					<h5>${form}</h5>
					<i class="fa-solid fa-circle win"></i>
				</div>
				`
			})

			document.getElementById('allstandings').innerHTML = competitions
		})
		.catch(err => console.error(err));
}

let matchDetails = []
let opponentDetails = []
now = new Date()

fetch('https://v3.football.api-sports.io/fixtures?season=2022&team=42&last=1', options)
	.then(response => response.json())
	.then(response => {
		matchDetails = response.response[0]
			let homeTeam = matchDetails.teams.home.name
			let awayTeam = matchDetails.teams.away.name
			document.getElementById('hometeam').innerHTML = `${homeTeam}:`
			document.getElementById('awayteam').innerHTML = `${awayTeam}:`

			// GET LEAGUE DETAILS

			let leagueName = matchDetails.league.name
			let leagueLogo = matchDetails.league.logo
			document.getElementById('matchleague').innerHTML = `
			<img class="comp-logo" src=${leagueLogo}>
			<h2>${leagueName}</h2>`


			if (matchDetails.teams.home.id != 42) {
				opponentDetails = matchDetails.teams.home
			} else {
				opponentDetails = matchDetails.teams.away
			}

			document.getElementById('opponentinfo').innerHTML = `
			<img class="comp-logo" src=${opponentDetails.logo}>
			<span>
			<h2 class="opponent-name">${opponentDetails.name}</h2>
			<p>form</p>
			</span>
			`

			let venue = matchDetails.fixture.venue.name
			let matchDate = new Date(matchDetails.fixture.date)
			const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
			let matchMonth = months[matchDate.getMonth()]



			document.getElementById('venueinfo').innerHTML = `
			<h2>${venue}</h2>
			<h3>${matchMonth} ${matchDate.getDate()}</h3>
			<h3>${matchDate.getHours()}:${matchDate.getMinutes()>9 ? `${matchDate.getMinutes()}` : `0${matchDate.getMinutes()}` }</h3>
			`

		getLineups()
		getStandings()
	})
	.catch(err => console.error(err));


getLineups = () => {
	if (now == matchDetails.fixture.date) {
		fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${matchDetails.fixture.id}`, options)
			.then(response => response.json())
			.then( response => {
				homeLineup = response.response[0].startXI
				awayLineup = response.response[1].startXI

				homePlayers = ""

				homeLineup.forEach(starter => {
					homePlayers +=
					`<li class="player-details">
						<div class="player-info">
							<p>${starter.player.pos}</p>
							<p>${starter.player.name}</p>
							<p>#${starter.player.number}</p>
						</div>
					</li>`
				})

				awayPlayers = ""

				awayLineup.forEach(starter => {
					awayPlayers +=
					`<li class="player-details">
						<div class="player-info">
							<p>${starter.player.pos}</p>
							<p>${starter.player.name}</p>
							<p>#${starter.player.number}</p>
						</div>
					</li>`
				})

				document.getElementById('homelineup').innerHTML = homePlayers
				document.getElementById('awaylineup').innerHTML = awayPlayers

			})
		.catch(err => console.error(err));

	} else {
		document.getElementById('teamlineups').style.display="none"
		document.getElementById('currentscore').style.display="none"

	}
}
