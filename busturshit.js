// Betting starts here -----------

var baseBet = Math.round(5/0.13); // Base bet.

// -----------
// Number of games skipped after X losses
var skip1 = 0;    // after third loss
var skip2 = 2;    // after fourth loss
var skip3 = 1;    // after fifth loss
var skip4 = 3;    // after sixth loss
var skip5 = 0;    // after seventh loss
var skip6 = 1;    // after eighth loss
var skip7 = 2;    // after fifteenth loss
// ------------
var bet = baseBet * 100;
var cashOut = 1.11;

var rapeBet = 1.5; // Bet we will do when we start losing
// ---- End of configurable shit ----

var currentBet = bet;
var startBalance = engine.getBalance();
var currentBalance = startBalance;

//zero out
var losses = 0, skip = 0, lostGames = 0, waitXgames = 0, CO = 0;
var winStreak = 0, result = 'No results yet. ', lossStreak = 0;

var statsAllWins = 0, statsAllLosses = 0;

console.log('%c----------Game Start!----------', 'color: green; font-weight:bold')

engine.on('game_starting', function(info) {
    if (currentBet && engine.lastGamePlay() == 'LOST') {
        //if loss
        lossStreak++;
        statsAllLosses++;
        lostGames++;
        winStreak = 0;
        currentBalance = engine.getBalance();
        losses = startBalance - currentBalance;

        currentBet *= rapeBet; //bet increase per loss round
        cashOut = (losses / currentBet) + 1.1; //cashout multiplier increase per loss round

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
        console.log('%cYou lose', 'color: red; font-weight:bold', bitresult, 'bits');
    } else {
        //if win
        currentBalance = engine.getBalance();
        if (currentBalance > startBalance) {
            winStreak++;
            if (winStreak >= 2) {
                cashOut *= 1.014; //cashout increase per win round
                if(cashOut>1.23){
                    cashOut=1.23;
                }else{
                    currentBet *= 1.02; //bet increase per win round
                }
            } else {
                currentBet = bet; //reset betting after first win after loss(es)
                cashOut = 1.11;
            }
            
            startBalance = engine.getBalance();
            lostGames = 0;
            skip = 0;
            
            lossStreak = 0;
            statsAllWins++;
            console.log('%cYou win', 'color: green; font-weight:bold', bitresult, 'bits');
        }
    }
    
    console.log('---Stats---');
    console.log('W/L :: (', statsAllWins, '/', statsAllLosses, ')');

    if (winStreak > '1') {
 		console.log('Current win streak is', winStreak);
 	}
 	if (lossStreak > '1') {
 		console.log('Current loss streak is', lossStreak);
 	}
 
    console.log('--------New Round--------')

    if (waitXgames >= skip) {
        console.log('', Math.floor(currentBet / 100), 'bits bet at', Math.round(cashOut * 100) / 100, 'x');
        engine.placeBet(Math.floor(currentBet / 100) * 100, Math.floor(cashOut * 100), false);
    } else {
		console.log('Cooling off. No bets this round.')
		console.log('Current loss streak is', lossStreak)
	}
	statsCurrentBet = Math.floor(currentBet / 100);
	statsCashOut = Math.round(cashOut * 100) / 100;
	//
	bitresult = Math.floor((statsCurrentBet * statsCashOut) - statsCurrentBet);
	statbet = Math.floor(bet / 100);

});
engine.on('game_crash', function(data) {
    if (data.game_crash / 100 >= CO) {
        console.log('Game [Busted] at ' + (data.game_crash / 100) + 'x');
        waitXgames++;
    } else {
        waitXgames++;
    }
});


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

