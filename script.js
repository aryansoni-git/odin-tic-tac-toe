// PLAYER FUNCTION
const Player = (marker) => {
    const getMarker = () => marker;
    return { getMarker };
}

// GAME BOARD
const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    // GET BOARD
    const getBoard = () => board;

    // SET MARKER
    const setMarker = (index, marker) => {
        if (board[index] === '' && index >= 0 && index <= 8) {
            board[index] = marker;
            return true;
        } else { return false; };
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) { board[i] = '' };
    };

    return { getBoard, setMarker, resetBoard };
})();

// CHECK WINNER
const checkWinner = (board) => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // ROWS 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals   
    ];
    for (let combination of winningCombinations) {
        [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            return board[a];
        }
    }
    if (!board.includes('')) {
        return `draw`;
    }
    return null;
};

// GAME CONTROLLER LOGIC
const gameController = (() => {
    // Initialize CURRENT PLAYERS & GAME STATUS
    let currentPlayerIndex = 0;
    let isGameOver = false;

    const Players = [Player('X'), Player('O')];

    // GET PLAYERS
    const getPlayers = () => Players;

    // GET CURRENT PLAYER INDEX
    const getCurrentPlayerIndex = () => currentPlayerIndex;

    // SWITCH PLAYER
    const switchPlayer = () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % 2;
    }

    // PLAY TURN
    const playTurn = (index) => {
        const currentPlayer = Players[currentPlayerIndex];
        const board = gameBoard.getBoard();

        if (!isGameOver && board[index] === '') {
            gameBoard.setMarker(index, currentPlayer.getMarker());
            const winner = checkWinner(board);

            if (winner) {
                isGameOver = true;
                return winner;
            } else if (winner === `draw`) {
                isGameOver = true;
                return `draw`;
            } else {
                switchPlayer();
            }
        }
    };

    // RESET GAME
    const resetGame = () => {
        const turnPara = document.querySelector('.turn-para');
        turnPara.classList.remove('disabled');
        gameBoard.resetBoard();
        currentPlayerIndex = 0
        isGameOver = false;
    }

    return { getPlayers, getCurrentPlayerIndex, playTurn, resetGame };

})();


// DISPLAY/DOM CONTROLLER
const displayController = (() => {
    const turnPara = document.querySelector('.turn-para');
    const resultElement = document.querySelector('.result');

    // Add event listener to game board buttons
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-index]').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                gameController.playTurn(index);
                updateDisplay();
            });
        });

        // Add event listener to Restart button
        document.querySelector('#restart').addEventListener('click', () => {
            resultElement.classList.add('disabled');
            turnPara.classList.remove('disabled');
            gameController.resetGame();
            updateDisplay();
        });

        updateDisplay();
    });

    // UPDATE DISPLAY
    const updateDisplay = () => {
        const board = gameBoard.getBoard();
        const winner = checkWinner(board);

        // UPDATE WINNER DISPLAY
        if (winner) {
            if (winner === 'draw') {
                resultElement.innerHTML = `Play Again! It's a <span>'${winner}'</span>`;
            } else {
                resultElement.innerHTML = `The winner is <span>'${winner}'</span>`;
            }
            resultElement.classList.remove('disabled');
            turnPara.classList.add('disabled');
        } else {
            resultElement.innerHTML = '';
            resultElement.classList.add('disabled');
        }


        // UPDATE CURRENT PLAYER TURN
        const Players = gameController.getPlayers();
        const currentPlayer = Players[gameController.getCurrentPlayerIndex()];
        document.querySelector('#turn').textContent = currentPlayer.getMarker();

        // UPDATE GAME BOARD BUTTONS
        const buttons = document.querySelectorAll('[data-index]');
        buttons.forEach((button, index) => {
            button.textContent = board[index] || '';
        });
    };
})();

/**
 * Future Enhancement: AI Mode
 * 
 * This section of the code is reserved for implementing an AI mode, allowing players to play against the computer.
 * 
 * Steps for Implementation:
 * 
 * 1. Decide on the AI algorithm to use (e.g., minimax, alpha-beta pruning).
 * 2. Implement AI logic to make intelligent moves based on the current game state.
 * 3. Integrate AI functionality into the game controller to enable AI vs. player or AI vs. AI matches.
 * 4. Update the display controller to provide feedback on AI moves and game outcomes.
 * 5. Test thoroughly to ensure the AI mode behaves as expected and provides a challenging gaming experience.
 * 
 * By implementing AI mode, we aim to enhance the player's experience by offering a single-player mode and challenging opponents.
 */