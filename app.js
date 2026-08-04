const player = (mark) => {
    return {mark}
}

const gameboard = (() => {
    const board = [
        "","","",
        "","","",
        "","",""
    ]
    
    const getBoard = () =>{
        return board;
    }

    const putMark = (index, mark) =>{
        board[index] = mark;
    }

    const resetBoard = () =>{
        for(let i = 0; i < board.length;i++){
            board[i] = "";
        }
    }

    return {getBoard, putMark, resetBoard}
})();


const gameController = (() => {
    const player1 = player("X");
    const player2 = player("O");
    let currentPlayer = player1;
    let gameOver = false;
    let winnerCombination = undefined;

    const playRound = (index) => {

        // while game isn't over
        if(!gameOver){

            const board = gameboard.getBoard();
    
            if(board[index] === ""){
                gameboard.putMark(index, currentPlayer.mark);
                
                //check winner
                if(checkWinner()){
                    //console.log(`${currentPlayer.mark} has won!`);
                    //console.log(winnerCombination);
                    gameOver = true;
                }
        
                //check draw
                else if(checkDraw()){
                    //console.log("It's a draw!");
                    gameOver = true;
                }else{
                    // switch turn
                    switchTurn();
                }
        
            }
    
        }
    }

    const getCurrentTurn = () => {
        return currentPlayer.mark;
    }

    const getWinnerCombination = () => {
        return winnerCombination;
    }

    const checkWinner = () => {
        const probabilities = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [6,4,2]
        ]

        const currentBoard = gameboard.getBoard();

        const isThereWinner = probabilities.some(option => {
            if(currentBoard[option[0]] === currentPlayer.mark && 
                    currentBoard[option[1]] === currentPlayer.mark && 
                    currentBoard[option[2]] === currentPlayer.mark){
                        winnerCombination = [option[0], option[1], option[2]];
                        return true;
                    }
        }
        );
        return isThereWinner;
    }

    const checkDraw = () => {
        const currentBoard = gameboard.getBoard();

        const isFull = currentBoard.every(cell => cell != "");
        return isFull;
    }

    const switchTurn = () =>{
        if(currentPlayer === player1){
            currentPlayer = player2;
        }else{
            currentPlayer = player1;
        }
    }

    const resetGame = () => {
        currentPlayer = player1;
        gameOver = false;
        gameboard.resetBoard();
        winnerCombination = undefined;
    }

    return {playRound,resetGame, getCurrentTurn, getWinnerCombination}
})();

const displayController = (() => {
    const restartBtn = document.getElementById("restart");
    const gameboardDiv = document.getElementById("game-board");
    const turn = document.getElementById("turn");


    const renderBoard = () => {

        for(let i=1; i<10; i++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add("avaible");
            cell.id = i;
            
            const p = document.createElement("p");
            p.textContent = gameboard.getBoard()[i-1];
            cell.appendChild(p);
            gameboardDiv.appendChild(cell);
        }

    }



    gameboardDiv.addEventListener("click", (e) => {
        if(e.target.closest("div").classList.contains("cell")){
            const cell = e.target.closest("div");
            gameController.playRound(cell.id -1);
            cell.firstChild.textContent = gameboard.getBoard()[cell.id -1];
            turn.textContent = `${gameController.getCurrentTurn()}'s Turn`;
            cell.classList.remove("avaible");

            if(gameController.getWinnerCombination()){
                
                for(const cell of gameController.getWinnerCombination()){
                    const div = document.getElementById(cell+1);
                    div.classList.add("winner");
                }
                turn.textContent = `${gameController.getCurrentTurn()} wins!`;
            }else if(gameboard.getBoard().every(e => e!== "")){
                turn.textContent = "It's a draw!"
            }
        }
    })


    document.addEventListener("DOMContentLoaded", ()=>{
        renderBoard();
    })

    restartBtn.addEventListener("click", ()=> {
        turn.textContent = "X's Turn"
        gameController.resetGame();
        gameboardDiv.textContent = "";
        renderBoard();
    })
})();