// object responsible for handling board state
const gameBoard = (() => {
  const _board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const getBoard = () => _board;
  const applyMark = function (tileNum) {
    _board[tileNum] = 1;
    displayController.modifyTile(tileNum, _board[tileNum]);
  }
  return { getBoard, applyMark };
})();

// object responsible for rendering board state to page
const displayController = (() => {
  const _display = document.querySelector('#board');
  const createDisplay = function (board) {
    for (const [tileNum, tile] of board.entries()) {
      _createTile(tileNum, tile);
    }
  }
  const _createTile = function (tileNum, tile) {
    const tileContainer = document.createElement('div');
    const newTile = document.createElement('div');
    tileContainer.classList.add('tileContainer');
    newTile.classList.add('tile');
    newTile.setAttribute('data-tilenum', `${tileNum}`);
    newTile.addEventListener('click', function () { logicController.applyMark(tileNum) });
    _display.appendChild(tileContainer);
    tileContainer.appendChild(newTile);
  }
  const modifyTile = function (tileNum, tile) {
    const modifyTile = document.querySelector(`.tile[data-tilenum="${tileNum}"]`);
    console.log(modifyTile);
    if (tile == "1" && modifyTile.textContent != "X") {
      modifyTile.textContent = "X";
      modifyTile.classList.add('fadein');
      modifyTile.addEventListener('animationend', function () { modifyTile.classList.remove('fadein') });
    } else {
      modifyTile.classList.add('error');
      modifyTile.addEventListener('animationend', function () { modifyTile.classList.remove('error') });
    }
  }
  return { createDisplay, modifyTile };
})();

// object responsible for controlling game logic
const logicController = (() => {
  const applyMark = function (tileNum) {
    gameBoard.applyMark(tileNum);
  }
  return { applyMark };
})();

displayController.createDisplay(gameBoard.getBoard());