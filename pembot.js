// CSS highlight usernames -----------
var usersArray = ["TechiusHF","sioncloudnine","strelnikov","PMYA","jesuspiece4","jesuspiece2","Polsaker"];

//create <style> in head
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '';
var arrayLength = usersArray.length;
for (var i = 0; i < arrayLength; i++) {
  style.innerHTML += 'tr[data-reactid*="';
  style.innerHTML += usersArray[i];
  style.innerHTML += '"],';
}
style.innerHTML += 'tr[data-reactid*="pembo"]{border: 3px solid #ff0000;}';
document.getElementsByTagName('head')[0].appendChild(style);
// --------------
// --------------
var baseBet = Math.round(200/0.13);    // base bet here.
// (50/0.13) bets 385
// -----------
// Number of games skipped after X losses
var skip1 = 0;    // after third loss
var skip2 = 1;    // after fourth loss
var skip3 = 0;    // after fifth loss
var skip4 = 1;    // after sixth loss
var skip5 = 0;    // after seventh loss
var skip6 = 0;    // after eighth loss
var skip7 = 0;    // after fifteenth loss
// ------------
var bet = baseBet * 100;
var cashOut = 1.11;

var currentBet = bet;
var startBalance = engine.getBalance();
var currentBalance = startBalance;
//zero out
var losses = 0;var skip = 0;var lostGames = 0;var waitXgames = 0;
var CO = 0;var winStreak = 0;result = 'No results yet.. ';
var lossStreak = 0;statsAllWins = 0;statsAllLosses = 0;

//start
console.log('%c----------Start!----------', 'color: green; font-weight:bold');
engine.on('game_starting', function(info) {
    if (currentBet && engine.lastGamePlay() == 'LOST') {
	  	//if loss
			lossStreak++;
      lostGames++;
      winStreak = 0;
      currentBalance = engine.getBalance();
      losses = startBalance - currentBalance;

      currentBet *= 1.18; //bet increase per loss round
      cashOut = (losses / currentBet) + 1.14; //cashout multiplier increase per loss round

      if (lostGames >= 1) {
        waitXgames = 0;
        if (lostGames == 3) {skip = skip1;}
        if (lostGames == 4) {skip = skip2;}
        if (lostGames == 5) {skip = skip3;}
        if (lostGames == 6) {skip = skip4;}
        if (lostGames == 7) {skip = skip5;}
        if (lostGames >= 8) {skip = skip6;}
        if (lostGames >= 15) {skip = skip7;}
      }
    } else {
	  	//if win
      currentBalance = engine.getBalance();
      if (currentBalance > startBalance) {
			  winStreak++;
				if (winStreak >= 2) {
					currentBet *= 1.02; //bet increase per win round
					cashOut *= 1.02; //cashout increase per win round
				} else {
					console.log('%cBetting Reset', 'color: green; font-weight:bold');
					currentBet = bet; //reset betting after first win after loss(es)
					cashOut = 1.11;
				}
	      startBalance = engine.getBalance();
	      lostGames = 0;
	      skip = 0;
				//reset betting on 7 winStreak
				if (winStreak % 7 === 0) {
					console.log('%cSeven win streak', 'color: green; font-weight:bold');
					console.log('%cBetting Reset', 'color: green; font-weight:bold');
					currentBet = bet; //reset betting
					cashOut = 1.11;	//reset cashOut
				}
      }
    }

		//win vs loss stuff

		if (engine.lastGamePlay() == 'WON') {
			lossStreak = 0;
			statsAllWins++;
			console.log('%cYou win', 'color: green; font-weight:bold', bitresult, 'bits'); //estimate without +bonus%
			//console.log('', bitresult, 'bits'); //estimate without bonus%
			//startBalance = engine.getProfit();

			//console.log('Base bet is', statbet);

		}
		if (engine.lastGamePlay() == 'LOST') {
			winStreak = 0;
			statsAllLosses++;
			console.log('%cYou lose', 'color: red; font-weight:bold');
			//console.log('Base bet is', statbet);

		}

		//show stuff on console
		console.log('---Stats---');
		//tempStat1 = Math.round(statsAllWins + statsAllLosses);
		//statsWinPercentage = parseFloat(statsAllWins / tempStat1);
		console.log('W/L :: (', statsAllWins, '/', statsAllLosses, ')');
		//console.log('', statsAllLosses);
		if (winStreak > '1') {
			console.log('Current win streak is', winStreak);
		}
		if (lossStreak > '1') {
			console.log('Current loss streak is', lossStreak);
		}

		//betting or chilling
    if (waitXgames >= skip) {
			//if betting this round
			console.log('--------New Round--------')
	    console.log('', Math.floor(currentBet / 100), 'bits bet at', Math.round(cashOut * 100) / 100, 'x');
	    engine.placeBet(Math.floor(currentBet / 100) * 100, Math.floor(cashOut * 100), false);
    } else {
			//skip round
			console.log('--------New Round--------')
			console.log('Cooling off. No bets this round.');
			winStreak = 0;
  	}

		////stats n stuff

		statsCurrentBet = Math.floor(currentBet / 100);
		statsCashOut = Math.round(cashOut * 100) / 100;
		//
		bitresult = Math.floor((statsCurrentBet * statsCashOut) - statsCurrentBet);
		statbet = Math.floor(bet / 100);

});

//detect Busted
engine.on('game_crash', function(data) {
    if (data.game_crash / 100 >= CO) {
        console.log('Game [Busted] at ' + (data.game_crash / 100) + 'x');
        waitXgames++;
    } else {
        waitXgames++;
    }
});
//engine.on('game_crash', function(data) {
//    console.log('[Bot] Game crashed at ' + (data.game_crash / 100) + 'x');
//});
