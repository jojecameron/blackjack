testMode = false;

const fs = require('fs');
let casinoBank = {};
if (fs.existsSync('casino_bank.json')) {
  casinoBank = JSON.parse(fs.readFileSync('casino_bank.json'));
} else {
  fs.writeFileSync('casino_bank.json', JSON.stringify({}));
}

let userData;

function userVerification() {
  let unverified = true;
  while (unverified) {
    alert(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n< \u2664 \u2661 \u2662 \u2667  Welcome to Blackjack!  \u2664 \u2661 \u2662 \u2667 >\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\nAre you a new player?\nYes or No?`);
    let input = prompt(`>`).toLowerCase();
    if (input.includes('yes')) {
      unverified = false;
      return newPlayer();
    } else if (input.includes('no')) {
      unverified = false;
      return existingPlayer();
    } else {
      alert(`Please enter either Yes or No`);
    }
  }
}

function newPlayer(){
  alert(`Please create a username.`);
  let newUserName = prompt(`>`);
  while (checkUserExists(newUserName)) {
    alert(`Sorry, that username is taken. Please create a unique username.`);
    newUserName = prompt(`>`);
  }
  alert(`Please create a password.\nPasswords must be over 6 characters.`);
  let newPW = prompt(`>`);
  while (newPW.length <= 6) {
    alert(`Sorry that's too short. Passwords must be over 6 characters.\nAt least we know you won't be counting cards! :^)`);
    newPW = prompt(`>`);
  }
  alert(`Lastly, what should we call you?`);
  let newName = prompt(`>`);
  alert(`Alright, ${newName}, right this way!`);
  userData = createUser(newUserName, newName, newPW);
  return true;
}

function existingPlayer(){
  alert('Please enter your username.');
  let userNameInput = prompt(`>`);
  let unverified = true;
  while (unverified) {
    if (!checkUserExists(userNameInput)) {
      alert(`Sorry, we don't know that username.\nWould you like to create a new account?`);
      let input = prompt(`>`).toLowerCase();
      if (input === `yes`) {
        unverified = false;
        return newPlayer();
        // return;
      } else if (input === `no`) {
        existingPlayer();
        return;
      }
    } else {
      unverified = false;
    }
  }
  alert(`Welcome back ${casinoBank[userNameInput].name}!\nPlease enter your password and we'll pull up your chip amount.`)
  let counter = 5;
  let pwInput = prompt(`>`);
  while (pwInput !== casinoBank[userNameInput]['password'] && counter > 0) {
    alert(`Hmmm...that wasn't right. Try again?\n${counter} attempts reminaing.`);
    pwInput = prompt(`>`);
    counter--;
  }
  if (counter === 0) {
    alert(`You've ran out of guesses, please come back when you remember!`);
    return false;
  } else if (casinoBank[userNameInput]['password']) {
    alert(`Password verified!`);
    userData = casinoBank[userNameInput];
    return true;
  }
}

function chipCheck(){
  if (userData.chips < 1){
    alert(`\nOh...I see your account with us is empty. Well just because I like you, here's 100 chips...on the house. `)
    userData.chips = 100;
  }
}

function chipWithdraw(){
  alert(`\nYou have ${userData.chips} chips, how many would you like to play with today?`);
  let chipWithdraw = Number(prompt(`>`));
  while (Number(chipWithdraw) > userData.chips || Number.isNaN(chipWithdraw) || Number(chipWithdraw) < 1) {
    if (Number(chipWithdraw) > userData.chips) {
      alert(`You only have ${userData.chips} chips.`);
      chipWithdraw = Number(prompt(`>`));
    } else if (Number.isNaN(chipWithdraw)) {
      alert(`Try a number amount.`);
      chipWithdraw = Number(prompt(`>`));
    } else {
      alert(`Are you feeling alright?`);
      chipWithdraw = Number(prompt(`>`));
    }
  }
  Number(chipWithdraw);
  userData.chips -= chipWithdraw;
  userData.chipsInPlay = chipWithdraw;
}

function createUser(username, name, password) {
  let newUser = new UserCreator(name, username, password);
  return newUser.getUserData();
}

function checkUserExists(username) {
    return casinoBank[username] !== undefined;
}

