const gameContainer = document.getElementById("game");

const clone = [];
const invertOBJ = {};
let highScore = localStorage["highScore"];
if(highScore === undefined){
  highScore = 0;
} else{
  highScore = parseFloat(localStorage["highScore"]);
}
document.querySelector("#high-score").innerText = highScore;

for(let i = 0;i < 18;i++){
  let r = (Math.floor(Math.random()*256));
  let g = (Math.floor(Math.random()*256));
  let b = (Math.floor(Math.random()*256));


  let invertedR = Math.abs(r - 255);
  let invertedG = Math.abs(g - 255);
  let invertedB = Math.abs(b - 255);
  function displayHex(r,g,b) {
    let hexR = r.toString(16);
    hexR.length === 1 ? (hexR = "0" + hexR) : hexR;
    let hexG = g.toString(16);
    hexG.length === 1 ? (hexG = "0" + hexG) : hexG;
    let hexB = b.toString(16);
    hexB.length === 1 ? (hexB = "0" + hexB) : hexB;
   return(`#${hexR.toUpperCase()}${hexG.toUpperCase()}${hexB.toUpperCase()}`);
    }
    if(clone.indexOf(displayHex(r,g,b)) !== -1){ //This is to make sure that all of the colors are unique and there are no duplicates
      while(true){
        r = (Math.floor(Math.random()*256));
        g = (Math.floor(Math.random()*256));
        b = (Math.floor(Math.random()*256));

        invertedR = Math.abs(r - 255);
        invertedG = Math.abs(g - 255);
        invertedB = Math.abs(b - 255);

        if (clone.indexOf(displayHex(r,g,b)) === -1){
          break;
        }
      }
    }
    clone.push(displayHex(r,g,b));
    invertOBJ[displayHex(r,g,b)] = displayHex(invertedR,invertedG,invertedB);
}
const COLORS2 = clone.concat(clone.slice())

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "#FF00FF",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "#FF00FF",
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS2);
// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newCardDiv = document.createElement("div");
    const newCardFrontDiv = document.createElement("div");
    const newCardBackDiv = document.createElement("div");
    // give it a class attribute for the value we are looping over
    newCardDiv.classList.add(color);
    newCardFrontDiv.classList.add("cardFront");
    newCardFrontDiv.classList.add("cardFace");
    newCardFrontDiv.innerText = "HEX";
    newCardBackDiv.style.color = invertOBJ[color];
    newCardBackDiv.classList.add("cardBack");
    newCardBackDiv.classList.add("cardFace");
    newCardBackDiv.innerText = color;
    newCardBackDiv.style.backgroundColor = color;
    // call a function handleCardClick when a div is clicked on
    newCardDiv.addEventListener("click", handleCardClick);
    // append the div to the element with an id of game
    gameContainer.append(newCardDiv);
    newCardDiv.append(newCardFrontDiv);
    newCardDiv.append(newCardBackDiv);
  }
}

const checkMatching = [];
let isMatching;
let canClickMore = true;
let score = 0;
const scoreCountingSpan = document.querySelector("#score");
// TODO: Implement this function!
function handleCardClick(event) {
  if (canClickMore){
  event.target.parentElement.classList.toggle("isFlipped");
  event.target.parentElement.removeEventListener("click", handleCardClick);
  if (checkMatching.length < 2){
    checkMatching.push(event.target.parentElement.getAttribute("class").split(" ")[0])
  }

  if (checkMatching.length === 2){
    canClickMore = false;
    if (checkMatching[0] === checkMatching [1]){
      isMatching = true;
      console.log(isMatching);
    } else{
      isMatching = false;
      console.log(isMatching);
    }
    checkMatching.length = 0;
    if (isMatching){
      for (i of document.querySelectorAll(".isFlipped")){
        i.classList.add("matched");
        i.classList.toggle("isFlipped");
      }
      score += COLORS2.length/5;
      scoreCountingSpan.innerText = score;
      if(score > highScore){
        localStorage["highScore"] = score;
        highScore = parseFloat(localStorage["highScore"])
        document.querySelector("#high-score").innerText = highScore;
      }
    }
    setTimeout(function(){
      if (!isMatching){
      for (i of document.querySelectorAll(".isFlipped")){
        i.classList.toggle("isFlipped");
        i.style.transition = "transform 1000ms"
      }
      setTimeout(function(){
        for (i of document.querySelectorAll(".cardFront")){i.parentElement.addEventListener("click", handleCardClick)}
      }, 2000);
    }
    canClickMore = true;
    }, 1000);
    }
  console.log("you just clicked", event.target);
}
}

// when the DOM loads
createDivsForColors(shuffledColors);
