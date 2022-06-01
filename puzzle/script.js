'use strict'

// 画面遷移
const startGame = document.getElementById('js-startGame');
const firstLayer = document.getElementById('js-firstLayer');
const puzzleLayer = document.getElementById('js-puzzleLayer');
startGame.addEventListener('click', (e) => {
  e.preventDefault();
  firstLayer.classList.add('is-hide');
  puzzleLayer.classList.add('is-active');
})

const puzzle = document.getElementById('js-puzzle');
const initialRows = 2;
const initialColumns = 2;

// パズルの生成
function puzzleInit(rows, columns){
  const tilesLength = rows * columns;
  const puzzleTiles = [];
  const clearStatus = [];

  for(let i = 0; i < tilesLength; i++){
    clearStatus.push(String(i))
  }
  const initialStatus = clearStatus.slice(0, clearStatus.length);
  arrayShuffle(initialStatus);

  for(let i=0; i<rows;i++){
    const puzzleTr = document.createElement('tr');
    for(let j=0; j<columns; j++){
      const puzzleTd = document.createElement('td');
      const index = i * columns + j;
      puzzleTd.className = 'c-puzzle__tile';
      puzzleTd.index = index;
      puzzleTd.value = initialStatus[index];
      puzzleTd.textContent = initialStatus[index] == 0? '': initialStatus[index];
      puzzleTd.onclick = clickTile;
      puzzleTr.appendChild(puzzleTd);
      puzzleTiles.push(puzzleTd)
    }
    puzzle.appendChild(puzzleTr)
  }
  // 配列のシャッフル
  function arrayShuffle(array) {
    for(let i = (array.length - 1); 0 < i; i--){
      const r = Math.floor(Math.random() * (i + 1));
      const tmp = array[i];
      array[i] = array[r];
      array[r] = tmp;
    }
    return array;
  }
  
  // タイルのクリック処理
  function clickTile(e) {
    const selectedIndex = e.target.index;
    if(selectedIndex - rows >= 0 && puzzleTiles[selectedIndex - rows].value == 0){
      swapTile(selectedIndex, selectedIndex - rows);
    } else if(selectedIndex + rows < tilesLength && puzzleTiles[selectedIndex + rows].value == 0){
      swapTile(selectedIndex, selectedIndex + rows);
    } else if(selectedIndex % columns != 0 && puzzleTiles[selectedIndex - 1].value == 0){
      swapTile(selectedIndex, selectedIndex - 1);
    } else if(selectedIndex % columns != columns - 1 && puzzleTiles[selectedIndex + 1].value == 0){
      swapTile(selectedIndex, selectedIndex + 1);
    }
  
    const currentStatus = [];
    const currentTiles = document.querySelectorAll('.c-puzzle__tile')
    for(let i = 0; i < currentTiles.length; i++){
      currentStatus.push(currentTiles[i].value)
    }
    compareArray(currentStatus, clearStatus)
  }
  // クリック後のタイルの入れ替え
  function swapTile(currentNum, newNum){
    const selectedTile = puzzleTiles[currentNum];
    const selectedNum = selectedTile.value;
    const swapedTile = puzzleTiles[newNum]; 
    selectedTile.textContent = swapedTile.textContent;
    selectedTile.value = swapedTile.value;
    swapedTile.textContent = selectedNum;
    swapedTile.value = selectedNum;
  }
  // 正誤判定
  function compareArray(currentArray, clearArray){
    for(let i = 0; i < currentArray.length; i++){
      if(currentArray[i] !== clearArray[i]){
        return false;
      }
    }
    playEnd();
  }
}
puzzleInit(initialRows, initialColumns);

// 設定変更
// const settingButton = document.getElementById('js-puzzleSet');
// const setRows = document.getElementById('js-puzzleRows')
// const setColumns = document.getElementById('js-puzzleColumns')
// settingButton.addEventListener('click', (e) => {
//   e.preventDefault();
//   const newRows = setRows.value;
//   const newColumns = setColumns.value;
//   puzzle.innerHTML = '';
//   puzzleInit(newRows, newColumns);
// })

// スタンバイ、ストップウォッチ
const puzzleTile = document.querySelectorAll('.c-puzzle__tile');
for(let i = 0; i < puzzleTile.length; i++){
  puzzleTile[i].classList.add('is-standby');
  puzzleTile[i].addEventListener('click', () => {
    for(let j = 0; j < puzzleTile.length; j++){
      puzzleTile[j].classList.remove('is-standby');
      playStart();
    }    
  })
}

// ストップウォッチ
const playTime = document.getElementById('js-playTime');
let startTime;
let elapsedTime = 0;
let displayTime = null;

function playStart() {
  if(displayTime === null ){
    startTime = new Date();
    displayTime = setInterval(() => {
      const d = new Date(Date.now() - startTime + elapsedTime)
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      const ms = String(d.getMilliseconds()).padStart(3,"000").slice(0,2);
      playTime.textContent = `${m}:${s}:${ms}`
    }, 10)
  }
}
function playEnd() {
  const clearLayer = document.getElementById('js-clearLayer');
  const clearTime = document.getElementById('js-clearTime');

  clearInterval(displayTime)
  clearLayer.style.display = 'block';
  clearTime.textContent = playTime.textContent;
}