class UserCreator {
  user = {
    "name": null,
    "username": null,
    "password": null,
    "chips": 0,
    "chipsInPlay": 100
  };
  constructor(name, username, password) {
    this.user.name = name;
    this.user.username = username;
    this.user.password = password;
  }
  getUserData() {
    return this.user;
  }
}

const cardValues = {
  Ace: 11,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Ten: 10,
  Jack: 10,
  Queen: 10,
  King: 10
}

const cardPic = {
  Ace: '🂡',
  Two: '🂢',
  Three: '🂣',
  Four: '🂤',
  Five: '🂥',
  Six: '🂦',
  Seven: '🂧',
  Eight: '🂨',
  Nine: '🂩',
  Ten: '🂪',
  Jack: '🂫',
  Queen: '🂭',
  King: '🂮'
}

function newGame () {
  if (!userVerification()) return;
  chipCheck();
  chipWithdraw();
  alert(`\nHave a seat, ${userData.name}! Good luck!`)
  const dealer = new dealerBJ();
  const player = new playerBJ(userData);
  const currentDeck = newDeck();
  player.bet(dealer, player, currentDeck);
}

let newDeck;
if (testMode === true) {
  newDeck = function () {
    const deck = ['Six', 'Six', 'Six', 'Six', 'Six', 'Six', 'Six', 'Six', 'Six', 'Six', 'Six', 'Six'];
    return deck;
  }
} else {
  newDeck = function() {
    const deck = ['Ace', 'Ace', 'Ace', 'Ace', 'Two', 'Two', 'Two', 'Two', 'Three', 'Three', 'Three', 'Three', 'Four', 'Four', 'Four', 'Four', 'Five', 'Five', 'Five', 'Five', 'Six', 'Six', 'Six', 'Six', 'Six', 'Seven', 'Seven', 'Seven', 'Eight', 'Eight', 'Eight', 'Eight', 'Nine', 'Nine', 'Nine', 'Nine', 'Ten', 'Ten', 'Ten', 'Ten', 'Jack', 'Jack', 'Jack', 'Jack', 'Queen', 'Queen', 'Queen', 'Queen', 'King', 'King', 'King', 'King'];
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }  
  }
  shuffle(deck);
  return deck;
  }
}

function deal (dealer, player, currentDeck){
  let players = [dealer, player];
  for (let i = 0; i < players.length; i++) {
    for (let j = players.length-1; j >= 0; j--) {   
      let card = currentDeck.shift();
      players[j].currentHand.push(card);   
    }
  }  
  alert(`\n\u2664\u2661\u2662\u2667--- Deal! ---\u2664\u2661\u2662\u2667\nDealer is showing ${cardPic[dealer.currentHand[1]]} ${dealer.currentHand[1]}.`);
  if(!dealer.dealerFirstHand(dealer, player, currentDeck)) {
    player.checkHandValue(dealer, player, currentDeck);
  }
}

function newHand (dealer, player, currentDeck) {
  currentDeck = newDeck()
  player.currentHand = [];
  player.splitHands = 0;
  player.didSplit = false;
  player.currentSplit = 0;
  player.splitResults = [];
  player.doubledDown = false;
  dealer.currentHand = [];
  dealer.currentHandValue = 0;
  dealer.blackJackFirstHand = false;
  dealer.acesReassigned = false;
  player.bet(dealer, player, currentDeck);
}  

function finalCheck (dealer, player, currentDeck) {
  if (player.didSplit === false) {
    if (player.currentHandValue === dealer.currentHandValue && 
        dealer.blackJackFirstHand === false) {
      push(dealer, player, currentDeck);
    } else if (
      (player.currentHandValue > dealer.currentHandValue && player.currentHandValue <= 21) || 
      (dealer.currentHandValue > 21 && player.currentHandValue <= 21)
    ) {
      playerWin(dealer, player, currentDeck);
    } else if (
      (player.currentHandValue < dealer.currentHandValue && dealer.currentHandValue <= 21) || 
      (player.currentHandValue > 21 && dealer.currentHandValue <= 21)
    ) {
      dealerWin(dealer, player, currentDeck);
    }
  } else {
    finalSplitCheck(dealer, player, currentDeck);
  }
}

