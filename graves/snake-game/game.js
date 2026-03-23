import { SNAKE_SPEED } from './snake.js';
import { getSnakeHead } from './snake.js';
import { snakeIntersection } from './snake.js';
import { draw as drawSnake } from './snake.js';
import { update as updateSnake } from './snake.js';
import { draw as drawFood } from './food.js';
import { update as updateFood } from './food.js';
import { outsideGrid } from './grid.js';

// * CACHING THE DOM
const board = document.getElementById('board');

// * INIT VARIABLES
let gameOver = false;
let lastRenderedTime = 0;

// * GAME LOOP
const main = (currentTime) => {
  if (gameOver) {
    if (confirm('You lost this game, Press OK to play again !!')) {
      window.location.assign('https://mistervaibhav.github.io/snake-game/');
    }
    return;
  }

  window.requestAnimationFrame(main);
  const secondsSincelastRender = (currentTime - lastRenderedTime) / 1000;
  if (secondsSincelastRender < 1 / SNAKE_SPEED) {
    return;
  }
  // console.log('RENDER');
  lastRenderedTime = currentTime;

  update();
  draw();
};

window.requestAnimationFrame(main);

const update = () => {
  updateSnake();
  updateFood();
  checkDeath();
};

const draw = () => {
  board.innerHTML = '';
  drawSnake(board);
  drawFood(board);
};

const checkDeath = () => {
  gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
};
