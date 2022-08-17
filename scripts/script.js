// object responsible for handling board state
const gameBoard = (() => {
  const _board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  const refreshBoard = function () {
    for (const [i, row] of _board.entries()) {
      for (const v of row.keys()) {
        _board[i][v] = 0;
      }
    }
  }
  const getBoard = () => _board;
  const applyMark = function (rowNum, columnNum, currPlayer) {
    if (logicController.getState() === "play") {
      let legalMove = false;
      if (_board[rowNum][columnNum] == "0") {
        _board[rowNum][columnNum] = currPlayer;
        legalMove = true;
      }
      displayController.modifyTile(rowNum, columnNum, _board[rowNum][columnNum], currPlayer);
      return legalMove;
    }
  }
  return { refreshBoard, getBoard, applyMark };
})();

// factory for creating player objects
const playerFactory = (playerName, playerID) => {
  return { playerName, playerID };
}

// object responsible for rendering board state to page
const displayController = (() => {
  const _display = document.querySelector('#board');
  const createDisplay = function (board) {
    _display.replaceChildren();
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
    logicController.checkWinner(rowNum, columnNum, gameBoard.getBoard());
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
      } else if (winPos === 1) {
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
  let _gameState = "initial";
  const _winner = document.querySelector("#winner");
  const player1 = playerFactory("default1");
  const player2 = playerFactory("default2");
  const startGame = function (state) {
    if (_gameState != "play") {
      _currPlayer = "X";
      _gameState = state;
      _winner.textContent = "";
      gameBoard.refreshBoard();
      displayController.createDisplay(gameBoard.getBoard());
    }
    player1.name = document.querySelector("#player1Name").value;
    player2.name = document.querySelector("#player2Name").value;
  };
  const applyMark = function (rowNum, columnNum) {
    // attempts to play turn and changes turn if legal move
    if (gameBoard.applyMark(rowNum, columnNum, _currPlayer) === true) {
      _currPlayer === "X" ? _currPlayer = "O" : _currPlayer = "X";
    }
  }

  const checkWinner = function (rowNum, columnNum, board) {
    const winnerName = (_currPlayer === "X" ? player1.name : player2.name);
    // takes rowNum and checks for row win
    if (board[rowNum][0] == board[rowNum][1] && board[rowNum][0] == board[rowNum][2]) {
      _alertWinner(winnerName, "hori", rowNum);
    }
    // takes columnNum and checks for column win
    if (board[0][columnNum] == board[1][columnNum] && board[0][columnNum] == board[2][columnNum]) {
      _alertWinner(winnerName, "vert", columnNum);
    }
    // checks diagonals and checks for diagonal win
    if (board[1][1] == _currPlayer) {
      if (board[0][0] == board[1][1] && board[0][0] == board[2][2]) {
        _alertWinner(winnerName, "diag", 0);
      }
      if (board[2][0] == board[1][1] && board[2][0] == board[0][2]) {
        _alertWinner(winnerName, "diag", 1);
      }
    }
    // checks for tie
    if (board[0].includes(0) == false && board[1].includes(0) == false && board[2].includes(0) == false) {
      _alertDraw();
    }
  }
  const _alertWinner = function (winnerName, winType, winPos) {
    if (_gameState === "play") {
      _gameState = "won";
      displayController.displayWin(winType, winPos);
      _winner.textContent = `${winnerName} has won!`;
      playButton.changeText("restart?");
    }
  }
  const _alertDraw = function () {
    if (_gameState === "play") {
      _gameState = "draw";
      document.querySelector("#winner").textContent = `Draw!`;
      playButton.changeText("restart?");
    }
  }
  const getState = function () {
    return _gameState;
  }
  return { startGame, applyMark, checkWinner, getState };
})();

// object for play button
const playButton = (() => {
  const _button = document.querySelector("button");
  _button.addEventListener('click', () => {
    logicController.startGame("play");
  });
  const changeText = function (text) {
    _button.textContent = text;
  }
  return { changeText }
})();

displayController.createDisplay(gameBoard.getBoard());