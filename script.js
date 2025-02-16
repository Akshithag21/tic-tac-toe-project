const boxes = document.querySelectorAll(".box");
const results = document.getElementById("results");
const restartBox = document.getElementById("restart-box");
const winnerMessage = document.getElementById("winner-message");
const roundWinnerMessage = document.getElementById("round-winner-message");
const userScoreDisplay = document.getElementById("user-score");
const computerScoreDisplay = document.getElementById("computer-score");
const totalGamesDisplay = document.getElementById("total-games");

let turn = "X";
let isGameOver = false;
let userScore = 0;
let computerScore = 0;
let gamesPlayed = 0;

function initGame() {
    isGameOver = false;
    boxes.forEach((box) => {
        box.innerHTML = "";
        box.addEventListener("click", boxClick);
    });
    results.innerText = "";
    restartBox.classList.remove("visible");
    winnerMessage.classList.remove("visible");
    roundWinnerMessage.classList.remove("visible");
}

function boxClick(e) {
    if (!isGameOver && e.target.innerHTML === "" && gamesPlayed < 5) {
        e.target.innerHTML = turn;
        checkWin();
        if (!isGameOver) {
            changeTurn();
            if (turn === "O" && gamesPlayed < 5) {
                computerMove();
            }
        }
    }
}

function changeTurn() {
    turn = turn === "X" ? "O" : "X";
}

function computerMove() {
    if (isGameOver || gamesPlayed >= 5) return;

    const winningMove = findWinningMove("O");
    if (winningMove !== null) {
        boxes[winningMove].innerHTML = "O";
        checkWin();
        if (!isGameOver) changeTurn();
        return;
    }

    const blockingMove = findWinningMove("X");
    if (blockingMove !== null) {
        boxes[blockingMove].innerHTML = "O";
        checkWin();
        if (!isGameOver) changeTurn();
        return;
    }

    const emptyBoxes = Array.from(boxes).filter((box) => box.innerHTML === "");
    if (emptyBoxes.length > 0) {
        const randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
        randomBox.innerHTML = "O";
        checkWin();
        if (!isGameOver) changeTurn();
    }
}

function checkWin() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    winConditions.forEach((condition) => {
        const [a, b, c] = condition;
        if (
            boxes[a].innerHTML !== "" &&
            boxes[a].innerHTML === boxes[b].innerHTML &&
            boxes[a].innerHTML === boxes[c].innerHTML
        ) {
            isGameOver = true;

            // Highlight the winning row
            condition.forEach((index) => {
                boxes[index].style.backgroundColor = "#FF2E63";
            });

            if (boxes[a].innerHTML === "X") {
                userScore++;
                results.innerText = "User Wins!";
            } else {
                computerScore++;
                results.innerText = "Computer Wins!";
            }
            updateScore();
        }
    });

    if (!isGameOver && Array.from(boxes).every((box) => box.innerHTML !== "")) {
        isGameOver = true;
        results.innerText = "It's a Draw!";
        updateScore();
    }
}

function updateScore() {
    gamesPlayed++;
    userScoreDisplay.innerText = `User (X): ${userScore}`;
    computerScoreDisplay.innerText = `Computer (O): ${computerScore}`;
    totalGamesDisplay.innerText = `Games Played: ${gamesPlayed}/5`;

    if (gamesPlayed < 5) {
        showPlayAgain();
    } else {
        showRestartRound();
    }
}

function showPlayAgain() {
    winnerMessage.innerText = results.innerText;
    winnerMessage.classList.add("visible");

    restartBox.classList.add("visible");
    restartBox.innerHTML = `<div>${results.innerText}</div><button id="play-again">Play Again</button>`;

    // Clear the winning row color before playing again
    boxes.forEach((box) => {
        box.style.backgroundColor = ""; // Clear color on play again
    });

    document.getElementById("play-again").onclick = () => {
        resetBoard();
        winnerMessage.classList.remove("visible");
        restartBox.classList.remove("visible");
    };
}

function showRestartRound() {
    let roundWinnerText = "";

    if (userScore > computerScore) {
        roundWinnerText = "User wins the round with the highest score!";
    } else if (computerScore > userScore) {
        roundWinnerText = "Computer wins the round with the highest score!";
    } else {
        roundWinnerText = "The round is a draw!";
    }

    roundWinnerMessage.innerText = roundWinnerText; // Update the winner message element
    roundWinnerMessage.classList.add("visible");

    restartBox.classList.add("visible");
    restartBox.innerHTML = `
        <div style="margin-bottom: 10px; font-size: 1.2rem;">${roundWinnerText}</div>
        <button id="restart-round" style="background-color: #FF2E63;">Restart Round</button>
    `;

    // Clear the winning row color before restarting the round
    boxes.forEach((box) => {
        box.style.backgroundColor = ""; // Clear color on restart
    });

    document.getElementById("restart-round").onclick = restartGame;
}

function resetBoard() {
    boxes.forEach((box) => {
        box.innerHTML = "";
        box.style.backgroundColor = ""; // Clear background color
    });
    isGameOver = false;
    turn = "X";
    results.innerText = "";
}

function restartGame() {
    gamesPlayed = 0;
    userScore = 0;
    computerScore = 0;
    resetBoard();
    restartBox.classList.remove("visible");
    userScoreDisplay.innerText = `User (X): ${userScore}`;
    computerScoreDisplay.innerText = `Computer (O): ${computerScore}`;
    totalGamesDisplay.innerText = `Games Played: ${gamesPlayed}/5`;
    initGame();
}

function findWinningMove(player) {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const condition of winConditions) {
        const [a, b, c] = condition;
        const values = [boxes[a].innerHTML, boxes[b].innerHTML, boxes[c].innerHTML];
        const emptyIndex = values.indexOf("");

        if (emptyIndex !== -1 && values.filter(val => val === player).length === 2) {
            return condition[emptyIndex];
        }
    }
    return null;
}

initGame(); // Initialize game on page load
