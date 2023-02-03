# Blackjack

Blackjack is a classic card game that you can now play in your javascript environment! This is a console-based game and the goal is to beat the dealer by having a hand value of 21 or as close to it as possible.

## How to Play
To play the game, simply execute the `blackjack.js` file in your javascript environment.

## User Creation
The player creates a username, password, and name at the outset of the game in order to save their chips in the casino bank in between play sessions:
- The player can end the game in-between hands by cashing-out their chips, which are saved to the casino bank
- If the player plays again and logs in with their username and password, their stored chips will be accessible to them
- Players can chose to withdraw any amount from their saved profile

## Game Rules
The following rules have been implemented in the game:
- The game is played with one deck of 52 cards
- The player begins with 100 chips and can bet on each hand
- The player starts with two cards and the dealer starts with one face-up card and one face-down card
- The player can initially choose to hit (take another card) stand (keep their current hand), double-down (double their bet and take only one more card),  or split (only if the player is dealt two of the same card) where the player plays two hands versus the dealer
- If the player immediately is dealt blackjack, their payout is more than a regular win (x2.5 as opposed to x2)
- If the player busts (goes over 21), they lose the game
- If the player stands, the dealer reveals their face-down card and must hit until their hand value is at least 17
- If the dealer is dealt an ace, and their ace is being count as a 1 they can hit on 17 (soft 17) otherwise they must stand on 17
- If the dealer busts, the player wins the game
- The player and dealer compare their hand values and the highest value under 21 wins
- If both the player and dealer have the same value, it is a push and the player receives their bet back

## Future plans
In the future, the plan is to extend the game to a browser-based game with html/css, animations, and visuals!

Enjoy playing Blackjack!
