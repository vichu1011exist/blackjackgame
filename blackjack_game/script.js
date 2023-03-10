//challenge 5: Blackjack 
  
let blackjackGame = {
  'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score':0},
  'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
  'cards': ['2','3','4','5','6','7','8','9','10','K','J','Q','A'],
  'cardsMap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10, 'J':10, 'Q':10, 'A':[1,11]},
  'wins': 0,
  'losses': 0,
  'draws': 0,
  'hitClick': false,
  'isStand': false,
  'turnOver': false,
  }; //contained the information that will use it later on

 const YOU = blackjackGame['you']; //to access the you above "you" key
 const DEALER = blackjackGame['dealer'];

 //to store card audio
  const hitSound = new Audio('sound/swish.m4a');
  const winSound = new Audio('sound/cash.mp3');
  const loseSound = new Audio('sound/aww.mp3');



 document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit); //whenever someone clicks on this button it should run the blackjackHit() function
 document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
 document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

 //blackjackHit function
         
 function blackjackHit(){
    blackjackGame['hitClick'] = true;
    
    //when stand  button got clicked then hit-btn shouldn't be work
if(blackjackGame['isStand'] === false) {  
     let card = randomCard(); //return the random number
     console.log("your card number is ", card);
     showCard(card, YOU);
     updateScore(card, YOU)
     showScore(YOU);
}
 }

 //picking random number
 function randomCard(){
     let randomIndex = Math.floor(Math.random() * 13);
     return blackjackGame['cards'][randomIndex];
 }

 //showCard function
 function showCard(card, activePlayer) {
     if(activePlayer['score'] <= 21) {
         let cardImage = document.createElement('img');
         cardImage.src = `images/${card}.png`; //here we are using backTick sign to make this string template stead string conconate
         document.querySelector(activePlayer['div']).appendChild(cardImage);
         hitSound.play();
     }
  }


      function blackjackDeal(){

       if(blackjackGame['turnOver'] === true) {

   
          let yourImages = document.querySelector('#your-box').querySelectorAll('img'); //give me every images that user div has
          let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

          for(let i = 0; i < yourImages.length; i++)
          {
              yourImages[i].remove(); //removes all images via their index nubmer
          } 

          for(let i = 0; i < dealerImages.length; i++){
              dealerImages[i].remove();
          }
             
          //reset the score when user click on deal button
         YOU['score'] = 0; //reset in backend
         DEALER['score'] = 0;

         //now let's reset it on screen as well
         document.querySelector('#your-blackjack-result').textContent = 0;
         document.querySelector('#dealer-blackjack-result').textContent = 0;
         
         //reset the color tp white you user got busted effect
         document.querySelector('#dealer-blackjack-result').style.color = 'white';
         document.querySelector('#your-blackjack-result').style.color = 'white';
       
       //   reset the result box
       document.querySelector('#blackjack-result').textContent = "Let's play";
       document.querySelector('#blackjack-result').style.color = 'black';
       blackjackGame['isStand'] = false;
       
       //inorder to play another round in same manner as we played our first round like -->
       //  first "you" player run then "dealer" will play then deal button reset everything
       //if i don't write this line then stand button will work before hit button and blocked the hit button 
       blackjackGame['hitClick'] = false;
       }

       blackjackGame['turnOver'] = false;
              }

      //to show the cards score
      function updateScore(card, activePlayer) {
          if(card==='A') {
              //if adding 11 keeps me below 21, add 11, otherwise add 1
              if(activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21)
              {
                  activePlayer['score'] += blackjackGame['cardsMap'][card][1];
              }
              else {
                  activePlayer['score'] += blackjackGame['cardsMap'][card][0];
              }
          }
          //if card is not 'A'
          else {
              activePlayer['score'] += blackjackGame['cardsMap'][card];
          }
      }
//show active user's score on the screen 
   function showScore(activePlayer) {
       if(activePlayer['score'] > 21) {
           document.querySelector(activePlayer['scoreSpan']).textContent = 'Bust!';
          //if you got busted then show the red color of score
           document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
       }
       else {
              document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
              document.querySelector(activePlayer['scoreSpan']).style.color = 'white';
            }
   }

   //show one card at a time
   function sleep(ms) { //ms means mili second
   return new Promise(resolve => setTimeout(resolve, ms));
   }

   //Dealer's logic and known as stand button's 
   async function dealerLogic() {

       //dealer button won't work until you done with playing
       if(blackjackGame['hitClick'] === true){
           // now dealer can play
           
       //if user clicks at stand buton then can't click again on hit button
       blackjackGame['isStand'] = true;

       //making stand cards choice automatically 
       while(DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
       let card = randomCard(); 
       showCard(card, DEALER);
       updateScore(card, DEALER);
       showScore(DEALER);
       await sleep(1000);
       }
       
         //when dealer played its turn 
           blackjackGame['turnOver'] = true;
           let winner = computerWinner();
           showResult(winner);
   
         }//hit logic    

   }//function ends

   //computerWinner fucntion that returns the winner
   //update the wins, draws, and losses
   function computerWinner() {
       let winner;
     
       //if nobody got busted then what to show
       if(YOU['score'] <= 21) {
           
           //either your score higher than dealer or dealer got busted
           if(YOU['score'] > DEALER['score'] || (DEALER['score'] > 21)) {
               blackjackGame['wins']++;
               winner = YOU;
           }
             else if(YOU['score'] < DEALER['score']) {
                blackjackGame['losses']++;
                 winner = DEALER;
             }

             else if(YOU['score'] === DEALER['score']) {
                 blackjackGame['draws']++;
               }

               //what if you bust but dealer doesn't 
            } else if(YOU['score'] > 21 && DEALER['score'] <= 21) {
                 blackjackGame['losses']++;
                 winner = DEALER;
             }   

             //what if you and dealer both busted
             else if(YOU['score'] > 21 && DEALER['score'] > 21) {
                 blackjackGame['draws']++;
                }

               //Result in console 
                console.log('Winner is', winner);

                //returning the winner
                return winner;
          }

          //function show result
          function showResult(winner) {
              let message, messageColor;

              if(winner === YOU) {
                  document.querySelector('#wins').textContent = blackjackGame['wins'];
                  message = 'you won!';
                  messageColor = 'green';
                  winSound.play();
              }
              
              else if(winner === DEALER) {
               document.querySelector('#losses').textContent = blackjackGame['losses'];
                  message = 'you lost!';
                  messageColor = 'red';
                  loseSound.play();
              }

              else {
               document.querySelector('#draws').textContent = blackjackGame['draws'];

                  message = 'you drew!';
                  messageColor = 'black';
              }

              document.querySelector('#blackjack-result').textContent = message;
              document.querySelector('#blackjack-result').style.color = messageColor;
          }