function finalSplitCheck(dealer, player, currentDeck) {
  for (let i=0; i<player.splitResults.length; i++) {
    alert(`Results of hand ${i+1}:`)
    if (player.splitResults[i] === dealer.currentHandValue &&
      dealer.blackJackFirstHand === false) {
      alert(`You have ${player.splitResults[i]} and dealer has ${dealer.currentHandValue}.\nPush! You get your bet back!\n`);
      player.chips += player.currentBet/2
    } else if (
      (player.splitResults[i] > dealer.currentHandValue && player.splitResults[i] <= 21) || 
      (dealer.currentHandValue > 21 && player.splitResults[i] <= 21)
    ) {
      alert(`You have ${player.splitResults[i]} and dealer has ${dealer.currentHandValue}.\n$$$$$$$$$$$$ You win! $$$$$$$$$$$$\n`);
      player.chips += player.currentBet;
    } else if (
      (player.splitResults[i] < dealer.currentHandValue && dealer.currentHandValue <= 21) || 
      (player.splitResults[i] > 21 && dealer.currentHandValue <= 21)
    ) {
      alert(`You have ${player.splitResults[i]} and dealer has ${dealer.currentHandValue}. \nDealer wins!\n`);
    }
  }
  if (player.chips <= 0) { 
    playerHasZeroChips(dealer, player, currentDeck);
  } else {
    newHand(dealer, player, currentDeck);  
  }
}

function push(dealer, player, currentDeck) {
  alert(`You have ${player.currentHandValue} and dealer has ${dealer.currentHandValue}. Push! You get your bet back!\n`);
  player.chips += player.currentBet;
  newHand(dealer, player, currentDeck);
}

function playerWin(dealer, player, currentDeck) {
  alert(`You have ${player.currentHandValue} and dealer has ${dealer.currentHandValue}.\n$$$$$$$$$$$$ You win! $$$$$$$$$$$$\n`);
  if (player.currentHand.length === 2 && player.currentHandValue === 21) {
    player.chips += Math.floor(player.currentBet*2.5);
    newHand(dealer, player, currentDeck);
  } else {
    player.chips += Math.floor(player.currentBet*2);
    newHand(dealer, player, currentDeck);
  }
}

function dealerWin(dealer, player, currentDeck){
  if (player.currentHandValue === 0) {
    alert(`Dealer has ${dealer.currentHandValue}. Dealer wins!\n`);
  } else {
    alert(`You have ${player.currentHandValue} and dealer has ${dealer.currentHandValue}. Dealer wins!\n`);
  }
  if (player.chips <= 0) { 
    playerHasZeroChips(dealer, player, currentDeck);
    return;
  } else {
      newHand(dealer, player, currentDeck);     
  } 
}

function playerHasZeroChips(dealer, player, currentDeck) {
  alert("------------------------------------------------------------\nOh no! You ran out of chips.\nDo you want to play again?");
  let input = prompt('>').toLowerCase();
  while (input !== 'yes' && input !== 'no') {
    alert('Type Yes or No');
    input = prompt(`>`).toLowerCase();
  }
  if (input === "yes") {
    alert(`Alright, here's 100 chips...on the house.`)
    player.firstBet = true;
    player.chips = 100;
    newHand(dealer, player, currentDeck);
  } else if (input === "no") { 
    alert(`Thanks for playing, ${player.name}! Better luck next time!\nRemember your username and password if you'd like to play again!`);
    player.data.chips += player.chips;
    player.data.chipsInPlay = 0;
    casinoBank[player.data.username] = player.data;
    fs.writeFileSync('casino_bank.json', JSON.stringify(casinoBank));
    return;
  } 
}

function playerBJ(userData) {
  if (userData !== "dealer") {
    this.data = userData; 
    this.name = userData.name;
    this.chips = userData.chipsInPlay;
    this.didSplit = false;
    this.splitHands = 0;
    this.splitResults = [];
    this.doubledDown = false;
    this.currentSplit = 0;
  }
  this.currentHand = [];
  this.currentBet = 0;
  this.currentHandValue = 0;
  this.blackJackFirstHand = false;
  this.firstBet = true;
  this.acesReassigned = false;
}

