// object responsible for handling board state
const gameBoard = (() => {
  const _board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  const getBoard = () => _board;
  const applyMark = function (rowNum, columnNum, currPlayer) {
    if (_board[rowNum][columnNum] == "0") {
    _board[rowNum][columnNum] = currPlayer;
    }
    displayController.modifyTile(rowNum, columnNum, _board[rowNum][columnNum], currPlayer);
  }
  return { getBoard, applyMark };
})();

// object responsible for rendering board state to page
const displayController = (() => {
  const _display = document.querySelector('#board');
  const createDisplay = function (board) {
    for (const [rowNum, row] of board.entries()) {
      for (const [columnNum] of row.entries())
        _createTile(rowNum, columnNum);
    }
  }
  // creates tiles and adds function to apply mark to each tile
  const _createTile = function (rowNum, columnNum) {
    const tileContainer = document.createElement('div');
    const newTile = document.createElement('div');
    tileContainer.classList.add('tileContainer');
    newTile.classList.add('tile');
    newTile.setAttribute('data-rownum', `${rowNum}`);
    newTile.setAttribute('data-columnnum', `${columnNum}`);
    newTile.addEventListener('click', function () { logicController.applyMark(rowNum, columnNum) });
    _display.appendChild(tileContainer);
    tileContainer.appendChild(newTile);
  }
  const modifyTile = function (rowNum, columnNum, tile, currPlayer) {
    const modifyTile = document.querySelector(`.tile[data-rownum="${rowNum}"][data-columnnum="${columnNum}"]`);
    if (tile != "0" && modifyTile.textContent == "") {
      modifyTile.textContent = currPlayer;
      modifyTile.classList.add('fadein');
      modifyTile.addEventListener('animationend', function () { modifyTile.classList.remove('fadein') });
    } else {
      modifyTile.classList.add('error');
      modifyTile.addEventListener('animationend', function () { modifyTile.classList.remove('error') });
    }
    logicController.checkWinner(rowNum, columnNum, gameBoard.getBoard(), currPlayer);
  }
  const displayWin = function (winType, winPos) {
    if (winType === "hori") {
      const victoryTiles = document.querySelectorAll(`.tile[data-rownum="${winPos}"]`)
      for (tiles of victoryTiles) {
        tiles.classList.add('victory');
      }
    }
    if (winType === "vert") {
      const victoryTiles = document.querySelectorAll(`.tile[data-columnnum="${winPos}"]`)
      for (tiles of victoryTiles) {
        tiles.classList.add('victory');
      }
    }
    if (winType === "diag") {
      if (winPos === 0) {
        const victoryTiles = [
          document.querySelector(`.tile[data-rownum="0"][data-columnnum="0"]`),
          document.querySelector(`.tile[data-rownum="1"][data-columnnum="1"]`),
          document.querySelector(`.tile[data-rownum="2"][data-columnnum="2"]`)
        ];
        for (tiles of victoryTiles) {
          tiles.classList.add('victory');
        }
      } else if (winPos === "1") {
        const victoryTiles = [
          document.querySelector(`.tile[data-rownum="0"][data-columnnum="2"]`),
          document.querySelector(`.tile[data-rownum="1"][data-columnnum="1"]`),
          document.querySelector(`.tile[data-rownum="2"][data-columnnum="0"]`)
        ];
        for (tiles of victoryTiles) {
          tiles.classList.add('victory');
        }
      }
    }
  }
  return { createDisplay, modifyTile, displayWin };
})();

// object responsible for controlling game logic
const logicController = (() => {
  let _currPlayer = "X";
  let _gameState = "play";
  const applyMark = function (rowNum, columnNum) {
    gameBoard.applyMark(rowNum, columnNum, _currPlayer);
    _currPlayer === "X" ? _currPlayer = "O" : _currPlayer = "X";
  }
  const checkWinner = function (rowNum, columnNum, board, currPlayer) {
    // takes rowNum and checks for row win
    if (board[rowNum][0] == board[rowNum][1] && board[rowNum][0] == board[rowNum][2]) {
      _alertWinner(currPlayer, "hori", rowNum);
    }
    // takes columnNum and checks for column win
    if (board[0][columnNum] == board[1][columnNum] && board[0][columnNum] == board[2][columnNum]) {
      _alertWinner(currPlayer, "vert", columnNum);
    }
    // checks diagonals and checks for diagonal win
    if (board[1][1] == currPlayer) {
      if (board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
        _alertWinner(currPlayer, "diag", 0);
      }
      if (board[2][0] == board[1][1] && board[2][0] == board[0][2]) {
        _alertWinner(currPlayer, "diag", 1);
      }
    }
    // checks for tie
    if (board[0].includes(0) == false && board[1].includes(0) == false && board[2].includes(0) == false) {
      _alertDraw();
    }
  }
  const _alertWinner = function (currPlayer, winType, winPos) {
    if (_gameState === "play") {
      _gameState = "won";
      displayController.displayWin(winType, winPos);
    }
  }
  const _alertDraw = function () {
    if (_gameState === "play") {
      alert(`Draw!`);
      _gameState = "draw";
    }
  }
  return { applyMark, checkWinner };
})();

// factory for creating player objects
const playerFactory = (name, playerID) => {
  return { name };
}

displayController.createDisplay(gameBoard.getBoard());