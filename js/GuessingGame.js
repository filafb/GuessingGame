function generateWinningNumber(){
    return Math.floor(Math.random()*100)+1
}
function shuffle(arr){
    var l = arr.length, t, i;
    while(l){
        i = Math.floor(Math.random() * l--);
        t = arr[l];
        arr[l] = arr[i];
        arr[i] = t 
    }
    return arr
}
function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
    return Math.abs(this.playersGuess-this.winningNumber)
}

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber
}

Game.prototype.playersGuessSubmission = function(num){
    if(num < 1 || num > 100 || typeof num !== 'number'){
        $('#title').text('Opps!');
        $('#subtitle').text('That is an invalid guess');
        throw 'That is an invalid guess'
    }
    else{
    this.playersGuess = num
    }
    return this.checkGuess()
}

Game.prototype.checkGuess = function(){
    if(this.playersGuess === this.winningNumber){
        addToList(this.playersGuess, this.pastGuesses.length);
        disableButtons()
        return 'You Win!'
    }
    else{
        if(this.pastGuesses.indexOf(this.playersGuess) !== -1){
            return 'You have already guessed that number'
        }
        else{
            addToList(this.playersGuess, this.pastGuesses.length);
            this.pastGuesses.push(this.playersGuess);
            if(this.pastGuesses.length === 5){
                disableButtons()
                return 'You Lose'
            } 
            else if(this.difference() < 10){
                
                return 'You\'re burning up!'
            }
            else if(this.difference() < 25){
                return 'You\'re lukewarm'
            }
            else if(this.difference() < 50){
                return 'You\'re a bit chilly'
            }
            else{
                return 'You\'re ice cold!'
            }
        }
    }

}
 var newGame = function(){
    return new Game()
}

Game.prototype.provideHint = function(){
    var arr = [];
    arr.push(this.winningNumber);
    while(arr.length < 3){
        arr.push(generateWinningNumber())
    }
    return shuffle(arr)
}
//making it works:
function guessANumber(game){
    var guess = +$('#player-input').val();
    $('#player-input').val('');
    var output = game.playersGuessSubmission(guess);
    var isLower = game.isLower();
    warningPlayer(output, isLower);
    console.log(game.winningNumber)
}

$(document).ready(function(){
    var headersClone = $('#headers').clone();
    var guessClone = $('#guess-list').clone();
    var game = new Game;
    $('#submit').on('click', function(){
        guessANumber(game);
    });
    $('#player-input').keypress(function(event){
        if(event.which === 13){
            guessANumber(game)
        }
    });
    $('#reset').on('click', function(){
        game = new Game
        $('#headers').replaceWith(headersClone.clone());
        $('#guess-list').replaceWith(guessClone.clone());
        $('#submit').prop('disabled',false);
        $('#hint').prop('disabled',false);
        $('#player-input').prop('disabled', false);
    })
    $('#hint').on('click', function(){
        var hint = game.provideHint();
        var messageHint = 'The winning number is ' + hint[0] + ', ' + hint[1] + ' or ' + hint[2];
        $('#title').text(messageHint);
        $('#hint').prop('disabled',true);
    })
})
function addToList(guess, guesses){ 
    // var guessList = document.createElement('li');
    // $(guessList).text(guess);
    // console.log(guesses);
    $('li').eq(guesses).text(guess);
    
    
    // $('#guess-list').prepend(guessList).addClass('guess');
//$('#guess-list').closest('.guess').remove()    
}

function warningPlayer(output, isLower){
    var message = output; isLower = isLower? 'Guess Higher':'Guess Lower';
    $('#title').text(message);
    if(message === 'You Win!'|| message === 'You Lose'){
        $('#subtitle').text('Press reset button to play again');
    }
    else{
        $('#subtitle').text(isLower);
    }
}
function disableButtons(){
    $('#submit').prop('disabled',true);
    $('#hint').prop('disabled',true);
    $('#player-input').prop('disabled', true);
}