function dealerBJ() {
  const obj = new playerBJ("dealer");
  obj.dealerFirstHand = function (dealer, player, currentDeck) {
    this.currentHand.forEach(card => {
      this.currentHandValue += cardValues[card];
    })
    if (this.currentHandValue === 21) {
      alert('Dealer has Blackjack! :('); 
      this.blackJackFirstHand = true;
      finalCheck(this, player, currentDeck);
    }
  }
  obj.dealerNextMove = function (dealer, player, currentDeck) {
    this.currentHandValue = this.checkHandValue();
    while (
      this.currentHandValue < 17 || 
      (this.currentHandValue === 17 && (this.currentHand.includes("Ace") && (this.currentHandValue - 10 < 17)) && this.acesReassigned === false) 
    ) {
      if (this.currentHandValue > player.currentHandValue && this.currentHandValue < 21) {
        let currentCards = this.cardBuilder();
        alert(`Dealer has ${currentCards} Total = ${this.currentHandValue}.`);
        finalCheck(this, player, currentDeck);
      } else if (this.currentHandValue===17) {
        let currentCards = this.cardBuilder();
        alert(`Dealer has ${currentCards} Soft 17. Drawing...`)
      } else {
        let currentCards = this.cardBuilder();
        alert(`Dealer has ${currentCards} Total = ${this.currentHandValue}. Drawing...`)
      }
      let card = currentDeck.shift();      
      this.currentHand.push(card);
      this.checkHandValue();
    }  
    if (this.currentHandValue === 21 && player.currentHandValue !== 21) {
      let currentCards = this.cardBuilder();
      alert(`Dealer has ${currentCards} Total = ${this.currentHandValue}.\nDealer has 21 and wins.\n`)
    } else if (this.currentHandValue > 21) {
      let currentCards = this.cardBuilder();
      alert(`Dealer has ${currentCards} Total = ${this.currentHandValue}. Busted!\n`)
    } else if (this.currentHandValue === 17) {
      let currentCards = this.cardBuilder();
      alert(`Dealer has ${currentCards} Hard 17. Dealer stands.\n`)
    } else if (this.currentHandValue > 17 && this.currentHandValue < 21) {
      let currentCards = this.cardBuilder();
      alert(`Dealer has ${currentCards} Dealer stands.\n`)
    }
    finalCheck(this, player, currentDeck)
  }
  obj.checkHandValue = function () {
    this.currentHandValue = 0;
    this.currentHand.forEach(card => {
      this.currentHandValue += cardValues[card];
    })
    if (this.currentHandValue > 21 && this.currentHand.includes('Ace')) {
      let aces = 0;
      this.currentHand.forEach(card => {
        if (card === 'Ace') aces += 1;
        return aces;
      }) 
      while (aces > 0 && this.currentHandValue > 21) {
        this.currentHandValue -= 10;
        aces--;
        this.acesReassigned = true;
      }
    }  
    return this.currentHandValue;
  }
  return obj
}

playerBJ.prototype.bet = function(dealer, player, currentDeck){
  if (this.firstBet === false) {
    alert(`\nWould you like to cash out your ${this.chips} chips?\nYes or No?`);
    let cashOut = prompt(`>`).toLowerCase(); 
    while (!cashOut.includes('yes') && !cashOut.includes('no')) {
      alert(`Yes or No?`)
      cashOut = prompt(`>`)
    }
    if (cashOut.includes('yes')) {
      this.data.chips += this.chips;
      this.data.chipsInPlay = 0;
      casinoBank[this.data.username] = this.data;
      fs.writeFileSync('casino_bank.json', JSON.stringify(casinoBank));
      alert(`You have cashed out. Thank you for playing, ${this.name}. You're welcome back anytime.\nRemember your username and password if you'd like to play again!`);
      return;
    } 
  }
  alert(`\nYou have ${this.chips} chips. Place your bet.`);
  this.currentBet = Number(prompt(`>`));
  while (Number.isNaN(this.currentBet) || this.currentBet > this.chips || this.currentBet < 1) {
    if (Number.isNaN(this.currentBet)) {
      alert('Try a number amount.');
      this.currentBet = Number(prompt(`>`)); 
    } else if (this.currentBet > this.chips) {
      alert(`You only have ${this.chips} chips. Try less?`);
      this.currentBet = Number(prompt('>'));
    } else {
      alert(`Your bet, please?`);
      this.currentBet = Number(prompt(`>`));
    }
  }
  if (this.currentBet <= this.chips) {
    this.firstBet = false;
    this.chips -= this.currentBet;
    deal(dealer, player, currentDeck);
  }
}

