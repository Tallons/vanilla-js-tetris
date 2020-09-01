const grid = document.querySelector(".grid"),
          numberOfNewDivs = 210;
for (let i = 0; i < numberOfNewDivs; i++){
   let newDiv = document.createElement("div");
   grid.appendChild(newDiv);
   if( i >= numberOfNewDivs - 10){
      newDiv.classList.add("taken");
   }
};

const miniGrid = document.querySelector(".mini-grid"),
         numberOfNewDivsMini = 16;
for (let i = 0; i < numberOfNewDivsMini; i++){
   let newDiv = document.createElement("div");
   miniGrid.appendChild(newDiv);
};


document.addEventListener("DOMContentLoaded", () => {
    scoreDisplay = document.querySelector("#score");
   const startButton = document.querySelector("#start-button");
   let squares = Array.from(document.querySelectorAll(".grid div"));
   let nextRandomTetromino = 0;
   const width = 10;
   let timerId;
   let score = 0;
   const colors = [
      "orange",
      "green",
      "red",
      "purple",
      "gold"
   ]

   const lTetromino = [
      [ 1, width+1, width*2+1, 2 ],
      [ 0, 1, 2, width+2 ],
      [ 1, width+1, width*2+1, width*2 ],
      [ 0, width, width+1, width+2]
   ];

      zTetromino = [
         [width, width+1, 1, 2],
         [0, width, width+1, width*2 + 1],
         [width, width+1, 1, 2],
         [0, width, width+1, width*2 + 1]
      ],

      tTetromino = [
         [width, width+1, width+2, 1],
         [width*2+1, width+1, width+2, 1],
         [width, width+1, width+2, width*2+1],
         [width*2+1, width+1, width, 1]
      ],

      oTetromino = [
         [0, 1, width, width+1],
         [0, 1, width, width+1],
         [0, 1, width, width+1],
         [0, 1, width, width+1]
      ],

      iTetromino = [
         [1, width+1, width*2+1,width*3+1],
         [width, width+1, width+2,width+3],
         [1, width+1, width*2+1,width*3+1],
         [width, width+1, width+2,width+3]
      ];

   const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
   
   let currentPosition = 4,
   currentRotation = 0,
   randomIndex =  getRandomIndex();
   current = theTetrominoes[randomIndex][currentRotation];
   
   function getRandomIndex () {
         return Math.floor(Math.random() * theTetrominoes.length)
      };

   const draw = () => {
      current.forEach(el => {
         squares[currentPosition + el].classList.add("tetromino");
         squares[currentPosition + el].style.backgroundColor = colors[randomIndex];
      })
   },
   
   undraw = () => {
      current.forEach(el => {
         squares[currentPosition + el].classList.remove("tetromino");
         squares[currentPosition + el].style.backgroundColor = "";
      })
   };
   
   draw();
   // const timerId = setInterval(moveDown, 1000);

   function moveDown () {
      undraw();
      currentPosition+= width;
      draw();
      freeze();
   };
   
   const freeze = () => {
      if (current.some(el => squares[currentPosition + el + width].classList.contains("taken"))) {
         current.forEach(el => squares[currentPosition + el].classList.add("taken"));
         randomIndex = nextRandomTetromino;
         nextRandomTetromino = getRandomIndex();
         current = theTetrominoes[randomIndex][currentRotation];
         currentPosition = 4;
         draw();
         displayShape();
         addScore();
         gameOver();
      }
   },
   
   control = (e) => {
      switch(e.keyCode) {
         case 37: moveLeft()
         break;
         case 38: rotate();
         break;
         case 39: moveRight();
         break;
         case 40: moveDown(); 
         break;
         
      }
   }
   
   document.addEventListener("keyup", control);
   
   moveLeft= () => {
      undraw()
      const isAtLeftEdge = current.some(el => (currentPosition + el) % width === 0);
      
      !isAtLeftEdge ? currentPosition-- : null
      
      if (current.some(el => squares[currentPosition + el].classList.contains("taken"))) {
         currentPosition++;
      };
      draw();
   },
   
   moveRight= () => {
      undraw()
      const isAtRightEdge = current.some(el => (currentPosition + el) % width === width - 1);
      !isAtRightEdge ? currentPosition++ : null
      if (current.some(el => squares[currentPosition + el].classList.contains("taken"))) { 
         currentPosition-- ;
      };
      draw();
   },
   
   rotate = () => {
      undraw();
      currentRotation++;
      currentRotation === 4 ? currentRotation = 0 : null
      current = theTetrominoes[randomIndex][currentRotation];
      draw();
   }
   
   // display next Tetromino
   const displaySquares = document.querySelectorAll(".mini-grid div");
   const displayWidth = 4;
   const displayIndex = 0;
   
   const nextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1,  2], // L
      [0, displayWidth, displayWidth, displayWidth+1, displayWidth*2+1],
      [1, displayWidth, displayWidth, displayWidth+1, displayWidth*2],
      [0, 1, displayWidth, displayWidth+1],
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
   ];
   
   function displayShape ( ) {
      displaySquares.forEach(square => {
         square.classList.remove('tetromino');
         square.style.backgroundColor = "";
      })
      nextTetrominoes[nextRandomTetromino].forEach( el => {
         displaySquares[displayIndex + el].classList.add("tetromino");
         displaySquares[displayIndex + el].style.backgroundColor = colors[nextRandomTetromino];
      })
   }
   
   // Start/Pause
         startButton.addEventListener("click", () => {
            if (timerId) {
               clearInterval(timerId);
               timerId = null;
            } else {
               draw();
               timerId = setInterval(moveDown, 1000);
               nextRandomTetromino = getRandomIndex();
               displayShape();
            }
         })
         
         // score
         const addScore = () => {
            for (let i = 0; i < 199; i += width){
               const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
               
               if (row.every(el => squares[el].classList.contains("taken"))) {
                  score += 10;
                  scoreDisplay.innerHTML = score;
                  row.forEach(el => {
                     squares[el].classList.remove("taken");
                     squares[el].classList.remove("tetromino");
                     squares[el].style.backgroundColor = "";
                  });
                  const squaresRemoved = squares.splice(i, width);
                  squares = squaresRemoved.concat(squares)
                  squares.forEach(el => grid.appendChild(el))
               }
            }
         }
         
         //gameover
         const gameOver = () => {
            if(current.some(el => squares[currentPosition + el].classList.contains("taken"))) {
               scoreDisplay.innerHTML = "GAME OVER";
               clearInterval(timerId);
            }
         }

   });