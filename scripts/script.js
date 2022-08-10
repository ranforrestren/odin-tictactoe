// object responsible for handling board state
const gameBoard = (() => {
  const _board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const getBoard = () => _board;
  const applyMark = function (tileNum) {
    _board[tileNum] = 1;
  }
  return { getBoard, applyMark };
})();

// object responsible for rendering board state to page
const displayController = (() => {
  const _display = document.querySelector('#board');
  const renderDisplay = function (board) {
    // clear current board
    _display.replaceChildren();
    // replace with new board
    for (const [tileNum, tile] of board.entries()) {
      _createTile(tileNum, tile);
    }
  }
  const _createTile = function (tileNum, tile) {
    const newTile = document.createElement('div');
    newTile.classList.add('tile');
    newTile.addEventListener('click', function () { logicController.mark(tileNum) });
    _display.appendChild(newTile);
  }
  return { renderDisplay };
})();

// object responsible for controlling game logic
const logicController = (() => {
  const mark = function (tileNum) {
    gameBoard.applyMark(tileNum);
    displayController.renderDisplay(gameBoard.getBoard());
  }
  return { mark };
})();

displayController.renderDisplay(gameBoard.getBoard());