playerBJ.prototype.playerFirstMove = function(dealer, player, currentDeck){
  let currentCards = this.cardBuilder();
  if (this.currentHand[0] === this.currentHand[1]) {
    alert(`You have ${currentCards}\nTotal Value = ${this.currentHandValue}.\nYou can: Hit, Stand, Double Down, or Split.`);
  } else {
    alert(`You have ${currentCards}\nTotal Value = ${this.currentHandValue}.\nYou can: Hit, Stand, or Double Down.`);
  }
  let response = prompt('>').toLowerCase().replaceAll('.','').replaceAll(' ','');
  while (response !== 'hit' && response !== 'stand' && response !== 'doubledown' && response !== 'split') {
    alert("Try again. You can: Hit, Stand, Double Down, or Split.")
    response = prompt(`>`).toLowerCase().replaceAll('.','').replaceAll(' ','');
  }
  if (response === 'hit') {
    this.hit(dealer, player, currentDeck);
  } else if (response === 'stand') {
    this.stand(dealer, player, currentDeck);
  } else if (response === 'doubledown' || response === 'split') {
    if (this.chips < this.currentBet) {
      alert(`You don't have enough chips to double your bet!\nYou can: Hit or Stand.`)
      response = prompt(`>`).toLowerCase().replaceAll('.','').replaceAll(' ','');
      while (response !== 'hit' && response !== 'stand') {
        alert(`Try again. You can: Hit or Stand.`)
        response = prompt('>').toLowerCase().replaceAll('.','').replaceAll(' ','');
      }
      if (response === 'hit') {
        this.hit(dealer, player, currentDeck);
      } else if (response === 'stand') {
        this.stand(dealer, player, currentDeck);
      }
    } else if (response === 'doubledown') {
      this.doubleDown(dealer, player, currentDeck);
    } else if (response === 'split') {
      if (this.currentHand[0] !== this.currentHand[1]) {
        alert(`You can only split your hand if you have two cards of the same value./nHit or stand?`);
        response = prompt(`>`).toLowerCase().replaceAll('.','').replaceAll(' ','');
        while (response !== 'hit' && response !== 'stand') {
          alert(`Try again. You can: Hit or Stand.`)
          response = prompt('>').toLowerCase().replaceAll('.','').replaceAll(' ','');
        }  
        if (response === 'hit') {
          this.hit(dealer, player, currentDeck);
        } else if (response === 'stand') {
          this.stand(dealer, player, currentDeck);
        }
      } else {
        this.split(dealer, player, currentDeck);
      }
    }
  } 
}

playerBJ.prototype.cardBuilder = function(string = '') {
  for (let i=0; i<this.currentHand.length; i++) {
    if (i === this.currentHand.length-1 && this.currentHand.length > 2) {
      if (this.currentHand[i] === 'Ace' || this.currentHand[i] === 'Eight') {
        string += `and drew an ${cardPic[this.currentHand[i]]} ${this.currentHand[i]}.`;
      } else {
        string += `and drew a ${cardPic[this.currentHand[i]]} ${this.currentHand[i]}.`;
      }
    } else if (i === this.currentHand.length-1 && this.currentHand.length === 2) {
      if (this.currentHand[i] === 'Ace' || this.currentHand[i] === 'Eight') {
        string += `and an ${cardPic[this.currentHand[i]]} ${this.currentHand[i]}.`;
      } else {
        string += `and a ${cardPic[this.currentHand[i]]} ${this.currentHand[i]}.`;
      }
    } else {
      string += `${cardPic[this.currentHand[i]]} ${this.currentHand[i]}, `;
    }
  }
  return string;
}

