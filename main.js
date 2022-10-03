(() => {
  const WINNING_COMBINATIONS = [
    // -----
    // BOARD
    // -----
    // 0|1|2
    // 3|4|5
    // 6|7|8
    // -----
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const playerType = ["X", "O"];
  const movesHistory = [];

  let boardSize = 9; // TODO: try to encrease board size
  let isGameOver = false;
  let currentTurn = playerType[0]; // X always starts

  class Cell {
    constructor(isOccupied, mark, elem) {
      Object.assign(this, { isOccupied, mark, elem });
    }
    click = () => {
      if (this.isOccupied || isGameOver) return;
      this.setMark();
      playTurn(this, this.mark);
    };
    setMark() {
      this.mark = currentTurn;
      this.elem.innerHTML = this.mark;
      this.elem.classList.add(this.mark);
      this.isOccupied = true;
    }
    removeMark() {
      this.elem.innerHTML = "";
      this.elem.classList.remove(this.mark);
      this.mark = null;
      this.isOccupied = false;
    }
  }

  const cells = [...Array(boardSize)].map(() => {
    return new Cell(false, null, document.createElement("div"));
  });

  function playTurn(cell, mark) {
    movesHistory.push(cell);
    checkForTie() && handleTie();
    checkForWin() && handleWin(mark);
    switchTurn();
  }

  function checkForTie() {
    return cells.every((cell) => cell.isOccupied);
  }

  function handleTie() {
    isGameOver = true;
    showPopup("It's a Tie!");
  }

  function checkForWin() {
    return WINNING_COMBINATIONS.some((comb) => {
      return comb.every((index) => {
        return cells[index].mark === currentTurn;
      });
    });
  }

  function handleWin(mark) {
    isGameOver = true;
    const moves = movesHistory.length;
    let text = `${mark} wins is ${moves} moves!!!`;
    const isNewReccord = ceckForNewReccord(moves);
    if (isNewReccord) {
      showPopup(`${mark} wins in a new record of ${moves} moves!!!`);
      return;
    }
    showPopup(text);
  }

  function ceckForNewReccord(moves) {
    const reccord = localStorage.getItem("reccord");
    const isNewReccord = reccord > moves || !reccord;
    isNewReccord && setNewReccord(moves);
    return isNewReccord;
  }

  function setNewReccord(moves) {
    localStorage.setItem("reccord", moves);
  }

  function switchTurn() {
    currentTurn = currentTurn === playerType[0] ? playerType[1] : playerType[0];
    currentTurnDisplay.innerHTML = currentTurn;
  }

  // UI buttons and functions

  const app = document.querySelector(".app");
  let board = app.querySelector(".board");

  cells.map((cell) => {
    cell.elem.classList.add("cell");
    cell.elem.onclick = cell.click;
    board.appendChild(cell.elem);
  });

  const currentTurnDisplay = app.querySelector(".turn-of > .cell");
  const popup = app.querySelector(".popup");

  const showReccordButton = (app.querySelector(".showReccord").onclick =
    showReccord);
  const undoButton = (app.querySelector(".undo").onclick = undoLastMove);
  const restartButton = (app.querySelector(".restart").onclick = restartGame);
  const closePopupButton = (popup.querySelector(".close").onclick = closePopup);

  function showReccord() {
    const reccord = localStorage.getItem("reccord");
    if (!reccord) {
      showPopup("No record has yet been set!");
      return;
    }
    showPopup(`The current record is a win in ${reccord} moves`);
  }

  function undoLastMove() {
    if (movesHistory.length < 1 || isGameOver) return;
    movesHistory.at(-1).removeMark();
    movesHistory.pop();
    switchTurn();
  }

  function restartGame() {
    cells.forEach((cell) => {
      isGameOver = false;
      cell.removeMark();
    });
    currentTurn !== playerType[0] && switchTurn();
    movesHistory.length = 0;
  }

  function closePopup() {
    popup.style.top = "-100vh";
  }

  function showPopup(text = "") {
    popup.style.top = "0";
    popup.querySelector(".popup-text").innerHTML = text;
  }
})();
