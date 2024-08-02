const cells = document.querySelectorAll('[data-cell]');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const gameBoardElement = document.getElementById('gameBoard');
const gameModeSelector = document.getElementById('gameMode');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let gameMode = 'player';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

restartButton.addEventListener('click', restartGame);
gameModeSelector.addEventListener('change', (e) => {
    gameMode = e.target.value;
    restartGame();
});

function handleClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (board[index] === '' && isGameActive) {
        playMove(index, currentPlayer);
        if (isGameActive && gameMode !== 'player' && currentPlayer === 'X') {
            currentPlayer = 'O';
            setTimeout(() => {
                if (gameMode === 'computer') {
                    computerMoveRandom();
                } else if (gameMode === 'minimax') {
                    computerMoveMinimax();
                }
                currentPlayer = 'X';
            }, 500);
        }
    }
}

function playMove(index, player) {
    board[index] = player;
    cells[index].innerText = player;
    if (checkWin(player)) {
        messageElement.innerText = `${player} wins!`;
        isGameActive = false;
    } else if (board.every(cell => cell !== '')) {
        messageElement.innerText = 'Draw!';
        isGameActive = false;
    }
}

function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function restartGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.innerText = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    messageElement.innerText = '';
    isGameActive = true;
}

// Random AI for the Computer
function computerMoveRandom() {
    const availableCells = board.map((cell, idx) => cell === '' ? idx : null).filter(idx => idx !== null);
    if (availableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        playMove(availableCells[randomIndex], 'O');
    }
}

// Minimax AI for the Computer
function computerMoveMinimax() {
    const bestMove = findBestMove(board);
    if (bestMove !== undefined) {
        playMove(bestMove, 'O');
    }
}

function findBestMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