playerBJ.prototype.playerNextMove = function(dealer, player, currentDeck){
  let currentCards = this.cardBuilder();
  alert(`Dealer is showing ${cardPic[dealer.currentHand[1]]} ${dealer.currentHand[1]}\nYou have ${currentCards}\nTotal Value = ${this.currentHandValue}.\nYou can: Hit or Stand`);
  let response = prompt('>').toLowerCase().replaceAll('.','').replaceAll(' ','');
  while (response !== 'hit' && response !== 'stand') {
    alert('Try again. You can: Hit or Stand');
    response = prompt(`>`).toLowerCase().replaceAll('.','').replaceAll(' ','');
  }
  if (response === 'hit') {
    this.hit(dealer, player, currentDeck);
  } else if (response === 'stand') {
    this.stand(dealer, player, currentDeck);
  }
}

playerBJ.prototype.hit = function(dealer, player, currentDeck){
  alert('\n');
  let card = currentDeck.shift();      
  this.currentHand.push(card);
  this.checkHandValue(dealer, player, currentDeck);
}

playerBJ.prototype.stand = function(dealer, player, currentDeck){
   alert(`\nDealer's turn!`);
   dealer.dealerNextMove(dealer, player, currentDeck); 
}

playerBJ.prototype.doubleDown = function(dealer, player, currentDeck){
  this.doubledDown = true;
  this.chips -= this.currentBet;
  this.currentBet *= 2;
  this.hit(dealer, player, currentDeck);
}

playerBJ.prototype.checkHandValue = function(dealer, player, currentDeck){
  this.currentHandValue = 0;
  this.currentHand.forEach(card => {
    this.currentHandValue += cardValues[card];
  })
  if (this.currentHandValue > 21 && this.currentHand.includes('Ace')) {
    let aces = 0;
    this.currentHand.forEach(card => {
      if (card === 'Ace') aces += 1;
      return aces;
    }) 
    while (aces > 0 && this.currentHandValue > 21) {
      this.currentHandValue -= 10;
      aces--;
    }
  }  
  let currentCards = this.cardBuilder();
  if (this.currentHandValue > 21) {
    alert(`You have ${currentCards} Your hand value is ${this.currentHandValue}. Bust hand!\n`);
    finalCheck(dealer, player, currentDeck);
  } else if (this.currentHandValue === 21 && dealer.currentHandValue !== 21 && this.currentHand.length === 2) {
    alert(`You have ${cardPic[this.currentHand[0]]} ${this.currentHand[0]} and ${cardPic[this.currentHand[1]]} ${this.currentHand[1]}.\n$$$$$ ${this.currentHandValue}! You got Blackjack! $$$$$\n`);    
    finalCheck(dealer, player, currentDeck);
  } else if (this.currentHandValue === 21) {
    alert(`You have ${currentCards} You got ${this.currentHandValue}! It's the dealer's turn now.\n`);  
    dealer.dealerNextMove(dealer, player, currentDeck); 
  } else {
    if (this.currentHand.length === 2) {
      this.playerFirstMove(dealer, player, currentDeck);
    } else if (this.doubledDown===true) {
      alert(`You have ${currentCards}\nYour current hand value is ${this.currentHandValue}.\n\nDealer's turn!`);
      dealer.dealerNextMove(dealer, player, currentDeck);
    } else if (this.currentHand.length > 2) {
      this.playerNextMove(dealer, player, currentDeck);
    }
  }
}

playerBJ.prototype.split = function(dealer, player, currentDeck){
  if (this.splitHands === 0) {
    alert('\n');
    this.chips -= this.currentBet;
    this.currentBet += this.currentBet;
    this.currentSplit = 0;
    this.currentHand = [this.currentHand.slice(0, 1), this.currentHand.slice(1)];
    this.splitHands = this.currentHand.length;
  } 
  this.didSplit = true;
  this.checkSplitHandValue(dealer, player, currentDeck);
}

