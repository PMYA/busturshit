// -----------
var baseBet = Math.round(5/0.13);;    // Set the base bet here. I recommend to set it to ~200 if you have 100k bits as start balance.

// -----------
var skip1 = 0;    // after second loss
var skip2 = 1;    // after third loss
var skip3 = 1;    // after fourth loss
var skip4 = 1;    // after fifth loss
var skip5 = 0;    // after sixth loss
var skip6 = 1;    // after eighth loss
var skip7 = 2;    // skip X games afterwards. This means the script will bet once and then skip X games.
                  // This would continue to happen until a game is won or you bust.
// ------------
var bet = baseBet * 100;
var cashOut = 1.11;

var currentBet = bet;
var startBalance = engine.getBalance();
var currentBalance = startBalance;
//zero out
var losses = 0;var skip = 0;var lostGames = 0;var waitXgames = 0;var CO = 0;var winStreak = 0;result = 'No results yet. ';
			console.log('%c----------Game Start!----------', 'color: green; font-weight:bold')
engine.on('game_starting', function(info) {
    if (currentBet && engine.lastGamePlay() == 'LOST') {
		//if loss
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
				cashOut *= 1.014; //cashout increase per win round
			} else {
				currentBet = bet; //reset betting after first win after loss(es)
				cashOut = 1.11;
			}
            startBalance = engine.getBalance();
            lostGames = 0;
            skip = 0;
        }
    }

    if (waitXgames >= skip) {
		if (currentBet && engine.lastGamePlay() == 'WON') {
			console.log('%cYou win', 'color: green; font-weight:bold')
		} 
		if (currentBet && engine.lastGamePlay() == 'LOST') {
			console.log('%cYou lose', 'color: red; font-weight:bold')
		}
		if (winStreak == '1') {} else {
			console.log('Current winstreak is', winStreak)
		}
		console.log('--------New Round--------')
        console.log('', Math.floor(currentBet / 100), 'bits bet at', Math.round(cashOut * 100) / 100, 'x');
        engine.placeBet(Math.floor(currentBet / 100) * 100, Math.floor(cashOut * 100), false);
    } else {
		console.log('--------New Round--------')
		console.log('Cooling off. No bets this round.')
		winStreak = 0;
	}
});
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
