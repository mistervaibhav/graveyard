let inputDirection = {
  x: 0,
  y: 0,
};
let lastInputDirection = {
  x: 0,
  y: 0,
};

window.addEventListener('keydown', (e) => {
  switch (e.keyCode) {
    case 37: // left
      if (lastInputDirection.x !== 0) break;
      inputDirection = { x: -1, y: 0 };
      break;
    case 38: // up
      if (lastInputDirection.y !== 0) break;
      inputDirection = { x: 0, y: -1 };
      break;
    case 39: // right
      if (lastInputDirection.x !== 0) break;
      inputDirection = { x: 1, y: 0 };
      break;
    case 40: // down
      if (lastInputDirection.y !== 0) break;
      inputDirection = { x: 0, y: 1 };
      break;
    default:
  }
});

export function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}
