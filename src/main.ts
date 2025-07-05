const gridSize = 8;
const mineCount = 10;

interface Cell {
  element: HTMLDivElement;
  hasMine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentMines: number;
}

let grid: Cell[][] = [];
const boardElement = document.getElementById('board') as HTMLDivElement;

function init() {
  grid = [];
  boardElement.innerHTML = '';
  boardElement.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;

  for (let y = 0; y < gridSize; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < gridSize; x++) {
      const cellElement = document.createElement('div');
      cellElement.className = 'cell';
      boardElement.appendChild(cellElement);
      const cell: Cell = {
        element: cellElement,
        hasMine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0
      };
      row.push(cell);

      cellElement.addEventListener('click', () => reveal(x, y));
      cellElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(x, y);
      });
    }
    grid.push(row);
  }

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    if (!grid[y][x].hasMine) {
      grid[y][x].hasMine = true;
      minesPlaced++;
    }
  }

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      grid[y][x].adjacentMines = countAdjacentMines(x, y);
    }
  }
}

function countAdjacentMines(x: number, y: number) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
        if (grid[ny][nx].hasMine) count++;
      }
    }
  }
  return count;
}

function reveal(x: number, y: number) {
  const cell = grid[y][x];
  if (cell.revealed || cell.flagged) return;
  cell.revealed = true;
  cell.element.classList.add('revealed');
  if (cell.hasMine) {
    cell.element.classList.add('mine');
    alert('Game Over!');
    revealAll();
    return;
  }
  if (cell.adjacentMines > 0) {
    cell.element.textContent = cell.adjacentMines.toString();
  } else {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
          reveal(nx, ny);
        }
      }
    }
  }
}

function revealAll() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = grid[y][x];
      if (!cell.revealed) {
        cell.revealed = true;
        cell.element.classList.add('revealed');
        if (cell.hasMine) {
          cell.element.classList.add('mine');
        } else if (cell.adjacentMines > 0) {
          cell.element.textContent = cell.adjacentMines.toString();
        }
      }
    }
  }
}

function toggleFlag(x: number, y: number) {
  const cell = grid[y][x];
  if (cell.revealed) return;
  cell.flagged = !cell.flagged;
  cell.element.classList.toggle('flagged');
}

document.getElementById('reset')?.addEventListener('click', () => init());

init();
