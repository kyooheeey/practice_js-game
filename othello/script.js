'use strict'

const weightData = [
  [30, -12, 0 -1, -1, 0 -12, 30],
  [-12, -15, -3, -3, -3, -3, -15, -12],
  [0, -3, 0, -1, -1, 0, -3, 0],
  [-1, -3, -1, -1, -1, -1, -3, 1],
  [-1, -3, -1, -1, -1, -1, -3, 1],
  [0, -3, 0, -1, -1, 0, -3, 0],
  [-12, -15, -3, -3, -3, -3, -15, -12],
  [30, -12, 0 -1, -1, 0 -12, 30],
];
const statusBlack = 1
const statusWhite = 2;
let currentBoard = [];
let playerTurn = false;

// ボードの生成
function init() {
  const board = document.getElementById('js-board');
  for(let i = 0; i < 8; i++){
    const tr = document.createElement('tr');
    currentBoard[i] = [0, 0, 0, 0, 0, 0, 0, 0];
    for(let j = 0; j < 8; j++){
      const td = document.createElement('td');
      td.className = 'c-board__cell'
      td.id = 'cell' + i + j;
      td.onclick = cellClick;
      tr.appendChild(td)
    }
    board.appendChild(tr)
  }
  put(3, 3, statusBlack);
  put(4, 4, statusBlack);
  put(3, 4, statusWhite);
  put(4, 3, statusWhite);
  updateBoard();
}

// スコアとボードの状態反映
function updateBoard() {
  let numBlack = 0;
  let numWhite = 0;
  const scoreBlack = document.getElementById('js-scoreBlack')
  const scoreWhite = document.getElementById('js-scoreWhite')
  for(let x = 0; x < 8; x++){
    for(let y = 0; y < 8; y++){
      if(currentBoard[x][y] == statusBlack){
        numBlack++;
      }
      if(currentBoard[x][y] == statusWhite){
        numWhite++;
      }
    }
  }

  scoreBlack.textContent = numBlack;
  scoreWhite.textContent = numWhite;
  
  const blackFlip = canFlip(statusBlack);
  const whiteFlip = canFlip(statusWhite);

  if(numBlack + numWhite == 64 || (!blackFlip && !whiteFlip)){
    showMessage('FINISHED');
  } else if(!blackFlip){
    showMessage('CPU SKIP!');
    playerTurn = false;
  } else if(!whiteFlip){
    showMessage('PLAYER SKIP!');
    playerTurn = true;
  } else {
    playerTurn = !playerTurn;
  }
  !playerTurn && setTimeout(think, 1000);
}

// メッセージの表示
function showMessage(msg) {
  let message = document.getElementById('js-message');
  message.textContent = msg;
  setTimeout(() => {
    message = "";
  }, 2000)
}

// セルのクリック処理
function cellClick(e) {
  if(!playerTurn){
    return;
  }
  const cellId = e.target.id;
  const i = parseInt(cellId.charAt(4));
  const j = parseInt(cellId.charAt(5));
  const fliped = getFlipCells(i, j, statusBlack)
  if(fliped.length > 0){
    for(let k =0; k < fliped.length; k++){
      put(fliped[k][0], fliped[k][1], statusBlack);
    }
    put(i, j, statusBlack);
    updateBoard();
  }
}

// コマのスタイル設定
function put(i, j, color) {
  const selectedCell = document.getElementById('cell' + i + j);
  selectedCell.textContent = '●';
  selectedCell.className = 'c-board__cell--' + (color == statusBlack ? 'black': 'white');
  selectedCell.classList.add('c-board__cell')
  currentBoard[i][j] = color;
}

// CPUの思考
function think() {
  let highScore = -1000;
  let px = -1;
  let py = -1;
  for(let x = 0; x < 8; x++){    
    for(let y = 0; y < 8; y++){
      const templateData = copyData();
      const fliped = getFlipCells(x, y, statusWhite);
      if(fliped.length > 0){
        for(let i = 0; i < fliped.length; i++){
          const p = fliped[i][0];
          const q = fliped[i][1];
          templateData[p][q] = statusWhite;
          templateData[x][y] = statusWhite;
        }

        const score = calcWeightData(templateData);
        if(score > highScore){
          highScore = score;
          px = x;
          py = y;
        }
      }
    }
  }

  if(px >= 0 && py >= 0){
    const fliped = getFlipCells(px, py, statusWhite);
    if(fliped.length > 0){
      for(let k = 0; k < fliped.length; k++){
        put(fliped[k][0], fliped[k][1], statusWhite);
      }
    }
    put(px, py, statusWhite)
  }
  updateBoard();
}

function calcWeightData(template) {
  let score = 0;
  for(let x = 0; x < 8; x++){
    for(let y = 0; y < 8; y++){
      if(template[x][y] == statusWhite){
        score += weightData[x][y]
      }
    }
  }
  return score;
}

function copyData() {
  let template = [];
  for(let x = 0; x < 8; x++){
    template[x] = [];
    for(let y = 0; y < 8; y++){
      template[x][y] = currentBoard[x][y]
    }
  }
  return template;
}

function canFlip(color) {
  for(let x = 0; x < 8; x++){
    for(let y = 0; y < 8; y++){
      let fliped = getFlipCells(x, y, color);
      if(fliped.length > 0){
        return true;
      }
    }
  }
  return false;
}

function getFlipCells(i, j, color) {
  if(currentBoard[i][j] == statusBlack || currentBoard[i][j] == statusWhite){
    return [];
  }

  const directs = [[-1, -1],[0, -1],[1, -1],[-1, 0],[1, 0],[-1, 1],[0, 1],[1, 1]];
  let resultBoard = [];
  for(let p = 0; p < directs.length; p++){
    let fliped = getFlipCellsOneDirect(i, j, directs[p][0], directs[p][1], color);
    resultBoard = resultBoard.concat(fliped);
  }
  return resultBoard;
}

function getFlipCellsOneDirect(i, j, dx, dy, color) {
  let x = i + dx;
  let y = j + dy;
  let fliped = [];
  if(x < 0 || y < 0 || x > 7 || y > 7 || currentBoard[x][y] == color || currentBoard[x][y] == 0){
    return [];
  }
  fliped.push([x, y]);
  while(true){
    x += dx;
    y += dy;
    if(x < 0 || y < 0 || x > 7 || y > 7 || currentBoard[x][y] == 0){
      return [];
    }
    if(currentBoard[x][y] == color){
      return fliped;
    } else {
      fliped.push([x, y]);
    }
  }
}

init();


