// object responsible for handling board state
const gameBoard = (() => {
  const _board = [0,0,0,0,0,0,0,0,0];
  const getBoard = () => _board;
  return { getBoard };
})();

// object responsible for rendering board state to page
const displayController = (() => {
  const _display = document.querySelector('#board');
  const renderDisplay = function(board) {
    board.forEach((tile) => { _createTile(tile); });
  }
  const _createTile = function() {
    const newTile = document.createElement('div');
    newTile.classList.add('tile');
    _display.appendChild(newTile);
  }
  return { renderDisplay };
})();

displayController.renderDisplay(gameBoard.getBoard());