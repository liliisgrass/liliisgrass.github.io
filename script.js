const output = document.querySelector(".output");

const cells = document.querySelectorAll(".grid>div")

let turn = true;

function rand(min, max){
    const range = max - min;
    return Math.floor(Math.random() * range + min);
}

const Settings = () => {
    let p1 = "X";
    let p2 = "O";
    const p1input = document.querySelector("#p1");
    const p2input = document.querySelector("#p2");
    p1input.addEventListener("input", (e) => {
        settings.p1 = e.target.value;
        grid.reset();
        turn = true;
    });
    p2input.addEventListener("input", (e) => {
        settings.p2 = e.target.value;
        grid.reset();
        turn = true;
    });
    let players = 2;
    const one = document.querySelector("#one");
    const two = document.querySelector("#two");
    one.addEventListener("change", () => {
        settings.players = 1;
        grid.reset();
        turn = true;
    })
    two.addEventListener("change", () => {
        settings.players = 2;
        grid.reset();
        turn = true;
    })
    return {p1, p2, players};
}
const settings = Settings();

const Grid = () => {
    let content = [,,,,,,,,]
    const reset = () => {
        grid.content = [,,,,,,,,];
        for (const cell of cells){
            cell.textContent = "";
        }
    };
    const tie = () => {
        let i = 0;
        for (const cell of grid.content){
            if (cell){
                i = i + 1;
            }
        }
        if (i === 9){
            return true;
        } else {
            return false;
        }
    }
    const checkWin = (players = [settings.p1, settings.p2]) => {
        for (const player of players){
            //rows
            if (grid.content[0] == grid.content[1] && grid.content[1] == grid.content[2] && grid.content[2] == player){
                return player;
            } else if (grid.content[3] == grid.content[4] && grid.content[4] == grid.content[5] && grid.content[5] == player){
                return player;
            } else if (grid.content[6] == grid.content[7] && grid.content[7] == grid.content[8] && grid.content[8] == player){
                return player;
            //diagonals
            } else if (grid.content[0] == grid.content[4] && grid.content[4] == grid.content[8] && grid.content[8] == player){
                return player;
            } else if (grid.content[2] == grid.content[4] && grid.content[4] == grid.content[6] && grid.content[6] == player){
                return player;
            //columns
            } else if (grid.content[0] == grid.content[3] && grid.content[3] == grid.content[6] && grid.content[6] == player){
                return player;
            } else if (grid.content[1] == grid.content[4] && grid.content[4] == grid.content[7] && grid.content[7] == player){
                return player;
            } else if (grid.content[2] == grid.content[5] && grid.content[5] == grid.content[8] && grid.content[8] == player){
                return player;
            } else if (tie()){
                return "tie";
            }
        }
        return null;
    }
    const gameOver = () => {
        if (checkWin() !== null){
            const gameInfo = document.createElement("p");
            gameInfo.style = "font-size: 5vmin";
            if (checkWin() == "tie"){
                gameInfo.textContent = "tie";
            } else {
                gameInfo.textContent = `${checkWin()} wins`;
            }
            output.appendChild(gameInfo);
            reset();

            if (settings.players == 1 && turn == false){
                grid.playBestMove();
                turn = true;
            }
        }
    }

    const minimax = (isMax, moves = 0, a, b) => {
        moves++;
        let score = checkWin();
        if (score == settings.p2){
            return 25 - moves;
        } else if (score == "tie"){
            return 0 - moves;
        } else if (score == settings.p1){
            return -25 + moves;
        } else {
            if (isMax){
                let best = -50;
                for (let i = 0; i <= 8; i++){
                    if(!grid.content[i]){
                        grid.content[i] = settings.p2;
                        best = Math.max(best, minimax(!isMax));
                        a = Math.max(a, best);
                        grid.content[i] = null;
                        if (b <= a){
                            break;
                        }
                    }
                }   
                return best;
            } else {
                let best = 50;
                for (let i = 0; i <= 8; i++){
                    if(!grid.content[i]){
                        grid.content[i] = settings.p1;
                        best = Math.min(best, minimax(!isMax));
                        b = Math.min(b, best);
                        grid.content[i] = null;
                        if (b <= a){
                            break;
                        }
                    }
                }
                return best;
            }
        }
    }
    const playBestMove = () => {
        let bestVal = -2;
        let bestMove = -1;
        for (let i = 0; i <= 8; i++){
            if (!grid.content[i]){
                grid.content[i] = settings.p2;
                let moveVal = minimax(false);
                if (moveVal > bestVal){
                    bestVal = moveVal;
                    bestMove = i;
                }
                grid.content[i] = null;
            }
        }
        grid.content[bestMove] = settings.p2;
        cells[bestMove].textContent = settings.p2;
    }

    return {gameOver, reset, content, checkWin, playBestMove}
}

const grid = Grid();

const Cell = (position, element) => {
    const place = () => {
        if (turn == true && !grid.content[position]){
            element.textContent = settings.p1;
            grid.content[position] = settings.p1;
            turn = false;
            if (settings.players == 1 && grid.checkWin() == null){
                grid.playBestMove();
                turn = true;
            }
        } else if (turn == false && !grid.content[position]){
            element.textContent = settings.p2;
            grid.content[position] = settings.p2;
            turn = true;
        }
        grid.gameOver();
    }
    return {position, place, element, turn};
}

for (i = 0; i <= 8; i++){
    const cell = Cell(i, cells[i]);
    cell.element.addEventListener("click", cell.place);
}

function baseConvert(num, targetBase){
    const findLargestDigit = (n) => {
        let i = 0;
        while (n >= Math.pow(targetBase, i)){
            i++;
        };
        return (i - 1);
    };

    const digitValue = (power) => {
        let i = 1;
        while (num >= Math.pow(targetBase, power) * i){
            i++;
        };
        return (i - 1);
    };

    let output = 0;
    for (let i = findLargestDigit(num); i >= 0; i--){
        let val = digitValue(i);
        if (val == 0){
            output = output * 10;
        } else {
            output = (output * 10) + val;
            num = num - (Math.pow(targetBase, i) * val);
        }
    }
    return output;
}