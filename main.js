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
  const turnsHistory = [];

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
      checkForTie() && handleTie();
      checkForWin() && handleWin(this.mark);
      switchTurn();
      turnsHistory.push(this);
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

  let board = document.querySelector(".board");
  cells.map((cell) => {
    cell.elem.classList.add("cell");
    cell.elem.onclick = cell.click;
    board.appendChild(cell.elem);
  });

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
    showPopup(`${mark} wins!`);
  }

  function switchTurn() {
    currentTurn = currentTurn === playerType[0] ? playerType[1] : playerType[0];
    currentTurnDisplay.innerHTML = currentTurn;
  }

  // UI buttons and functions

  const currentTurnDisplay = document.querySelector(".turn-of > .cell");
  const popup = document.querySelector(".popup");

  const undoButton = (document.querySelector(".undo").onclick = undoLastMove);
  const restartButton = (document.querySelector(".restart").onclick =
    restartGame);
  const closePopupButton = (popup.querySelector(".close").onclick = closePopup);

  function undoLastMove() {
    if (turnsHistory.length < 1 || isGameOver) return;
    turnsHistory.at(-1).removeMark();
    turnsHistory.pop();
    switchTurn();
  }

  function restartGame() {
    cells.forEach((cell) => {
      isGameOver = false;
      cell.removeMark();
    });
    currentTurn !== playerType[0] && switchTurn();
    turnsHistory.length = 0;
  }

  function closePopup() {
    popup.style.top = "-100vh";
  }

  function showPopup(text = "") {
    popup.style.top = "0";
    popup.querySelector(".popup-text").innerHTML = text;
  }
})();
