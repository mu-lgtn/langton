const canvas = document.getElementById("MainCanvas");
const ctx = canvas.getContext("2d");

const CodelSize = 10;
const CellOffsetX = 50;
const CellOffsetY = 50;
const CellWidth = 50;
const CellHeight = 50;
const cell = new Array(CellHeight).fill(null).map(() => new Array(CellWidth).fill(0));
const pos = [Math.floor(CellHeight/2),Math.floor(CellWidth/2)];
const RotateMatrix = [[-1,0],[0,1],[1,0],[0,-1]];

let dp = 0;
let run = false;
let AnimationId = null;
let IsClicked = false;

function mod(n,m) {
  return ((n%m)+m)%m;
}

function move() {
  pos[0] += RotateMatrix[dp][0];
  pos[1] += RotateMatrix[dp][1];
  pos[0] = mod(pos[0],CellHeight);
  pos[1] = mod(pos[1],CellWidth);
}

function StyleSwitch(n) {
  if (n) {
    ctx.fillStyle = "black";
  } else {
    ctx.fillStyle = "white";
  }
}

function temp1() {
  if (!run) return;
  if (cell[pos[0]][pos[1]]) {
    cell[pos[0]][pos[1]] = 0;
    dp--;
  } else {
    cell[pos[0]][pos[1]] = 1;
    dp++;
  }
  dp = mod(dp,4);
  move();
}

function DrawGrid() {
  if (run) {
    if (cell[pos[0]][pos[1]]) {
      cell[pos[0]][pos[1]] = 0;
      dp--;
    } else {
      cell[pos[0]][pos[1]] = 1;
      dp++;
    }
    dp = mod(dp,4);
    move();
  }
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let i=0; i<CellHeight; i++) {
    for (let j=0; j<CellWidth; j++) {
      StyleSwitch(cell[i][j]);
      ctx.fillRect(CellOffsetX+i*CodelSize,CellOffsetY+j*CodelSize,CodelSize,CodelSize);
    }
  }
  if (run) {
    AnimationId = requestAnimationFrame(DrawGrid);
  }
}

function PaintCell(x,y) {
  const rect = canvas.getBoundingClientRect();
  const cx = x-rect.left-CellOffsetX;
  const cy = y-rect.top-CellOffsetY;
  const i = Math.floor(cx/CodelSize);
  const j = Math.floor(cy/CodelSize);

  if (0 <= i && i < CellHeight && 0 <= j && j < CellWidth) {
    cell[i][j] = 1;
    DrawGrid();
  }
}

canvas.addEventListener("mousedown",(e) => {
  IsClicked = true;
  if (!run) {
    PaintCell(e.clientX,e.clientY);
  }
})

canvas.addEventListener("mousemove",(e) => {
  if (IsClicked && !run) PaintCell(e.clientX,e.clientY);
})

canvas.addEventListener("mouseup",() => {
  IsClicked = false;
})

document.getElementById("start").addEventListener("click",() => {
  if (!run) {
    run = true;
    DrawGrid();
  }
})

document.getElementById("stop").addEventListener("click",() => {
  run = false;
  if (AnimationId) {
    cancelAnimationFrame(AnimationId);
    AnimationId = null;
  }
})
