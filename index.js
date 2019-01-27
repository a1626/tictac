/**
* This program is a boilerplate code for the standard tic tac toe game
* Here the “box” represents one placeholder for either a “X” or a “0”
* We have a 2D array to represent the arrangement of X or O is a grid
* 0 -> empty box
* 1 -> box with X
* 2 -> box with O
*
* Below are the tasks which needs to be completed:
* Imagine you are playing with the computer so every alternate move should be done by the computer
* X -> player
* O -> Computer
*
* Winner needs to be decided and has to be flashed
*
* Extra points will be given for approaching the problem more creatively
* 
*/

const grid = [];
const GRID_LENGTH = 3;
let numberOfGridFilled = 0;
const USER_RECORD = {
  '0x': ['00', '01', '02'],
  'x0': ['00', '10', '20'],
  '1x': ['10', '11', '12'],
  'x1': ['01', '11', '21'],
  '2x': ['20', '21', '22'],
  'x2': ['02', '12', '22'],
  leftDiagonal: ['00', '11', '22'],
  rightDiagonal: ['02', '11', '20']
};
const COMPUTER_RECORD = JSON.parse(JSON.stringify(USER_RECORD));
let turn = 'X';

function initializeGrid() {
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    const tempArray = [];
    for (let rowidx = 0; rowidx < GRID_LENGTH; rowidx++) {
      tempArray.push(0);
    }
    grid.push(tempArray);
  }
}

function getRowBoxes(colIdx) {
  let rowDivs = '';

  for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
    let additionalClass = 'darkBackground';
    let content = '';
    const sum = colIdx + rowIdx;
    if (sum % 2 === 0) {
      additionalClass = 'lightBackground';
    }
    const gridValue = grid[colIdx][rowIdx];
    if (gridValue === 1) {
      content = '<span class="cross">X</span>';
    }
    else if (gridValue === 2) {
      content = '<span class="cross">O</span>';
    }
    rowDivs = rowDivs + '<div colIdx="' + colIdx + '" rowIdx="' + rowIdx + '" class="box ' +
      additionalClass + '">' + content + '</div>';
  }
  return rowDivs;
}

function getColumns() {
  let columnDivs = '';
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    let coldiv = getRowBoxes(colIdx);
    coldiv = '<div class="rowStyle">' + coldiv + '</div>';
    columnDivs = columnDivs + coldiv;
  }
  return columnDivs;
}

function hasValue(record, value) {
  return Object.keys(record).some(key => record[key].length === value);
}

function renderMainGrid() {
  const parent = document.getElementById('grid');
  const columnDivs = getColumns();
  parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function populateHistory(gridValue, record) {
  record[`${gridValue[0]}x`].splice(record[`${gridValue[0]}x`].indexOf(`${gridValue}`), 1);
  record[`x${gridValue[1]}`].splice(record[`x${gridValue[1]}`].indexOf(`${gridValue}`), 1);

  if (gridValue[1] === gridValue[0]) {
    record['leftDiagonal'].splice(record['leftDiagonal'].indexOf(`${gridValue}`), 1);
  }

  if (parseInt(gridValue[1]) + parseInt(gridValue[0]) === 2) {
    record['rightDiagonal'].splice(record['rightDiagonal'].indexOf(`${gridValue}`), 1);
  }
}

function whereCanIWin(userData, oponentData) {
  let retValue;
  const canIWin = Object.keys(userData).some(key => {
    const arr = userData[key];
    retValue = arr[0];
    return arr.length === 1 && oponentData[key].length === 3
  });
  return canIWin ? retValue : null;
}

function fillFirstEmptyBox(newValue) {
  for (let i = 0; i < GRID_LENGTH; i++) {
    for (let j = 0; j < GRID_LENGTH; j++) {
      if (grid[i][j] === 0) {
        grid[i][j] = newValue;
        return `${i}${j}`;
      }
    }
  }
}

function aIsTurn() {
  const newValue = 2;
  let myGridValue = '11';

  if (grid[1][1] === 0) {
    grid[1][1] = newValue;
  }
  else if (myGridValue = whereCanIWin(COMPUTER_RECORD, USER_RECORD)) {
    grid[myGridValue[0]][myGridValue[1]] = newValue;
  }
  else if (myGridValue = whereCanIWin(USER_RECORD, COMPUTER_RECORD)) {
    grid[myGridValue[0]][myGridValue[1]] = newValue;
  }
  else {
    myGridValue = fillFirstEmptyBox(newValue);
  }

  populateHistory(myGridValue, COMPUTER_RECORD);
}

function onBoxClick() {
  const rowIdx = this.getAttribute('rowIdx');
  const colIdx = this.getAttribute('colIdx');
  const newValue = 1;
  grid[colIdx][rowIdx] = newValue;
  populateHistory(`${colIdx}${rowIdx}`, USER_RECORD);
  const userWon = hasValue(USER_RECORD, 0);
  numberOfGridFilled++;
  if (userWon || numberOfGridFilled === 9) {
    renderMainGrid();
    return;
  }

  aIsTurn();
  numberOfGridFilled++;
  const aiWon = hasValue(COMPUTER_RECORD, 0);
  renderMainGrid();

  if (!aiWon) {
    addClickHandlers();
  }
}

function addClickHandlers() {
  const boxes = document.getElementsByClassName('box');
  for (let idx = 0; idx < boxes.length; idx++) {
    boxes[idx].addEventListener('click', onBoxClick, false);
  }
}

initializeGrid();
renderMainGrid();
addClickHandlers();
