



getStandings = () => {
	fetch('https://v3.football.api-sports.io/standings?season=2022&team=42', options)
		.then(response => response.json())
		.then(response => {

			let data = response.response

			// console.log(data[0].league.standings[0])


			let competitions = ""
			let form = ""

			data.forEach(competition => {

				let placement = ""
				let teamPoints = ""

				// GET AND SPLIT FORM INTO AN ARRAY

				competition.league.standings[0].forEach(table => {
					placement = table.rank
					teamPoints = table.points
					form = table.form.split("")
				})

				// console.log(form)

				// CONVERT FORM FROM ARRAY TO HTML ICONS

				let formIcons =""

				form.forEach(result => {
					formIcons += `
						<i class="fa-solid fa-circle ${result}"></i>
					`
					// console.log(result)
				})

				// console.log(formIcons)

				// BUILD HTML FOR EACH LEAGUE STANDINGS SECTION

				competitions += `
				<div class="comp-line">
					<img class="comp-logo" src=${competition.league.logo} alt="">
					<h2>${competition.league.name}</h2>
					<h5>${placement}${placement > 3 ? "th" : placement ==3 ? "rd" : placement ==2 ? "nd" : "st"} Place (${teamPoints} pts)</h5>
					<div>
						${formIcons}
					</div>
				</div>
				`

			document.getElementById('allstandings').innerHTML = competitions

			})

		})
		.catch(err => console.error(err));
}

let matchDetails = []
let opponentDetails = []
now = new Date()

fetch('https://v3.football.api-sports.io/fixtures?season=2022&team=42&next=1', options)
	.then(response => response.json())
	.then(response => {
		matchDetails = response.response[0]
			let homeTeam = matchDetails.teams.home.name
			let awayTeam = matchDetails.teams.away.name
			document.getElementById('hometeam').innerHTML = `${homeTeam}:`
			document.getElementById('awayteam').innerHTML = `${awayTeam}:`

			// console.log(matchDetails)

			// GET LEAGUE DETAILS

			let leagueName = matchDetails.league.name
			let leagueLogo = matchDetails.league.logo

			let leagueStage = matchDetails.league.round.split("-")

			// console.log(leagueStage)

			document.getElementById('matchleague').innerHTML = `
			<img class="comp-logo" src=${leagueLogo}>
			<span class="matchcardDetails">
				<h2>${leagueName}</h2>
				<span>
					<h4>${leagueStage[0]}</h4>
					<h4>Round ${leagueStage[1]}</h4>
				</span>
			</span>`


			// DETERMINE HOME AND AWAY TEAMS

			if (matchDetails.teams.home.id != 42) {
				opponentDetails = matchDetails.teams.home
			} else {
				opponentDetails = matchDetails.teams.away
			}



			// ADD OPPONENT DETAILS TO PAGE

			document.getElementById('opponentinfo').innerHTML = `
			<img class="comp-logo" src=${opponentDetails.logo}>
			<span class="matchcardDetails">
				<h2 class="opponent-name">${opponentDetails.name}</h2>
				<span id="opponentform"></span>
			</span>
			`

			// DETERMINE MATCH VENUE AND DATE

			let venue = matchDetails.fixture.venue.name
			let matchDate = new Date(matchDetails.fixture.date)
			const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
			let matchMonth = months[matchDate.getMonth()]

			// ADD MATCH DETAILS TO PAGE

			document.getElementById('venueinfo').innerHTML = `
			<h2>${venue}</h2>
			<h3>${matchMonth} ${matchDate.getDate()}</h3>
			<h3>${matchDate.getHours()}:${matchDate.getMinutes()>9 ? `${matchDate.getMinutes()}` : `0${matchDate.getMinutes()}` }</h3>
			`

			// DETERMINE IF GAME IS LIVE

			if (matchDetails.fixture.status.long != "Not Started") {
				// ADD CURRENT SCORE TO PAGE
				document.getElementById('matchscore').innerHTML = `${matchDetails.goals.home} - ${matchDetails.goals.away}`
				document.getElementById('matchtime').innerHTML = `${matchDetails.fixture.status.elapsed}'`
			} else {
				// HIDE SCORE SECTION IF NOT LIVE
				document.getElementById('currentscore').style.display="none"
			}

			// DETERMINE IF TODAY IS MATCH DAY

			if (matchDate.getMonth() == now.getMonth() && matchDate.getDate() == now.getDate()) {
				getLineups()
			} else {
				// HIDE MATCH LINEUPS
				document.getElementById('teamlineups').style.display="none"
			}


		getOpponentForm()
		getStandings()
	})
	.catch(err => console.error(err));


getLineups = () => {
		fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${matchDetails.fixture.id}`, options)
			.then(response => response.json())
			.then( response => {
				homeLineup = response.response[0].startXI
				awayLineup = response.response[1].startXI

				// BUILD HTML FOR LINEUPS IN A VARIABLE

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

				// ADD LINEUPS TO PAGE

				document.getElementById('homelineup').innerHTML = homePlayers
				document.getElementById('awaylineup').innerHTML = awayPlayers

			})
		.catch(err => console.error(err));
}

getOpponentForm = () => {
	fetch(`https://v3.football.api-sports.io/standings?league=${matchDetails.league.id}&season=2022&team=${opponentDetails.id}`, options)
	.then(response => response.json())
	.then(response => {
		let data = response.response[0].league.standings[0]

		// console.log(data)

		let form = ""
		let oppPlacement = ""
		let oppPoints =""


		data.forEach(table => {
			oppPlacement = table.rank
			oppPoints = table.points
			form = table.form.split("")
		})

			console.log(form)
			console.log(oppPlacement)

		let oppformIcons =""

		form.forEach(result => {
			oppformIcons += `
		 		<i class="fa-solid fa-circle ${result}"></i>
			`
			// console.log(result)
		})

		document.getElementById('opponentform').innerHTML = `
			<h4>${oppPlacement}${oppPlacement > 3 ? "th" : oppPlacement ==3 ? "rd" : oppPlacement ==2 ? "nd" : "st"} Place (${oppPoints} pts)</h4>
			<span>
				${oppformIcons}
			</span>
		 `
	})
}