playerBJ.prototype.splitMove = function(dealer, player, currentDeck){
  let currentCards = this.splitCardBuilder();
  alert(`Dealer is showing ${cardPic[dealer.currentHand[1]]} ${dealer.currentHand[1]}\nYou have ${currentCards}\nTotal Value = ${this.currentHandValue}.\nYou can: Hit or Stand`);
  let response = prompt('>').toLowerCase().replaceAll('.','').replaceAll(' ','');
  while (response !== 'hit' && response !== 'stand') {
    alert('Try again. You can: Hit or Stand');
    response = prompt(`>`).toLowerCase().replaceAll('.','').replaceAll(' ','');
  }
  if (response === 'hit') {
    this.splitHit(dealer, player, currentDeck);
  } else if (response === 'stand') {
    this.splitStand(dealer, player, currentDeck);
  }
}

playerBJ.prototype.splitHit = function(dealer, player, currentDeck){
  alert('\n');
  let card = currentDeck.shift();      
  this.currentHand[this.currentSplit].push(card);
  this.checkSplitHandValue(dealer, player, currentDeck);
}

playerBJ.prototype.splitStand = function(dealer, player, currentDeck){
  alert('\n');
  if (this.isCurrentSplitLast()) {
    this.splitResults.push(this.currentHandValue);
    alert(`\nDealer's turn!`);
    dealer.dealerNextMove(dealer, player, currentDeck); 
  } else {
    alert(`\nNext hand!`);
    this.splitResults.push(this.currentHandValue);
    this.currentSplit++;
    this.checkSplitHandValue(dealer, player, currentDeck);
  }
}

playerBJ.prototype.isCurrentSplitLast = function(){
  return this.currentSplit === this.currentHand.length-1;
}

playerBJ.prototype.splitCardBuilder = function(string = '') {
  for (let i=0; i<this.currentHand[this.currentSplit].length; i++) {
    if (i === this.currentHand[this.currentSplit].length-1 && this.currentHand[this.currentSplit].length > 1) {
      if (this.currentHand[this.currentSplit][i] === 'Ace' || this.currentHand[this.currentSplit][i] === 'Eight') {
        string += `and drew an ${cardPic[this.currentHand[this.currentSplit][i]]} ${this.currentHand[this.currentSplit][i]}.`;
      } else {
        string += `and drew a ${cardPic[this.currentHand[this.currentSplit][i]]} ${this.currentHand[this.currentSplit][i]}.`;
      }
    } else if (i === this.currentHand[this.currentSplit].length-1 && this.currentHand[this.currentSplit].length === 1) {
      if (this.currentHand[this.currentSplit][i] === 'Ace' || this.currentHand[this.currentSplit][i] === 'Eight') {
        string += `${cardPic[this.currentHand[this.currentSplit][i]]} ${this.currentHand[this.currentSplit][i]}.`;
      } else {
        string += `${cardPic[this.currentHand[this.currentSplit][i]]} ${this.currentHand[this.currentSplit][i]}.`;
      }
    } else {
      string += `${cardPic[this.currentHand[this.currentSplit][i]]} ${this.currentHand[this.currentSplit][i]}, `;
    }
  }
  return string;
}

playerBJ.prototype.checkSplitHandValue = function(dealer, player, currentDeck){
  this.currentHandValue = 0;
  this.currentHand[this.currentSplit].forEach(card => {
    this.currentHandValue += cardValues[card];
  })
  let currentCards = this.splitCardBuilder();
  if (this.currentHandValue > 21) {
    alert(`You have ${currentCards} Your hand value is ${this.currentHandValue}. Bust hand!\n`);
    this.splitResults.push(this.currentHandValue);
    if (this.isCurrentSplitLast()) {
      finalCheck(dealer, player, currentDeck); 
    } else {
      alert(`\nNext hand!`);
      this.currentSplit++;
      this.checkSplitHandValue(dealer, player, currentDeck);
    }
  } else if (this.currentHandValue === 21) {
    alert(`You have ${currentCards} You got ${this.currentHandValue}! Blackjack!\n`)
    this.splitResults.push(this.currentHandValue);
    if (this.isCurrentSplitLast()) {
      alert(`\nDealer's turn!`);
      dealer.dealerNextMove(dealer, player, currentDeck); 
    } else {
      alert(`\nNext hand!`);
      this.currentSplit++;
      this.checkSplitHandValue(dealer, player, currentDeck);
    }
  } else {
    this.splitMove(dealer, player, currentDeck);
  }
}

newGame();
