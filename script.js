document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded with JavaScript");

  // Getting important html tags
  const gameArena = document.getElementById("game-arena");

  // Initial game variables
  let score = 0;
  let gameStarted = false;
  let gameArenaSize = 600;
  let cellSize = 20;
  let food = { row: 15, col: 15 };
  let snake = [
    { row: 15, col: 10 },
    { row: 15, col: 9 },
    { row: 15, col: 8 },
  ];

  // Create the start button and append it to the body
  let startButton = document.createElement("button");
  startButton.textContent = "Start Game";
  startButton.classList.add("start-button");
  document.body.appendChild(startButton);

  // Add a click event listener to the start button
  startButton.addEventListener("click", function () {
    console.log("Start button clicked");
    startButton.style.display = "none";
    gameStarted = true;
    addScoreBoard();
    addFoodAndSnake();
    moveSnake(0, 1);
  });

  // Create the score board and append it to the body before game-arena div
  function addScoreBoard() {
    let scoreBoard = document.createElement("div");
    scoreBoard.id = "score-board";
    scoreBoard.innerHTML = score;
    document.body.insertBefore(scoreBoard, gameArena);
  }

  // Create the food and snake div and append them to the game arena div
  function addFoodAndSnake() {
    createDiv(food, "food");

    snake.forEach((snakePart) => {
      createDiv(snakePart, "snake");
    });
  }

  // Create a div element
  function createDiv(position, className) {
    let div = document.createElement("div");
    div.style.top = position.row * cellSize + "px";
    div.style.left = position.col * cellSize + "px";
    div.classList.add(className);
    gameArena.appendChild(div);
  }

  // Remove a div element
  function removeDiv(position) {
    let divs = document.querySelectorAll("div");
    divs.forEach((div) => {
      if (
        div.style.top === position.row * cellSize + "px" &&
        div.style.left === position.col * cellSize + "px"
      ) {
        div.remove();
      }
    });
  }

  let newFood;
  function createFood() {
    newFood = {
      row: Math.floor(Math.random() * cellSize),
      col: Math.floor(Math.random() * cellSize),
    };

    if (newFood !== food && !snake.includes(newFood)) {
      return newFood;
    }

    createFood();
  }

  // Grow snake or not
  function growSnake() {
    if (snake[0].row === food.row && snake[0].col === food.col) {
      score++;
      document.getElementById("score-board").innerHTML = score;

      // todo - add a new food
      food = createFood();
      createDiv(food, "food");
    } else {
      const tail = snake.pop();
      removeDiv(tail);
    }
  }

  // Move Snake
  function moveSnake(x, y) {
    setInterval(() => {
      if (gameStarted) {
        let newHead = {
          row: snake[0].row + x,
          col: snake[0].col + y,
        };
        snake.unshift(newHead);

        createDiv(newHead, "snake");
        growSnake();
      }
    }, 200);
  }

  function changeSnakeDirection(key) {
    if (key === "ArrowUp") {
      clearInterval();
      moveSnake(-1, 0);
    } else if (key === "ArrowDown") {
      clearInterval();
      moveSnake(1, 0);
    } else if (key === "ArrowLeft") {
      clearInterval();
      moveSnake(0, -1);
    } else if (key === "ArrowRight") {
      clearInterval();
      moveSnake(0, 1);
    }
  }

  // Event Listener for key down
  document.addEventListener("keydown", function (event) {
    console.log("Keydown ", event);
    const key = event.key;
    changeSnakeDirection(key);
  });
});
