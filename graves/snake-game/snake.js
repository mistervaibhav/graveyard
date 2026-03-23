import { getInputDirection } from './input.js';

export const SNAKE_SPEED = 5;
const snakeBody = [
  {
    x: 11,
    y: 11,
  },
];
let newSegments = 0;

export const update = () => {
  addSegment();

  let inputDirection = getInputDirection();

  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
};

export const draw = (board) => {
  snakeBody.forEach((segment) => {
    let snakeElement = document.createElement('div');
    snakeElement.style.gridColumnStart = segment.x;
    snakeElement.style.gridRowStart = segment.y;
    snakeElement.classList.add('snake');
    board.appendChild(snakeElement);
  });
};

export const expandSnake = (amount) => {
  newSegments += amount;
};

export const onSnake = (position, { ignoreHead = false } = {}) => {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) {
      return false;
    }
    return equalPositions(segment, position);
  });
};

export const getSnakeHead = () => {
  return snakeBody[0];
};

export const snakeIntersection = () => {
  return onSnake(snakeBody[0], { ignoreHead: true });
};

const equalPositions = (pos1, pos2) => {
  return pos1.x === pos2.x && pos1.y === pos2.y;
};

const addSegment = () => {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
};
