document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded with JavaScript");

  // Getting important html tags
  const gameArena = document.getElementById("game-arena");

  // Game constants
  const gameArenaSize = 600;
  const cellSize = 20;
  const totalCell = gameArenaSize / cellSize; // 600/20 = 30 cells
  const gameSpeed = 200;
  const initialFoodPos = { row: 15, col: 15 };
  const initialSnakePos = [
    { row: 15, col: 10 },
    { row: 15, col: 9 },
    { row: 15, col: 8 },
  ];

  // Initial game variables
  let score = 0;
  let gameStarted = false; // flag to check if game is started or not.
  let gameInitialized = false; // flag to track if game is ready for key input
  let food = { ...initialFoodPos };
  let snake = JSON.parse(JSON.stringify(initialSnakePos));
  let intervalId = null;
  let currentDirection = "right";

  // Create the start button and append it to the body
  let startButton = document.createElement("button");
  startButton.textContent = "Start Game";
  startButton.classList.add("start-button");
  document.body.appendChild(startButton);

  // Add a click event listener to the start button
  startButton.addEventListener("click", function () {
    console.log("Start button clicked");
    startButton.style.display = "none";
    initializeGame();
  });

  function initializeGame() {
    gameInitialized = true;
    addScoreBoard();
    addFoodAndSnake();

    let instruction = document.createElement("div");
    instruction.textContent = "Press any arrow key to start";
    instruction.id = "instruction";
    document.body.insertBefore(instruction, gameArena.nextSibling);
  }

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
  function removeDiv(position, className) {
    const divs = gameArena.querySelectorAll("." + className);
    divs.forEach((div) => {
      if (
        div.style.top === position.row * cellSize + "px" &&
        div.style.left === position.col * cellSize + "px"
      ) {
        div.remove();
      }
    });
  }

  function createFood() {
    let newFood;

    do {
      newFood = {
        row: Math.floor(Math.random() * totalCell),
        col: Math.floor(Math.random() * totalCell),
      };
    } while (snake.some((snakePart) => snakePart.row === newFood.row && snakePart.col === newFood.col));

    return newFood;
  }

  // Grow snake or not
  function growSnake() {
    if (snake[0].row === food.row && snake[0].col === food.col) {
      score++;
      document.getElementById("score-board").innerHTML = score;

      // todo - add a new food
      removeDiv(food, "food");
      food = createFood();
      createDiv(food, "food");
    } else {
      const tail = snake.pop();
      removeDiv(tail, "snake");
    }
  }

  // Game Over?
  function isGameOver() {
    // snake collision check
    for (let i = 1; i < snake.length; i++) {
      if (snake[0].row === snake[i].row && snake[0].col === snake[i].col) {
        return true;
      }
    }

    const hitLeftWall = snake[0].row < 0;
    const hitRightWall = snake[0].row === totalCell;
    const hitTopWall = snake[0].col < 0;
    const hitBottomWall = snake[0].col === totalCell;
    return hitLeftWall || hitRightWall || hitBottomWall || hitTopWall;
  }

  // Reset Game after Game Over
  function resetGame() {
    score = 0;
    gameStarted = false;
    gameInitialized = false;
    intervalId = null;
    food = initialFoodPos;
    snake = initialSnakePos;
    currentDirection = "right";

    // Remove score board
    const scoreBoard = document.getElementById("score-board");
    if (scoreBoard) {
      scoreBoard.style.display = "none";
    }

    // Remove instruction text
    const instruction = document.getElementById("instruction");
    if (instruction) {
      instruction.remove();
    }

    // Remove all food elements
    const foodElements = gameArena.querySelectorAll(".food");
    foodElements.forEach((element) => element.remove());

    // Remove all snake elements
    const snakeElements = gameArena.querySelectorAll(".snake");
    snakeElements.forEach((element) => element.remove());

    // Show start button
    startButton.style.display = "block";
  }

  // Move Snake
  function moveSnake(x, y) {
    intervalId = setInterval(() => {
      if (isGameOver()) {
        clearInterval(intervalId);
        alert("Game Over!!" + "\n" + "Your Score - " + score);

        resetGame();

        return;
      }
      let newHead = {
        row: snake[0].row + x,
        col: snake[0].col + y,
      };
      snake.unshift(newHead);

      createDiv(newHead, "snake");
      growSnake();
    }, gameSpeed);
  }

  function changeSnakeDirection(key) {
    if (!gameStarted && gameInitialized) {
      // Remove instruction text when game starts
      const instruction = document.getElementById("instruction");
      if (instruction) {
        instruction.remove();
      }
      gameStarted = true;
    }

    if (gameStarted) {
      if (key === "ArrowUp" && currentDirection !== "down") {
        clearInterval(intervalId);
        currentDirection = "up";
        moveSnake(-1, 0);
      } else if (key === "ArrowDown" && currentDirection !== "up") {
        clearInterval(intervalId);
        currentDirection = "down";
        moveSnake(1, 0);
      } else if (key === "ArrowLeft" && currentDirection !== "right") {
        clearInterval(intervalId);
        currentDirection = "left";
        moveSnake(0, -1);
      } else if (key === "ArrowRight" && currentDirection !== "left") {
        clearInterval(intervalId);
        currentDirection = "right";
        moveSnake(0, 1);
      }
    }
  }

  // Event Listener for key down
  document.addEventListener("keydown", function (event) {
    if (gameInitialized) {
      console.log("Keydown ", event);
      const key = event.key;

      if (
        key !== "ArrowUp" &&
        key !== "ArrowDown" &&
        key !== "ArrowLeft" &&
        key !== "ArrowRight"
      ) {
        alert("Invalid Key Pressed. Please press arrow keys to play the game.");
        return;
      }
      changeSnakeDirection(key);
    }
  });
});
