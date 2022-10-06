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

  const playerType = { x: "X", o: "O" };
  let movesHistory = [];

  let boardSize = 9;
  let isGameOver = false;
  let currentTurn = playerType.x; // X always starts

  class Cell {
    constructor(isOccupied, mark, elem) {
      Object.assign(this, { isOccupied, mark, elem });
    }
    click = () => {
      if (this.isOccupied || isGameOver) return;
      this.setMark(currentTurn);
      playTurn(this, this.mark);
    };
    setMark(mark) {
      this.mark = mark;
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
    showPopup("It's a Tie!", true);
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
    const isNewReccord = checkForNewReccord(moves);
    if (isNewReccord) {
      showPopup(`${mark} wins in a new record of ${moves} moves!!!`);
      return;
    }
    showPopup(text, true);
  }

  function checkForNewReccord(moves) {
    const reccord = localStorage.getItem("reccord");
    const isNewReccord = reccord > moves || !reccord;
    isNewReccord && setNewReccord(moves);
    return isNewReccord;
  }

  function setNewReccord(moves) {
    localStorage.setItem("reccord", moves);
  }

  function switchTurn() {
    currentTurn = currentTurn === playerType.x ? playerType.o : playerType.x;
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

  app.querySelector(".showReccord").onclick = showReccord;
  app.querySelector(".undo").onclick = undoLastMove;
  app.querySelector(".saveGame").onclick = saveGame;
  app.querySelector(".loadGame").onclick = loadGame;


  const closePopupButton = popup.querySelector(".close");
  closePopupButton.onclick = closePopup;
  const restartButtons = app.querySelectorAll(".restart");
  restartButtons.forEach(button => button.onclick = restartGame);

  function showReccord() {
    const reccord = localStorage.getItem("reccord");
    if (!reccord) {
      showPopup("No record has yet been set!");
      return;
    }
    showPopup(`The current record is a win in ${reccord} moves!`);
  }

  function undoLastMove() {
    if (movesHistory.length < 1 || isGameOver) {
      let text = isGameOver
        ? "A move cannot be undone after the game is over!"
        : "No previous moves!";
      showPopup(text);
      return;
    }
    movesHistory.at(-1).removeMark();
    movesHistory.pop();
    switchTurn();
  }

  function restartGame(isLoadedGame = false, turn = playerType.x) {
    cells.forEach((cell) => {
      cell.removeMark();
    });
    if (isLoadedGame) {
      currentTurn !== turn && switchTurn();
    } else {
      switchTurn();
    }
    movesHistory.length = 0;
    isGameOver = false;
    closePopup();
  }

  function saveGame() {
    let text = "Game saved!";
    if (isGameOver) {
      text = "Can't save a finished game!";
    } else if (movesHistory.length === 0) {
      text = "An empty game cannot be saved!";
    } else {
      const boardSnapshot = { cells, currentTurn };
      localStorage.setItem("savedGame", JSON.stringify(boardSnapshot));
    }
    showPopup(text);
  }

  function loadGame() {
    let loadedGame = JSON.parse(localStorage.getItem("savedGame"));
    if (!loadedGame) {
      showPopup("There is no saved game to load!");
      return;
    }
    restartGame(true, loadedGame.currentTurn);
    loadedGame.cells.forEach((cell, index) => {
      currentCell = cells[index];
      if (!cell.isOccupied) return;
      currentCell.setMark(cell.mark);
      movesHistory.push(currentCell);
    });
    showPopup("Game loaded!");
  }

  function closePopup() {
    popup.style.top = "-100vh";
  }

  function showPopup(text = "", isShowRestartButton = false) {
    popup.style.top = "0";
    popup.querySelector(".popup-text").innerHTML = text;
    closePopupButton.focus();
    isShowRestartButton
      ? (restartButtons[1].style.display = "inline")
      : (restartButtons[1].style.display = "none");
  }
})();
